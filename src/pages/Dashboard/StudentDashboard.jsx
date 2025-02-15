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

// Card animation variants with advanced spring effect.
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
  hover: { scale: 1.1, backgroundColor: "#facc15" }, // yellow-400 hex code is #facc15
  tap: { scale: 0.95 },
};

const StudentDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  // Cards with RAG: The chatbot uses a provided document to answer questions.
  const cardsWithRag = [
    {
      id: 1,
      heading: "Chatbot with RAG",
      title: "Solve Quiz",
      image: "quiz.jpg",
      description:
        "This chatbot uses RAG (Retrieval-Augmented Generation) to answer your quiz questions using a provided document. It delivers context-aware responses by referencing detailed material, making it ideal for situations where accuracy is key and background information is required.",
    },
    {
      id: 2,
      heading: "Chatbot with RAG",
      title: "Solve Assignment",
      image: "assignment.jpg",
      description:
        "With RAG technology, this chatbot taps into supplied documents to help solve assignments. It provides precise, document-backed answers, which is especially useful for academic tasks that require thorough explanations and factual support.",
    },
    {
      id: 3,
      heading: "Chatbot with RAG",
      title: "Solve Paper",
      image: "exam.jpg",
      description:
        "This chatbot leverages a provided document to address paper-related queries. Its ability to pull in relevant data from documents ensures high-quality, well-referenced responses. It is best used for research or exam preparations where depth and accuracy matter.",
    },
  ];

  // Cards without RAG: The chatbot answers questions without needing a document.
  const cardsWithoutRag = [
    {
      id: 4,
      heading: "Chatbot without RAG",
      title: "Solve Quiz",
      image: "quiz.jpg",
      description:
        "This chatbot provides answers to your quiz questions without the need for an external document. It is quick and efficient for general queries, making it perfect for rapid problem-solving or when you need a straightforward response.",
    },
    {
      id: 5,
      heading: "Chatbot without RAG",
      title: "Solve Assignment",
      image: "assignment.jpg",
      description:
        "Without relying on provided documents, this chatbot offers assistance with assignments based on its built-in knowledge. It works well for conceptual explanations and general academic support where in-depth document references are not necessary.",
    },
    {
      id: 6,
      heading: "Chatbot without RAG",
      title: "Solve Paper",
      image: "exam.jpg",
      description:
        "This chatbot answers paper-related queries using its existing knowledge base rather than a supplied document. It is excellent for quick overviews or when you need fast, accessible insights without the overhead of processing external content.",
    },
  ];

  // Render a single card.
  const renderCard = (card) => (
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
      {/* Card Heading indicating RAG type */}
      <h4 className="text-sm text-gray-500">{card.heading}</h4>
      {/* Functionality Title */}
      <h3 className="text-xl font-bold">{card.title}</h3>
      {/* Description */}
      <p>{card.description}</p>
      {/* Chat Button that navigates to the chatbot page */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => navigate("/chatbot")}
        className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-300 transition"
      >
        Chat
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Student Dashboard</h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cardsWithRag.map(renderCard)}
        {cardsWithoutRag.map(renderCard)}
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
