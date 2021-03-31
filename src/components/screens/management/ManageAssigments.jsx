import React, { useEffect, useState } from "react";

// import components
import {
  getAllLectures,
  getAllFaculties,
  getAllSubjects,
  getAllClass,
  setNewAssignment,
  getAssignmentsOfLecture,
} from "../../../firebase";
import { exists, titleCase } from "../../../utils";
// import { confirmAlert } from "react-confirm-alert";
import { Loading } from "../../Components";
import { AgGridReact } from "ag-grid-react";
import NumbericEditor from "./NumbericEditor";
import ClassSelectEditor from "./ClassSelectEditor";

// import styles
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

import "./Manage.css";
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";

function extractValues(mappings) {
  return Object.values(mappings);
}

const ManageAssignments = (props) => {
  //#region Component State
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [lecturesObj, setLecturesObj] = useState({});
  const [classArr, setClassArr] = useState([]);
  const [classObj, setClassObj] = useState({});
  const [rowData, setRowData] = useState([]);
  const [facultyObj, setFacultiesObj] = useState({});
  const [currentLectureId, setCurrentLectureId] = useState();
  const [searchString, setSearchString] = useState("");
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
      field: "classTeaching",
      headerName: "Lớp Giảng Dạy",
      editable: true,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: Object.keys(classObj),
      },
      valueFormatter: (params) => {
        // lấy tên lớp cho vào select

        const classID = params.value;

        const label =
          classID === "Chọn Lớp" ? "Chọn Lớp" : classObj[classID]["className"];

        return label;
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

  const contextMenuItems = (params) => {
    var result = ["copy", "copyWithHeaders", "separator", "export"];
    return result;
  };

  //#endregion

  //#region Hooks

  // Lấy dữ liệu từ firebase (async)
  useEffect(() => {
    async function fetchData() {
      var [
        allLectures,
        allFaculties,
        allSubjects,
        allClasses,
      ] = await Promise.all([
        getAllLectures(),
        getAllFaculties(),
        getAllSubjects(),
        getAllClass(props.semId),
      ]).then(setIsLoading(false));

      if (exists(allFaculties)) {
        setFacultiesObj(allFaculties);
        // console.log(allFaculties);
      }

      if (exists(allSubjects)) {
        const subjectRows = Object.keys(allSubjects).map(
          (subjectKey, index) => {
            return {
              id: index + 1,
              subjectId: subjectKey,
              subjectName: titleCase(allSubjects[subjectKey]["subject-name"]),
              credit: allSubjects[subjectKey]["credit"],
              periods: allSubjects[subjectKey]["periods"],
              classTeaching: "Chọn Lớp",
              numberOfTests: 0,
            };
          }
        );

        setRowData(subjectRows);
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
      fetchData();
    }

    // eslint-disable-next-line
  }, [isLoading]); // similar to fetching lectures list on componentUpdate()

  // tìm kiếm giảng viên nếu searchString thay đổi
  useEffect(() => {
    const li = document.getElementsByClassName("list__container-li_item");
    for (let i = 0; i < li.length; i++) {
      const items = li[i].querySelectorAll(".li__item-search");
      let isInclude = [];
      items.forEach((item) => {
        let txtValue = item.textContent || item.innerHTML;
        isInclude.push(
          txtValue.trim().toLowerCase().includes(searchString.toLowerCase())
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
    // console.log(currentLectureId);

    if (currentLectureId && gridApi) {
      getAssignmentsOfLecture(props.semId, currentLectureId).then(
        (fetchedRes) => {
          const result = fetchedRes;
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
                rowNode.setData(
                  allAssignmentsOfLecture[rowNode.data.subjectId]
                );
                rowNode.setSelected(true, false);
              } else {
                rowNode.setData({
                  ...rowNode.data,
                  classTeaching: "Chọn Lớp",
                  numberOfTests: "0",
                });
                rowNode.setSelected(false, false);
              }
            });
          } else {
            gridApi.forEachNode((rowNode) => {
              rowNode.setData({
                ...rowNode.data,
                classTeaching: "Chọn Lớp",
                numberOfTests: "0",
              });
            });
            gridApi.deselectAll();
          }
        }
      );
    }

    // eslint-disable-next-line
  }, [currentLectureId, gridApi]);

  // hàm callback khi bảng sẵn sàng nhận dữ liệu
  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
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

  //#endregion

  return (
    <>
      <div className="form-list__container">
        <div style={{ flex: "1" }}>
          <div className="list__container-search" style={{ marginBottom: 10 }}>
            <input
              style={{ marginBottom: 10 }}
              className="search-input-assignments"
              placeholder="Lọc Giảng Viên..."
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
          <ul>
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

          <div className="ag-theme-alpine-dark" style={{ height: 750 }}>
            {rowData.length && currentLectureId && classObj ? (
              <>
                <AgGridReact
                  {...{ onGridReady, rowData, columnDefs }}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 130,
                    editable: true,
                    resizable: true,
                    lockPosition: true,
                    menuTabs: [],
                  }}
                  components={{
                    numbericCellEditor: NumbericEditor,
                  }}
                  enableRangeSelection={true}
                  pagination={true}
                  paginationPageSize={15}
                  rowSelection="multiple"
                  suppressRowClickSelection={true}
                  suppressDragLeaveHidesColumns={true}
                  getContextMenuItems={contextMenuItems}
                  overlayNoRowsTemplate={
                    "Bạn chưa có dữ liệu nào trong cơ sở dữ liệu"
                  }
                  onSelectionChanged={() => {
                    var selectedRows = gridApi.getSelectedRows();
                    setNewAssignment(
                      props.semId,
                      currentLectureId,
                      selectedRows
                    );
                  }}
                  onCellEditingStopped={() => {
                    var selectedRows = gridApi.getSelectedRows();
                    setNewAssignment(
                      props.semId,
                      currentLectureId,
                      selectedRows
                    );
                  }}
                ></AgGridReact>
              </>
            ) : (
              <h1>no data</h1>
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default ManageAssignments;
