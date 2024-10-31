import { useEffect, useReducer } from "react";
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

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  category: "React",
};

function reducer(state, action) {
  function saveHighscoreToDataBase(newHighscore) {
    fetch(`http://localhost:8000/highscore${state.category}`, {
      method: "PUT",
      body: JSON.stringify({ value: newHighscore }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return newHighscore;
  }

  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload[0],
        status: "ready",
        highscore: action.payload[1].value,
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "setCategory":
      return { ...state, category: action.payload };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore
            ? saveHighscoreToDataBase(state.points)
            : state.highscore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        category: state.category,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      category,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(
    function () {
      async function getQuestions() {
        const res = await fetch(`http://localhost:8000/${category}`);
        const data = await res.json();
        return data;
      }

      async function getHighscore() {
        const res = await fetch(`http://localhost:8000/highscore${category}`);
        const data = await res.json();
        return data;
      }

      Promise.all([getQuestions(), getHighscore()])
        .then((data) => dispatch({ type: "dataRecived", payload: data }))
        .catch((err) => dispatch({ type: "dataFailed" }));
    },
    [category, dispatch]
  );

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  return (
    <div className="app">
      <Header category={category} />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            category={category}
          >
            <SelectCategory dispatch={dispatch} category={category} />
          </StartScreen>
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            </Footer>
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
