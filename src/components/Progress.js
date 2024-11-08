import { useQuiz } from "../contexts/QuizContext";

function Progress() {
  const { numQuestions, index, points, maxPossiblePoints, answer } = useQuiz();
  return (
    <header className="progress">
      <progress
        value={index + Number(answer !== null)}
        max={numQuestions}
      ></progress>
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints} points
      </p>
    </header>
  );
}

export default Progress;
