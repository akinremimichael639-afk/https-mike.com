import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ExamTimetable() {
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
      const res = await axios.post('/api/timetable/download-pdf', { courses: selectedCourseIds, type: 'exam' }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exam_timetable.pdf');
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

  // Group exams by date
  const groupedExams = data?.exams.reduce((acc: any, exam: any) => {
    const date = new Date(exam.exam_date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(exam);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Examination Timetable</h1>
          <p className="text-gray-500">Your personalized TAG-generated exam schedule.</p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/timetable/lecture"
            state={{ selectedCourseIds }}
            className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Lecture Timetable
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

      {data?.examClashes.length > 0 && (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-center mb-4 text-orange-800">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">Potential Timetable Clash Detected</h3>
          </div>
          <div className="space-y-3">
            {data.examClashes.map((clash: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between text-sm">
                <span className="font-semibold text-gray-900">{clash.event1.course_code} vs {clash.event2.course_code}</span>
                <span className="text-gray-600 mt-2 md:mt-0">{clash.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
        {Object.keys(groupedExams || {}).length === 0 ? (
          <div className="text-center py-10 text-gray-500">No exams scheduled for your selected courses.</div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedExams).sort((a,b) => new Date(a).getTime() - new Date(b).getTime()).map(date => (
              <div key={date}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">{date}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedExams[date].map((exam: any) => (
                    <div key={exam.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-[#007AFF] transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-xl text-gray-900">{exam.course_code}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-4 line-clamp-1">{exam.course_title}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <div className="w-16 font-semibold">Time:</div>
                          <div className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                            {exam.start_time.slice(0,5)} - {exam.end_time.slice(0,5)}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-16 font-semibold">Venue:</div>
                          <div>{exam.venue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
