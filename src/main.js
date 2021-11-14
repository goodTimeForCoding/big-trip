import NavigationView from './view/tabs.js';
import FiltersView from './view/filter.js';
import {render, RenderPosition} from './utils/render.js';
import {POINT_COUNT} from './const.js';
import {generateWaypoint} from './mock/point-data.js';
import TripPresenter from './presenter/trip.js';

const points = new Array(POINT_COUNT).fill().map(generateWaypoint);
console.log(points);

const siteBodyElement = document.querySelector('.page-body');
const tripDetailsElement = document.querySelector('.trip-main');
const tripNavigationElement = tripDetailsElement.querySelector('.trip-controls__navigation');
const tripFilterControlElement = tripDetailsElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteBodyElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripEventsElement);

render(tripNavigationElement, new NavigationView(), RenderPosition.BEFOREEND);

render(tripFilterControlElement, new FiltersView(), RenderPosition.BEFOREEND);

tripPresenter.init(points);
