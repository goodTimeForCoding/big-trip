import {DESCRIPTION_TEXT} from './const.js';
import dayjs from 'dayjs';
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

const MILLISECONDS_IN_HOUR = 3600000;
const MILLISECONDS_IN_DAY = 86400000;

export const converDataAfterCompare = (dateA,dateB) => {
  const compareTwoDates = dayjs(dateA).diff(dateB);
  if (compareTwoDates < MILLISECONDS_IN_HOUR){
    return dayjs(compareTwoDates, 'SSS').format('m[M]');
  } else if (compareTwoDates < MILLISECONDS_IN_DAY){
    return dayjs(compareTwoDates, 'SSS').format('H[H] m[M]');
  }
  return dayjs(compareTwoDates, 'SSS').format('D[D] H[H] m[M]');
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
export const dateFormat = (date, temp) => dayjs(date).format(temp);
