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
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ClassRow from "./TableRowClass";

// import styles
import "./Manage.css";

function createData(facultyName, classList) {
  return {
    facultyName,
    classList,
  };
}

const ManageClass = (props) => {
  //#region Component State

  const [classObj, setClassObj] = useState({});
  const [facultiesObj, setFacultiesObj] = useState({});
  const [currentClassId, setCurrentClassId] = useState();
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [excelLoadedItems, setExcelLoadedItems] = useState([]);

  const [originalRows, setOriginalRows] = useState([]);

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
    getAllClass(props.semId, (result) => {
      setClassObj(result);
    });
    getAllFaculties((result) => {
      setFacultiesObj(result);
      setIsLoading(false);
    });
  }, [isLoading, props.semId]);

  useEffect(() => {
    let tableRows = [];
    let facultyList = [];

    Object.keys(classObj).forEach((classKey) => {
      const facultyName = classObj[classKey]["faculty"];
      if (!facultyList.includes(facultyName)) {
        facultyList.push(facultyName);
      }
    });

    facultyList.forEach((facultyName) => {
      tableRows = [
        ...tableRows,
        createData(
          facultyName,
          Object.values(classObj).filter((classValue, i) => {
            if (classValue["faculty"] === facultyName) {
              const classId = Object.keys(classObj)[i];
              return { ...classValue, classId };
            }
            return null;
          })
        ),
      ];
    });

    setOriginalRows(tableRows);
  }, [classObj]);

  // useEffect(() => {
  //   console.log(classObj);
  // }, [classObj]);

  // useEffect(() => {
  //   console.log({ ...props, classObj });
  // }, [props, classObj]);

  useEffect(() => {
    const li = document.getElementsByClassName("list_item-search");
    for (let i = 0; i < li.length; i++) {
      const items = li[i].querySelectorAll(".item-to_search");
      let isInclude = [];
      items.forEach((item) => {
        let txtValue = item.textContent || item.innerHTML;
        isInclude.push(
          txtValue.toLowerCase().includes(searchString.trim().toLowerCase())
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

  const handleOnRemove = (facId, classId) => {
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
            removeClass(props.semId, classId);
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
            </div>
            {!!Object.keys(classObj).length ? (
              <TableContainer
                component={Paper}
                style={{ maxHeight: "100%", overflow: "auto" }}
              >
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <b>Khoa</b>
                      </TableCell>
                      <TableCell align="center">
                        <b>Số Lượng Lớp</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {originalRows.map((row, index) => (
                      <ClassRow
                        key={index}
                        row={row}
                        onRemove={handleOnRemove}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <p>no class</p>
            )}
            {/* list of classes */}
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default ManageClass;
