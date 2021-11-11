import {DESCRIPTION_TEXT, TimeFormat} from './const.js';
import dayjs from 'dayjs';

export const dateFormat = (date, temp) => dayjs(date).format(temp);

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

//вставляет DOM элемент в определённую позицию в разметке
//prepend - помещает элемент вначало внутри контейнера
//append - помещает элемент вконец внутри контейнера
export const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};


// 1. создаём пустой div-блок
// 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
// 3. возвращаем этот DOM-элемент
export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2
  return newElement.firstElementChild; // 3
};

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
