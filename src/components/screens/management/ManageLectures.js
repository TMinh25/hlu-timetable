import React, { useEffect, useState } from "react";

// import components
import FormLectures from "./FormLectures";
import {
  newLecture,
  modifyLecture,
  removeLecture,
  getAllLectures,
  getAllFaculties,
  setNewFaculty,
} from "../../../firebase";
import { defaultFailCB, readExcel, exists } from "../../../utils";
import { confirmAlert } from "react-confirm-alert";
import { Loading, Button, FileDropzone } from "../../Components";
import { getFacId } from "./ManageFaculties";

// import styles
import "./Manage.css";

const ManageLectures = () => {
  //#region Component State

  const [lecturesObj, setLecturesObj] = useState({});
  const [facultiesObj, setFacultiesObj] = useState({});
  const [currentLectureId, setCurrentLectureId] = useState();
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [excelLoadedItems, setExcelLoadedItems] = useState([]);

  //#endregion

  //#region Components

  const LectureListItem = ({ index, name, faculty, onRemove, onClick }) => {
    return (
      <>
        <li key={index} className="list__container-li_item" onClick={onClick}>
          <p className="li__item-search">{index + 1}</p>
          <p className="li__item-search">{name}</p>
          <p className="li__item-search">
            {faculty !== "defaultValue" ? faculty : "Không"}
          </p>
          <span className="btn__trash trash" onClick={() => onRemove(index)}>
            <i className="far fa-trash" />
          </span>
        </li>
      </>
    );
  };

  const LectureItemToAdd = ({ onAdd, index, lectureName }) => {
    return (
      <li key={index} className="excel__list-li_item">
        <div>
          <p>{lectureName}</p>
        </div>
        <span className="btn__trash add" onClick={onAdd}>
          <i className="far fa-plus-square" />
        </span>
      </li>
    );
  };

  //#endregion

  //#region Hooks

  useEffect(() => {
    async function fetchData() {
      const [allLectures, allFaculties] = await Promise.all([
        getAllLectures(),
        getAllFaculties(),
      ]);

      Promise.all([
        setLecturesObj(allLectures),
        setFacultiesObj(allFaculties),
        setIsLoading(false),
      ]);
    }

    fetchData();
  }, [isLoading]); // similar to fetching lectures list on componentUpdate()

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

  function handleOnAddFaculty(values) {
    // Trả về Promise để Form đợi tới khi người dùng chọn tùy chọn
    return new Promise((resolve, reject) => {
      if (exists(values["faculty-name"])) {
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
                },
              },
            ],
          });
        } else {
          setNewFaculty(values);
          resolve();
        }
      }
    });
  }

  const handleOnAdd = ({
    values,
    shouldRemoveChild = false,
    event = undefined,
  }) => {
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

    return new Promise((resolve, reject) => {
      if (!!values["lecture-name"]) {
        if (
          exists(values["faculty"]) &&
          !(getFacId(values["faculty"]) in facultiesObj)
        ) {
          confirmAlert({
            title: "Khoa này hiện tại chưa có trong cơ sở dữ liệu",
            message: "Bạn muốn thêm khoa này vào database không?",
            buttons: [
              {
                className: "confirm__cancel",
                label: "Hủy",
                onClick: () => reject(),
              },
              {
                className: "new",
                label: "Thêm",
                onClick: () => {
                  newLecture(values);
                  handleOnAddFaculty({
                    "faculty-name": values["faculty"],
                  });
                  setIsLoading(true);
                  shouldRemoveChild && removeLi();
                  resolve();
                },
              },
            ],
          });
        } else {
          newLecture(values);
          setIsLoading(true);
          shouldRemoveChild && removeLi();
          resolve();
        }
      }
    });
  };

  const handleOnModify = (id, values) => {
    return new Promise((resolve) => {
      if (!!Object.keys(values).length) {
        modifyLecture(id, values);
        setCurrentLectureId("");
        setIsLoading(true);
      }
      resolve(true);
    });
  };

  const handleOnRemove = (id) => {
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
            removeLecture(id);
            setCurrentLectureId("");
            setIsLoading(true);
          },
        },
      ],
    });
  };

  async function handleDropped(files) {
    const objHeaders = ["lecture-name", "lecture-email", "faculty"];
    const file = files[0];
    try {
      const data = await readExcel(file, objHeaders);
      if (data.length === 0) {
        setExcelLoadedItems(null);
      } else {
        setExcelLoadedItems(data);
      }
    } catch (err) {
      defaultFailCB(err);
    }
  }

  const handleDownloadTemplateFile = () =>
    window.open(
      "https://drive.google.com/file/d/15h5VvMQOtWwKoNRKzAWQaW62vctDx-jd/view?usp=sharing",
      "_blank",
      ""
    );

  //#endregion

  return (
    <>
      <div className="mng-container">
        <div className="form-list__container">
          <div className="form__container">
            {
              // render cancel button if excelLoaded has at least 1 row
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
                <ul id="excel__loaded-ul lecture-ul">
                  {excelLoadedItems.map((values, index) => (
                    <LectureItemToAdd
                      index={index}
                      lectureName={values["lecture-name"]}
                      lectrueEmail={values["lecture-email"]}
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
              // remove form if list item has item
              !!excelLoadedItems.length || (
                <FormLectures
                  {...{
                    facultiesObj,
                    lecturesObj,
                    currentLectureId,
                    setCurrentLectureId,
                    handleOnAdd,
                    handleOnModify,
                  }}
                />
              )
            }
          </div>

          <div className="list__container lecture-list">
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
                <h5>Tên giảng viên</h5>
                <h5>Khoa</h5>
              </div>
            </div>
            {!!Object.keys(lecturesObj).length ? (
              <ul>
                {Object.keys(lecturesObj)
                  .reverse()
                  .map((id, index) => {
                    return (
                      <LectureListItem
                        index={index}
                        name={lecturesObj[id]["lecture-name"]}
                        faculty={lecturesObj[id]["faculty"]}
                        onRemove={() => handleOnRemove(id)}
                        onClick={() => setCurrentLectureId(id)}
                      />
                    );
                  })}
              </ul>
            ) : (
              <p>no lecture</p>
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default ManageLectures;
