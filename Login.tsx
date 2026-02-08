import React, { useState } from 'react';
import { UserRole, AdminUser, AdminStatus } from '../types';
import { SERVICE_CREDENTIALS } from '../constants';

interface LoginProps {
  onLogin: (role: UserRole, user: any) => void;
  onAdminRequest: (name: string, dept: string) => AdminUser;
  onCitizenLogin: (fullName: string, phone: string) => any;
  admins: AdminUser[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onAdminRequest, onCitizenLogin, admins }) => {
  const [activeTab, setActiveTab] = useState<'ADMIN' | 'CITIZEN' | 'SERVICE' | null>(null);
  
  // Admin form
  const [adminName, setAdminName] = useState('');
  const [adminDept, setAdminDept] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  // Citizen form
  const [citName, setCitName] = useState('');
  const [citPhone, setCitPhone] = useState('');

  // Service form
  const [srvUser, setSrvUser] = useState('');
  const [srvPass, setSrvPass] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = admins.find(a => a.name === adminName && a.department === adminDept);
    
    if (existing) {
      if (existing.status === AdminStatus.APPROVED) {
        onLogin('ADMIN', existing);
      } else if (existing.status === AdminStatus.REJECTED) {
        setAdminMsg('ขออภัย การเข้าสู่ระบบของคุณถูกปฏิเสธ');
      } else {
        setAdminMsg('รอการอนุมัติจากผู้ดูแล Service...');
      }
    } else {
      onAdminRequest(adminName, adminDept);
      setAdminMsg('ส่งคำขอเข้าสู่ระบบแล้ว กรุณารอ Service อนุมัติ');
    }
  };

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (citName && citPhone) {
      const user = onCitizenLogin(citName, citPhone);
      onLogin('CITIZEN', user);
    }
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (srvUser === SERVICE_CREDENTIALS.username && srvPass === SERVICE_CREDENTIALS.password) {
      onLogin('SERVICE', { name: 'Service Manager' });
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Left Side: Branding */}
        <div className="md:w-1/3 bg-slate-900 p-10 flex flex-col justify-center items-center text-center text-white">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i className="fa-solid fa-landmark text-4xl"></i>
          </div>
          <h1 className="text-2xl font-bold mb-2">One Stop Service</h1>
          <p className="text-slate-400 text-sm">ระบบ บริหารจัดการและให้บริการประชาชน</p>
        </div>

        {/* Right Side: Forms */}
        <div className="md:w-2/3 p-8 lg:p-12">
          {!activeTab ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">เข้าสู่ระบบ</h2>
              <div className="grid gap-4">
                <button 
                  onClick={() => setActiveTab('ADMIN')}
                  className="flex items-center p-5 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white">
                    <i className="fa-solid fa-user-shield text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">สำหรับเจ้าหน้าที่ (Admin)</p>
                    <p className="text-sm text-gray-500">กรอกชื่อและหน่วยงานเพื่อขอเข้าใช้งาน</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('CITIZEN')}
                  className="flex items-center p-5 border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-600 group-hover:text-white">
                    <i className="fa-solid fa-users text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">สำหรับประชาชน</p>
                    <p className="text-sm text-gray-500">กรอกชื่อ-นามสกุล และเบอร์โทรศัพท์</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('SERVICE')}
                  className="flex items-center p-5 border-2 border-slate-100 rounded-2xl hover:border-amber-500 hover:bg-amber-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-amber-600 group-hover:text-white">
                    <i className="fa-solid fa-headset text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">สำหรับผู้ดูแลระบบ (Service)</p>
                    <p className="text-sm text-gray-500">เข้าจัดการระบบและอนุมัติเจ้าหน้าที่</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button 
                onClick={() => setActiveTab(null)}
                className="mb-6 text-slate-500 hover:text-slate-800 flex items-center transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> ย้อนกลับ
              </button>

              {activeTab === 'ADMIN' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">เข้าสู่ระบบสำหรับเจ้าหน้าที่</h3>
                  {adminMsg && (
                    <div className={`p-4 rounded-lg text-sm ${adminMsg.includes('อนุมัติ') ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                      <i className="fa-solid fa-circle-info mr-2"></i> {adminMsg}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                    <input 
                      type="text" required value={adminName} onChange={e => setAdminName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">หน่วยงาน / ตำแหน่ง</label>
                    <input 
                      type="text" required value={adminDept} onChange={e => setAdminDept(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                    เข้าสู่ระบบ / ขอรับสิทธิ์
                  </button>
                </form>
              )}

              {activeTab === 'CITIZEN' && (
                <form onSubmit={handleCitizenSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">เข้าสู่ระบบสำหรับประชาชน</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                    <input 
                      type="text" required value={citName} onChange={e => setCitName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                    <input 
                      type="tel" required value={citPhone} onChange={e => setCitPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all">
                    เข้าใช้งานทันที
                  </button>
                </form>
              )}

              {activeTab === 'SERVICE' && (
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">เข้าสู่ระบบ Service</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้</label>
                    <input 
                      type="text" required value={srvUser} onChange={e => setSrvUser(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                    <input 
                      type="password" required value={srvPass} onChange={e => setSrvPass(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-amber-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-amber-700 transition-all">
                    ยืนยันการเข้าสู่ระบบ
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
