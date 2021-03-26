import React, { useEffect, useState } from "react";

// import components
import FormFaculties from "./FormFaculties";
import {
  getAllFaculties,
  setNewFaculty,
  removeFaculty,
} from "../../../firebase";
import { confirmAlert } from "react-confirm-alert";
import { Loading, Button, FileDropzone } from "../../Components";
import { readExcel, defaultFailCB, exists, getHeaderRow } from "../../../utils";

// import styles
import "./Manage.css";

export function getFacId(facName) {
  if (exists(facName)) {
    return facName
      .toString()
      .trim()
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  }
}

const ManageFaculties = () => {
  //#region Component State

  const [isLoading, setIsLoading] = useState(true);
  const [searchString, setSearchString] = useState("");

  const [facultiesObj, setFacultiesObj] = useState({});
  const [currentFacultyId, setCurrentFacultyId] = useState("");
  const [excelLoadedItems, setExcelLoadedItems] = useState([]);

  //#endregion

  //#region Component

  const FacultyListItem = ({ index, id, facultyName, onClick, onRemove }) => (
    <li key={index} className="list__container-li_item" onClick={onClick}>
      <p className="li__item-search">{index + 1}</p>
      <p className="li__item-search">{id}</p>
      <p className="li__item-search">{facultyName}</p>
      <span className="btn__trash trash" onClick={onRemove}>
        <i className="far fa-trash" />
      </span>
    </li>
  );

  const FacultyItemToAdd = ({ onAdd, index, facultyName }) => {
    return (
      <li key={index} className="excel__list-li_item">
        <p>{facultyName}</p>
        <span className="btn__trash add" onClick={onAdd}>
          <i className="far fa-plus-square" />
        </span>
      </li>
    );
  };

  //#endregion

  //#region Hooks

  useEffect(() => {
    getAllFaculties((res) => {
      setFacultiesObj(res);
      setIsLoading(false);
    });
  }, []); // fetching faculties list on componentUpdate

  useEffect(() => {
    const li = document.getElementsByClassName("list__container-li_item");
    for (let i = 0; i < li.length; i++) {
      const items = li[i].querySelectorAll(".li__item-search");
      let isInclude = [];
      items.forEach((item) => {
        let txtValue = item.textContent || item.innerHTML;
        isInclude.push(
          txtValue.toLowerCase().includes(searchString.toLowerCase())
            ? true
            : false
        );
      });
      if (isInclude.some((item) => item === true)) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }, [searchString]); // search for text in list when searchString change

  //#endregion

  //#region Component Method

  // handle on file drop with dropzone
  const handleDropped = (files) => handleExcelLoad(files[0]);

  const handleDownloadTemplateFile = () =>
    window.open(
      "https://drive.google.com/file/d/16xqql9RI8iowKy_q1tuC7BCkE0J8YmlN/view?usp=sharing",
      "_blank",
      ""
    );

  function handleOnAdd({
    values,
    shouldRemoveChild = false,
    event = undefined,
  }) {
    //remove li element on add
    const removeLi = () => {
      const thisLi = event.target.closest("li");
      let nodes = Array.from(thisLi.closest("ul").children); // get array
      let index = nodes.indexOf(thisLi);
      if (index >= 0) {
        const tempArr = [...excelLoadedItems];
        tempArr.splice(index, 1);
        setExcelLoadedItems(tempArr);
      }
    };
    // Trả về Promise để Form đợi tới khi người dùng chọn tùy chọn
    return new Promise((resolve, reject) => {
      if (values["faculty-name"] !== "") {
        let facID = getFacId(values["faculty-name"]);
        values["faculty-id"] = facID;
        if (values["faculty-id"] in facultiesObj) {
          confirmAlert({
            title: "Bạn có muốn thay đổi tên khoa?",
            message: "Mã khoa này đã tồn tại",
            buttons: [
              {
                className: "confirm__cancel",
                label: "Hủy",
                onClick: () => reject(),
              },
              {
                className: "new",
                label: "Thay Đổi",
                onClick: () => {
                  setNewFaculty(values);
                  resolve();
                  shouldRemoveChild && removeLi();
                },
              },
            ],
          });
        } else {
          setNewFaculty(values);
          resolve();
          shouldRemoveChild && removeLi();
        }
      }
    });
  }

  function handleOnModify(values) {
    return new Promise((resolve) => {
      let id = getFacId(values["faculty-name"]);
      values["faculty-id"] = id;

      if (id !== currentFacultyId) {
        if (values["faculty-id"] in facultiesObj) {
          confirmAlert({
            closeOnEscape: true,
            title: "Bạn có muốn thay đổi tên khoa?",
            message: "Mã khoa này đã tồn tại",
            buttons: [
              {
                className: "confirm__cancel",
                label: "Hủy",
                onClick: () => resolve(),
              },
              {
                className: "new",
                label: "Thay Đổi",
                onClick: () => {
                  removeFaculty(currentFacultyId);
                  setNewFaculty(values);
                  resolve(true);
                },
              },
            ],
          });
        } else {
          setNewFaculty(values);
          resolve(true);
        }
      } else {
        setNewFaculty(values);
      }
      // Đặt lại id thành null để reset Form
      setCurrentFacultyId("");
      resolve(true);
    });
  }

  function handleOnRemove(id) {
    confirmAlert({
      title: "Bạn có chắc muốn xóa khoa này?",
      message: "Bạn sẽ không thể truy cập lại thông tin này",
      buttons: [
        {
          className: "confirm__cancel",
          label: "Hủy",
        },
        {
          className: "sign-out",
          label: "Xóa",
          onClick: () => {
            removeFaculty(id);
            setCurrentFacultyId("");
          },
        },
      ],
    });
  }

  async function handleExcelLoad(file) {
    const objHeaders = ["faculty-name", "faculty-note"];
    try {
      const data = await readExcel(file, objHeaders);
      const headers = await getHeaderRow(file);
      if (
        headers.length > 0 &&
        headers[0].toUpperCase() === "Tên khoa".toUpperCase() &&
        headers[1].toUpperCase() === "ghi chú".toUpperCase()
      ) {
        if (data.length === 0) {
          setExcelLoadedItems(null);
        } else {
          setExcelLoadedItems(data);
        }
      } else {
        throw new Error("Tệp excel không đúng tên cột");
      }
    } catch (err) {
      defaultFailCB(err);
    }
  }

  //#endregion

  return isLoading ? (
    <Loading />
  ) : (
    <div className="mng-container">
      <div className="form-list__container">
        <div className="form__container">
          {
            // render button if excel loaded at least 1 row
            !!excelLoadedItems.length && (
              <Button
                style={{ marginBottom: 10 }}
                className="delete"
                // clear items
                onClick={() => setExcelLoadedItems([])}
              >
                Hủy
              </Button>
            )
          }
          {
            // render excel loaded list items if it has at least 1 row or render dropzone_container
            !!excelLoadedItems.length ? (
              <ul id="excel__loaded-ul">
                {excelLoadedItems.map((values, index) => (
                  <FacultyItemToAdd
                    index={index}
                    facultyName={values["faculty-name"]}
                    onAdd={(event) =>
                      handleOnAdd({ values, shouldRemoveChild: true, event })
                    }
                  />
                ))}
              </ul>
            ) : (
              <FileDropzone
                {...{
                  excelLoadedItems,
                  handleDropped,
                  handleDownloadTemplateFile,
                }}
              />
            )
          }
          {
            // remove form on list item has item
            !!excelLoadedItems.length || (
              <FormFaculties
                {...{
                  facultiesObj,
                  currentFacultyId,
                  setCurrentFacultyId,
                  handleOnAdd,
                  handleOnModify,
                }}
              />
            )
          }
        </div>
        <div className="list__container faculties-list">
          <div className="list__container-search">
            <input
              type="text"
              className="text__search"
              onChange={({ target }) => setSearchString(target.value)}
              name="search-string"
              value={searchString}
              placeholder="Tìm kiếm..."
            />
            <div className="list__header">
              <h5>STT</h5>
              <h5>Mã khoa</h5>
              <h5>Tên khoa</h5>
            </div>
          </div>
          {!!Object.keys(facultiesObj).length ? (
            <ul>
              {Object.keys(facultiesObj)
                .reverse()
                .map((id, index) => (
                  <FacultyListItem
                    index={index}
                    id={id}
                    facultyName={facultiesObj[id]["faculty-name"]}
                    onClick={() => setCurrentFacultyId(id)}
                    onRemove={() => handleOnRemove(id)}
                  />
                ))}
            </ul>
          ) : (
            <p>no lecture</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageFaculties;
