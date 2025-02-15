import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import UniversityDashboard from './pages/Dashboard/UniversityDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Services from './pages/Services';
import ReviewsPage from './pages/ReviewsPage';
import ProfileManagement from './pages/ProfileManagement'; // Profile management page
import ChatbotPage from './pages/ChatbotPage'; // Chatbot page
import CustomCursor from './components/CustomCursor';

function App() {
  const location = useLocation();
  // Hide the Footer when on the Chatbot page
  const showFooter = location.pathname !== '/chatbot';

  return (
    <>
      {/* Custom Animated Cursor */}
      <CustomCursor />

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/university-dashboard" element={<UniversityDashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Conditionally render Footer */}
      {showFooter && <Footer />}
    </>
  );
}

export default App;
