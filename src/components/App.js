import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import NextButton from "./NextButton";
import Footer from "./Footer";
import Timer from "./Timer";
import SelectCategory from "./SelectCategory";
import { useQuiz } from "../contexts/QuizContext";

export default function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen>
            <SelectCategory />
          </StartScreen>
        )}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
            </Footer>
            <NextButton />
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}
