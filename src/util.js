import {DESCRIPTION_TEXT} from './const.js';
import dayjs from 'dayjs';

export const dateFormat = (date, temp) => dayjs(date).format(temp);

//случайное число
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

//случайный элемент массива
export const getRandomElementArr = (array) => array[getRandomInteger(0, array.length - 1)];

//перемешиваем массив
export const shuffleArray = (arr) => {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

const MILLISECOND_IN_HOUR = 3600000;
const MILLISECOND_IN_DAY = 86400000;
const MILLISECOND_IN_MINUT = 60000;

export const converDataAfterCompare = (dateA,dateB) => {
  const timeTo = dateFormat(dateA,'YYYY-MM-DDTHH:mm');
  const timeFrom = dateFormat(dateB,'YYYY-MM-DDTHH:mm');
  const compareTwoDates = dayjs(timeTo).diff(dayjs(timeFrom));

  const days = Math.floor(compareTwoDates / MILLISECOND_IN_DAY);
  const hours = Math.floor((compareTwoDates - days * MILLISECOND_IN_DAY)/ MILLISECOND_IN_HOUR);
  const minutes = Math.round((compareTwoDates - days * MILLISECOND_IN_DAY - hours * MILLISECOND_IN_HOUR)/ MILLISECOND_IN_MINUT);

  if (compareTwoDates < MILLISECOND_IN_HOUR){
    return `${minutes}M`;
  } else if (compareTwoDates > MILLISECOND_IN_HOUR && compareTwoDates < MILLISECOND_IN_DAY) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};


export const generateDescription = (SENTENCE_COUNT_MIN, SENTENCE_COUNT_MAX) => {
  const descriptionArr = [];
  const arrayOfDescriptionText = DESCRIPTION_TEXT.split('. ');
  const offerCount = getRandomInteger(SENTENCE_COUNT_MIN, SENTENCE_COUNT_MAX);

  for (let i = 0; i < offerCount; i++) {
    const randIndex = getRandomInteger(0, arrayOfDescriptionText.length - 1);
    descriptionArr.push(arrayOfDescriptionText[randIndex]);
  }
  return descriptionArr.join('. ');
};
