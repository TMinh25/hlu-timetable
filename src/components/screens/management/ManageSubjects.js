import React, { useEffect, useState } from "react";
import {
  getAllSubjects,
  modifySubject,
  newSubject,
  removeSubject,
} from "../../../firebase";
import { defaultFailCB, readExcel, exists, validNumber } from "../../../utils";

// import components
import FormSubjects from "./FormSubjects";
import { Loading, Button, FileDropzone } from "../../Components";
import { confirmAlert } from "react-confirm-alert";
import { AgGridReact } from "ag-grid-react";

//import styles
import "./Manage.css";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

const ManageSubjects = () => {
  //#region State

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState([]);

  const [subjectsObj, setSubjectsObj] = useState({});
  const [currentSubjectId, setCurrentSubjectId] = useState("");
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [excelLoadedItems, setExcelLoadedItems] = useState([]);

  const gridOptions = {
    columnDefs: [
      {
        field: "id",
        headerName: "STT",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        maxWidth: 120,
        editable: false,
      },
      { field: "subjectName", headerName: "Tên Học Phần" },
      { field: "credit", headerName: "Số Tín Chỉ" },
      { field: "periods", headerName: "Số Tiết" },
    ],
    defaultColDef: {
      flex: 1,
      resizable: true,
    },
    rowSelection: "multiple",
  };

  const contextMenuItems = ["copy", "copyWithHeaders", "separator", "export"];

  //#endregion

  //#region Components

  const SubjectItemToAdd = ({ onAdd, index, subjectName, credit, periods }) => {
    return (
      <li key={index.toString()} className="excel__list-li_item">
        <div className="vert-align">
          <p>
            {exists(subjectName) ? (
              subjectName
            ) : (
              <span style={{ color: "red" }}>Không có tên môn</span>
            )}
          </p>
          <div className="hozi-align">
            <p>
              {credit && (
                <>
                  <span
                    style={{
                      color: validNumber(Number.parseInt(credit)) || "red",
                    }}
                  >
                    {credit}
                  </span>{" "}
                  tín
                </>
              )}
            </p>
            <p>
              {periods && (
                <>
                  <span
                    style={{
                      color: validNumber(Number.parseInt(periods)) || "red",
                    }}
                  >
                    {periods}
                  </span>{" "}
                  tiết
                </>
              )}
            </p>
          </div>
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
      const allSubject = await getAllSubjects();

      setSubjectsObj(allSubject);
      setIsLoading(false);

      const subjectRows = Object.keys(allSubject).map((subjectKey, index) => {
        return {
          id: index + 1,
          subjectId: subjectKey,
          subjectName: allSubject[subjectKey]["subject-name"],
          credit: allSubject[subjectKey]["credit"],
          periods: allSubject[subjectKey]["periods"],
        };
      });

      setRowData(subjectRows);
    }

    if (isLoading) {
      fetchData();
    }
  }, [isLoading]);

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  //#endregion

  //#region Methods

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
      if (!exists(values["subject-name"])) {
        defaultFailCB("Không có tên môn học");
      } else if (
        !validNumber(values["credit"]) ||
        !validNumber(values["periods"])
      ) {
        defaultFailCB("Dữ liệu không đúng định dạng số");
      } else {
        newSubject(values);
        setIsLoading(true);
        shouldRemoveChild && removeLi();
        resolve();
      }
    });
  };

  const handleOnModify = (id, values) => {
    if (!!Object.keys(values).length) {
      modifySubject(id, values);
      setCurrentSubjectId(undefined);
      setIsLoading(true);
    }
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
            removeSubject(id);
            setCurrentSubjectId("");
            setIsLoading(true);
          },
        },
      ],
    });
  };

  async function handleDropped(files) {
    const objHeaders = ["subject-name", "credit", "periods"];
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
      "https://drive.google.com/file/d/1rTYsYcXKhHf1Cb0jGqLjqiY1edQW-5Z3/view?usp=sharing",
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
                <ul id="excel__loaded-ul subject-ul">
                  {excelLoadedItems.map((values, index) => (
                    <SubjectItemToAdd
                      index={index}
                      subjectName={values["subject-name"]}
                      credit={values["credit"]}
                      periods={values["periods"]}
                      onAdd={async (event) => {
                        try {
                          const res = await handleOnAdd({
                            values,
                            shouldRemoveChild: true,
                            event,
                          });
                          console.error(res);
                        } catch (err) {
                          defaultFailCB(err);
                        }
                      }}
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
                <FormSubjects
                  {...{
                    subjectsObj,
                    currentSubjectId,
                    setCurrentSubjectId,
                    handleOnAdd,
                    handleOnModify,
                  }}
                />
              )
            }
          </div>
          <div className="list__container ag-theme-alpine-dark">
            <input
              type="text"
              className="text__search"
              onChange={({ target }) => setSearchString(target.value)}
              name="search-string"
              value={searchString}
              placeholder="Tìm kiếm..."
            />
            <div style={{ height: "94%" }}>
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
                  setCurrentSubjectId(data["subjectId"])
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

export default ManageSubjects;
