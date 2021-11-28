import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomElementArr, getRandomInteger, shuffleArray}  from '../utils/common.js';
import {generateDescription}  from '../utils/point.js';
import {TYPES, TOWNS, OFFERS, BasePrice, Gap, Period, SentenceCount} from '../const.js';

/*offers*/
//формируем объект с произвольными опциями
const createOfferGenerator = (type) => {
  const startElement = 1;
  const endElment = getRandomInteger(1, 6);
  return {
    type,
    offers: shuffleArray(OFFERS).slice(startElement, endElment),
  };
};
//формируем массив объектов с типом и соответствующим ему опциями
const generateRandomOffers = (types) => types.map((type) => createOfferGenerator(type));

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
const generateRandomDescriptions = (towns) => towns.map((town) => createDestinationGenerator(town));


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

export const destinations = generateRandomDescriptions(TOWNS);
export const offers = generateRandomOffers(TYPES);
export const generateWaypoint = () => {
  const type = getRandomElementArr(TYPES);
  const dateInterval = dataGenerator();
  return {
    id: nanoid(),
    type, //тип точки маршрута
    basePrice: getRandomInteger(BasePrice.MIN, BasePrice.MAX),
    isFavorite: Boolean(getRandomInteger()),
    dateFrom: dateInterval.dateFrom,
    dateTo: dateInterval.dateTo,
    offers: offers.find((item) => item.type === type).offers,//находим доп опции(offers) соответствующее текущему сформированному типу точки маршрута(type)
    destination: destinations[getRandomInteger(0,TOWNS.length-1)],
  };
};
