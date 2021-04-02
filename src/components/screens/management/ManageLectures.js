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
import { AgGridReact } from "ag-grid-react";

// import styles
import "./Manage.css";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

const ManageLectures = () => {
  //#region Component State
  const gridOptions = {
    columnDefs: [
      {
        field: "id",
        headerName: "STT",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        maxWidth: 120,
      },
      { field: "lectureName", headerName: "Tên Giảng Viên" },
      { field: "faculty", headerName: "Khoa" },
    ],
    defaultColDef: {
      flex: 1,
    },
    rowSelection: "multiple",
  };

  const contextMenuItems = ["copy", "copyWithHeaders", "separator", "export"];

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState([]);
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

      const lectureRows = Object.keys(allLectures).map((lectureKey, index) => {
        return {
          id: index + 1,
          lectureId: lectureKey,
          lectureName: allLectures[lectureKey]["lecture-name"],
          faculty: allLectures[lectureKey]["faculty"],
        };
      });

      console.log(lectureRows);

      setRowData(lectureRows);
    }

    fetchData();
  }, [isLoading]); // similar to fetching lectures list on componentUpdate()

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }
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
      title: `Bạn có chắc muốn xóa ${selectedRows.length} giảng viên này?`,
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
            selectedRows.forEach((row) => {
              removeLecture(row?.lectureId);
            });
            setCurrentLectureId("");
            setIsLoading(true);
            setSelectedRows([]);
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
            {!!selectedRows.length && (
              <Button
                style={{ marginTop: 10 }}
                className="delete"
                // clear items
                onClick={handleOnRemove}
              >
                Xóa {selectedRows.length} Khoa
              </Button>
            )}
          </div>

          <div className="list__container lecture-list">
            <input
              type="text"
              className="text__search"
              onChange={({ target }) => gridApi.setQuickFilter(target.value)}
              placeholder="Tìm kiếm..."
            />
            <div style={{ height: "94%" }} className="ag-theme-alpine-dark">
              <AgGridReact
                {...{ onGridReady, rowData, gridOptions }}
                style={{ height: "90%" }}
                columnDefs={gridOptions["columnDefs"]}
                defaultColDef={{ flex: 1 }}
                enableRangeSelection={true}
                pagination={true}
                paginationPageSize={15}
                rowMultiSelectWithClick={true}
                suppressRowClickSelection={true}
                getContextMenuItems={contextMenuItems}
                overlayNoRowsTemplate={
                  "Bạn chưa có dữ liệu nào trong cơ sở dữ liệu"
                }
                onRowClicked={({ data }) =>
                  setCurrentLectureId(data["lectureId"])
                }
                onSelectionChanged={() => {
                  var selectedRows = gridApi.getSelectedRows();
                  setSelectedRows(selectedRows);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default ManageLectures;
