import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import clsx from 'clsx';
import { BookOpen, CalendarIcon, Clock, Plus, Pencil, Trash2, X, Check, Upload, FileText } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Course { id: number; code: string; title: string; level: string; type: string; }
interface Lecture { id: number; level: string; course_id: number; day: string; start_time: string; end_time: string; venue: string; lecturer: string; course_code?: string; course_title?: string; }
interface Exam { id: number; level: string; course_id: number; exam_date: string; start_time: string; end_time: string; venue: string; course_code?: string; course_title?: string; }

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] outline-none text-sm transition-all";

// ─── Courses Manager ──────────────────────────────────────────────────────────
function CoursesManager({ token }: { token: string | null }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ code: '', title: '', level: '100', type: 'Compulsory' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try { const res = await axios.get('/api/courses'); setCourses(res.data.data); } catch (e) { console.error(e); }
  };

  const openAdd = () => { setForm({ code: '', title: '', level: '100', type: 'Compulsory' }); setEditCourse(null); setError(''); setShowModal(true); };
  const openEdit = (c: Course) => { setForm({ code: c.code, title: c.title, level: c.level, type: c.type }); setEditCourse(c); setError(''); setShowModal(true); };

  const handleSave = async () => {
    if (!form.code || !form.title) { setError('Course code and title are required.'); return; }
    setSaving(true); setError('');
    try {
      if (editCourse) {
        await axios.put(`/api/courses/${editCourse.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/courses', form, { headers: { Authorization: `Bearer ${token}` } });
      }
      await fetchCourses();
      setShowModal(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save course.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this course? This will also remove its timetable entries.')) return;
    try { await axios.delete(`/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } }); await fetchCourses(); }
    catch (e) { alert('Failed to delete course.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Manage Courses</h2>
        <button onClick={openAdd} className="flex items-center px-4 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Course
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Code</th>
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Level</th>
                <th className="p-4 font-semibold text-gray-600">Type</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No courses found.</td></tr>
              )}
              {courses.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-[#007AFF]">{c.code}</td>
                  <td className="p-4 text-gray-700">{c.title}</td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium">{c.level}</span></td>
                  <td className="p-4"><span className={clsx("px-2 py-0.5 rounded-md text-xs font-medium", c.type === 'Elective' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700')}>{c.type}</span></td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-gray-500 hover:text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editCourse ? 'Edit Course' : 'Add Course'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
            <Field label="Course Code"><input className={inputCls} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CSC 411" /></Field>
            <Field label="Course Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Artificial Intelligence" /></Field>
            <Field label="Level">
              <select className={inputCls} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {['100','200','300','400'].map(l => <option key={l} value={l}>{l} Level</option>)}
              </select>
            </Field>
            <Field label="Course Type">
              <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="Compulsory">Compulsory</option>
                <option value="Elective">Elective</option>
              </select>
            </Field>
            <div className="flex space-x-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#007AFF] text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center">
                {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Check className="w-4 h-4 mr-2" />{editCourse ? 'Update' : 'Add Course'}</>}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Lectures Manager ─────────────────────────────────────────────────────────
function LecturesManager({ token }: { token: string | null }) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ level: '100', course_id: '', day: 'Monday', start_time: '08:00', end_time: '10:00', venue: '', lecturer: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [lRes, cRes] = await Promise.all([axios.get('/api/timetable/lecture'), axios.get('/api/courses')]);
      setLectures(lRes.data.data); setCourses(cRes.data.data);
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!form.course_id || !form.venue || !form.lecturer) { setError('Please fill in all fields.'); return; }
    setSaving(true); setError('');
    try {
      await axios.post('/api/timetable/lecture', { ...form, course_id: parseInt(form.course_id) }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchAll(); setShowModal(false);
      setForm({ level: '100', course_id: '', day: 'Monday', start_time: '08:00', end_time: '10:00', venue: '', lecturer: '' });
    } catch (e: any) { setError(e.response?.data?.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this lecture entry?')) return;
    try { await axios.delete(`/api/timetable/lecture/${id}`, { headers: { Authorization: `Bearer ${token}` } }); await fetchAll(); }
    catch (e) { alert('Failed to delete.'); }
  };

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Lecture Timetables</h2>
        <button onClick={() => { setError(''); setShowModal(true); }} className="flex items-center px-4 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Entry
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Course</th>
                <th className="p-4 font-semibold text-gray-600">Day</th>
                <th className="p-4 font-semibold text-gray-600">Time</th>
                <th className="p-4 font-semibold text-gray-600">Venue</th>
                <th className="p-4 font-semibold text-gray-600">Lecturer</th>
                <th className="p-4 font-semibold text-gray-600">Level</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lectures.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-gray-400">No lecture entries found.</td></tr>}
              {lectures.map(l => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4"><div className="font-semibold text-[#007AFF]">{l.course_code}</div><div className="text-xs text-gray-500">{l.course_title}</div></td>
                  <td className="p-4">{l.day}</td>
                  <td className="p-4 whitespace-nowrap">{String(l.start_time).slice(0,5)} – {String(l.end_time).slice(0,5)}</td>
                  <td className="p-4">{l.venue}</td>
                  <td className="p-4">{l.lecturer}</td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium">{l.level}</span></td>
                  <td className="p-4"><button onClick={() => handleDelete(l.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Add Lecture Entry" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
            <Field label="Level">
              <select className={inputCls} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {['100','200','300','400'].map(l => <option key={l} value={l}>{l} Level</option>)}
              </select>
            </Field>
            <Field label="Course">
              <select className={inputCls} value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} – {c.title}</option>)}
              </select>
            </Field>
            <Field label="Day">
              <select className={inputCls} value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Time"><input type="time" className={inputCls} value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} /></Field>
              <Field label="End Time"><input type="time" className={inputCls} value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} /></Field>
            </div>
            <Field label="Venue"><input className={inputCls} value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="e.g. LT1" /></Field>
            <Field label="Lecturer"><input className={inputCls} value={form.lecturer} onChange={e => setForm({ ...form, lecturer: e.target.value })} placeholder="e.g. Dr. A. Bello" /></Field>
            <div className="flex space-x-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#007AFF] text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center">
                {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Check className="w-4 h-4 mr-2" />Add Entry</>}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Exams Manager ────────────────────────────────────────────────────────────
function ExamsManager({ token }: { token: string | null }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ level: '100', course_id: '', exam_date: '', start_time: '09:00', end_time: '12:00', venue: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [eRes, cRes] = await Promise.all([axios.get('/api/timetable/exam'), axios.get('/api/courses')]);
      setExams(eRes.data.data); setCourses(cRes.data.data);
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!form.course_id || !form.exam_date || !form.venue) { setError('Please fill in all fields.'); return; }
    setSaving(true); setError('');
    try {
      await axios.post('/api/timetable/exam', { ...form, course_id: parseInt(form.course_id) }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchAll(); setShowModal(false);
      setForm({ level: '100', course_id: '', exam_date: '', start_time: '09:00', end_time: '12:00', venue: '' });
    } catch (e: any) { setError(e.response?.data?.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this exam entry?')) return;
    try { await axios.delete(`/api/timetable/exam/${id}`, { headers: { Authorization: `Bearer ${token}` } }); await fetchAll(); }
    catch (e) { alert('Failed to delete.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Exam Timetables</h2>
        <button onClick={() => { setError(''); setShowModal(true); }} className="flex items-center px-4 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Entry
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Course</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Time</th>
                <th className="p-4 font-semibold text-gray-600">Venue</th>
                <th className="p-4 font-semibold text-gray-600">Level</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-400">No exam entries found.</td></tr>}
              {exams.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4"><div className="font-semibold text-[#007AFF]">{e.course_code}</div><div className="text-xs text-gray-500">{e.course_title}</div></td>
                  <td className="p-4 whitespace-nowrap">{new Date(e.exam_date).toDateString()}</td>
                  <td className="p-4 whitespace-nowrap">{String(e.start_time).slice(0,5)} – {String(e.end_time).slice(0,5)}</td>
                  <td className="p-4">{e.venue}</td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium">{e.level}</span></td>
                  <td className="p-4"><button onClick={() => handleDelete(e.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Add Exam Entry" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
            <Field label="Level">
              <select className={inputCls} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {['100','200','300','400'].map(l => <option key={l} value={l}>{l} Level</option>)}
              </select>
            </Field>
            <Field label="Course">
              <select className={inputCls} value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} – {c.title}</option>)}
              </select>
            </Field>
            <Field label="Exam Date"><input type="date" className={inputCls} value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Time"><input type="time" className={inputCls} value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} /></Field>
              <Field label="End Time"><input type="time" className={inputCls} value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} /></Field>
            </div>
            <Field label="Venue"><input className={inputCls} value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="e.g. Exam Hall 1" /></Field>
            <div className="flex space-x-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#007AFF] text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center">
                {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Check className="w-4 h-4 mr-2" />Add Entry</>}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { admin, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'lectures' | 'exams'>('overview');
  const [stats, setStats] = useState({ courses: 0, lectures: 0, exams: 0, adminAdded: 0 });

  useEffect(() => {
    if (!admin) navigate('/admin/login');
  }, [admin, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cRes, lRes, eRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/timetable/lecture'),
          axios.get('/api/timetable/exam')
        ]);
        setStats({
          courses: cRes.data?.data?.length || 0,
          lectures: lRes.data?.data?.length || 0,
          exams: eRes.data?.data?.length || 0,
          adminAdded: 0
        });
      } catch (e) { console.error(e); }
    };
    if (admin && activeTab === 'overview') fetchStats();
  }, [admin, activeTab]);

  if (!admin) return null;

  if (activeTab !== 'overview') {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
        <button onClick={() => setActiveTab('overview')} className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-[#007AFF] transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </button>
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden min-h-[60vh]">
          {activeTab === 'courses'  && <CoursesManager  token={token} />}
          {activeTab === 'lectures' && <LecturesManager token={token} />}
          {activeTab === 'exams'    && <ExamsManager    token={token} />}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto relative px-4 py-6 animate-in fade-in duration-500 min-h-screen">
      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none z-0 mt-10">
        <img src="https://upload.wikimedia.org/wikipedia/en/7/7e/Lagos_State_University_logo.png" alt="LASU Watermark" className="w-72 h-72 object-contain" />
      </div>

      <div className="relative z-10 mb-6">
        <div className="flex items-center space-x-3 mb-1">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <span className="flex items-center px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-semibold rounded-md border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            DB Connected
          </span>
        </div>
        <p className="text-[13px] text-gray-500 leading-snug mb-4 pr-4">Department of Computer Science — LASU TAG System</p>
        <button 
          onClick={logout} 
          className="px-5 py-1.5 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:bg-gray-50 transition-colors shadow-sm"
        >
          Sign out
        </button>
      </div>

      <div className="border-t border-gray-100 w-full mb-6 relative z-10" />

      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <div onClick={() => setActiveTab('courses')} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
          <div className="text-[32px] font-light text-[#007AFF] mb-1">{stats.courses}</div>
          <div className="text-[11px] text-gray-500 font-medium">Total Courses</div>
        </div>
        <div onClick={() => setActiveTab('lectures')} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
          <div className="text-[32px] font-light text-[#007AFF] mb-1">{stats.lectures}</div>
          <div className="text-[11px] text-gray-500 font-medium">Lecture Records</div>
        </div>
        <div onClick={() => setActiveTab('exams')} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
          <div className="text-[32px] font-light text-[#007AFF] mb-1">{stats.exams}</div>
          <div className="text-[11px] text-gray-500 font-medium">Exam Records</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[32px] font-light text-[#007AFF] mb-1">{stats.adminAdded}</div>
          <div className="text-[11px] text-gray-500 font-medium leading-tight">Admin-Added<br/>Courses</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10 pb-12">
        <div 
          onClick={() => setActiveTab('lectures')}
          className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm cursor-pointer hover:border-[#007AFF] hover:bg-blue-50/30 transition-all flex flex-col"
        >
          <Upload className="w-5 h-5 text-[#007AFF] mb-3" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-gray-900 mb-1 leading-tight">Upload Lecture Timetable</h3>
          <p className="text-[10px] text-gray-500 leading-tight">Add new lecture schedule records</p>
        </div>
        <div 
          onClick={() => setActiveTab('exams')}
          className="p-4 rounded-xl border border-[#007AFF] bg-blue-50/50 shadow-sm shadow-blue-100 cursor-pointer transition-all flex flex-col"
        >
          <FileText className="w-5 h-5 text-[#007AFF] mb-3" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-gray-900 mb-1 leading-tight">Upload Exam Timetable</h3>
          <p className="text-[10px] text-gray-500 leading-tight">Add or update exam schedule entries</p>
        </div>
      </div>
    </div>
  );
}
