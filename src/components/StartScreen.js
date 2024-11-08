import { useQuiz } from "../contexts/QuizContext";

function StartScreen({ children }) {
  const { numQuestions, dispatch, category } = useQuiz();
  return (
    <div className="start">
      <h2>Welcome to The {category} Quiz!</h2>
      <h3>
        {numQuestions} questions to test your {category} mastery
      </h3>
      {children}
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
