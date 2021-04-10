import React, { useContext, useEffect, useState } from "react";

// import components
import {
  getAllLectures,
  getAllSubjects,
  getAllClasses,
  setNewAssignment,
  getAssignmentsOfLecture,
} from "../../../firebase";
import { exists, titleCase } from "../../../utils";
// import { confirmAlert } from "react-confirm-alert";
import { Loading } from "../../Components";
import { AgGridReact } from "ag-grid-react";
import NumbericEditor from "./NumbericEditor";
import Select from "react-select";

// import styles
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

import "./Manage.css";
import { useMemo } from "react";
import { SemContext } from "../timetable/provider/SemProvider";

const ManageAssignments = (props) => {
  //#region Component State
  const [gridApi, setGridApi] = useState(null);
  // const [gridColumnApi, setGridColumnApi] = useState(null);

  const context = useContext(SemContext);
  const { semesterInfo } = context;

  const [lecturesObj, setLecturesObj] = useState({});
  const [classObj, setClassObj] = useState({});
  const [subjectObj, setSubjectObj] = useState({});
  // const [facultyObj, setFacultiesObj] = useState({});
  const [currentLectureID, setCurrentLectureID] = useState();
  const [lectureListFilter, setLectureListFilter] = useState("");
  const [subjectGridFilter, setSubjectGridFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const columnDefs = [
    {
      field: "id",
      headerName: "STT",
      type: "number",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      maxWidth: 120,
    },
    {
      field: "subjectName",
      headerName: "Tên môn học",
      type: "string",
      editable: false,
    },
    {
      field: "credit",
      headerName: "Số Tín Chỉ",
      type: "number",
      editable: false,
    },
    {
      field: "periods",
      headerName: "Số Tiết",
      type: "number",
      editable: false,
    },
    {
      field: "classID",
      headerName: "Lớp Giảng Dạy",
      editable: !!Object.keys(classObj).length,
      cellEditor: "agRichSelectCellEditor",
      // cellRenderer: "classesSelectComponent",
      // cellEditor: "classesSelectComponent",
      cellEditorParams: {
        values: Object.keys(classObj),
      },
      valueFormatter: (params) => {
        // lấy tên lớp cho vào select
        if (Object.keys(classObj).length > 0) {
          const classID = params?.value;

          // console.log(classID, classObj, classObj[classID]);

          return classID === "Chọn Lớp" || classID === ""
            ? "Chọn Lớp"
            : classObj[classID]?.className;
        } else {
          return "Chưa có lớp học";
        }
      },
    },
    {
      field: "numberOfTests",
      headerName: "Số Bài Kiểm Tra",
      type: "number",
      editable: true,
      // chỉ chấp nhận số
      valueSetter: numberValueSetter,
    },
  ];

  const contextMenuItems = (params) => [
    "copy",
    "copyWithHeaders",
    "separator",
    "export",
  ];

  //#endregion

  //#region Hooks

  useEffect(() => {
    console.log("classObj", "=>", classObj);
  }, [classObj]);

  // Lấy dữ liệu từ firebase (async)
  useEffect(() => {
    async function fetchData() {
      var [
        allLectures,
        // allFaculties,
        allSubjects,
        allClasses,
      ] = await Promise.all([
        getAllLectures(),
        // getAllFaculties(),
        getAllSubjects(),
        getAllClasses(props.semId),
      ]);

      if (exists(allSubjects)) {
        setSubjectObj(allSubjects);
        // console.log(subjectRows);
      }

      if (exists(allLectures)) {
        setLecturesObj(allLectures);
        // console.log(allLectures);
      }
      if (exists(allClasses)) {
        setClassObj(allClasses);
        // console.log(allClasses);
      }
    }

    if (isLoading === true) {
      fetchData().then(() => setIsLoading(false));
    }

    // eslint-disable-next-line
  }, [isLoading]); // similar to fetching lectures list on componentUpdate()

  const rowData = useMemo(() => {
    return Object.keys(subjectObj).map((subjectKey, index) => {
      return {
        id: index + 1,
        subjectId: subjectKey,
        subjectName: titleCase(subjectObj[subjectKey]["subject-name"]),
        credit: subjectObj[subjectKey]["credit"],
        periods: subjectObj[subjectKey]["periods"],
        classID: "",
        numberOfTests: 0,
      };
    });
  }, [subjectObj]);

  useEffect(() => {
    const li = document.getElementsByClassName("list__container-li_item");
    for (let i = 0; i < li.length; i++) {
      const items = li[i].querySelectorAll(".li__item-search");
      let isInclude = [];
      items.forEach((item) => {
        let txtValue = item.textContent || item.innerHTML;
        isInclude.push(
          txtValue.toLowerCase().includes(lectureListFilter.toLowerCase())
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
  }, [lectureListFilter]); // search for text in list when searchString change

  useEffect(() => {
    if (currentLectureID && gridApi) {
      getAssignmentsOfLecture(props.semId, currentLectureID).then((result) => {
        if (result.length > 0) {
          let allAssignmentsOfLecture = {};
          console.log(result);

          result.forEach((value) => {
            allAssignmentsOfLecture = {
              ...allAssignmentsOfLecture,
              [value["subjectId"]]: value,
            };
          });

          console.log(allAssignmentsOfLecture);

          gridApi.forEachNode((rowNode) => {
            if (rowNode?.data?.subjectId in allAssignmentsOfLecture) {
              rowNode.setData(allAssignmentsOfLecture[rowNode.data.subjectId]);
              rowNode.setSelected(true, false);
            } else {
              rowNode.setData({
                ...rowNode.data,
                classID: "Chọn Lớp",
                numberOfTests: "0",
              });
              rowNode.setSelected(false, false);
            }
          });
        } else {
          gridApi.forEachNode((rowNode) => {
            rowNode.setData({
              ...rowNode.data,
              classID: "Chọn Lớp",
              numberOfTests: "0",
            });
          });
          gridApi.deselectAll();
        }
      });
    }

    // eslint-disable-next-line
  }, [currentLectureID, gridApi]);

  // hàm callback khi bảng sẵn sàng nhận dữ liệu
  function onGridReady(params) {
    setGridApi(params.api);
    // setGridColumnApi(params.columnApi);
  }

  //#endregion

  //#region Component Method

  function numberValueSetter(params) {
    if (isNaN(parseInt(params.newValue)) || !isFinite(params.newValue)) {
      return false; // don't set invalid numbers!
    }

    params.data.numberOfTests = params.newValue;

    return true;
  }

  function handleAddToDB() {
    var selectedRows = gridApi.getSelectedRows();
    setNewAssignment(
      props.semId,
      currentLectureID,
      selectedRows,
      semesterInfo?.numberOfWeeks
    );
  }

  //#endregion

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="form-list__container">
        <div style={{ flex: "1" }}>
          <div className="list__container-search" style={{ marginBottom: 10 }}>
            <input
              style={{ marginBottom: 10 }}
              className="search-input-assignments"
              placeholder="Lọc Giảng Viên..."
              value={lectureListFilter}
              onChange={(e) => setLectureListFilter(e.target.value)}
            />
          </div>
          <ul>
            {Object.keys(lecturesObj).map((key) => {
              return (
                <>
                  <li
                    className="list__container-li_item items-body-content"
                    onClick={() => setCurrentLectureID(key)}
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
        </div>
        <div style={{ marginLeft: 30, flex: "3" }}>
          <input
            style={{ marginBottom: "10 !important" }}
            className="search-input-assignments"
            placeholder="Tìm Môn Học..."
            value={subjectGridFilter}
            onChange={(e) => {
              setSubjectGridFilter(e.target.value);
              gridApi.setQuickFilter(e.target.value);
            }}
          />

          <div
            className="ag-theme-alpine-dark"
            style={{ height: "calc(100% - 47px)" }}
          >
            {(!rowData.length && !exists(classObj)) || (
              <AgGridReact
                {...{ onGridReady, rowData, columnDefs }}
                defaultColDef={{
                  flex: 1,
                  minWidth: 130,
                  editable: true,
                  resizable: true,
                }}
                frameworkComponents={{
                  classesSelectComponent: Select
                }}
                components={{
                  numbericCellEditor: NumbericEditor,
                }}
                enableRangeSelection={true}
                rowSelection="multiple"
                suppressRowClickSelection={true}
                suppressDragLeaveHidesColumns={true}
                getContextMenuItems={contextMenuItems}
                overlayNoRowsTemplate={
                  "Bạn chưa có dữ liệu nào trong cơ sở dữ liệu"
                }
                onSelectionChanged={handleAddToDB}
                onCellEditingStopped={handleAddToDB}
              ></AgGridReact>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAssignments;
