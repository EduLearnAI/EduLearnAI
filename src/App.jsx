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
import ProfileManagement from './pages/ProfileManagement';
import ChatbotWithRag from './pages/ChatbotPage';       // RAG-enabled chatbot
import ChatbotWithoutRag from './pages/chatbot';        // Simple chatbot (no RAG)
import VideoRagPage from './pages/VideoRagPage';       // New Video RAG page
import CustomCursor from './components/CustomCursor';

function App() {
  const location = useLocation();
  // Hide the Footer on both chatbot routes and the video-RAG page
  const hideFooterPaths = [
    '/chatbot-with-rag',
    '/chatbot-without-rag',
    '/video-rag'
  ];
  const showFooter = !hideFooterPaths.includes(location.pathname);

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

        {/* Chatbot routes */}
        <Route path="/chatbot-with-rag" element={<ChatbotWithRag />} />
        <Route path="/chatbot-without-rag" element={<ChatbotWithoutRag />} />

        {/* Video RAG route */}
        <Route path="/video-rag" element={<VideoRagPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Conditionally render Footer */}
      {showFooter && <Footer />}
    </>
  );
}

export default App;
