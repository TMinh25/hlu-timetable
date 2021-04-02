import React, { useEffect, useState } from "react";

// import components
import FormClassManage from "./FormClassManage";
import {
  getAllFaculties,
  getAllClass,
  setNewClass,
  removeClass,
} from "../../../firebase";
import { defaultFailCB, readExcel, exists } from "../../../utils";
import { confirmAlert } from "react-confirm-alert";
import { Loading, Button, FileDropzone } from "../../Components";
import { getFacId } from "./ManageFaculties";

// import styles
import "./Manage.css";
import { AgGridReact } from "ag-grid-react";

const ManageClass = (props) => {
  //#region Component State

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState([]);

  const [classObj, setClassObj] = useState({});
  const [facultiesObj, setFacultiesObj] = useState({});
  const [currentClassId, setCurrentClassId] = useState();
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
        editable: false,
        maxWidth: 120,
      },
      { field: "className", headerName: "Tên Lớp" },
      { field: "classSize", headerName: "Sĩ Số Lớp" },
      { field: "classType", headerName: "Hệ" },
      { field: "faculty", headerName: "Khoa", hide: true, rowGroup: true },
    ],
    defaultColDef: {
      flex: 1,
    },
    rowSelection: "multiple",
    groupUseEntireRow: true,
  };

  const contextMenuItems = ["copy", "copyWithHeaders", "separator", "export"];

  //#endregion

  //#region Components

  const LectureItemToAdd = ({ onAdd, index, className, faculty }) => {
    return (
      <li
        key={index}
        className="excel__list-li_item"
        style={{ gridTemplateColumns: "4fr 3fr 1fr" }}
      >
        <div>
          <p>{className}</p>
        </div>
        <div>
          <p>{getFacId(faculty)}</p>
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
    console.log(rowData);
  }, [rowData]);

  useEffect(() => {
    async function fetchData() {
      var [allClasses, allFaculties] = await Promise.all([
        getAllClass(props.semId),
        getAllFaculties(),
      ]);

      const classRow = Object.keys(allClasses).map((classKey, index) => {
        return {
          id: index + 1,
          classId: classKey,
          className: allClasses[classKey]["className"],
          classSize: allClasses[classKey]["classSize"],
          classType: allClasses[classKey]["classType"],
          faculty: allClasses[classKey]["faculty"],
        };
      });

      setRowData(classRow);
      setClassObj(allClasses);
      setFacultiesObj(allFaculties);
    }
    if (isLoading) {
      fetchData().then(() => setIsLoading(false));
    }
    // eslint-disable-next-line
  }, [isLoading]);

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  // useEffect(() => {
  //   console.log(classObj);
  // }, [classObj]);

  // useEffect(() => {
  //   console.log({ ...props, classObj });
  // }, [props, classObj]);

  //#endregion

  //#region Component Method

  function handleOnAdd({
    values,
    shouldRemoveChild = false,
    event = undefined,
  }) {
    // remove li element on add
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
      if (!!values["className"]) {
        if (
          exists(values["className"]) &&
          exists(classObj[values["faculty"]]) &&
          values["className"] in classObj[values["faculty"]]
        ) {
          confirmAlert({
            title: "Lớp này đã tồn tại trong cơ sở dữ liệu",
            message: "Bạn muốn thay đổi thông tin của lớp này?",
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
                  setNewClass(props.semId, values);
                  setIsLoading(true);
                  shouldRemoveChild && removeLi();
                  resolve();
                },
              },
            ],
          });
        } else {
          setNewClass(props.semId, values);
          setIsLoading(true);
          shouldRemoveChild && removeLi();
          resolve();
        }
      }
    });
  }

  const handleOnRemove = () => {
    confirmAlert({
      title: `Bạn có chắc muốn xóa ${selectedRows.length} lớp này?`,
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
              removeClass(props.semId, row?.classId);
            });
            setSelectedRows([]);
            setIsLoading(true);
          },
        },
      ],
    });
  };

  async function handleDropped(files) {
    const objHeaders = ["faculty", "className", "classType", "classSize"];
    const file = files[0];
    try {
      const data = await readExcel(file, objHeaders);
      if (data.length === 0) {
        setExcelLoadedItems(null);
      } else {
        setExcelLoadedItems(data);
        console.log(data);
      }
    } catch (err) {
      defaultFailCB(err);
    }
  }

  const handleDownloadTemplateFile = () =>
    window.open(
      "https://drive.google.com/file/d/19AczyMhfMR7AL0oAup2HYKkgGG-vUB_G/view?usp=sharing",
      "_blank",
      ""
    );

  //#endregion

  return (
    <>
      <div className="form-list__container">
        <div style={{ flex: "1" }}>
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
              <ul id="excel__loaded-ul">
                {excelLoadedItems.map((values, index) => (
                  <LectureItemToAdd
                    index={index}
                    className={values["className"]}
                    faculty={values["faculty"]}
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
              <FormClassManage
                {...{
                  facultiesObj,
                  classObj,
                  currentClassId,
                  setCurrentClassId,
                  handleOnAdd,
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
        <div style={{ marginLeft: 30, flex: "3" }}>
          <input
            type="text"
            className="text__search"
            onChange={({ target }) => gridApi.setQuickFilter(target.value)}
            placeholder="Tìm kiếm..."
          />
          <div className="ag-theme-alpine-dark" style={{ height: "94%" }}>
            <AgGridReact
              {...{ onGridReady, rowData, gridOptions }}
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
              onRowClicked={({ data }) => {
                setCurrentClassId(data?.classId);
              }}
              onSelectionChanged={() => {
                var selectedRows = gridApi.getSelectedRows();
                setSelectedRows(selectedRows);
              }}
            />
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default ManageClass;
