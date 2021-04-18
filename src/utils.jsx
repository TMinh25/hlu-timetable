import { useEffect } from 'react';

import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { breakTime, holidays } from './timetable-config';
import moment from 'moment';

// read excel as json
export function readExcel(file, headers) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = e => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: 'buffer' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, {
        header: headers,
        raw: true,
        blankrows: false,
        defval: null, // giá trị mặc định thay cho null hoặc undefined
      });

      if (data.slice(1).length === 0) {
        reject('Không có dữ liệu');
      } else {
        resolve(data.slice(1));
      }
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
}

export function addScheduleSheet({ workSheet, data, isLecture }) {
  // console.log(workBook.xlsx);

  const style = {
    alignment: {
      wrapText: true,
      vertical: 'top',
      horizontal: 'center',
    },
  };
  workSheet.getRow(3).values = [
    'TIẾT',
    'THỜI GIAN',
    'THỨ HAI',
    'THỨ BA',
    'THỨ TƯ',
    'THỨ NĂM',
    'THỨ SÁU',
    'THỨ BẢY',
    'CHỦ NHẬT',
  ];

  workSheet.columns = [
    {
      key: 'slot',
      width: 10,
      protection: true,
    },
    {
      key: 'slottime',
      width: 15,
      style,
    },
    { key: 'mon', width: 20, style },
    { key: 'tue', width: 20, style },
    { key: 'wed', width: 20, style },
    { key: 'thu', width: 20, style },
    { key: 'fri', width: 20, style },
    { key: 'sat', width: 20, style },
    { key: 'sun', width: 20, style },
  ];

  const arrRowBeforeAdding = [
    {
      slot: 'Sáng',
      slottime: 'BĐ - KT',
      mon: 'Học Phần',
      tue: 'Học Phần',
      wed: 'Học Phần',
      thu: 'Học Phần',
      fri: 'Học Phần',
      sat: 'Học Phần',
      sun: 'Học Phần',
    },
    { slot: '1', slottime: '07:00 - 07:50' },
    { slot: '2', slottime: '07:55 - 08:45' },
    { slot: '3', slottime: '08:50 - 09:40' },
    { slot: '4', slottime: '09:45 - 10:35' },
    { slot: '5', slottime: '10:40 - 11:30' },
    { slot: 'Chiều' },
    { slot: '6', slottime: '13:00 - 13:50' },
    { slot: '7', slottime: '13:55 - 14:45' },
    { slot: '8', slottime: '14:50 - 15:40' },
    { slot: '9', slottime: '15:45 - 16:35' },
    { slot: '10', slottime: '16:40 - 17:30' },
  ];

  arrRowBeforeAdding.forEach(function (item, index) {
    workSheet.addRow({
      slot: item.slot,
      slottime: item.slottime,
      mon: item.mon,
      tue: item.tue,
      wed: item.wed,
      thu: item.thu,
      fri: item.fri,
      sat: item.sat,
      sun: item.sun,
    });
  });

  // merge unneeded cells
  workSheet.mergeCells('A10', 'I10');

  // make borders for cells
  workSheet.getRows(3, 13).forEach(row => {
    for (let i = 1; i <= 9; i++) {
      row.getCell(i).style = {
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
      };
    }
  });

  const slots = workSheet.getColumn('A').values;

  data.forEach(item => {
    const { title, startDate, startSlot, endSlot, data } = item;
    const { classTeaching, lectureTeaching, weekCount } = data;

    const dayOfWeek = moment(startDate).get('day'); // sunday == 0

    var column;
    const addScheduleCell = column => {
      const mergeCell = [];

      slots.forEach((slot, index) => {
        if (slot >= startSlot && slot <= endSlot) {
          mergeCell.push(column + index);
          workSheet.getCell(column + index).value =
            title +
            '\r\n' +
            (isLecture
              ? classTeaching['className']
              : lectureTeaching['lecture-name']) +
            ' (học ' +
            weekCount +
            ' tuần)';
        }
      });

      const startMergeCell = mergeCell[0],
        endMergeCell = mergeCell[mergeCell.length - 1];

      // merge cell with same schedule
      workSheet.mergeCells(startMergeCell, endMergeCell);

      // align text in center
      workSheet.getCell(startMergeCell).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
      };
    };

    switch (dayOfWeek) {
      // mon
      case 1:
        column = 'C';
        addScheduleCell(column);
        break;
      // tue
      case 2:
        column = 'D';
        addScheduleCell(column);
        break;
      // wed
      case 3:
        column = 'E';
        addScheduleCell(column);
        break;
      // thu
      case 4:
        column = 'F';
        addScheduleCell(column);
        break;
      // fri
      case 5:
        column = 'G';
        addScheduleCell(column);
        break;
      // sat
      case 6:
        column = 'H';
        addScheduleCell(column);
        break;
      // sun
      case 0:
        column = 'I';
        addScheduleCell(column);
        break;
      default:
        break;
    }
  });
}

// normal string to title case (exp: Title Case String)
export function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

//#region notification

// success notification
export const defaultSuccessCB = msg =>
  toast.success(msg ? `✌ Thành Công: ${msg}!` : '✌ Thành Công!');

// fail notification
export const defaultFailCB = err =>
  toast.error(err ? `🚫 Lỗi: ${err}!` : '🚫 Lỗi!');

// warn notification
export const defaultWarnCB = msg =>
  toast.warn(msg ? `❗ ${msg}` : '❗ Cảnh báo.');

//#endregion

export function getFacID(facName) {
  if (exists(facName)) {
    return facName
      .toString()
      .trim()
      .split(' ')
      .map(word => (word.toLowerCase() === 'và' ? '&' : word[0].toUpperCase()))
      .join('');
  }
}

export const exists = x => x !== null && x !== undefined && x !== '';

export const ifExists = value => {
  return new Promise((resolve, reject) => {
    exists(value) ? resolve(value) : reject();
  });
};

export const validNumber = num => exists(num) && Number.isInteger(num);

export const selectAllOnFocus = event => event.target.select();

export function getHeaderRow(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = e => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: 'buffer' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      var headers = [];
      var range = XLSX.utils.decode_range(ws['!ref']);
      var C,
        R = range.s.r; /* start in the first row */
      /* walk every column in the range */
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell =
          ws[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* find the cell in the first row */

        var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
      }

      resolve(headers);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
}

export function isBreak(date) {
  const hours = date.getHours();
  return hours >= breakTime.from && hours < breakTime.to;
}

export function hasCoffeeCupIcon(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return hours === breakTime.from && minutes === 0;
}

// export function isValidAppointment(component, appointmentData) {
//   const startDate = new Date(appointmentData.startDate);
//   const endDate = new Date(appointmentData.endDate);
//   const cellDuration = component.option("cellDuration");
//   return isValidAppointmentInterval(startDate, endDate, cellDuration);
// }

// export function isValidAppointmentInterval(startDate, endDate, cellDuration) {
//   const edgeEndDate = new Date(endDate.getTime() - 1);

//   if (!isValidAppointmentDate(edgeEndDate)) {
//     return false;
//   }

//   const durationInMs = cellDuration * 60 * 1000;
//   const date = startDate;
//   while (date <= endDate) {
//     if (!isValidAppointmentDate(date)) {
//       return false;
//     }
//     const newDateTime = date.getTime() + durationInMs - 1;
//     date.setTime(newDateTime);
//   }

//   return true;
// }

export function isRoundNumber(numb) {
  return numb % 1 === 0;
}

export function getStartTime(momentInput, classTime) {
  var time = moment(momentInput);
  switch (classTime) {
    case 1:
      time.set({ hour: 7, minute: 0 });
      break;
    case 2:
      time.set({ hour: 7, minute: 55 });
      break;
    case 3:
      time.set({ hour: 8, minute: 50 });
      break;
    case 4:
      time.set({ hour: 9, minute: 45 });
      break;
    case 5:
      time.set({ hour: 10, minute: 40 });
      break;
    case 6:
      time.set({ hour: 13, minute: 0 });
      break;
    case 7:
      time.set({ hour: 13, minute: 55 });
      break;
    case 8:
      time.set({ hour: 14, minute: 50 });
      break;
    case 9:
      time.set({ hour: 15, minute: 45 });
      break;
    case 10:
      time.set({ hour: 16, minute: 40 });
      break;
    default:
      break;
  }
  return moment(time);
}

export function getStartTimeSlot(momentInput) {
  var time = moment(momentInput).format('HH:mm');
  switch (time) {
    case '07:00':
      return 1;
    case '07:55':
      return 2;
    case '08:50':
      return 3;
    case '09:45':
      return 4;
    case '10:40':
      return 5;
    case '13:00':
      return 6;
    case '13:55':
      return 7;
    case '14:50':
      return 8;
    case '15:45':
      return 9;
    case '16:40':
      return 10;
    default:
      break;
  }
}

export function getEndTime(momentInput, classTime) {
  var time = moment(momentInput);
  switch (classTime) {
    case 1:
      time.set({ hour: 7, minute: 55 });
      break;
    case 2:
      time.set({ hour: 8, minute: 50 });
      break;
    case 3:
      time.set({ hour: 9, minute: 45 });
      break;
    case 4:
      time.set({ hour: 10, minute: 40 });
      break;
    case 5:
      time.set({ hour: 11, minute: 35 });
      break;
    case 6:
      time.set({ hour: 13, minute: 55 });
      break;
    case 7:
      time.set({ hour: 14, minute: 50 });
      break;
    case 8:
      time.set({ hour: 15, minute: 45 });
      break;
    case 9:
      time.set({ hour: 16, minute: 40 });
      break;
    case 10:
      time.set({ hour: 17, minute: 35 });
      break;
    default:
      break;
  }
  return moment(time);
}

export function getEndTimeSlot(momentInput) {
  var time = moment(momentInput).format('HH:mm');
  switch (time) {
    case '07:55':
      return 1;
    case '08:50':
      return 2;
    case '09:45':
      return 3;
    case '10:40':
      return 4;
    case '11:35':
      return 5;
    case '13:55':
      return 6;
    case '14:50':
      return 7;
    case '15:45':
      return 8;
    case '16:40':
      return 9;
    case '17:35':
      return 10;
    default:
      break;
  }
}

export function getTimeSlot(momentInputStart, momentInputEnd) {
  var timeStart = moment(momentInputStart).format('HH:mm');
  var timeEnd = moment(momentInputEnd).format('HH:mm');

  switch (timeStart + '-' + timeEnd) {
    case '07:00-07:55':
      return 1;
    case '07:55-08:50':
      return 2;
    case '08:50-09:45':
      return 3;
    case '09:45-10:40':
      return 4;
    case '10:40-11:35':
      return 5;
    case '13:00-13:55':
      return 6;
    case '13:55-14:50':
      return 7;
    case '14:50-15:45':
      return 8;
    case '15:45-16:40':
      return 9;
    case '16:40-17:35':
      return 10;
    default:
      break;
  }
}

export function getTime(momentInput) {
  return moment(moment(momentInput).format('HH:mm'), 'HH:mm');
}

export function isValidTimeSlot(
  startDate,
  endDate,
  momentInputStart,
  momentInputEnd,
) {
  const timeFormat = 'HH:mm';

  const startFormat = moment(moment(startDate).format(timeFormat), timeFormat),
    endFormat = moment(moment(endDate).format(timeFormat), timeFormat);

  const startTime = getTime(momentInputStart);
  const endTime = getTime(momentInputEnd);

  // debugger;

  // chỉ kiểm tra thời gian của các slot
  // thời gian không nằm giữa hoặc
  // thời gian nằm sau hẳn hoặc
  // thời gian nằm trước hẳn
  const isValidTime =
    // thời gian không nằm giữa thời gian cần kiểm tra
    (!startFormat.isBetween(startTime, endTime, undefined, '[]') &&
      !endFormat.isBetween(startTime, endTime, undefined, '[]')) ||
    // sau hẳn
    (startFormat.isSameOrAfter(endTime) && endFormat.isAfter(endTime)) ||
    // trước hẳn
    (startFormat.isBefore(startTime) && endFormat.isSameOrBefore(startTime));

  // khác ngày của thời gian check hoặc !chủ nhật
  const isDayValid = isValidDay(startDate, momentInputStart);

  // kiểm tra giờ trong đúng khoảng thời gian
  const isValidHour =
    (startFormat.isSameOrAfter(moment('07:00', timeFormat)) &&
      startFormat.isSameOrBefore(moment('10:40', timeFormat))) ||
    (startFormat.isSameOrAfter(moment('13:00', timeFormat)) &&
      startFormat.isSameOrBefore(moment('16:40', timeFormat))) ||
    (endFormat.isSameOrAfter(moment('07:55', timeFormat)) &&
      endFormat.isSameOrBefore(moment('11:35', timeFormat))) ||
    (endFormat.isSameOrAfter(moment('13:55', timeFormat)) &&
      endFormat.isSameOrBefore(moment('17:35', timeFormat)));

  const isValidSession =
    (getStartTimeSlot(startFormat) <= 5 && getEndTimeSlot(endFormat)) <= 5 ||
    (getStartTimeSlot(startFormat) > 5 && getEndTimeSlot(endFormat)) > 5;

  // console.log(startFormat, endFormat, startTime, endTime, isValidTime);

  return (isValidTime || isDayValid) && isValidHour && isValidSession;
}

export function isValidDay(startDate, startDate2) {
  return (
    // not the same day
    !moment(startDate).isSame(moment(startDate2), 'day')
    // and not sunday
    // !moment(startDate).day() === 0
  );
}

export function isHoliday(date) {
  return holidays.some(holiday => holiday.date.isSame(moment(date), 'day'));
}

export function exDateHolidaysString() {
  var exDate = '';
  holidays.forEach(holiday => {
    if (exists(holiday.date)) {
      exDate += moment(holiday.date).format('YYYYMMDD') + ',';
      // YYYYMMDDTHHmmssZ
    }
  });
  return exDate;
}
