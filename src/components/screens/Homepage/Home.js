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
      <h1>Trang Chủ</h1>
    </>
  );
};

export default Home;
