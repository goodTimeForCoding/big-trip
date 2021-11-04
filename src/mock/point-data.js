import dayjs from 'dayjs';
import { getRandomElementArr, getRandomInteger, shuffleArray,  generateDescription}  from '../util.js';
import { TYPES, TOWNS, OFFERS, BasePrice, GAP, Period, MAX_SENTECES, MIN_SENTECES} from '../const.js';


const generatePicture = () => ({
  src: `../../public/img/photos/${  getRandomInteger(1, 5)  }.jpg`,
  alt: generateDescription(1,1),
});


//формируем объект с произвольным описанием
const createDestinationGenerator = (town) => ({
  description: generateDescription(MIN_SENTECES, MAX_SENTECES),
  town,
  picture: new Array(getRandomInteger(GAP.MIN, GAP.MAX)).fill(null).map(generatePicture),
});

//формируем
const generateRandomDescriptions = (towns) => towns.map((town) => createDestinationGenerator(town));


const createDateGenerator = () => {
  let startDate = dayjs().add(getRandomInteger(Period.START_DATE_MIN, Period.START_DATE_MAX), 'd');
  return () => {
    const dateFrom = dayjs(startDate).add(getRandomInteger(Period.DATE_FROM_MIN, Period.DATE_FROM_MAX), 'm').toDate();
    const dateTo = dayjs(dateFrom).add(getRandomInteger(Period.DATE_TO_MIN, Period.DATE_TO_MAX), 'm').toDate();
    startDate = dateTo; /*не уверен что нужно*/
    return {
      dateFrom,
      dateTo,
    };
  };
};
const dataGenerator = createDateGenerator();


//формируем объект с произвольными опциями
const createOfferGenerator = (type) => {
  const START_ELEMENT = 1;
  const END_ELEMENT = getRandomInteger(1, 6);
  return {
    type,
    offers: shuffleArray(OFFERS).slice(START_ELEMENT, END_ELEMENT),
  };
};

//формируем массив объектов с типом и соответствующим ему опциями
const generateRandomOffers = (types) => types.map((type) => createOfferGenerator(type));


export const generateWaypoint = () => {
  const type = getRandomElementArr(TYPES);
  const offers = generateRandomOffers(TYPES);
  const dateInterval = dataGenerator();
  const destinations = generateRandomDescriptions(TOWNS);
  return {
    type, //тип точки маршрута
    basePrice: getRandomInteger(BasePrice.MIN, BasePrice.MAX),
    isFavorite: Boolean(getRandomInteger()),
    dateFrom: dateInterval.dateFrom,
    dateTo: dateInterval.dateTo,
    offers: offers.find((item) => item.type === type).offers,//находим доп опции(offers) соответствующее текущему сформированному типу точки маршрута(type)
    destination: destinations[getRandomInteger(0,TOWNS.length-1)],
  };
};
