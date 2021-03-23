import React, { useState, useEffect } from "react";

// import components
import { Button } from "../../Components";
import { Form } from "semantic-ui-react";

const FormClassManage = ({
  handleOnModify,
  handleOnAdd,
  currentLectureId,
  lecturesObj,
  facultiesObj,
  setCurrentLectureId,
}) => {
  const initialState = {
    "lecture-name": "",
    "lecture-email": "",
    // faculty: "--- Khoa ---",
    faculty: "defaultValue",
  };

  const [values, setValues] = useState(initialState);

  useEffect(() => {
    if (currentLectureId === "") {
      setValues({ ...initialState });
    } else {
      setValues({ ...lecturesObj[currentLectureId] });
    }
    // eslint-disable-next-line
  }, [currentLectureId, lecturesObj]);

  // useEffect(() => {
  // 	console.log(currentLectureId, values);
  // }, [values, currentLectureId]);

  useEffect(() => {
    if (currentLectureId) {
      document.getElementById("lecture__select-faculty").value =
        lecturesObj[currentLectureId]["faculty"];
    }
  }, [currentLectureId, lecturesObj, facultiesObj]);

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleButtonAdd = async (e) => {
    e.preventDefault();
    await handleOnAdd({ values });
    setValues(initialState);
  };

  const handleButtonModify = async (e) => {
    e.preventDefault();
    const resolve = await handleOnModify(currentLectureId, values);
    resolve && setValues(initialState);
  };

  const cancelModify = () => {
    setCurrentLectureId("");
    setValues(initialState);
  };

  return (
    <>
      <Form id="manage__form">
        <Form.Input
          label="Họ tên"
          title="Họ tên giảng viên"
          className="left-align"
          placeholder="Họ tên giảng viên"
          type="text"
          name="lecture-name"
          id="lecture-name"
          value={values["lecture-name"]}
          onChange={handleInputChange}
          required
          autoFocus
        />
        <Form.Input
          label="Email"
          title="Email"
          placeholder="Email"
          id="lecture-email"
          type="email"
          name="lecture-email"
          value={values["lecture-email"]}
          onChange={handleInputChange}
        />
        <label htmlFor="lecture__select-faculty">Chọn Khoa</label>
        <select
          title="Chọn khoa"
          name="faculty"
          id="lecture__select-faculty"
          style={{ marginBottom: 10 }}
          onChange={handleInputChange}
          value={values.faculty}
        >
          <option disabled key="default" value="defaultValue">
            {Object.keys(facultiesObj).length
              ? "--- Khoa ---"
              : "Không có khoa nào"}
          </option>
          {Object.keys(facultiesObj).length &&
            Object.keys(facultiesObj).map((id) => {
              return (
                <option value={facultiesObj[id]["faculty-name"]} key={id}>
                  {facultiesObj[id]["faculty-name"]}
                </option>
              );
            })}
        </select>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {currentLectureId ? (
              <Button
                style={{ margin: 0, height: "100%" }}
                type="submit"
                className="new"
                title="Chỉnh sửa khoa"
                onClick={handleButtonModify}
              >
                Chỉnh Sửa
              </Button>
            ) : (
              <Button
                style={{ margin: "0", height: "100%" }}
                type="submit"
                className="new"
                title="Thêm giảng viên mới"
                onClick={handleButtonAdd}
              >
                Thêm
              </Button>
            )}
          </div>
          <div>
            {currentLectureId && (
              <Button
                style={{ margin: "0", height: "100%" }}
                className="sign-out"
                title="Hủy chỉnh sửa"
                onClick={cancelModify}
              >
                Hủy
              </Button>
            )}
          </div>
        </div>
      </Form>
    </>
  );
};

export default FormClassManage;
