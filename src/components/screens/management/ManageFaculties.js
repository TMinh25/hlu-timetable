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
import {
  readExcel,
  defaultFailCB,
  exists,
  getHeaderRow,
  getFacID,
} from "../../../utils";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

// import styles
import "./Manage.css";

const ManageFaculties = () => {
  //#region Component State

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState([]);

  const [facultiesObj, setFacultiesObj] = useState({});
  const [currentFacultyId, setCurrentFacultyId] = useState("");
  const [excelLoadedItems, setExcelLoadedItems] = useState([]);

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
      { field: "facultyId", headerName: "Mã Khoa" },
      { field: "facultyName", headerName: "Tên Khoa" },
    ],
    defaultColDef: {
      flex: 1,
    },
    rowSelection: "multiple",
  };

  const contextMenuItems = (params) => [
    "copy",
    "copyWithHeaders",
    "separator",
    "export",
  ];

  //#endregion

  //#region Component

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
    async function fetchData() {
      const allFaculties = await getAllFaculties();
      Promise.all([setFacultiesObj(allFaculties), setIsLoading(false)]);

      const subjectRows = Object.keys(allFaculties).map((facultyKey, index) => {
        return {
          id: index + 1,
          facultyId: facultyKey,
          facultyName: allFaculties[facultyKey]["faculty-name"],
        };
      });

      setRowData(subjectRows);
    }

    if (isLoading) {
      fetchData();
    }
  }, [isLoading]); // fetching faculties list on componentUpdate

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

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
        let facID = getFacID(values["faculty-name"]);
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
                  setIsLoading(true);
                  resolve();
                  shouldRemoveChild && removeLi();
                },
              },
            ],
          });
        } else {
          setNewFaculty(values);
          setIsLoading(true);
          resolve();
          shouldRemoveChild && removeLi();
        }
      }
    });
  }

  function handleOnModify(values) {
    return new Promise((resolve) => {
      let id = getFacID(values["faculty-name"]);
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

  function handleOnRemove() {
    confirmAlert({
      title: `Bạn có chắc muốn xóa ${selectedRows.length} khoa?`,
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
              removeFaculty(row?.facultyId);
            });
            setCurrentFacultyId("");
            setIsLoading(true);
            setSelectedRows([]);
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
        <div
          className="list__container faculties-list ag-theme-alpine-dark"
          style={{ height: "100%" }}
        >
          <input
            type="text"
            className="text__search"
            onChange={({ target }) => gridApi.setQuickFilter(target.value)}
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
                setCurrentFacultyId(data["facultyId"])
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
  );
};

export default ManageFaculties;
