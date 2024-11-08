import { useQuiz } from "../contexts/QuizContext";

function Header() {
  const { category } = useQuiz();
  return (
    <header className="app-header">
      {category === "React" && <img src="logo512.png" alt="React logo" />}
      {category === "PHP" && <img src="php_logo.png" alt="PHP logo" />}
      {category === "JavaScript" && (
        <img src="js_logo.png" alt="JavaScript logo" />
      )}
      <h1>The {category} Quiz</h1>
    </header>
  );
}

export default Header;
