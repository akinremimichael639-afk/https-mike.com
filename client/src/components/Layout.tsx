import { ReactGNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Briefcase, BookOpen, 
  Calendar, FileText, Download, Info, 
  Lock, LayoutDashboard, LogOut 
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { admin, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Select Level', path: '/level', icon: Briefcase },
    { name: 'Select Courses', path: '/courses', icon: BookOpen },
    { name: 'Lecture Timetable', path: '/timetable/lecture', icon: Calendar },
    { name: 'Exam Timetable', path: '/timetable/exam', icon: FileText },
    { name: 'Download Timetable', path: '/download', icon: Download },
    { name: 'About', path: '/about', icon: Info, divider: true },
  ];

  if (admin) {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard });
  } else {
    navLinks.push({ name: 'Admin Login', path: '/admin/login', icon: Lock });
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Background Watermark */}
      <img
        src="C:\Users\MICHAEL\Documents\ayo software\client\public\lasu-logo.png"
        alt="LASU Crest Watermark"
        className="lasu-watermark"
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <img
                src="C:\Users\MICHAEL\Documents\ayo software\client\public\lasu-logo.png"
                alt="LASU Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-tight tracking-tight text-gray-900">Lagos State University</span>
                <span className="text-xs text-[#007AFF] font-medium tracking-wide uppercase">TAG System</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    "text-sm font-medium transition-colors hover:text-[#007AFF] whitespace-nowrap flex items-center gap-1.5",
                    location.pathname === link.path ? "text-[#007AFF]" : "text-gray-600"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name === 'Select Level' ? 'Level' : link.name.replace(' Timetable', '')}
                </Link>
              ))}
              {admin && (
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={toggleMenu}
            />
            
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-semibold text-gray-900">Navigation</span>
                <button 
                  onClick={toggleMenu}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-2">
                {navLinks.map((link) => (
                  <div key={link.path}>
                    {link.divider && <hr className="my-2 mx-4 border-gray-100" />}
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors",
                        location.pathname === link.path
                          ? "text-[#007AFF] bg-blue-50/50 border-r-2 border-[#007AFF]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {link.icon && <link.icon className="h-5 w-5" strokeWidth={1.5} />}
                      <span>{link.name}</span>
                    </Link>
                  </div>
                ))}
                {admin && (
                  <>
                    <hr className="my-2 mx-4 border-gray-100" />
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full flex items-center space-x-3 px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5" strokeWidth={1.5} />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative">
        {children}
      </main>
    </div>
  );
}
