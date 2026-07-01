import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function LevelSelection() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const navigate = useNavigate();

  const levels = ['100', '200', '300', '400'];

  const handleContinue = () => {
    if (selectedLevel) {
      navigate(`/courses/${selectedLevel}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Select Your Academic Level</h1>
        <p className="text-gray-500">Choose your current level to load the base courses.</p>
      </div>

      <div className="space-y-4 mb-12">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={clsx(
              "w-full flex items-center justify-between p-6 rounded-2xl border transition-all duration-200",
              selectedLevel === level 
                ? "border-[#007AFF] bg-blue-50 shadow-sm" 
                : "border-gray-200 hover:border-[#007AFF] hover:bg-gray-50 bg-white"
            )}
          >
            <div className="flex items-center space-x-4">
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-colors",
                selectedLevel === level ? "bg-[#007AFF] text-white" : "bg-gray-100 text-gray-700"
              )}>
                {level}
              </div>
              <span className={clsx(
                "text-xl font-medium",
                selectedLevel === level ? "text-[#007AFF]" : "text-gray-700"
              )}>Level</span>
            </div>
            <div className={clsx(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              selectedLevel === level ? "border-[#007AFF] bg-[#007AFF]" : "border-gray-300"
            )}>
              {selectedLevel === level && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedLevel}
          className="flex items-center px-8 py-4 bg-[#007AFF] text-white font-medium rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue to Course Selection
          <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
