import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LevelSelection from './pages/LevelSelection';
import CourseSelection from './pages/CourseSelection';
import LectureTimetable from './pages/LectureTimetable';
import ExamTimetable from './pages/ExamTimetable';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/level" element={<LevelSelection />} />
            <Route path="/courses/:level" element={<CourseSelection />} />
            <Route path="/timetable/lecture" element={<LectureTimetable />} />
            <Route path="/timetable/exam" element={<ExamTimetable />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
