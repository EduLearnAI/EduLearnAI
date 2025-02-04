import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // For reading and writing cookies

function Navbar() {
  // States to manage dropdown visibility.
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showInsightsDropdown, setShowInsightsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Define the backend base URL.
  const backendBaseUrl = "https://mominah-auth.hf.space";

  // Access token from cookie.
  const token = Cookies.get("access_token");

  // Local state for user data (including avatar). Initialize from cookie if present.
  const [userData, setUserData] = useState(() => {
    const cookie = Cookies.get("user");
    return cookie ? JSON.parse(cookie) : {};
  });

  // Update userData whenever token changes.
  useEffect(() => {
    if (token) {
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        setUserData(JSON.parse(cookieUser));
      }
    }
  }, [token]);

  // If token exists and the avatar is not set, fetch user data.
  useEffect(() => {
    if (token && !userData.avatar) {
      axios
        .get(`${backendBaseUrl}/user/data`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          setUserData(data);
          // Save the user data in a cookie for reuse.
          Cookies.set("user", JSON.stringify(data), { expires: 7, secure: true });
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, [token, userData.avatar, backendBaseUrl]);

  // Get the user's name either from userData or from a cookie.
  const userName = userData.name || Cookies.get("name");

  // Determine the avatar URL. If relative, prepend the backend URL.
  const userAvatar = userData.avatar
    ? userData.avatar.startsWith("/avatars")
      ? `${backendBaseUrl}${userData.avatar}`
      : userData.avatar
    : null;

  // Logout handler: remove cookies and redirect to login.
  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("name");
    Cookies.remove("avatar");
    Cookies.remove("user");
    window.location.href = "/login";
  };

  return (
    <motion.nav
      className="w-full bg-white text-black py-4 px-8 flex justify-between items-center shadow-md sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      {/* Logo Section */}
      <motion.div
        className="flex items-center space-x-4"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Link to="/" className="flex items-center space-x-2">
          <img src="download.gif" alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold tracking-wide">EduLearn AI</span>
        </Link>
      </motion.div>

      {/* Center Navigation Links */}
      <motion.div
        className="flex-1 flex justify-center space-x-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {/* Services Dropdown */}
        <motion.div
          className="relative"
          onMouseEnter={() => setShowServicesDropdown(true)}
          onMouseLeave={() => setShowServicesDropdown(false)}
        >
          <Link
            to="/services"
            className="text-lg font-semibold hover:text-yellow-300 transition duration-300"
          >
            Services
          </Link>
          {showServicesDropdown && (
            <motion.div
              className="absolute left-0 bg-white text-black shadow-md rounded-lg w-40 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Updated links to point to the dashboard routes */}
              <Link to="/student-dashboard" className="block py-1 px-2 hover:bg-yellow-200">
                Student
              </Link>
              <Link to="/teacher-dashboard" className="block py-1 px-2 hover:bg-yellow-200">
                Teacher
              </Link>
              <Link to="/university-dashboard" className="block py-1 px-2 hover:bg-yellow-200">
                University
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Reviews Link */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <Link to="/reviews" className="text-lg font-semibold hover:text-yellow-300 transition duration-300">
            Reviews
          </Link>
        </motion.div>

        {/* About Us Link */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <Link to="/about" className="text-lg font-semibold hover:text-yellow-300 transition duration-300">
            About Us
          </Link>
        </motion.div>

        {/* Contact Us Link */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <Link to="/contact" className="text-lg font-semibold hover:text-yellow-300 transition duration-300">
            Contact Us
          </Link>
        </motion.div>

        {/* Insights Dropdown */}
        <motion.div
          className="relative"
          onMouseEnter={() => setShowInsightsDropdown(true)}
          onMouseLeave={() => setShowInsightsDropdown(false)}
        >
          <Link to="/insights" className="text-lg font-semibold hover:text-yellow-300 transition duration-300">
            Insights
          </Link>
          {showInsightsDropdown && (
            <motion.div
              className="absolute left-0 bg-white text-black shadow-md rounded-lg w-40 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/blogs" className="block py-1 px-2 hover:bg-yellow-200">
                Blogs
              </Link>
              <Link to="/ebooks" className="block py-1 px-2 hover:bg-yellow-200">
                Ebooks
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Auth Section: Show Login or Profile (with dropdown) */}
      <motion.div
        className="flex items-center space-x-4"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {token ? (
          <div
            className="relative"
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
          >
            {/* Avatar wrapped with a Link to the profile page */}
            <Link to="/profile">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </Link>
            {/* Dropdown on hover */}
            {showProfileDropdown && (
              <div className="absolute right-0 bg-white text-black shadow-md rounded-lg w-48">
                <Link to="/profile" className="flex items-center py-2 px-4 border-b hover:bg-yellow-200">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" className="h-8 w-8 rounded-full object-cover mr-2" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold mr-2">
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span>{userName}</span>
                </Link>
                <div className="py-2 px-4 hover:bg-yellow-200 cursor-pointer" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-md hover:bg-yellow-300 transition duration-300"
          >
            Login
          </Link>
        )}
      </motion.div>
    </motion.nav>
  );
}

export default Navbar;
