import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface Vehicle {
  id: string;
  license_plate: string;
  vehicle_name: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setVehicles(data || []);
      setLoadingVehicles(false);
    };
    fetchVehicles();
  }, [user?.id]);

  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=ec5b13&color=fff`;

  return (
    <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 min-h-screen shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <Link to="/profile" className="flex size-12 shrink-0 items-center">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary"
            style={{ backgroundImage: `url(${avatarUrl})` }}
          ></div>
        </Link>
        <div className="flex-1 px-3">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Xin Chào</p>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
            {user?.name || 'Người dùng'}
          </h2>
        </div>
        <div className="flex w-12 items-center justify-end">
          <button className="relative flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary"></span>
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="p-4">
        <div className="relative flex flex-col rounded-xl overflow-hidden shadow-lg bg-primary p-6">
          <div className="bg-white/20 w-fit p-1 rounded-lg px-2 mb-1">
            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Số lượng có hạn</span>
          </div>
          <p className="text-white text-2xl font-bold leading-tight mt-2">Đăng Ký Gửi Xe Mới</p>
          <p className="text-white/90 text-sm font-normal mb-4">Vui lòng chọn khu vực và bãi đỗ xe của bạn.</p>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <select className="w-full h-11 px-4 rounded-xl bg-white border-none text-slate-900 text-sm font-medium appearance-none outline-none">
                <option>Chọn Tỉnh thành</option>
                <option>Hà Nội</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
            </div>
            <div className="relative">
              <select className="w-full h-11 px-4 rounded-xl bg-white border-none text-slate-900 text-sm font-medium appearance-none outline-none">
                <option>Chọn Tòa nhà / Bãi gửi xe</option>
                <option>Tòa nhà Alpha</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
            </div>
            <Link to="/register" className="flex w-full items-center justify-center rounded-xl h-12 bg-white text-primary text-base font-bold mt-1 shadow-md">
              Đăng Ký Ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ví F-Pay</h2>
          <Link to="/wallet" className="text-primary text-sm font-semibold flex items-center">Chi tiết <span className="material-symbols-outlined text-sm">chevron_right</span></Link>
        </div>
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-900 dark:bg-slate-800 shadow-xl">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Tổng số dư</p>
              <p className="text-white tracking-tight text-3xl font-extrabold">1.250.000 <span className="text-lg font-medium">VND</span></p>
            </div>
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-primary h-11 text-white font-bold text-sm">
              <span className="material-symbols-outlined text-lg">add_circle</span> Nạp tiền
            </button>
            <Link to="/wallet" className="flex items-center justify-center gap-2 rounded-xl bg-white/10 h-11 text-white font-bold text-sm">
              <span className="material-symbols-outlined text-lg">history</span> Lịch sử
            </Link>
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Xe Của Tôi</h2>
          <Link to="/register" className="size-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-xl">add</span>
          </Link>
        </div>

        {loadingVehicles ? (
          <div className="flex items-center justify-center py-8">
            <svg className="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-slate-400 gap-2">
            <span className="material-symbols-outlined text-4xl">directions_car</span>
            <p className="text-sm">Chưa có xe nào. <Link to="/register" className="text-primary font-bold">Đăng ký ngay!</Link></p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="size-14 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <span className="material-symbols-outlined text-3xl">motorcycle</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base">{v.vehicle_name || 'Xe của tôi'}</h3>
                  <p className="text-slate-500 text-sm font-medium">{v.license_plate}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${v.status === 'active'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-slate-100 text-slate-500'
                  }`}>
                  {v.status === 'active' ? 'Đang hoạt động' : 'Hết hạn'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}