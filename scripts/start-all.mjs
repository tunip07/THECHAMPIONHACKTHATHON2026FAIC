import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const pythonExe = path.join(
  repoRoot,
  'VehicleAccessVerifier',
  'venv',
  'Scripts',
  'python.exe',
);
const backendEntry = path.join(repoRoot, 'VehicleAccessVerifier', 'src', 'main.py');
const viteEntry = path.join(repoRoot, 'node_modules', 'vite', 'bin', 'vite.js');

const requiredPaths = [
  [pythonExe, 'Missing AI backend virtualenv Python executable.'],
  [backendEntry, 'Missing AI backend entrypoint.'],
  [viteEntry, 'Missing Vite entrypoint. Run `npm install` first.'],
];

for (const [targetPath, errorMessage] of requiredPaths) {
  if (!fs.existsSync(targetPath)) {
    console.error(`${errorMessage}\nExpected path: ${targetPath}`);
    process.exit(1);
  }
}

const children = [];
let shuttingDown = false;

const prefixStream = (stream, prefix, writer) => {
  let buffer = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line) {
        continue;
      }
      writer.write(`[${prefix}] ${line}\n`);
    }
  });
  stream.on('end', () => {
    if (buffer) {
      writer.write(`[${prefix}] ${buffer}\n`);
    }
  });
};

const stopChild = (child) => {
  if (!child || child.killed) {
    return;
  }

  if (process.platform === 'win32') {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
    });
    killer.unref();
    return;
  }

  child.kill('SIGTERM');
};

const shutdown = (reason, exitCode = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (reason) {
    console.log(reason);
  }

  for (const child of children) {
    stopChild(child);
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 250).unref();
};

const startProcess = (name, command, args) => {
  const child = spawn(command, args, {
    cwd: repoRoot,
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  children.push(child);
  prefixStream(child.stdout, name, process.stdout);
  prefixStream(child.stderr, name, process.stderr);

  child.on('error', (error) => {
    if (shuttingDown) {
      return;
    }

    shutdown(`[${name}] Failed to start: ${error.message}`, 1);
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const detail = signal ? `signal ${signal}` : `exit code ${code ?? 0}`;
    shutdown(`[${name}] Stopped with ${detail}. Shutting down the other process.`, code ?? 1);
  });

  return child;
};

console.log('Starting frontend and AI backend...');
console.log('Frontend URL: http://localhost:3000');
console.log('AI backend URL: http://localhost:8000');
console.log('Press Ctrl+C to stop both processes.');

startProcess('ai-backend', pythonExe, [backendEntry]);
startProcess('frontend', process.execPath, [viteEntry, '--port=3000', '--host=0.0.0.0']);

process.on('SIGINT', () => shutdown('Stopping frontend and AI backend...'));
process.on('SIGTERM', () => shutdown('Stopping frontend and AI backend...'));
