import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {DESCRIPTION_TEXT, TimeFormat} from '../const.js';
import {getRandomInteger} from './common.js';


export const dateFormat = (date, temp) => dayjs(date).format(temp);
dayjs.extend(duration);

export const pickDescriptionElementDependOnValue = (value, elements) => elements.find((element) => element.town === value);

export const pickOfferElementDependOnValue = (value, elements) => elements.find((element) => element.type === value).offers;

export const converDataAfterCompare = (dateA,dateB) => {
  const timeTo = dateFormat(dateA,'YYYY-MM-DDTHH:mm');
  const timeFrom = dateFormat(dateB,'YYYY-MM-DDTHH:mm');
  const compareDates = dayjs(timeTo).diff(dayjs(timeFrom));
  const days = Math.floor(compareDates / TimeFormat.MILLISECOND_IN_DAY);
  const hours = Math.floor((compareDates - days * TimeFormat.MILLISECOND_IN_DAY)/ TimeFormat.MILLISECOND_IN_HOUR);
  const minutes = Math.round((compareDates - days * TimeFormat.MILLISECOND_IN_DAY - hours * TimeFormat.MILLISECOND_IN_HOUR)/ TimeFormat.MILLISECOND_IN_MINUT);

  if (compareDates < TimeFormat.MILLISECOND_IN_HOUR){
    return `${minutes}M`;
  } else if (compareDates > TimeFormat.MILLISECOND_IN_HOUR && compareDates < TimeFormat.MILLISECOND_IN_DAY) {
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

// Функция помещает поинты без значений в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNull = (valueA, valueB) => {
  //значение отсутствует
  if (valueA === null && valueB === null) {
    return 0;
  }
  //B первее A
  if (valueA === null) {
    return 1;
  }
  //A первее B
  if (valueB === null) {
    return -1;
  }

  return null;
};


export const sortPriceUp = (pointA, pointB) => {
  const weight = getWeightForNull(pointA.basePrice, pointB.basePrice);

  if (weight !== null) {
    return weight;
  }

  return dayjs(pointB.basePrice).diff(dayjs(pointA.basePrice));
};


export const sortTimeUp = (pointA, pointB) => {
  const compareDatesPointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const compareDatesPointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  const weight = getWeightForNull(compareDatesPointA, compareDatesPointB);

  if (weight !== null) {
    return weight;
  }

  return compareDatesPointB - compareDatesPointA;
};

export const sortDateUp = (pointA, pointB) => {
  const startDatePointA = pointA.dateFrom;
  const startDatePointB = pointB.dateFrom;

  const sortWeightForEmptyValue = getWeightForNull(startDatePointA, startDatePointB);

  if (sortWeightForEmptyValue !== null) {
    return sortWeightForEmptyValue;
  }

  return dayjs(startDatePointA).diff(startDatePointB);
};

export const isDateTheSame = (dateA, dateB) => (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'm');
export const isDateExpired = (date) => dayjs().isAfter(date, 'm');
export const isDateInFuture = (date) => dayjs().isBefore(date, 'm');
export const isDateCurrent = (date) => dayjs().isSame(date, 'm');
export const isEventContinues = (dateFrom, dateTo) => isDateExpired(dateFrom) && isDateInFuture(dateTo);


export const pickElementDependOnValue = (value, elements, descriptionFlag) => {
  if (descriptionFlag) {
    return elements.find((element) => element.name === value);
  }
  return elements.find((element) => element.type === value).offers;
};

export const compareTwoDates = (dateA, dateB) => {
  if (dateA === null || dateB === null) {
    return null;
  }
  return dayjs(dateA).diff(dateB);
};

export const humanizeDateDuration = (compareDates) => {
  const days = Math.floor(compareDates / TimeFormat.MILLISECOND_IN_DAY);
  const hours = Math.floor((compareDates - days * TimeFormat.MILLISECOND_IN_DAY)/ TimeFormat.MILLISECOND_IN_HOUR);
  const minutes = Math.round((compareDates - days * TimeFormat.MILLISECOND_IN_DAY - hours * TimeFormat.MILLISECOND_IN_HOUR)/ TimeFormat.MILLISECOND_IN_MINUT);

  if (compareDates < TimeFormat.MILLISECOND_IN_HOUR){
    return `${minutes}M`;
  } else if (compareDates > TimeFormat.MILLISECOND_IN_HOUR && compareDates < TimeFormat.MILLISECOND_IN_DAY) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};
