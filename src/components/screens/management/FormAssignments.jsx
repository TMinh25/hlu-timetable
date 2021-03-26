import React, { useState, useEffect } from "react";

// import components
import { Button } from "../../Components";
import { Form } from "semantic-ui-react";

const FormAssignments = ({
  handleOnModify,
  handleOnAdd,
  currentLectureId,
  lecturesObj,
  facultiesObj,
  setCurrentLectureId,
}) => {
  const initialState = {
    // faculty: "--- Khoa ---",
    faculty: "defaultValue",
    // faculty: "--- Giảng Viên ---",
    lectureID: "defaultValue",
  };

  const [values, setValues] = useState(initialState);
  const [lectureOptions, setLectureOptions] = useState([]);

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

  useEffect(() => {
    setLectureOptions(
      Object.keys(lecturesObj).map((key) => {
        return { label: lecturesObj[key]["lecture-name"], value: key };
      })
    );
  }, [lecturesObj]);

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
        <label htmlFor="lecture__select-faculty">Chọn Khoa</label>
        <select
          title="Chọn khoa"
          name="faculty"
          id="lecture__select-faculty"
          style={{ marginBottom: 10 }}
          onChange={handleInputChange}
          value={values["faculty"]}
        >
          <option disabled key="default" value="defaultValue">
            {Object.keys(facultiesObj).length
              ? "--- Khoa ---"
              : "Không có khoa nào"}
          </option>
          {Object.keys(facultiesObj).length &&
            Object.keys(facultiesObj).map((id, index) => {
              return (
                <option value={facultiesObj[id]["faculty-name"]} key={index}>
                  {facultiesObj[id]["faculty-name"]}
                </option>
              );
            })}
        </select>
        <label htmlFor="lecture__select-lecture">Chọn Khoa</label>
        <select
          title="Chọn khoa"
          name="lectureID"
          id="lecture__select-lecture"
          style={{ marginBottom: 10 }}
          onChange={handleInputChange}
          value={values["lectureID"]}
        >
          <option disabled key="default" value="defaultValue">
            {Object.keys(lecturesObj).length
              ? "--- Giảng Viên ---"
              : "Không có giảng viên nào"}
          </option>
          {lectureOptions.map((lecture, index) => (
            <option value={lecture["value"]} key={index}>
              {lecture["label"]}
            </option>
          ))}
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

export default FormAssignments;
