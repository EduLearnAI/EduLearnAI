import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

function ProfileManagement() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const access_token = Cookies.get("access_token");
  const backendBaseUrl = "https://mominah-auth.hf.space";

  useEffect(() => {
    if (access_token) {
      axios
        .get(`${backendBaseUrl}/user/data`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((response) => {
          const userData = response.data;
          setUser(userData);
          setName(userData.name || "");
          setEmail(userData.email || "");
          let avatarUrl = userData.avatar || null;
          if (avatarUrl && avatarUrl.startsWith("/avatars")) {
            avatarUrl = backendBaseUrl + avatarUrl;
          }
          setAvatarPreview(avatarUrl);
          Cookies.set("user", JSON.stringify(userData), { expires: 7, secure: true });
        })
        .catch(() => setErrorMsg("Error loading profile data."));
    }
  }, [access_token]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (avatar) formData.append("avatar", avatar);

      const response = await axios.put(`${backendBaseUrl}/user/update`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (response.status === 200) {
        setMessage("Profile updated successfully!");
        const updatedResponse = await axios.get(`${backendBaseUrl}/user/data`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const updatedUser = updatedResponse.data;
        setUser(updatedUser);
        setName(updatedUser.name || "");
        setEmail(updatedUser.email || "");
        let updatedAvatarUrl = updatedUser.avatar || null;
        if (updatedAvatarUrl && updatedAvatarUrl.startsWith("/avatars")) {
          updatedAvatarUrl = backendBaseUrl + updatedAvatarUrl;
        }
        setAvatarPreview(updatedAvatarUrl);
        Cookies.set("user", JSON.stringify(updatedUser), { expires: 7, secure: true });
      }
    } catch {
      setErrorMsg("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Manage Profile</h2>

        {/* Success & Error Messages with Smooth Appearance */}
        <AnimatePresence>
          {message && (
            <motion.p
              className="mb-4 text-green-600 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.p>
          )}
          {errorMsg && (
            <motion.p
              className="mb-4 text-red-600 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            {/* Avatar with a smooth transition */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {avatarPreview ? (
                <motion.img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="h-24 w-24 rounded-full object-cover mb-2 shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.div
                  className="h-24 w-24 rounded-full bg-gray-500 flex items-center justify-center text-white text-3xl mb-2 shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </motion.div>
              )}
            </motion.div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
          </div>

          {/* Input Fields */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-300"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default ProfileManagement;
