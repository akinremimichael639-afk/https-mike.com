import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LectureTimetable() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const selectedCourseIds = location.state?.selectedCourseIds || [];

  useEffect(() => {
    if (selectedCourseIds.length === 0) {
      navigate('/level');
      return;
    }

    const fetchTAG = async () => {
      try {
        const res = await axios.post('/api/timetable/generate', { courses: selectedCourseIds });
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to generate timetable', error);
      }
      setLoading(false);
    };

    fetchTAG();
  }, []);

  const downloadPDF = async () => {
    try {
      const res = await axios.post('/api/timetable/download-pdf', { courses: selectedCourseIds, type: 'lecture' }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lecture_timetable.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download PDF', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AFF]"></div></div>;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="max-w-7xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lecture Timetable</h1>
          <p className="text-gray-500">Your personalized TAG-generated schedule.</p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/timetable/exam"
            state={{ selectedCourseIds }}
            className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            View Exam Timetable
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <button
            onClick={downloadPDF}
            className="flex items-center px-6 py-3 bg-[#007AFF] text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Download className="mr-2 w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {data?.lectureClashes.length > 0 && (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-center mb-4 text-orange-800">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">Potential Timetable Clash Detected</h3>
          </div>
          <div className="space-y-3">
            {data.lectureClashes.map((clash: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between text-sm">
                <span className="font-semibold text-gray-900">{clash.event1.course_code} vs {clash.event2.course_code}</span>
                <span className="text-gray-600 mt-2 md:mt-0">{clash.reason}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-orange-600 mt-4">*Please contact your course advisor as clashes cannot be auto-resolved.</p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 w-32">Day</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {days.map(day => {
                const dayLectures = data?.lectures.filter((l: any) => l.day === day).sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
                
                return (
                  <tr key={day} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 px-6 align-top">
                      <span className="font-semibold text-gray-900">{day}</span>
                    </td>
                    <td className="py-6 px-6">
                      {dayLectures && dayLectures.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dayLectures.map((lecture: any) => (
                            <div key={lecture.id} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 transition-all hover:shadow-sm hover:bg-white">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-[#007AFF]">{lecture.course_code}</span>
                                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                                  {lecture.start_time.slice(0,5)} - {lecture.end_time.slice(0,5)}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">{lecture.course_title}</p>
                              <div className="text-xs text-gray-500 space-y-1">
                                <p><span className="font-medium text-gray-700">Venue:</span> {lecture.venue}</p>
                                <p><span className="font-medium text-gray-700">Lecturer:</span> {lecture.lecturer}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">No classes</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
