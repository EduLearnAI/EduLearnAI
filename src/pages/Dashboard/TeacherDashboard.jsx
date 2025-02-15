import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Parent container variants for staggered children animations.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Card animation variants with an advanced spring effect.
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 120, damping: 14 } 
  },
};

// Button animation variants.
const buttonVariants = {
  hover: { scale: 1.1, backgroundColor: "#facc15" }, // yellow-400 hex code
  tap: { scale: 0.95 },
};

const TeacherDashboard = () => {
  const navigate = useNavigate();

  // Data for teacher "create" cards.
  const createCards = [
    {
      id: 1,
      heading: "Teacher Create - With Document",
      title: "Create Quiz",
      image: "quiz.jpg",
      description:
        "This tool uses a provided document to help you design detailed quiz questions. It ensures your quiz content is accurate and well-referenced.",
    },
    {
      id: 2,
      heading: "Teacher Create - With Document",
      title: "Create Assignment",
      image: "assignment.jpg",
      description:
        "Create assignments by leveraging a document as a reference, helping you generate comprehensive questions and instructions.",
    },
    {
      id: 3,
      heading: "Teacher Create - With Document",
      title: "Create Paper",
      image: "exam.jpg",
      description:
        "Generate paper content using key reference documents. This feature is ideal for creating research-based assessments or exam papers.",
    },
    {
      id: 4,
      heading: "Teacher Create - Without Document",
      title: "Create Quiz",
      image: "quiz.jpg",
      description:
        "Design quizzes quickly without relying on external documents. Use your expertise to craft questions on the fly for immediate use.",
    },
    {
      id: 5,
      heading: "Teacher Create - Without Document",
      title: "Create Assignment",
      image: "assignment.jpg",
      description:
        "Craft assignments based solely on your input and experience. This mode is great when you need fast creation without extra references.",
    },
    {
      id: 6,
      heading: "Teacher Create - Without Document",
      title: "Create Paper",
      image: "exam.jpg",
      description:
        "Develop paper content without document support. Perfect for creating preliminary drafts or when reference material is not available.",
    },
  ];

  // Data for teacher "check" cards.
  const checkCards = [
    {
      id: 7,
      heading: "Teacher Check - With Document",
      title: "Check Quiz",
      image: "quiz.jpg",
      description:
        "Review quizzes using the provided document as a benchmark. This helps ensure consistency and correctness in your quiz assessments.",
    },
    {
      id: 8,
      heading: "Teacher Check - With Document",
      title: "Check Assignment",
      image: "assignment.jpg",
      description:
        "Verify assignment content against reference materials. This mode helps you ensure that assignments are well-founded and accurate.",
    },
    {
      id: 9,
      heading: "Teacher Check - With Document",
      title: "Check Paper",
      image: "exam.jpg",
      description:
        "Evaluate paper submissions by comparing them with key documents. It’s ideal for in-depth review and ensuring the quality of academic content.",
    },
    {
      id: 10,
      heading: "Teacher Check - Without Document",
      title: "Check Quiz",
      image: "quiz.jpg",
      description:
        "Quickly review quiz content without the need for external references. This mode is great for fast assessments and immediate feedback.",
    },
    {
      id: 11,
      heading: "Teacher Check - Without Document",
      title: "Check Assignment",
      image: "assignment.jpg",
      description:
        "Efficiently review assignments using your expertise and built-in guidelines. Perfect for rapid evaluations when documents aren’t provided.",
    },
    {
      id: 12,
      heading: "Teacher Check - Without Document",
      title: "Check Paper",
      image: "exam.jpg",
      description:
        "Assess paper content quickly without external documentation. Use this mode for preliminary reviews and fast quality checks.",
    },
  ];

  // Helper function to render a single card.
  const renderCard = (card) => {
    // Determine the button text based on the card heading.
    const buttonText = card.heading.includes("Create") ? "Create" : "Check";
    return (
      <motion.div
        key={card.id}
        className="bg-white text-black border border-yellow-400 rounded-lg shadow-lg p-6 flex flex-col space-y-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      >
        {/* Card Image */}
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-32 object-cover rounded"
        />
        {/* Card Heading */}
        <h4 className="text-sm text-gray-500">{card.heading}</h4>
        {/* Card Title */}
        <h3 className="text-xl font-bold">{card.title}</h3>
        {/* Card Description */}
        <p>{card.description}</p>
        {/* Action Button that navigates to the Chatbot page */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate("/chatbot")}
          className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-300 transition"
        >
          {buttonText}
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Teacher Dashboard</h1>

      {/* Section for Creating Content */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Create Content</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {createCards.map(renderCard)}
        </motion.div>
      </section>

      {/* Section for Checking Content */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Check Content</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {checkCards.map(renderCard)}
        </motion.div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
