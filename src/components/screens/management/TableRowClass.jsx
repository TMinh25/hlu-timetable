import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  Box,
  Typography,
} from "@material-ui/core";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

export default function ClassRow(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const { onRemove } = props;

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
        <TableCell align="center">{row.classList.length}</TableCell>
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
                        onClick={() => onRemove(classRow.classId)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="far fa-trash" />
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

ClassRow.propTypes = {
  row: PropTypes.shape({
    facultyName: PropTypes.string.isRequired,
    classList: PropTypes.arrayOf(
      PropTypes.shape({
        className: PropTypes.string.isRequired,
        classType: PropTypes.string.isRequired,
        classSize: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
