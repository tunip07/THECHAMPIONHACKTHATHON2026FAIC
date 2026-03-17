import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopNav } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { syncVehicleToAiBackend } from '../services/aiEnrollment';
import { createVehicle } from '../services/vehicles';

const resolveRecordingMimeType = () => {
  if (typeof MediaRecorder === 'undefined') {
    return '';
  }

  const supportedMimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];

  return supportedMimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) || '';
};

export default function RegisterVehicle() {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFaceMedia, setRecordedFaceMedia] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasRecordedMedia = Boolean(recordedFaceMedia);

  const clearPreview = () => {
    setPreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return '';
    });
  };

  const setPreviewFromBlob = (mediaBlob: Blob) => {
    clearPreview();
    setPreviewUrl(URL.createObjectURL(mediaBlob));
  };

  const stopRecordingTimer = () => {
    if (recordingIntervalRef.current !== null) {
      window.clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  };

  const finalizeRecording = () => {
    const mimeType =
      mediaRecorderRef.current?.mimeType ||
      recordedChunksRef.current.find((chunk) => chunk.type)?.type ||
      'video/webm';
    const mediaBlob = new Blob(recordedChunksRef.current, { type: mimeType });

    setRecordedFaceMedia(mediaBlob);
    setPreviewFromBlob(mediaBlob);
    setIsRecording(false);
    setRecordingSeconds(0);
    stopRecordingTimer();
    stopCamera();
    recordedChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  const startCamera = async () => {
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      setRecordedFaceMedia(null);
      clearPreview();
      setRecordingSeconds(0);
      setIsRecording(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraOpen(true);
    } catch (cameraError) {
      console.error(cameraError);
      setError('Không thể truy cập camera. Bạn có thể thử tải video khuôn mặt lên thay thế.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      setError('Camera chưa sẵn sàng để quay video.');
      return;
    }

    if (typeof MediaRecorder === 'undefined') {
      setError('Trình duyệt hiện tại chưa hỗ trợ quay video trực tiếp.');
      return;
    }

    const mimeType = resolveRecordingMimeType();
    const recorder = mimeType
      ? new MediaRecorder(streamRef.current, { mimeType })
      : new MediaRecorder(streamRef.current);

    recordedChunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    recorder.onstop = finalizeRecording;
    recorder.start();

    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setRecordedFaceMedia(null);
    setRecordingSeconds(0);
    stopRecordingTimer();
    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingSeconds((currentValue) => currentValue + 1);
    }, 1000);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === 'inactive') {
      return;
    }

    recorder.stop();
  };

  const handleUploadClick = () => {
    if (isRecording) {
      setError('Hãy dừng video đang quay trước khi tải tệp khác lên.');
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('Chỉ chấp nhận tệp video để đăng ký xe.');
      return;
    }

    if (isRecording) {
      setError('Hãy dừng video đang quay trước khi tải tệp khác lên.');
      event.target.value = '';
      return;
    }

    stopRecordingTimer();
    stopCamera();
    setError('');
    setRecordingSeconds(0);
    setRecordedFaceMedia(file);
    setPreviewFromBlob(file);
    event.target.value = '';
  };

  useEffect(() => {
    return () => {
      stopRecordingTimer();

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!recordedFaceMedia) {
      setError('Vui lòng quay hoặc tải video khuôn mặt trước khi đăng ký.');
      return;
    }

    if (!user?.id) {
      setError('Bạn cần đăng nhập trước khi đăng ký xe.');
      return;
    }

    setSubmitting(true);

    // Navigate immediately — don't wait for backend calls
    navigate('/register-vehicle-success', {
      state: {
        licensePlate,
        registeredAt: new Date().toLocaleString('vi-VN'),
      },
    });

    // Send face data to AI backend in background
    syncVehicleToAiBackend({
      userId: user.id,
      licensePlate,
      faceMedia: recordedFaceMedia,
    }).catch((err) => console.error('Background AI sync failed:', err));

    // Save to Supabase in background
    createVehicle({
      userId: user.id,
      vehicleName,
      licensePlate,
      faceMedia: recordedFaceMedia,
    }).catch((err) => console.error('Background vehicle save failed:', err));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f6] font-sans text-slate-900 dark:bg-[#221610] dark:text-slate-100">
      <TopNav />

      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#f8f6f6] to-[#ec5b13]/5 p-6 dark:from-[#221610] dark:to-[#ec5b13]/10">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-8 text-center dark:border-slate-800">
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#ec5b13]">
              Đăng ký gửi xe
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Lưu biển số xe và video khuôn mặt chủ xe để dùng cho hệ thống nhận diện.
            </p>
          </div>

          <form onSubmit={handleRegister} className="p-8">
            <div className="space-y-8">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="rounded-2xl border border-[#ec5b13]/15 bg-[#ec5b13]/5 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                Khi bạn bấm xác nhận, web sẽ thông tin đến hệ thống.
              </div>

              <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                      <span className="material-symbols-outlined text-[#ec5b13]">videocam</span>
                      Video khuôn mặt chủ xe
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Quay video rõ mặt trong khoảng 3 đến 5 giây để nhận diện ổn định
                      hơn.
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-[#ec5b13]/10 px-3 py-1 text-xs font-bold text-[#ec5b13]">
                    Bắt buộc
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <div className="relative aspect-video flex items-center justify-center">
                    {!isCameraOpen && !hasRecordedMedia && (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#ec5b13] shadow-lg dark:bg-slate-700">
                          <span className="material-symbols-outlined text-4xl">video_camera_front</span>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            Quay video trực tiếp hoặc tải video khuôn mặt lên
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Nên quay chính diện, đủ sáng và hạn chế rung lắc.
                          </p>
                        </div>
                      </div>
                    )}

                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`absolute inset-0 h-full w-full object-cover ${
                        isCameraOpen ? '' : 'hidden'
                      }`}
                    />

                    {previewUrl && !isCameraOpen && (
                      <video
                        src={previewUrl}
                        controls
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}

                    {isCameraOpen && (
                      <>
                        <div className="pointer-events-none absolute left-4 top-4 h-12 w-12 rounded-xl border-2 border-[#ec5b13]/20 border-l-[#ec5b13] border-t-[#ec5b13]"></div>
                        <div className="pointer-events-none absolute right-4 top-4 h-12 w-12 rounded-xl border-2 border-[#ec5b13]/20 border-r-[#ec5b13] border-t-[#ec5b13]"></div>
                        <div className="pointer-events-none absolute bottom-4 left-4 h-12 w-12 rounded-xl border-2 border-[#ec5b13]/20 border-b-[#ec5b13] border-l-[#ec5b13]"></div>
                        <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 rounded-xl border-2 border-[#ec5b13]/20 border-b-[#ec5b13] border-r-[#ec5b13]"></div>
                      </>
                    )}

                    {isRecording && (
                      <div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Đang quay {recordingSeconds}s
                      </div>
                    )}

                    {hasRecordedMedia && !isCameraOpen && !isRecording && (
                      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Đã sẵn sàng
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  {!isCameraOpen ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ec5b13] font-bold text-white shadow-lg shadow-[#ec5b13]/20 transition-all hover:bg-[#ec5b13]/90 active:scale-95"
                    >
                      <span className="material-symbols-outlined">video_call</span>
                      {hasRecordedMedia ? 'Quay lại bằng camera' : 'Mở camera'}
                    </button>
                  ) : !isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
                    >
                      <span className="material-symbols-outlined">fiber_manual_record</span>
                      Bắt đầu quay
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 font-bold text-white shadow-lg transition-all hover:bg-slate-700 active:scale-95 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      <span className="material-symbols-outlined">stop_circle</span>
                      Dừng quay
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <span className="material-symbols-outlined">upload</span>
                    Tải video lên
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <span className="material-symbols-outlined text-[#ec5b13]">directions_car</span>
                    Thông tin xe
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Điền tên xe và biển số để hệ thống liên kết đúng phương tiện.
                  </p>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-slate-400">two_wheeler</span>
                  </div>
                  <input
                    type="text"
                    value={vehicleName}
                    onChange={(event) => setVehicleName(event.target.value)}
                    className="h-14 w-full rounded-2xl border-none bg-slate-100 pl-12 pr-4 text-base font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#ec5b13] placeholder:text-slate-400 dark:bg-slate-800 dark:text-white"
                    placeholder="Tên xe, ví dụ: Honda Air Blade"
                  />
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-slate-400">badge</span>
                  </div>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(event) => setLicensePlate(event.target.value.toUpperCase())}
                    required
                    className="h-14 w-full rounded-2xl border-none bg-slate-100 pl-12 pr-4 text-lg font-bold uppercase tracking-widest text-slate-900 outline-none focus:ring-2 focus:ring-[#ec5b13] placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 dark:bg-slate-800 dark:text-white"
                    placeholder="Biển số: 29A-12345"
                  />
                </div>
              </section>

              <button
                type="submit"
                disabled={!hasRecordedMedia || !licensePlate.trim() || submitting}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ec5b13] text-lg font-black uppercase tracking-wider text-white shadow-xl shadow-[#ec5b13]/30 transition-all hover:bg-[#ec5b13]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting && (
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {submitting ? 'Đang đăng ký...' : 'Xác nhận đăng ký'}
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/50">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#ec5b13] transition-colors hover:underline"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Trở lại trang chủ
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>The Visionary FAIC HACKATHON PROJECT © 2026</p>
      </footer>
    </div>
  );
}
