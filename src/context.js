import axios from "axios";
import React, { useState, useContext, useEffect } from "react";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const url = "";

const tempUrl =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });

  const fetchQuestions = async (url) => {
    setWaiting(false);
    setLoading(true);
    try {
      const response = await axios(url);
      if (response) {
        const data = response.data.results;
        if (data.length < 1) {
          setError(true);
          setWaiting(true);
          setError(true);
          return;
        }
        setQuestions(data);
        setWaiting(false);
        setLoading(false);
      } else {
        setWaiting(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      let newIndex = oldIndex + 1;
      if (newIndex > questions.length - 1) {
        openModal();
        return 0;
      }
      return newIndex;
    });
  };

  const checkAnswer = (value) => {
    if (value) {
      setCorrect((oldValue) => oldValue + 1);
    }
    nextQuestion();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setWaiting(true);
    setCorrect(0);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz((oldValues) => {
      return { ...oldValues, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
  };

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        correct,
        index,
        error,
        isModalOpen,
        quiz,
        nextQuestion,
        checkAnswer,
        closeModal,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
