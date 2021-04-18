import allHolidays from './holidays.json';
import moment from 'moment';

export const holidays = allHolidays.map(holiday => {
  console.log(holiday);
  return Object.freeze({
    name: holiday.name_local,
    date: moment(holiday?.date),
  });
});

export const breakTime = { from: '11:35sa', to: '13:00ch' };
