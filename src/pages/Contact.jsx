import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Custom hook to detect mobile view
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

// Variants for the overall page container
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, duration: 0.8 },
  },
};

// Variants for individual items (form elements)
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// Variant for animated circles on the left side (used only on desktop)
const circleVariants = {
  animate: {
    x: [0, 30, -30, 0],
    y: [0, -20, 20, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Button animation variants
const buttonVariants = {
  idle: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
  clicked: {
    scale: [1, 0.9, 1.1, 1],
    transition: { duration: 0.4 },
  },
};

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const isMobile = useIsMobile();

  // Update form data as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit form data to the backend endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Your message has been sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("There was a problem sending your message. Please try again.");
      }
    } catch (error) {
      setStatus("Error: Unable to send your message at this time.");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* CSS for moving dots and glowing border */}
      <style>{`
        .glow-border {
          border: 2px solid #facc15; /* yellow-400 */
          box-shadow: 0 0 15px 5px rgba(250, 204, 21, 0.7);
        }
        @keyframes moveDot {
          0% { top: 0; left: 0; }
          25% { top: 0; left: calc(100% - 8px); }
          50% { top: calc(100% - 8px); left: calc(100% - 8px); }
          75% { top: calc(100% - 8px); left: 0; }
          100% { top: 0; left: 0; }
        }
      `}</style>

      <motion.div
        className="min-h-screen flex flex-col md:flex-row bg-white"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Left side animated section – Render only on desktop */}
        {!isMobile && (
          <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
            <div className="space-y-8">
              <motion.div
                className="w-32 h-32 bg-yellow-400 rounded-full"
                variants={circleVariants}
                animate="animate"
              />
              <motion.div
                className="w-24 h-24 bg-yellow-400 rounded-full"
                variants={circleVariants}
                animate="animate"
              />
              <motion.div
                className="w-16 h-16 bg-yellow-400 rounded-full"
                variants={circleVariants}
                animate="animate"
              />
            </div>
          </div>
        )}

        {/* Right side: Contact Form with glowing border and moving dots */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md">
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-xl w-full glow-border"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="text-3xl font-bold text-black mb-6 text-center"
                variants={itemVariants}
              >
                Contact Us
              </motion.h1>

              <motion.div className="mb-4" variants={itemVariants}>
                <label
                  htmlFor="firstName"
                  className="block text-black font-semibold mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  required
                />
              </motion.div>

              <motion.div className="mb-4" variants={itemVariants}>
                <label
                  htmlFor="lastName"
                  className="block text-black font-semibold mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  required
                />
              </motion.div>

              <motion.div className="mb-4" variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-black font-semibold mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  required
                />
              </motion.div>

              <motion.div className="mb-4" variants={itemVariants}>
                <label
                  htmlFor="message"
                  className="block text-black font-semibold mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  required
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition-colors"
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="idle"
                  whileTap="clicked"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </motion.div>

              {status && (
                <motion.p
                  className="mt-4 text-center text-yellow-400 font-semibold"
                  variants={itemVariants}
                >
                  {status}
                </motion.p>
              )}
            </motion.form>

            {/* Animated Moving Dots on the border */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{ animation: "moveDot 4s linear infinite", animationDelay: "0s" }}
              ></div>
              <div
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{ animation: "moveDot 4s linear infinite", animationDelay: "1s" }}
              ></div>
              <div
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{ animation: "moveDot 4s linear infinite", animationDelay: "2s" }}
              ></div>
              <div
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{ animation: "moveDot 4s linear infinite", animationDelay: "3s" }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Contact;
