import React, { useState } from 'react';
import { Submission, SubmissionStatus, Department } from '../types';
import { DEPARTMENTS } from '../constants';

interface AdminDashboardProps {
  user: any;
  submissions: Submission[];
  onUpdateSubmission: (id: string, updates: Partial<Submission>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, submissions, onUpdateSubmission }) => {
  const [view, setView] = useState<'REQUESTS' | 'HISTORY'>('REQUESTS');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [assignedDept, setAssignedDept] = useState<Department>(DEPARTMENTS[0]);
  const [filterDept, setFilterDept] = useState<Department | 'ทั้งหมด'>('ทั้งหมด');

  const handleOpenSubmission = (sub: Submission) => {
    setSelectedSub(sub);
    if (!sub.isReadByAdmin) {
      onUpdateSubmission(sub.id, { isReadByAdmin: true });
    }
  };

  const handleApprove = () => {
    if (selectedSub) {
      onUpdateSubmission(selectedSub.id, { 
        status: SubmissionStatus.RECEIVED, 
        assignedDepartment: assignedDept 
      });
      setSelectedSub(null);
      alert('อนุมัติและส่งต่องานไปยัง ' + assignedDept + ' เรียบร้อยแล้ว');
    }
  };

  const handleReject = () => {
    if (selectedSub && rejectReason) {
      onUpdateSubmission(selectedSub.id, { 
        status: SubmissionStatus.REJECTED, 
        rejectionReason: rejectReason 
      });
      setSelectedSub(null);
      setRejectReason('');
      alert('ไม่อนุมัติคำร้องเรียบร้อยแล้ว');
    } else {
      alert('กรุณาระบุเหตุผลที่ไม่อนุมัติ');
    }
  };

  const updateStatus = (id: string, status: SubmissionStatus) => {
    onUpdateSubmission(id, { status });
  };

  const filteredHistory = submissions.filter(s => {
    const isHistory = [SubmissionStatus.RECEIVED, SubmissionStatus.PENDING, SubmissionStatus.SUCCESS].includes(s.status);
    if (!isHistory) return false;
    if (filterDept === 'ทั้งหมด') return true;
    return s.assignedDepartment === filterDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
        <button 
          onClick={() => setView('REQUESTS')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center ${
            view === 'REQUESTS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-inbox mr-2"></i> คำร้องใหม่ ({submissions.filter(s => s.status === SubmissionStatus.NEW).length})
        </button>
        <button 
          onClick={() => setView('HISTORY')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center ${
            view === 'HISTORY' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-tasks mr-2"></i> จัดการงานหน่วยงาน
        </button>
      </div>

      {view === 'REQUESTS' ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">รายการรับเรื่องร้องเรียนจากประชาชน</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-4">สถานะ</th>
                  <th className="px-8 py-4">เรื่องที่แจ้ง</th>
                  <th className="px-8 py-4">ผู้ส่งเรื่อง</th>
                  <th className="px-8 py-4">วันที่รับ</th>
                  <th className="px-8 py-4 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {submissions.filter(s => s.status === SubmissionStatus.NEW || s.status === SubmissionStatus.REJECTED).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="max-w-xs mx-auto text-slate-400">
                        <i className="fa-solid fa-circle-check text-4xl mb-4 text-emerald-100"></i>
                        <p className="font-bold">เรียบร้อยทุกรายการ</p>
                        <p className="text-sm">ขณะนี้ไม่มีคำร้องใหม่รอการพิจารณา</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.filter(s => s.status === SubmissionStatus.NEW || s.status === SubmissionStatus.REJECTED).map(sub => (
                    <tr key={sub.id} className={`hover:bg-slate-50 transition-colors ${!sub.isReadByAdmin ? 'bg-blue-50/10' : ''}`}>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          sub.status === SubmissionStatus.NEW ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{sub.title}</span>
                          <span className="text-xs text-slate-400 flex items-center mt-1">
                            <i className="fa-solid fa-location-dot mr-1"></i> {sub.address.slice(0, 30)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3 text-slate-400 text-xs">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          <span className="text-sm font-medium text-slate-600">{sub.citizenName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500">{sub.date}</td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleOpenSubmission(sub)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                        >
                          ตรวจงาน
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800">ติดตามการแก้ไขปัญหา</h2>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">หน่วยงาน:</span>
              <select 
                value={filterDept}
                onChange={e => setFilterDept(e.target.value as any)}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-500"
              >
                <option value="ทั้งหมด">ทั้งหมดทุกหน่วยงาน</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-4">หัวข้อเรื่อง</th>
                    <th className="px-8 py-4">ผู้ดูแลรับผิดชอบ</th>
                    <th className="px-8 py-4 text-center">สถานะ</th>
                    <th className="px-8 py-4 text-right">ปรับปรุงข้อมูล</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400">ไม่พบรายการงานในหมวดหมู่นี้</td>
                    </tr>
                  ) : (
                    filteredHistory.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <button 
                            onClick={() => handleOpenSubmission(sub)}
                            className="font-bold text-blue-600 hover:underline flex items-center"
                          >
                            <i className="fa-solid fa-file-invoice mr-3 text-slate-300"></i>
                            {sub.title}
                          </button>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                            <i className="fa-solid fa-building mr-2 text-slate-400"></i>
                            {sub.assignedDepartment}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            sub.status === SubmissionStatus.SUCCESS ? 'bg-emerald-100 text-emerald-700' :
                            sub.status === SubmissionStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right flex items-center justify-end space-x-3">
                           <select 
                            value={sub.status}
                            onChange={(e) => updateStatus(sub.id, e.target.value as SubmissionStatus)}
                            className="p-2 text-xs bg-white border border-slate-200 rounded-xl font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           >
                             <option value={SubmissionStatus.RECEIVED}>รับเรื่องแล้ว</option>
                             <option value={SubmissionStatus.PENDING}>กำลังดำเนินงาน</option>
                             <option value={SubmissionStatus.SUCCESS}>แก้ไขสำเร็จ</option>
                           </select>
                           <button className="text-slate-300 hover:text-blue-600 transition-colors">
                             <i className="fa-solid fa-ellipsis-vertical"></i>
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modern Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Case Management Portal</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedSub.title}</h3>
              </div>
              <button onClick={() => setSelectedSub(null)} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">ข้อมูลผู้ร้องเรียน</p>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-500 mr-4">
                      <i className="fa-solid fa-user-tie"></i>
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{selectedSub.citizenName}</p>
                      <p className="text-sm text-slate-500">{selectedSub.citizenPhone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">วันที่แจ้งเรื่อง</p>
                      <p className="text-xs font-bold text-slate-800">{selectedSub.date}</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">สถานะปัจจุบัน</p>
                      <p className="text-xs font-bold text-blue-600">{selectedSub.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">สถานที่เกิดเหตุ</p>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-700 leading-relaxed font-medium">
                      {selectedSub.address}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">รายละเอียดเชิงลึก</p>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-700 leading-relaxed italic">
                      {selectedSub.details || 'ไม่มีข้อมูลเพิ่มเติม'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {selectedSub.imageUrl && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">หลักฐานรูปภาพ</p>
                    <div className="rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 aspect-video flex items-center justify-center">
                      <img src={selectedSub.imageUrl} className="max-h-full object-contain" alt="Evidence" />
                    </div>
                  </div>
                )}

                {selectedSub.status === SubmissionStatus.NEW && (
                  <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-200 space-y-6">
                    <h4 className="text-lg font-black flex items-center">
                      <i className="fa-solid fa-shield-halved mr-3"></i>
                      พิจารณาคำร้อง
                    </h4>
                    <div>
                      <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">มอบหมายงานให้หน่วยงาน</label>
                      <select 
                        value={assignedDept} 
                        onChange={e => setAssignedDept(e.target.value as Department)}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl focus:bg-white focus:text-slate-900 transition-all outline-none font-bold"
                      >
                        {DEPARTMENTS.map(d => <option key={d} value={d} className="text-slate-900">{d}</option>)}
                      </select>
                    </div>
                    <button 
                      onClick={handleApprove}
                      className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      อนุมัติและรับงาน
                    </button>
                    
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-xs font-bold text-blue-200 uppercase mb-3">กรณีไม่อนุมัติ (ระบุเหตุผล)</p>
                      <textarea 
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="ระบุเหตุผลที่ปฏิเสธ..."
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl focus:bg-white focus:text-slate-900 transition-all outline-none h-24 text-sm font-medium"
                      />
                      <button 
                        onClick={handleReject}
                        className="w-full mt-3 bg-red-500 text-white py-3 rounded-2xl font-bold hover:bg-red-600 transition-all"
                      >
                        ไม่อนุมัติและแจ้งผล
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedSub.status !== SubmissionStatus.NEW && (
                   <div className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-emerald-200">
                      <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-1">บันทึกการส่งต่องาน</p>
                      <p className="text-2xl font-black mb-4">ดำเนินการโดย: {selectedSub.assignedDepartment}</p>
                      <div className="flex items-center bg-white/10 rounded-2xl p-4">
                        <i className="fa-solid fa-circle-info mr-3"></i>
                        <span className="text-sm font-bold">สถานะ: {selectedSub.status}</span>
                      </div>
                      {selectedSub.rejectionReason && (
                        <div className="mt-4 bg-red-900/20 p-4 rounded-2xl border border-red-100/20">
                           <p className="text-xs font-bold text-red-200">เหตุผลที่ปฏิเสธ</p>
                           <p className="text-sm italic">{selectedSub.rejectionReason}</p>
                        </div>
                      )}
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
