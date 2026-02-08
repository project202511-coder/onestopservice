import React from 'react';
import { AdminUser, CitizenUser, AdminStatus } from '../types';

interface ServiceDashboardProps {
  admins: AdminUser[];
  citizens: CitizenUser[];
  onUpdateAdmin: (id: string, status: AdminStatus) => void;
  onDeleteAdmin: (id: string) => void;
  onDeleteCitizen: (id: string) => void;
}

const ServiceDashboard: React.FC<ServiceDashboardProps> = ({ 
  admins, 
  citizens, 
  onUpdateAdmin, 
  onDeleteAdmin, 
  onDeleteCitizen 
}) => {
  return (
    <div className="space-y-8 px-4 sm:px-0">
      
      {/* Admin Management Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <h2 className="text-lg font-bold text-slate-800">จัดการสิทธิ์เข้าใช้งาน Admin</h2>
          </div>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {admins.length} รายการ
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4">หน่วยงาน/ตำแหน่ง</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
                <th className="px-6 py-4 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">ยังไม่มีข้อมูลคำขอ</td>
                </tr>
              ) : (
                admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{admin.name}</td>
                    <td className="px-6 py-4 text-slate-600">{admin.department}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${
                        admin.status === AdminStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                        admin.status === AdminStatus.REJECTED ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          admin.status === AdminStatus.APPROVED ? 'bg-emerald-500' :
                          admin.status === AdminStatus.REJECTED ? 'bg-red-500' :
                          'bg-amber-500'
                        }`}></span>
                        {admin.status === AdminStatus.APPROVED ? 'อนุมัติแล้ว' :
                         admin.status === AdminStatus.REJECTED ? 'ไม่อนุมัติ' :
                         'รอการอนุมัติ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {admin.status === AdminStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => onUpdateAdmin(admin.id, AdminStatus.APPROVED)}
                            className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            อนุมัติ
                          </button>
                          <button 
                            onClick={() => onUpdateAdmin(admin.id, AdminStatus.REJECTED)}
                            className="text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            ปฏิเสธ
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => onDeleteAdmin(admin.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Citizen History Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-users"></i>
            </div>
            <h2 className="text-lg font-bold text-slate-800">ประวัติการเข้าใช้งาน (ประชาชน)</h2>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {citizens.length} รายการ
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4">เบอร์โทรศัพท์</th>
                <th className="px-6 py-4">เวลาที่เข้าสู่ระบบ</th>
                <th className="px-6 py-4 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {citizens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">ยังไม่มีผู้เข้าใช้งาน</td>
                </tr>
              ) : (
                citizens.map(citizen => (
                  <tr key={citizen.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{citizen.fullName}</td>
                    <td className="px-6 py-4 text-slate-600">{citizen.phone}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{citizen.loginTime}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteCitizen(citizen.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default ServiceDashboard;
