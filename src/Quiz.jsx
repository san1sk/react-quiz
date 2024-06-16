import React, { useState, useEffect } from 'react';
import questions from './questions.json';
import "./styles/Quiz.scss"

const FULL_SCREEN_MSG = 'Please enable full screen to take the quiz';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ score: 0, correctAnswers: 0, wrongAnswers: 0 });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('quizState'));
    if (savedState) {
      setCurrentQuestion(savedState.currentQuestion);
      setTimeLeft(savedState.timeLeft);
      setResult(savedState.result);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          localStorage.setItem('quizState', JSON.stringify({ currentQuestion, timeLeft: prev - 1, result }));
          return prev - 1;
        }
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, result]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const startFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const correctAnswer = questions[currentQuestion].answer;
      if (selectedOption === correctAnswer) {
        setResult((prev) => ({
          ...prev,
          score: prev.score + 5,
          correctAnswers: prev.correctAnswers + 1,
        }));
      } else {
        setResult((prev) => ({
          ...prev,
          wrongAnswers: prev.wrongAnswers + 1,
        }));
      }

      setSelectedOption('');
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        localStorage.setItem('quizState', JSON.stringify({
          currentQuestion: currentQuestion + 1,
          timeLeft,
          result
        }));
      } else {
        setShowResult(true);
        localStorage.removeItem('quizState');
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption('');
    setTimeLeft(600);
    setIsFullScreen(false);
    setShowResult(false);
    setResult({ score: 0, correctAnswers: 0, wrongAnswers: 0 });
    localStorage.removeItem('quizState');
    startFullScreen();
  };

  const displayFullScreenMessage = () => {
    return (
      <div className="fullscreen-message">
        {FULL_SCREEN_MSG}
        <button className="Enable" onClick={startFullScreen}>Enable Full Screen</button>
      </div>
    );
  };

  if (!isFullScreen) {
    return displayFullScreenMessage();
  }

  if (timeLeft <= 0 || showResult) {
    return (
      <div className="quiz-end">
        Quiz ended. Thanks for participating!
        <div>Score: {result.score}</div>
        <div>Correct Answers: {result.correctAnswers}</div>
        <div>Wrong Answers: {result.wrongAnswers}</div>
        <button onClick={handleRestartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
      <div className="question-counter">
      <div className="active-question"> {currentQuestion + 1}</div>/<div className="total-question">{questions.length}</div>
      </div>
      <div className="question">
        <h2>{questions[currentQuestion].question}</h2>
        <div className="options">
          {questions[currentQuestion].options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              {option}
            </label>
          ))}
        </div>
        <button onClick={handleNextQuestion} disabled={!selectedOption}>
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default App;
