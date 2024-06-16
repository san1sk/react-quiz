import { useState } from "react";
import questions from './questions.json';

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState({});
    const [timeLeft, setTimeLeft] = useState(600);
    const { question, choices, correctAnswer } = questions[currentQuestion];
    const [answerIdx, setAnswerIdx] = useState(null);
    const [result, setResult] = useState(0);

    const onAnwswerClick = (answer, index) => {
        setAnswerIdx(index);
        if (answer === correctAnswer) {
            setAnswer(true);
        } else {
            setAnswer(false);
        }
    };


    const onClickNext = () => {
        setAnswerIdx(null);
        setResult((prev) =>
            answer
                ? {
                    ...prev,
                    score: prev.score + 5,
                    correctAnswers: prev.correctAnswers + 1,
                }
                : {
                    ...prev,
                    wrongAnswers: prev.wrongAnswers + 1,
                }
        );

        if (currentQuestion !== questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setCurrentQuestion(0);
            setShowResult(true);
        }
    };

    return (
        <div className="quiz-container">
            <span className="active-question-no">{currentQuestion + 1}</span>
            <span className="total-question">/{questions.length}</span>
            <div className="timer">Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
            <h2>{questions[currentQuestion].question}</h2>
            <ul>
                {choices.map((choice, index) => (
                    <li
                        onClick={() => onAnwswerClick(choice, index)}
                        key={choice}
                        className={answerIdx === index ? "selected-answer" : null}
                    >
                        {choice}
                    </li>
                ))}
            </ul>
            <div className="footer">
                <button onClick={'onCLickNext'} disabled={answerIdx === null}>
                    {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                </button>
            </div>
        </div>
    )
}

export default Quiz
{/* <div className="quiz">
    <h1>Quiz</h1>
    <div className="timer">Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
    <div className="question">
        <h2>{questions[currentQuestion].question}</h2>
        <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(option)}>
                    {option}
                </button>
            ))}
        </div>
    </div>
</div> */}