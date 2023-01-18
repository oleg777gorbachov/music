import { useEffect, useState } from "react";
import Router from "next/router";
import MainConteiner from "../components/MainConteiner";
import s from "../styles/pages/error.module.scss";
import Card from "../components/Card";

function ErrorPage() {
  const [counter, setCounter] = useState(8);

  useEffect(() => {
    if (counter === 0) {
      Router.push("/");
    }
    const timeout = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [counter]);

  return (
    <MainConteiner title="Musio.io Unknown page">
      <div className={s.error}>
        <Card>
          <h2>Unknown page, returning to the main after: {counter}</h2>
        </Card>
      </div>
    </MainConteiner>
  );
}

export default ErrorPage;
