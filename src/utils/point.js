import dayjs from 'dayjs';
import {DESCRIPTION_TEXT, TimeFormat} from '../const.js';
import {getRandomInteger} from './common.js';
export const dateFormat = (date, temp) => dayjs(date).format(temp);

//перевод времени в различные форматы
export const converDataAfterCompare = (dateA,dateB) => {
  const timeTo = dateFormat(dateA,'YYYY-MM-DDTHH:mm');
  const timeFrom = dateFormat(dateB,'YYYY-MM-DDTHH:mm');
  const compareTwoDates = dayjs(timeTo).diff(dayjs(timeFrom));

  const days = Math.floor(compareTwoDates / TimeFormat.MILLISECOND_IN_DAY);
  const hours = Math.floor((compareTwoDates - days * TimeFormat.MILLISECOND_IN_DAY)/ TimeFormat.MILLISECOND_IN_HOUR);
  const minutes = Math.round((compareTwoDates - days * TimeFormat.MILLISECOND_IN_DAY - hours * TimeFormat.MILLISECOND_IN_HOUR)/ TimeFormat.MILLISECOND_IN_MINUT);

  if (compareTwoDates < TimeFormat.MILLISECOND_IN_HOUR){
    return `${minutes}M`;
  } else if (compareTwoDates > TimeFormat.MILLISECOND_IN_HOUR && compareTwoDates < TimeFormat.MILLISECOND_IN_DAY) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};


export const generateDescription = (countMin = 1, countMax = 1) => {
  const descriptionArr = [];
  const arrayOfDescriptionText = DESCRIPTION_TEXT.split('. ');
  const offerCount = getRandomInteger(countMin, countMax);

  for (let i = 0; i < offerCount; i++) {
    const randIndex = getRandomInteger(0, arrayOfDescriptionText.length - 1);
    descriptionArr.push(arrayOfDescriptionText[randIndex]);
  }
  return descriptionArr.join('. ');
};
