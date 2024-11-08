import { createContext, useContext, useEffect, useReducer } from "react";

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
        highscore: action.payload,
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

const QuizContext = createContext();

function QuizProvider({ children }) {
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

  function finishQuiz(newPoints) {
    if (newPoints > highscore) {
      fetch(`http://localhost:8000/highscore${category}`, {
        method: "PUT",
        body: JSON.stringify({ value: newPoints }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "finish", payload: newPoints });
    } else {
      dispatch({ type: "finish", payload: highscore });
    }
  }

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
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        category,
        dispatch,
        numQuestions,
        maxPossiblePoints,
        finishQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside the QuizProvider ");
  return context;
}

export { QuizProvider, useQuiz };
