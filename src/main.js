import {createTripInfoTemplate} from './view/route.js';
import {createCostTemplate} from './view/cost.js';
import {createNavTabsTemplate} from './view/tabs.js';
import {createFiltersTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createEventTemplate} from './view/event.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointsTemplate} from './view/create-point.js';

const EVENT_COUNT = 3;
const siteBodyElement = document.querySelector('.page-body');


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
render(tripDetailsElement, createTripInfoTemplate(), 'afterbegin');

const tripInfoElement = tripDetailsElement.querySelector('.trip-info');
render(tripInfoElement, createCostTemplate(), 'beforeend');


const tripNavigationElement = tripDetailsElement.querySelector('.trip-controls__navigation');
render(tripNavigationElement, createNavTabsTemplate(), 'beforeend');

const tripFilterControlElement = tripDetailsElement.querySelector('.trip-controls__filters');
render(tripFilterControlElement, createFiltersTemplate(), 'beforeend');

const tripEventsElement = siteBodyElement.querySelector('.trip-events');
render(tripEventsElement, createSortTemplate(), 'beforeend');


const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripEventsListElement, createEditPointTemplate(), 'beforeend');
render(tripEventsListElement, createPointsTemplate(), 'beforeend');

for (let i = 0; i < EVENT_COUNT; i++ ) {
  render(tripEventsListElement, createEventTemplate(), 'beforeend');
}