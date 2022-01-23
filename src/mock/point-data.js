import dayjs from 'dayjs';
import { allTypeOffers } from './../main.js';
import {nanoid} from 'nanoid';
import {getRandomElementArr, getRandomInteger, shuffleArray}  from '../utils/common.js';
import {generateDescription, pickOfferElementDependOnValue}  from '../utils/point.js';
import {types, towns, offers, BasePrice, Gap, Period, SentenceCount} from '../const.js';

/*offers*/
//формируем объект с произвольными опциями
const createOfferGenerator = (type) => {
  const startElement = 1;
  const endElment = getRandomInteger(1, 6);
  return {
    type,
    offers: shuffleArray(offers).slice(startElement, endElment),
  };
};
//формируем массив объектов с типом и соответствующим ему опциями
export const generateRandomOffers = () => types.map((type) => createOfferGenerator(type));

/*destination*/
//генерируем изображения
const generatePicture = () => ({
  src: `img/photos/${  getRandomInteger(1, 5)  }.jpg`,
  alt: generateDescription(),
});
//формируем объект с произвольным описанием
const createDestinationGenerator = (town) => ({
  description: generateDescription(SentenceCount.MIN_SENTECES, SentenceCount.MAX_SENTECES),
  town,
  picture: new Array(getRandomInteger(Gap.MIN, Gap.MAX)).fill(null).map(generatePicture),
});
//формируем описание для каждого города, и заносим в новый массив
const generateRandomDescriptions = (items) => items.map((town) => createDestinationGenerator(town));


/*Формируем дату начала и окончания маршрута*/
const createDateGenerator = () => {
  let startDate = dayjs().add(getRandomInteger(Period.START_DATE_MIN, Period.START_DATE_MAX), 'd');
  return () => {
    const dateFrom = dayjs(startDate).add(getRandomInteger(Period.DATE_FROM_MIN, Period.DATE_FROM_MAX), 'm').toDate();
    const dateTo = dayjs(dateFrom).add(getRandomInteger(Period.DATE_TO_MIN, Period.DATE_TO_MAX), 'm').toDate();
    startDate = dateTo;
    return {
      dateFrom,
      dateTo,
    };
  };
};
const dataGenerator = createDateGenerator();

export const destinations = generateRandomDescriptions(towns);
export const generateWaypoint = () => {
  const type = getRandomElementArr(types);
  const dateInterval = dataGenerator();
  return {
    id: nanoid(),
    type, //тип точки маршрута
    basePrice: getRandomInteger(BasePrice.MIN, BasePrice.MAX),
    isFavorite: Boolean(getRandomInteger()),
    dateFrom: dateInterval.dateFrom,
    dateTo: dateInterval.dateTo,
    offers: pickOfferElementDependOnValue(type, allTypeOffers),
    destination: destinations[getRandomInteger(0,towns.length-1)],
  };
};
