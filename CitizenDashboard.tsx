import React, { useState } from 'react';
import { Submission, SubmissionStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CitizenDashboardProps {
  user: { fullName: string; phone: string };
  submissions: Submission[];
  onSubmit: (sub: Omit<Submission, 'id' | 'status' | 'isReadByAdmin'>) => void;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user, submissions, onSubmit }) => {
  const [view, setView] = useState<'NEW' | 'HISTORY'>('NEW');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user.phone);
  const [details, setDetails] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiDraft = async () => {
    if (!title) {
      alert('กรุณากรอกหัวข้อเรื่องเพื่อให้ AI ช่วยแนะนำรายละเอียด');
      return;
    }

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `ช่วยเรียบเรียงรายละเอียดคำร้องสำหรับหัวข้อ "${title}" ให้หน่อย โดยเน้นความเป็นทางการและระบุข้อมูลที่ควรมีเพื่อให้เจ้าหน้าที่รัฐทำงานง่ายขึ้น`,
        config: {
          systemInstruction: 'คุณคือเจ้าหน้าที่ผู้ช่วยอัจฉริยะของระบบ One Stop Service ทำหน้าที่ช่วยเหลือประชาชนในการเรียบเรียงคำร้องให้มีความสุภาพ ชัดเจน และระบุข้อมูลที่จำเป็น เช่น วันที่ เวลา สถานที่ และลักษณะปัญหา เพื่อให้เจ้าหน้าที่รัฐสามารถดำเนินการแก้ไขได้รวดเร็วขึ้น ตอบกลับเฉพาะข้อความที่เป็นรายละเอียดคำร้องเท่านั้น',
        },
      });
      if (response.text) {
        setDetails(response.text);
      }
    } catch (error) {
      console.error('AI error:', error);
      alert('ขออภัย ไม่สามารถเรียกใช้งาน AI ได้ในขณะนี้');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      citizenName: user.fullName,
      citizenPhone: phone,
      title,
      address,
      details,
      imageUrl: image || undefined,
      date: new Date().toLocaleDateString('th-TH')
    });
    alert('ส่งเรื่องเรียบร้อยแล้ว ระบบจะดำเนินการในลำดับถัดไป');
    resetForm();
    setView('HISTORY');
  };

  const resetForm = () => {
    setTitle('');
    setAddress('');
    setPhone(user.phone);
    setDetails('');
    setImage(null);
  };

  const getStatusStep = (status: SubmissionStatus) => {
    switch(status) {
      case SubmissionStatus.NEW: return 1;
      case SubmissionStatus.RECEIVED: return 2;
      case SubmissionStatus.PENDING: return 3;
      case SubmissionStatus.SUCCESS: return 4;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
        <button 
          onClick={() => setView('NEW')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center ${
            view === 'NEW' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-paper-plane mr-2"></i> แจ้งเรื่องใหม่
        </button>
        <button 
          onClick={() => setView('HISTORY')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center ${
            view === 'HISTORY' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-clipboard-list mr-2"></i> ติดตามสถานะ
        </button>
      </div>

      {view === 'NEW' ? (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 bg-slate-900 text-white">
            <h2 className="text-2xl font-bold">ยื่นคำร้องขอรับบริการ</h2>
            <p className="text-slate-400 text-sm mt-1">กรอกข้อมูลให้ครบถ้วนเพื่อให้เจ้าหน้าที่เข้าถึงพื้นที่ได้อย่างรวดเร็ว</p>
          </div>
          
          <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อเรื่องที่ต้องการแจ้ง <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    placeholder="เช่น ท่อประปาแตก, กิ่งไม้พาดสายไฟ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">สถานที่เกิดเหตุ / ที่อยู่ <span className="text-red-500">*</span></label>
                  <textarea 
                    required value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none h-32"
                    placeholder="ระบุบ้านเลขที่ หมู่ที่ ซอย ถนน หรือจุดสังเกต"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">เบอร์โทรศัพท์สำหรับติดต่อกลับ</label>
                  <input 
                    type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">รายละเอียดคำร้อง</label>
                    <button 
                      type="button"
                      onClick={handleAiDraft}
                      disabled={isAiLoading}
                      className="text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full hover:shadow-md transition-all disabled:opacity-50"
                    >
                      {isAiLoading ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>}
                      AI ช่วยเรียบเรียง
                    </button>
                  </div>
                  <textarea 
                    value={details} onChange={e => setDetails(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none h-48"
                    placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับปัญหาที่พบ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">แนบรูปภาพประกอบ</label>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-upload" />
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer bg-slate-50 group-hover:bg-slate-100 group-hover:border-blue-300 transition-all"
                    >
                      {image ? (
                        <div className="relative h-full w-full p-2">
                           <img src={image} className="h-full w-full object-contain rounded-2xl" alt="Preview" />
                           <button type="button" onClick={(e) => { e.preventDefault(); setImage(null); }} className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                            <i className="fa-solid fa-trash-can text-sm"></i>
                           </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                            <i className="fa-solid fa-camera text-slate-400"></i>
                          </div>
                          <p className="text-sm font-medium text-slate-600">อัปโหลดรูปภาพ</p>
                          <p className="text-xs text-slate-400 mt-1">ไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
              <button 
                type="submit"
                className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                ยืนยันการส่งข้อมูล
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white text-slate-600 border border-slate-200 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                ล้างข้อมูล
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-6">
          {submissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <i className="fa-solid fa-folder-open text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800">ยังไม่เคยมีรายการแจ้ง</h3>
              <p className="text-slate-500 mt-2">หากท่านพบปัญหาหรือต้องการรับบริการ สามารถแจ้งเรื่องได้ที่เมนู "แจ้งเรื่องใหม่"</p>
            </div>
          ) : (
            submissions.map(sub => {
              const step = getStatusStep(sub.status);
              return (
                <div key={sub.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">ID: #{sub.id.slice(-6)}</span>
                          <span className="text-xs text-slate-400">{sub.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{sub.title}</h3>
                        <p className="text-slate-500 text-sm mt-1 flex items-center">
                          <i className="fa-solid fa-location-dot mr-1.5 text-slate-300"></i>
                          {sub.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                          sub.status === SubmissionStatus.SUCCESS ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          sub.status === SubmissionStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' :
                          sub.status === SubmissionStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          <i className={`mr-2 fa-solid ${
                            sub.status === SubmissionStatus.SUCCESS ? 'fa-circle-check' :
                            sub.status === SubmissionStatus.REJECTED ? 'fa-circle-xmark' :
                            sub.status === SubmissionStatus.PENDING ? 'fa-clock-rotate-left' :
                            'fa-info-circle'
                          }`}></i>
                          {sub.status}
                        </span>
                      </div>
                    </div>

                    {/* Stepper Tracking */}
                    {sub.status !== SubmissionStatus.REJECTED && (
                      <div className="relative pt-10 pb-4">
                        <div className="absolute top-[48px] left-0 right-0 h-1 bg-slate-100 rounded-full"></div>
                        <div 
                          className="absolute top-[48px] left-0 h-1 bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(step - 1) * 33.33}%` }}
                        ></div>
                        
                        <div className="relative flex justify-between">
                          {[
                            { label: 'ส่งเรื่อง', icon: 'fa-paper-plane' },
                            { label: 'รับเรื่อง', icon: 'fa-inbox' },
                            { label: 'กำลังดำเนินการ', icon: 'fa-tools' },
                            { label: 'สำเร็จ', icon: 'fa-flag-checkered' }
                          ].map((item, idx) => {
                            const currentIdx = idx + 1;
                            const isActive = currentIdx <= step;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-500 ${
                                  isActive ? 'bg-blue-600 border-white text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300'
                                }`}>
                                  <i className={`fa-solid ${item.icon} text-sm`}></i>
                                </div>
                                <span className={`text-[11px] font-bold mt-2 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {sub.status === SubmissionStatus.REJECTED && (
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                        <i className="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
                        <div>
                          <p className="text-sm font-bold text-red-800">ขออภัย คำร้องนี้ไม่สามารถดำเนินการได้</p>
                          <p className="text-sm text-red-700 mt-1">เหตุผล: {sub.rejectionReason || 'ข้อมูลไม่ชัดเจนหรือไม่ครบถ้วน'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
