import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { database } from "../../../firebase";

// import components

import { ImportScript as importScript } from "../../../utils";

// import styles
import "./Home.css";
const Home = () => {
  const [count, setCount] = useState(60);

  const expensiveCount = useMemo(() => {
    return count ** 9;
  }, [count]);

  // lấy dữ liệu
  // useEffect(() => {
  //   database.ref("asd").once("value", (snapshot) => {
  //     if (snapshot.val()) {
  //       setValues(snapshot.val());
  //     } else {
  //       setValues();
  //     }
  //   });
  // }, []);

  return (
    <>
      {count}
      <br />
      {count ** 9}
      <br />
      {expensiveCount}
      <button onClick={() => setCount(count + 10)}>them</button>
    </>
  );
};

export default Home;
