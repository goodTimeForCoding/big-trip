import NavigationView from './view/tabs.js';
import { render, RenderPosition } from './utils/render.js';
import { POINT_COUNT } from './const.js';
import { generateWaypoint } from './mock/point-data.js';
import { generateRandomOffers } from './mock/point-data.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';


const siteBodyElement = document.querySelector('.page-body');
const tripDetailsElement = document.querySelector('.trip-main');
const tripNavigationElement = tripDetailsElement.querySelector('.trip-controls__navigation');
const tripFilterControlElement = tripDetailsElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteBodyElement.querySelector('.trip-events');

const offersModel = new OffersModel();
const randomOffersData = generateRandomOffers();
offersModel.setOffers(randomOffersData);
export const allTypeOffers = offersModel.getOffers();

const points = new Array(POINT_COUNT).fill().map(generateWaypoint);
console.log(points);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);//записываем в модель данные

const filterModel = new FilterModel();


const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, offersModel);//экземпляр модели передаём в презентер(2 - ой параметр)
const filterPresenter = new FilterPresenter(tripFilterControlElement, filterModel, pointsModel);


render(tripNavigationElement, new NavigationView(), RenderPosition.BEFOREEND);
tripPresenter.init();
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
