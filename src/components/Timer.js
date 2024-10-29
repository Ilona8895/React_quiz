import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins =
    Math.floor(secondsRemaining / 60) < 10
      ? `0${Math.floor(secondsRemaining / 60)}`
      : Math.floor(secondsRemaining / 60);
  const seconds =
    secondsRemaining % 60 < 10
      ? `0${secondsRemaining % 60}`
      : secondsRemaining % 60;

  useEffect(
    function () {
      const id = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);

      return function () {
        clearInterval(id);
      };
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins}:{seconds}
    </div>
  );
}

export default Timer;
