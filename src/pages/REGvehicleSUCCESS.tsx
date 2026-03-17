import { Link, useLocation } from 'react-router-dom';
import { TopNav } from '../components/Navigation';

export default function REGvehicleSUCCESS() {
    const location = useLocation();
    const { licensePlate, registeredAt } = (location.state as { licensePlate?: string; registeredAt?: string }) || {};

    const displayPlate = licensePlate || '---';
    const displayTime = registeredAt || new Date().toLocaleString('vi-VN');

    return (
        <div className="flex min-h-screen flex-col bg-[#f8f6f6] font-sans text-slate-900 dark:bg-[#221610] dark:text-slate-100">
            <TopNav />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Hero Image Section */}
                    <div className="lg:col-span-7">
                        <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-[#ec5b13]/5 bg-slate-200 dark:bg-slate-800 aspect-[16/9]">
                            <div
                                className="absolute inset-0 bg-cover bg-left"
                                style={{
                                    backgroundImage:
                                        'url("https://daihoc.fpt.edu.vn/wp-content/uploads/2025/12/banner-truong-dai-hoc-fpt-co-so-ha-noi.jpg")',
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-2xl font-bold">Khuôn viên FPT UNIVERSITY</h3>
                                <p className="text-slate-200 text-sm">Hệ thống quản lý bãi đỗ xe thông minh</p>
                            </div>
                        </div>
                    </div>

                    {/* Success Card Section */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
                                    check_circle
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Gửi xe thành công
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                                Yêu cầu của bạn đã được hệ thống ghi nhận thành công vào hệ thống quản lý.
                            </p>

                            {/* Details Box */}
                            <div className="w-full bg-[#f8f6f6] dark:bg-[#221610]/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Biển số xe</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{displayPlate}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Thời gian ghi nhận</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{displayTime}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <Link
                                    to="/services"
                                    className="flex-1 px-6 py-3 bg-[#ec5b13] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-xl">home</span>
                                    Về trang chủ
                                </Link>
                                <Link
                                    to="/services"
                                    className="flex-1 px-6 py-3 bg-[#ec5b13]/10 text-[#ec5b13] font-bold rounded-xl hover:bg-[#ec5b13]/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-xl">list_alt</span>
                                    Danh sách xe
                                </Link>
                            </div>
                        </div>

                        {/* Secondary Info */}
                        <div className="mt-6 flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <div className="text-[#ec5b13]">
                                <span className="material-symbols-outlined">info</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Vui lòng giữ ảnh đăng ký xe để thực hiện thủ tục pháp lý sau này thuận tiện hơn. Mọi thắc mắc liên hệ
                                hotline FPT.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-auto py-8 text-center border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-400">The Visionary FAIC HACKATHON PROJECT © 2026</p>
            </footer>
        </div>
    );
} ``