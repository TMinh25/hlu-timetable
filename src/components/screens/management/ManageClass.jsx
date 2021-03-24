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
import PropTypes from "prop-types";

import {
  makeStyles,
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@material-ui/core";

// import styles
import "./Manage.css";

function getFacId(facName) {
  if (exists(facName)) {
    return facName
      .toString()
      .trim()
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  }
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(facultyName, classList) {
  return {
    facultyName,
    classList,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const { onRemove } = props;

  useEffect(() => {
    console.log(open);
  }, [open]);

  return (
    <>
      <TableRow
        className={`${classes.root} list_item-search-contain`}
        style={{
          maxHeight: 699,
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <TableCell component="th" scope="row" align="left">
          {row.facultyName}
        </TableCell>
        <TableCell align="middle">{row.classList.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            style={{
              borderBottom: "1px solid whtiesmoke",
            }}
          >
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Danh Sách Lớp
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên Lớp</TableCell>
                    <TableCell>Hệ</TableCell>
                    <TableCell>Sĩ Số Lớp</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.classList.map((classRow, index) => (
                    <TableRow key={index} className="list_item-search">
                      <TableCell
                        component="th"
                        scope="row"
                        className="item-to_search"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell className="item-to_search">
                        {classRow.className}
                      </TableCell>
                      <TableCell className="item-to_search">
                        {classRow.classType}
                      </TableCell>
                      <TableCell>{classRow.classSize}</TableCell>
                      <TableCell
                        align="right"
                        onClick={() =>
                          onRemove(row.facultyName, classRow.className)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <i class="fas fa-trash" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    facultyName: PropTypes.string.isRequired,
    classList: PropTypes.arrayOf(
      PropTypes.shape({
        className: PropTypes.string.isRequired,
        classType: PropTypes.string.isRequired,
        classSize: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

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
    Object.keys(classObj).forEach((facKey) => {
      tableRows = [
        ...tableRows,
        createData(
          facKey,
          Object.keys(classObj[facKey]).map((classKey) => ({
            className: classKey,
            classType: classObj[facKey][classKey]["classType"],
            classSize: classObj[facKey][classKey]["classSize"],
          }))
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
        // const container = li[i].closest(".list_item-search-contain");

        // console.log("container");
        // console.log(container);
        // container.style.display = "none";
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
            removeClass(props.semId, facId, classId);
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
                <ul id="excel__loaded-ul class-mng-ul">
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
                      <TableCell align="middle">
                        <b>Số Lượng Lớp</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {originalRows.map((row) => (
                      <Row key={row.name} row={row} onRemove={handleOnRemove} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <p>no lecture</p>
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
