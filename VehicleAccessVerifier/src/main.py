import base64
import cgi
import html
import json
import os
import shutil
import sys
import tempfile
import traceback
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from enroll_user import enroll_user, resolve_path


PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC_ROOT = os.path.dirname(__file__)
USERS_CSV_PATH = resolve_path("data", "users", "users.csv")
FACES_DIR_PATH = resolve_path("data", "users", "faces")
TEMPLATE_PATH = os.path.join(SRC_ROOT, "templates", "guest_registration.html")
STYLESHEET_PATH = os.path.join(SRC_ROOT, "static", "styles.css")
VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm"}


def read_text_file(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as input_file:
        return input_file.read()


def safe_console_print(message: str):
    encoding = getattr(sys.stdout, "encoding", None) or "utf-8"
    encoded_message = message.encode(encoding, errors="replace") + b"\n"
    stdout_buffer = getattr(sys.stdout, "buffer", None)
    if stdout_buffer is not None:
        stdout_buffer.write(encoded_message)
        stdout_buffer.flush()
        return
    sys.stdout.write(encoded_message.decode(encoding, errors="replace"))
    sys.stdout.flush()


def is_truthy(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "on"}


def safe_filename(filename: str) -> str:
    basename = os.path.basename(filename or "")
    sanitized = "".join(
        character if character.isalnum() or character in ("-", "_", ".") else "_"
        for character in basename
    )
    return sanitized or "upload.bin"


def save_uploaded_file(field_item, destination_dir: str) -> str:
    filename = safe_filename(field_item.filename)
    destination_path = os.path.join(destination_dir, filename)
    with open(destination_path, "wb") as upload_file:
        shutil.copyfileobj(field_item.file, upload_file)
    return destination_path


def guess_extension_from_data_url(data_url_header: str) -> str:
    mime_type = data_url_header.split(";", 1)[0].split(":", 1)[-1].lower()
    return {
        "video/webm": ".webm",
        "video/mp4": ".mp4",
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/webp": ".webp",
    }.get(mime_type, ".webm")


def save_recorded_media(data_url: str, destination_dir: str) -> str:
    if not data_url:
        raise ValueError("Du lieu khuon mat da quay dang trong.")
    if "," not in data_url or ";base64" not in data_url:
        raise ValueError("Du lieu khuon mat da quay khong hop le.")

    header, encoded_data = data_url.split(",", 1)
    extension = guess_extension_from_data_url(header)
    destination_path = os.path.join(destination_dir, f"recorded_face{extension}")

    with open(destination_path, "wb") as output_file:
        output_file.write(base64.b64decode(encoded_data))
    return destination_path


def render_page(message=None, message_tone="success"):
    template_html = read_text_file(TEMPLATE_PATH)
    message_html = ""
    if message:
        message_html = f"""
        <div class="banner banner-{html.escape(message_tone)}">
          <p>{html.escape(message)}</p>
        </div>
        """
    return template_html.replace("__MESSAGE_HTML__", message_html)


class VehicleAccessPortalHandler(BaseHTTPRequestHandler):
    server_version = "VehicleAccessPortal/1.1"

    def log_message(self, format, *args):
        return

    def _request_path(self):
        return self.path.split("?", 1)[0]

    def _send_cors_headers(self):
        self.send_header(
            "Access-Control-Allow-Origin",
            os.environ.get("CORS_ALLOW_ORIGIN", "*"),
        )
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _send_response_body(
        self,
        body,
        *,
        content_type: str,
        status: int = HTTPStatus.OK,
        encoding: str = "utf-8",
    ):
        if isinstance(body, str):
            encoded = body.encode(encoding)
        else:
            encoded = body
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(encoded)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(encoded)

    def _send_html(self, html_content: str, status: int = HTTPStatus.OK):
        self._send_response_body(
            html_content,
            content_type="text/html; charset=utf-8",
            status=status,
        )

    def _send_css(self, css_content: str, status: int = HTTPStatus.OK):
        self._send_response_body(
            css_content,
            content_type="text/css; charset=utf-8",
            status=status,
        )

    def _send_json(self, payload, status: int = HTTPStatus.OK):
        self._send_response_body(
            json.dumps(payload, ensure_ascii=False),
            content_type="application/json; charset=utf-8",
            status=status,
        )

    def _render(self, *, message=None, message_tone="success", status=HTTPStatus.OK):
        self._send_html(
            render_page(
                message=message,
                message_tone=message_tone,
            ),
            status=status,
        )

    def _parse_form(self):
        environ = {
            "REQUEST_METHOD": "POST",
            "CONTENT_TYPE": self.headers.get("Content-Type", ""),
        }
        content_length = self.headers.get("Content-Length")
        if content_length:
            environ["CONTENT_LENGTH"] = content_length
        return cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ=environ,
        )

    @staticmethod
    def _get_optional_file_field(form, field_name: str):
        if field_name not in form:
            return None
        field = form[field_name]
        if not getattr(field, "filename", ""):
            return None
        return field

    def _enroll_from_form(
        self,
        form,
        *,
        default_user_id: str = "",
        default_guest_mode: bool = False,
    ):
        plate = form.getfirst("plate", "").strip()
        user_id = form.getfirst("user_id", default_user_id).strip()
        guest_mode = default_guest_mode or is_truthy(form.getfirst("guest_mode", ""))
        face_media = self._get_optional_file_field(form, "face_media")
        recorded_face_data = form.getfirst("recorded_face_data", "").strip()

        if not plate:
            raise ValueError("Missing required field: plate.")
        if face_media is None and not recorded_face_data:
            raise ValueError("Missing required face media upload.")
        if not guest_mode and not user_id:
            raise ValueError("Missing required field: user_id.")

        with tempfile.TemporaryDirectory(dir=PROJECT_ROOT) as temp_dir:
            if face_media is not None:
                temp_source_path = save_uploaded_file(face_media, temp_dir)
            else:
                temp_source_path = save_recorded_media(recorded_face_data, temp_dir)

            is_video = os.path.splitext(temp_source_path)[1].lower() in VIDEO_EXTENSIONS
            enrollment_result = enroll_user(
                user_id,
                plate,
                temp_source_path,
                users_csv=USERS_CSV_PATH,
                faces_dir=FACES_DIR_PATH,
                is_video=is_video,
                guest_mode=guest_mode,
            )

        return enrollment_result

    def _handle_register(self):
        form = self._parse_form()
        enrollment_result = self._enroll_from_form(form, default_guest_mode=True)
        registered_user_id = enrollment_result["user_id"]
        self._render(
            message=f"Dang ky khach thanh cong. Ma khach la: {registered_user_id}",
            message_tone="success",
        )

    def _handle_register_vehicle_api(self):
        form = self._parse_form()
        enrollment_result = self._enroll_from_form(form)
        self._send_json(
            {
                "success": True,
                "message": "Vehicle enrollment completed.",
                "result": enrollment_result,
            }
        )

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self._send_cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        request_path = self._request_path()

        if request_path == "/":
            self._render()
            return
        if request_path == "/styles.css":
            self._send_css(read_text_file(STYLESHEET_PATH))
            return
        if request_path == "/api/health":
            self._send_json(
                {
                    "success": True,
                    "status": "ok",
                    "service": "vehicle-access-verifier",
                }
            )
            return
        if request_path.startswith("/api/"):
            self._send_json(
                {
                    "success": False,
                    "error": "API endpoint not found.",
                },
                status=HTTPStatus.NOT_FOUND,
            )
            return
        self._send_response_body(
            "Khong tim thay trang.",
            content_type="text/plain; charset=utf-8",
            status=HTTPStatus.NOT_FOUND,
        )

    def do_POST(self):
        request_path = self._request_path()

        try:
            if request_path == "/register":
                self._handle_register()
                return
            if request_path == "/api/register-vehicle":
                self._handle_register_vehicle_api()
                return
            if request_path.startswith("/api/"):
                self._send_json(
                    {
                        "success": False,
                        "error": "API endpoint not found.",
                    },
                    status=HTTPStatus.NOT_FOUND,
                )
                return
            self._send_response_body(
                "Khong tim thay trang.",
                content_type="text/plain; charset=utf-8",
                status=HTTPStatus.NOT_FOUND,
            )
        except Exception as exc:
            traceback.print_exc()
            if request_path.startswith("/api/"):
                self._send_json(
                    {
                        "success": False,
                        "error": str(exc),
                    },
                    status=HTTPStatus.BAD_REQUEST,
                )
                return
            self._render(
                message=str(exc),
                message_tone="error",
                status=HTTPStatus.BAD_REQUEST,
            )


def create_server(host: str = "localhost", port: int = 8000):
    return ThreadingHTTPServer((host, port), VehicleAccessPortalHandler)


def main():
    host = os.environ.get("HOST", "localhost")
    port = int(os.environ.get("PORT", "8000"))
    server = create_server(host, port)
    safe_console_print(f"Vehicle Access Verifier backend listening on http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
