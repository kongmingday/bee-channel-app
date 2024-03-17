import numberal from 'numeral';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export const isEmail = (value: string) => {
  const regex = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  return regex.test(value);
};

export const convertNumber = (value?: string) => {
  return value ? numberal(value).format('0a') : 0;
};

export const calculateDuration = (targetTime?: string) => {
  if (!targetTime) {
    return 'just now';
  }
  dayjs.extend(relativeTime);
  return dayjs(targetTime).fromNow();
};
