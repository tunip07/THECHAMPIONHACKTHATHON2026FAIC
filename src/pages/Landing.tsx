import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TopNav } from '../components/Navigation';

export default function Landing() {
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const scrollToSearch = () => {
    const yOffset = -100; // Offset to account for sticky header
    const element = searchSectionRef.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f6] dark:bg-[#221610] font-sans text-slate-900 dark:text-slate-100 antialiased">
      <TopNav />

      <main className="flex-1">
        <section className="relative w-full py-12 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[#ec5b13]/5 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ec5b13]/10 text-[#ec5b13] text-xs font-bold uppercase tracking-wider w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec5b13] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ec5b13]"></span>
                  </span> 
                  THE VISIONARY FAIC HACKATHON PROJECT
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1]">
                  <span className="text-slate-900 dark:text-white">Bãi gửi xe&nbsp;</span>
                  <div className="text-[#ec5b13]">Thông minh</div>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
                  Dễ dàng tìm kiếm và gửi xe tại các cơ sở FPT, thành phố, trung tâm thương mại và các tiện ích công cộng khác bằng nhận diện khuôn mặt
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={scrollToSearch}
                    className="group flex items-center justify-center gap-2 bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-[#ec5b13]/25 hover:shadow-[#ec5b13]/40 hover:-translate-y-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined group-hover:animate-bounce">school</span> Đăng ký ngay
                  </button>
                  <Link to="/register" className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <span className="material-symbols-outlined">person</span> Staff 
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 rotate-2 aspect-[4/3] bg-slate-200">
                  <img className="w-full h-full object-cover" alt="Modern high-tech parking garage interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjoHP5q2k7MXkxJQ6NNQyuC9yQjFXWf0mbD4vuyUJxzQGMSU-l4ssgYPqpu3jrVTd0zb3uNOKnAUFTOwwJGyH5SS8nNv-o4usp6_E9au_VFIlnJX-O-e9f3J2UxjNnordlSlsEvcTp7qP4BTLH6hHMeaZnqJ3Y61FJgLM7MvgVSZV6FvscQSP_P7Kw_rPpKC_9tUZnHByv6bIDv2ITzkjDmH7Z6oBmQfOIgD9tktPwLfJ3rDPG6ecWlEFvIXCRKO0fv4JC0gCX" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={searchSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16 scroll-mt-24">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-wrap gap-4 items-end transform transition-all duration-500 hover:shadow-2xl">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Thành Phố</label>
              <div className="relative">
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none focus:ring-[#ec5b13] focus:border-[#ec5b13] text-sm font-medium outline-none">
                  <option>Hà Nội</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                  <option>Cần Thơ</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Quận/Huyện</label>
              <div className="relative">
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none focus:ring-[#ec5b13] focus:border-[#ec5b13] text-sm font-medium outline-none">
                  <option>Tất cả các quận/huyện</option>
                  <option>Cầu Giấy</option>
                  <option>Nam Từ Liêm</option>
                  <option>Hoàn Kiếm</option>
                  <option>Thanh Xuân</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Loại hình gửi xe</label>
              <div className="relative">
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none focus:ring-[#ec5b13] focus:border-[#ec5b13] text-sm font-medium outline-none">
                  <option>Tất cả loại hình</option>
                  <option>Khuôn viên Đại học</option>
                  <option>Trung tâm thương mại</option>
                  <option>Bệnh viện</option>
                  <option>Công cộng trong nhà</option>
                  <option>Công cộng ngoài trời</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
            <button className="bg-[#ec5b13] text-white h-[46px] px-8 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#ec5b13]/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#ec5b13]/30 active:scale-95 min-w-[140px]">
              <span className="material-symbols-outlined text-xl">search</span> Tìm kiếm
            </button>
          </div>

          <div className="mt-12 flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Bãi gửi xe gần đây</h2>
              <p className="text-slate-500 text-sm">Tìm thấy 42 bãi gửi xe phù hợp với tiêu chí của bạn</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#ec5b13] transition-colors">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#ec5b13] transition-colors">
                <span className="material-symbols-outlined">map</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div 
              onClick={() => navigate('/register')}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#ec5b13]/10 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="FPT University campus parking entrance" src="https://daihoc.fpt.edu.vn/en/wp-content/uploads/2025/11/Ver-cuoi-FPT-Universitys-Sustainability-Report-2024-pages-1-scaled.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  <span className="material-symbols-outlined text-sm text-yellow-400 fill-current">star</span> 4.9 (1.2k)
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 relative">
                <div className="absolute top-0 right-5 -translate-y-1/2 bg-[#ec5b13] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-[#ec5b13] transition-colors">FPT University Campus</h3>
                  <span className="text-[#ec5b13] font-bold">Miễn phí</span>
                </div>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                  <span className="material-symbols-outlined text-base">location_on</span> Hoa Lac Hi-Tech Park, HN
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-slate-400" title="Motorbike">motorcycle</span>
                    <span className="material-symbols-outlined text-slate-400" title="Car">directions_car</span>
                    <span className="material-symbols-outlined text-[#ec5b13]" title="EV Charging">ev_station</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">0.4 km away</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => navigate('/register')}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#ec5b13]/10 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Modern indoor shopping mall parking lot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOr6uB3RGWyOOdUu8nD0hm1RXz139exBK7Xez52CJ6k1taT701krioKV3pekwoEhuiDYAi_GsvZSxsPfbR2jZbgYX4FJOkpGwKsmiA31qpP4UA9xjskypXX1YImBeyso-wPOj40zxThpHYKkNWMQuIzkGNIFG-BtYBhhcjrpPBZZyt4nvjC7uh6bIGlQiGgzM8LdlwqTmMwk7yxw3MskaxVZBo3Xop8gz2PadfnPZEfmwcePldTRBiv5dbPZZ9uST-qqKMChLs" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  <span className="material-symbols-outlined text-sm text-yellow-400 fill-current">star</span> 4.5 (850)
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 relative">
                <div className="absolute top-0 right-5 -translate-y-1/2 bg-[#ec5b13] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-[#ec5b13] transition-colors">Vincom Center Lot</h3>
                  <div className="text-right">
                    <span className="text-[#ec5b13] font-bold">10k VND</span>
                    <span className="text-[10px] text-slate-400 block">/giờ</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                  <span className="material-symbols-outlined text-base">location_on</span> Pham Ngoc Thach, HN
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-slate-400" title="Motorbike">motorcycle</span>
                    <span className="material-symbols-outlined text-slate-400" title="Car">directions_car</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">2.1 km away</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => navigate('/register')}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#ec5b13]/10 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Outdoor public city parking space" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3IjWwAZ_RU5mRTKOCHOIdqw04-SPit8sHKA&s" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  <span className="material-symbols-outlined text-sm text-yellow-400 fill-current">star</span> 4.2 (230)
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 relative">
                <div className="absolute top-0 right-5 -translate-y-1/2 bg-[#ec5b13] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-[#ec5b13] transition-colors">Bach Mai Hospital</h3>
                  <div className="text-right">
                    <span className="text-[#ec5b13] font-bold">5k VND</span>
                    <span className="text-[10px] text-slate-400 block">/giờ</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                  <span className="material-symbols-outlined text-base">location_on</span> Giai Phong Str, HN
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-slate-400" title="Motorbike">motorcycle</span>
                    <span className="material-symbols-outlined text-slate-400" title="Car">directions_car</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">3.8 km away</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button className="px-6 py-3 rounded-xl border border-[#ec5b13] text-[#ec5b13] font-bold hover:bg-[#ec5b13]/5 transition-colors">
              Xem thêm địa điểm
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-[#ec5b13] mb-6">
                <span className="material-symbols-outlined text-3xl font-bold">local_parking</span>
                <h2 className="text-xl font-extrabold tracking-tight">FPT <span className="text-slate-900 dark:text-white">Parking</span></h2>
              </div>
              <p className="text-slate-500 text-sm max-w-xs mb-6">
                Making urban mobility easier with smart parking solutions for campuses, public spaces, and private facilities.
              </p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#ec5b13] hover:text-white transition-all">
                  <span className="material-symbols-outlined text-xl">social_leaderboard</span>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#ec5b13] hover:text-white transition-all">
                  <span className="material-symbols-outlined text-xl">language</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Tìm bãi xe</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Vé tháng</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Cổng đối tác</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Doanh nghiệp</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Trung tâm trợ giúp</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">An toàn</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Liên hệ</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Khả năng tiếp cận</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Pháp lý</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Chính sách bảo mật</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Điều khoản dịch vụ</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#ec5b13]">Chính sách Cookie</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">
              <span className="text-center bg-white/90 dark:bg-transparent" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>
                The Visionary FAIC HACKATHON PROJECT © 2026
              </span>
            </p>
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="material-symbols-outlined text-sm">verified</span> Đã xác minh bảo mật
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="material-symbols-outlined text-sm">language</span> Việt Nam (Tiếng Việt)
              </span>
            </div>
          </div>
        </div>``
      </footer>
    </div>
  );
}