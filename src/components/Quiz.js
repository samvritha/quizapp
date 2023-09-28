import React, { useState, useEffect } from "react";
import questions_en from "../assets/questions_en.json";
import questions_hi from "../assets/questions_hi.json";
import questions_ml from "../assets/questions_ml.json";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [responses, setResponses] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);

  const allQuestions = {
    en: questions_en,
    hi: questions_hi,
    ml: questions_ml,
  };

  const loadQuestions = (language) => {
    setQuestions(allQuestions[language] || []);
    setDisplayQuestions(generateRandomQuestions(allQuestions[language] || []));
  };

  useEffect(() => {
    loadQuestions(selectedLanguage);
  }, [selectedLanguage]);

  const generateRandomQuestions = (questions) => {
    let indices = new Set();
    while (indices.size < 10) {
      indices.add(Math.floor(Math.random() * questions.length));
    }
    return Array.from(indices).map((index) => questions[index]);
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleEnd = () => {
    setIsQuizFinished(true);
  };

  const handleAnswer = (answer) => {
    const currentQuestion = displayQuestions[currentIndex];
    let userScore = answer === currentQuestion.answer ? 10 : 0;
    setScore(score + userScore);
    setResponses([
      ...responses,
      {
        question: currentQuestion,
        userAnswer: answer || "Unanswered",
        userScore,
      },
    ]);
    if (currentIndex < displayQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleChangeLanguage = (language) => {
    setSelectedLanguage(language);
    if (hasStarted || isQuizFinished) resetQuiz();
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setResponses([]);
    setIsQuizFinished(false);
    setHasStarted(false);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleChangeLanguage("en")}>English</button>
        <button onClick={() => handleChangeLanguage("hi")}>Hindi</button>
        <button onClick={() => handleChangeLanguage("ml")}>Malayalam</button>
      </div>
      {!hasStarted ? (
        <button onClick={handleStart}>Start</button>
      ) : !isQuizFinished ? (
        <div>
          <button onClick={handleEnd}>End Quiz</button>
          <p>{displayQuestions[currentIndex]?.question}</p>
          {displayQuestions[currentIndex]?.options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
          <p>Score: {score}</p>
        </div>
      ) : (
        <div>
          <p>Quiz Completed!</p>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <tr key={index}>
                  <td>{response.question.question}</td>
                  <td>{response.userAnswer}</td>
                  <td>{response.question.answer}</td>
                  <td>{response.userScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={resetQuiz}>Reset</button>
        </div>
      )}
    </div>
  );
}

export default Quiz;