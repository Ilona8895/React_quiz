import { useQuiz } from "../contexts/QuizContext";

function SelectCategory() {
  const { category, dispatch } = useQuiz();
  return (
    <div className="categorySelect">
      <p>Select category</p>
      <select
        value={category}
        onChange={(e) =>
          dispatch({ type: "setCategory", payload: e.target.value })
        }
      >
        <option value="React">React</option>
        <option value="PHP">PHP</option>
        <option value="JavaScript">JavaScript</option>
      </select>
    </div>
  );
}

export default SelectCategory;
