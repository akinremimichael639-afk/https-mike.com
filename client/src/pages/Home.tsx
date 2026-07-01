import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Timetable Auto Generator
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-light max-w-2xl mx-auto">
          A personalized, clash-free lecture and examination scheduling experience for Lagos State University.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-12">
        <FeatureCard 
          icon={<Clock className="w-8 h-8 text-[#007AFF]" />}
          title="Instant Clash Detection"
          desc="Automatically identifies overlapping lectures and exams."
        />
        <FeatureCard 
          icon={<Calendar className="w-8 h-8 text-[#007AFF]" />}
          title="Personalized View"
          desc="See only the courses you are taking, including carry-overs."
        />
        <FeatureCard 
          icon={<CheckCircle className="w-8 h-8 text-[#007AFF]" />}
          title="Export to PDF"
          desc="Download a clean, printer-friendly version of your schedule."
        />
      </div>

      <div className="pt-12">
        <Link
          to="/level"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#007AFF] hover:bg-blue-600 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
        >
          Generate My Timetable
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-gray-50/50 backdrop-blur-sm rounded-3xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
      <div className="p-4 bg-blue-50 rounded-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
