import React, { useState, useEffect } from 'react';
import { UserRole, AppState, AdminUser, CitizenUser, Submission, AdminStatus, SubmissionStatus } from './types';
import Login from './components/Login';
import ServiceDashboard from './components/ServiceDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('one-stop-service-state');
    return saved ? JSON.parse(saved) : {
      admins: [],
      citizens: [],
      submissions: []
    };
  });

  useEffect(() => {
    localStorage.setItem('one-stop-service-state', JSON.stringify(state));
  }, [state]);

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
  };

  const addAdminRequest = (name: string, dept: string) => {
    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      name,
      department: dept,
      status: AdminStatus.PENDING
    };
    setState(prev => ({ ...prev, admins: [...prev.admins, newAdmin] }));
    return newAdmin;
  };

  const addCitizenLogin = (fullName: string, phone: string) => {
    const newCitizen: CitizenUser = {
      id: Date.now().toString(),
      fullName,
      phone,
      loginTime: new Date().toLocaleString('th-TH')
    };
    setState(prev => ({ ...prev, citizens: [...prev.citizens, newCitizen] }));
    return newCitizen;
  };

  const updateAdminStatus = (id: string, status: AdminStatus) => {
    setState(prev => ({
      ...prev,
      admins: prev.admins.map(a => a.id === id ? { ...a, status } : a)
    }));
  };

  const deleteAdmin = (id: string) => {
    setState(prev => ({ ...prev, admins: prev.admins.filter(a => a.id !== id) }));
  };

  const deleteCitizen = (id: string) => {
    setState(prev => ({ ...prev, citizens: prev.citizens.filter(c => c.id !== id) }));
  };

  const addSubmission = (sub: Omit<Submission, 'id' | 'status' | 'isReadByAdmin'>) => {
    const newSub: Submission = {
      ...sub,
      id: Math.floor(Math.random() * 900000 + 100000).toString(),
      status: SubmissionStatus.NEW,
      isReadByAdmin: false
    };
    setState(prev => ({ ...prev, submissions: [...prev.submissions, newSub] }));
  };

  const updateSubmission = (id: string, updates: Partial<Submission>) => {
    setState(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const stats = {
    total: state.submissions.length,
    success: state.submissions.filter(s => s.status === SubmissionStatus.SUCCESS).length,
    pending: state.submissions.filter(s => [SubmissionStatus.RECEIVED, SubmissionStatus.PENDING].includes(s.status)).length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {!role ? (
        <Login 
          onLogin={(role, user) => {
            setRole(role);
            setCurrentUser(user);
          }}
          onAdminRequest={addAdminRequest}
          onCitizenLogin={addCitizenLogin}
          admins={state.admins}
        />
      ) : (
        <>
          <nav className="bg-slate-900 text-white shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-landmark text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight leading-none">ONE STOP SERVICE</h1>
                  <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Government Digital Portal</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="hidden sm:flex items-center space-x-3 border-r border-slate-700 pr-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">เข้าใช้งานในนาม</p>
                    <p className="text-sm font-bold text-blue-100">{currentUser?.name || currentUser?.fullName || 'Super Admin'}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                    <i className="fa-solid fa-user-circle text-slate-400 text-xl"></i>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </nav>

          <main className="flex-grow max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
            {/* Contextual Header */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-folder"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">เรื่องทั้งหมด</p>
                  <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">รอการดำเนินการ</p>
                  <p className="text-2xl font-black text-slate-800">{stats.pending}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">แก้ไขสำเร็จ</p>
                  <p className="text-2xl font-black text-slate-800">{stats.success}</p>
                </div>
              </div>
            </div>

            {role === 'SERVICE' && (
              <ServiceDashboard 
                admins={state.admins} 
                citizens={state.citizens}
                onUpdateAdmin={updateAdminStatus}
                onDeleteAdmin={deleteAdmin}
                onDeleteCitizen={deleteCitizen}
              />
            )}

            {role === 'CITIZEN' && (
              <CitizenDashboard 
                user={currentUser}
                submissions={state.submissions.filter(s => s.citizenPhone === currentUser.phone)}
                onSubmit={addSubmission}
              />
            )}

            {role === 'ADMIN' && (
              <AdminDashboard 
                user={currentUser}
                submissions={state.submissions}
                onUpdateSubmission={updateSubmission}
              />
            )}
          </main>

          <footer className="bg-white border-t border-slate-100 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm text-slate-400 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} One Stop Service | Digital Government Solutions Center
              </p>
              <div className="flex justify-center space-x-6 mt-4 text-slate-300">
                <i className="fa-brands fa-facebook hover:text-blue-600 cursor-pointer transition-colors"></i>
                <i className="fa-brands fa-twitter hover:text-blue-400 cursor-pointer transition-colors"></i>
                <i className="fa-brands fa-line hover:text-emerald-500 cursor-pointer transition-colors"></i>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
