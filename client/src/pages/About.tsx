import { Info, Shield, Zap, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-2">
          <Info className="w-8 h-8 text-[#007AFF]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          About the TAG System
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
          The Timetable Auto Generator (TAG) is designed to streamline the scheduling process for students and administrators at Lagos State University.
        </p>
      </div>

      <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
        <p className="text-lg">
          Managing academic schedules can be a complex task, especially with varying course requirements, large student populations, and the need to accommodate specific learning pathways like carry-over courses. The TAG system was built to solve these challenges by providing an automated, intelligent, and user-friendly platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 m-0">Intelligent Automation</h3>
            </div>
            <p className="text-sm">
              Our core algorithm detects and resolves timetable clashes automatically. By generating tailored schedules, students no longer need to manually figure out their lecture and examination periods.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="w-6 h-6 text-emerald-500" />
              <h3 className="text-lg font-semibold text-gray-900 m-0">Personalized for You</h3>
            </div>
            <p className="text-sm">
              Whether you are taking standard departmental courses or adjusting your schedule to include external modules or carry-overs, TAG customizes your view so you only see what matters.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2 transition-shadow hover:shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-[#007AFF]" />
              <h3 className="text-lg font-semibold text-gray-900 m-0">Administrator Control</h3>
            </div>
            <p className="text-sm">
              Administrators have access to a powerful dashboard where they can manage faculties, departments, courses, and schedules. The system ensures data integrity and provides tools for easy updates, making the entire university's scheduling transparent and efficient.
            </p>
          </div>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mt-8">
          <p className="text-center font-medium text-gray-800 m-0">
            Built with modern web technologies, the TAG system ensures a fast, responsive, and seamless experience across all devices. We are committed to continually improving the academic experience at Lagos State University.
          </p>
        </div>
      </div>
    </div>
  );
}
