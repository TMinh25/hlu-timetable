import React, { useState, useEffect } from "react";

// import components
import { Button } from "../../Components";
import { Form } from "semantic-ui-react";

const FormClassManage = ({
  facultiesObj,
  classObj,
  currentClassId,
  setCurrentClassId,
  handleOnAdd,
  handleOnModify,
}) => {
  const initialState = {
    className: "",
    classSize: "",
    classType: "defaultValue",
    faculty: "defaultValue",
  };

  const [values, setValues] = useState(initialState);

  // useEffect(() => {
  //   console.log(values);
  // }, [values]);

  useEffect(() => {
    if (currentClassId === "") {
      setValues({ ...initialState });
    } else {
      setValues({ ...classObj[currentClassId] });
    }
    // eslint-disable-next-line
  }, [currentClassId, classObj]);

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
    const resolve = await handleOnModify(currentClassId, values);
    resolve && setValues(initialState);
  };

  const cancelModify = () => {
    setCurrentClassId("");
    setValues(initialState);
  };

  return (
    <>
      <Form id="manage__form" onSubmit={handleOnAdd}>
        <Form.Input
          label="Tên Lớp"
          title="Tên Lớp"
          className="left-align"
          placeholder="Tên Lớp"
          type="text"
          name="className"
          value={values["className"]}
          onChange={handleInputChange}
          required
          autoFocus
        />
        <Form.Input
          label="Sĩ Số Lớp"
          title="Sĩ Số Lớp"
          className="left-align"
          placeholder="Sĩ Số Lớp"
          type="number"
          name="classSize"
          value={values["classSize"]}
          onChange={handleInputChange}
          required
          autoFocus
        />
        <label htmlFor="class__select-faculty">Chọn Hệ</label>
        <select
          title="Chọn Hệ"
          id="class__select-faculty"
          style={{ marginBottom: 10 }}
          name="classType"
          value={values["classType"]}
          onChange={handleInputChange}
        >
          <option disabled key="default" value="defaultValue">
            --- Hệ ---
          </option>
          <option value="Cao Đẳng" key="CĐ">
            Cao Đẳng
          </option>
          <option value="Đại Học" key="ĐH">
            Đại Học
          </option>
        </select>
        <label htmlFor="class__select-class_type">Chọn Khoa</label>
        <select
          title="Chọn khoa"
          id="class__select-class_type"
          style={{ marginBottom: 10 }}
          name="faculty"
          value={values["faculty"]}
          onChange={handleInputChange}
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
            {currentClassId ? (
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
            {currentClassId && (
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
