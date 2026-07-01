import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Trash2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface Course {
  id: number;
  code: string;
  title: string;
  level: string;
  type: string;
}

export default function CourseSelection() {
  const { level } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial courses for the level
  useEffect(() => {
    const fetchBaseCourses = async () => {
      try {
        const res = await axios.get(`/api/courses/level/${level}`);
        setSearchResults(res.data.data);
      } catch (error) {
        console.error('Failed to fetch base courses', error);
      }
    };
    if (level) {
      fetchBaseCourses();
    }
  }, [level]);

  // Global search with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/courses/search?query=${encodeURIComponent(searchQuery)}`);
          setSearchResults(res.data.data);
        } catch (error) {
          console.error('Search failed', error);
        }
        setIsLoading(false);
      } else if (level) {
        // Reset to base level courses
        try {
          const res = await axios.get(`/api/courses/level/${level}`);
          setSearchResults(res.data.data);
        } catch (error) {
          console.error('Failed to reset courses', error);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, level]);

  const addCourse = (course: Course) => {
    if (!selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const removeCourse = (id: number) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== id));
  };

  const generateTimetable = async () => {
    if (selectedCourses.length === 0) return;
    
    // Pass selected course ids to next steps via state
    const courseIds = selectedCourses.map(c => c.id);
    navigate('/timetable/lecture', { state: { selectedCourseIds: courseIds } });
  };

  const getBadgeType = (courseLevel: string) => {
    if (courseLevel === level) return { label: 'Current Level', color: 'bg-green-100 text-green-800' };
    if (parseInt(courseLevel) < parseInt(level || '0')) return { label: 'Carry-over', color: 'bg-red-100 text-red-800' };
    return { label: 'Borrowed', color: 'bg-purple-100 text-purple-800' };
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Selection</h1>
        <p className="text-gray-500">Search and select all your courses for this semester.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Search & Results Panel */}
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col h-[70vh]">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] transition-shadow shadow-sm"
              placeholder="Search ENTIRE database (e.g. CSC 111, MTH 211)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#007AFF]"></div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {searchResults.length === 0 && !isLoading && (
              <div className="text-center py-10 text-gray-500">No courses found.</div>
            )}
            {searchResults.map(course => {
              const badge = getBadgeType(course.level);
              const isSelected = selectedCourses.some(c => c.id === course.id);
              return (
                <div key={course.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:border-[#007AFF]">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-bold text-gray-900">{course.code}</span>
                      <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium", badge.color)}>
                        {badge.label}
                      </span>
                      {course.type === 'Elective' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Elective</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{course.title}</p>
                  </div>
                  <button
                    onClick={() => addCourse(course)}
                    disabled={isSelected}
                    className={clsx(
                      "p-2 rounded-full transition-colors flex-shrink-0 ml-4",
                      isSelected ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#007AFF] text-white hover:bg-blue-600"
                    )}
                  >
                    {isSelected ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Courses Panel */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col h-[70vh]">
          <div className="mb-6 flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Selected Courses</h2>
            <span className="bg-blue-100 text-[#007AFF] py-1 px-3 rounded-full text-sm font-semibold">
              {selectedCourses.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {selectedCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>No courses selected yet.</p>
                <p className="text-sm mt-2">Search and add courses from the left panel.</p>
              </div>
            ) : (
              selectedCourses.map(course => {
                const badge = getBadgeType(course.level);
                return (
                  <div key={course.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center group">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-gray-900">{course.code}</span>
                        <span className={clsx("px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider", badge.color)}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate max-w-[200px]">{course.title}</p>
                    </div>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove course"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={generateTimetable}
              disabled={selectedCourses.length === 0}
              className="w-full flex items-center justify-center py-4 rounded-xl font-medium text-white bg-[#007AFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Generate Timetables
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Dummy check circle component since we didn't import it at the top
function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
