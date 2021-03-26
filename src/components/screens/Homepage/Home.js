import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";

// import components

import { ImportScript as importScript } from "../../../utils";

// import styles
import "./Home.css";
const Home = () => {
  const [values, setValues] = useState(null);

  // lấy dữ liệu
  useEffect(() => {
    database.ref("asd").once("value", (snapshot) => {
      if (snapshot.val()) {
        setValues(snapshot.val());
      } else {
        setValues();
      }
    });
  }, []);

	// hiển thị dữ liệu để xem thôi
  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <>
      home
      <button
        onClick={() => {

					// từ array ta đọc được trong database, ta thêm phần tử ta muốn vào
          setValues([...values, "value thêm"]);

					// rồi set cái thuộc tính mà ta muốn thay đổi
          database.ref("asd").set(values);
        }}
      >
        them
      </button>
    </>
  );
};

export default Home;
