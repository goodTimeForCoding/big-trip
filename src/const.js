export const POINT_COUNT = 20;

export const DESCRIPTION_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';

export const TYPES = [
  'taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant',
];

export const TOWNS = ['Amsterdam', 'Geneva', 'Chamonix', 'Havana', 'New York'];


export const OFFERS = [
  {
    title: 'Rent a car',
    price: 200,
  },
  {
    title: 'Add luggage',
    price: 30,
  },
  {
    title: 'Switch to comfort',
    price: 100,
  },
  {
    title: 'Order Uber',
    price: 20,
  },
  {
    title: 'Add breakfast',
    price: 50,
  },
  {
    title: 'Add meal',
    price: 15,
  },
  {
    title: 'Choose seats',
    price: 5,
  },
  {
    title: 'Travel by train',
    price: 40,
  },
];


export const BasePrice = {
  MIN: 20,
  MAX: 1400,
};

export const Gap = {
  MIN: 0,
  MAX: 5,
};


export const SentenceCount = {
  MIN_SENTECES: 0,
  MAX_SENTECES: 5,
};


export const Period = {
  START_DATE_MIN: -7,
  START_DATE_MAX: -1,
  DATE_FROM_MIN: 60,
  DATE_FROM_MAX: 120,
  DATE_TO_MIN: 30,
  DATE_TO_MAX: 1500,
};


export const TimeFormat = {
  MILLISECOND_IN_HOUR: 3600000,
  MILLISECOND_IN_DAY: 86400000,
  MILLISECOND_IN_MINUT: 60000,
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
