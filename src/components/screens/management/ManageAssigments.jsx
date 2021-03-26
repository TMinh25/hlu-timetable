import React, { useEffect, useState } from "react";

// import components
import FormAssignments from "./FormAssignments";
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

// import styles
import "./Manage.css";
import { Collapse } from "@material-ui/core";
import { Image, Input, List, Segment } from "semantic-ui-react";

const ManageAssignments = () => {
  //#region Component State

  const [lecturesObj, setLecturesObj] = useState({});
  const [facultiesObj, setFacultiesObj] = useState({});
  const [currentLectureId, setCurrentLectureId] = useState();
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  //#endregion

  //#region Components

  //#endregion

  //#region Hooks

  useEffect(() => {
    async function fetchData() {
      var [allLectures, allFaculties] = await Promise.all([
        getAllLectures(),
        getAllFaculties(),
      ]).then(setIsLoading(false));

      if (exists(allFaculties)) {
        setFacultiesObj(allFaculties);
        console.log(allFaculties);
      }

      if (exists(allLectures)) {
        setLecturesObj(allLectures);
        console.log(allLectures);
        var lecturesCategorizedFac = {};
        // tableRows = [
        //   ...tableRows,
        //   createData(
        //     facultyName,
        //     Object.values(classObj).filter((classValue, i) => {
        //       if (classValue["faculty"] === facultyName) {
        //         const classId = Object.keys(classObj)[i];
        //         return { ...classValue, classId };
        //       }
        //       return null;
        //     })
        //   ),
        // ];
        Object.keys(allFaculties).forEach((facKey) => {
          lecturesCategorizedFac = {
            ...lecturesCategorizedFac,
            [facKey]: Object.values(allLectures).filter((lecture, index) => {
              console.log(facKey);
              if (lecture["faculty"] === facKey) {
                console.log(lecture["faculty"]);
                return true;
              }
              return null;
            }),
          };
        });
      }

      console.log(lecturesCategorizedFac);
    }

    if (isLoading === true) {
      fetchData();
    }
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

  useEffect(() => {
    console.log(currentLectureId);
  }, [currentLectureId]);

  //#endregion

  //#region Component Method

  //#endregion

  return (
    <>
      <div className="mng-container">
        <div className="form-list__container">
          <div className="form__container">
            <ul>
              <Input
                placeholder="Search..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />

              {/* <Collapse in={} timeout="auto" unmountOnExit></Collapse> */}
              {Object.keys(lecturesObj).map((key) => {
                return (
                  <>
                    <li
                      className="list__container-li_item items-body-content"
                      onClick={() => setCurrentLectureId(key)}
                    >
                      <span className="li__item-search">
                        {lecturesObj[key]["lecture-name"]}
                      </span>
                      <i className="fa fa-angle-right" />
                    </li>
                  </>
                );
              })}
            </ul>
            {/* {
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
                <FormAssignments
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
            } */}
          </div>

          <div className="list__container lecture-list">
            {/* <div className="list__container-search">
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
                      <AssignmentsListItem
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
            )} */}
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default ManageAssignments;
