import {createNavTabsTemplate} from './view/tabs.js';
import {createFiltersTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createEventTemplate} from './view/event.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {generateWaypoint} from './mock/point-data.js';


const POINT_COUNT = 20;
const FIRST_EVENT_NUMBER = 1;
const EVENT_COUNT = 4;
const siteBodyElement = document.querySelector('.page-body');

const points = new Array(POINT_COUNT).fill().map(generateWaypoint);
console.log(points);
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripDetailsElement = document.querySelector('.trip-main');


const tripNavigationElement = tripDetailsElement.querySelector('.trip-controls__navigation');
render(tripNavigationElement, createNavTabsTemplate(), 'beforeend');

const tripFilterControlElement = tripDetailsElement.querySelector('.trip-controls__filters');
render(tripFilterControlElement, createFiltersTemplate(), 'beforeend');

const tripEventsElement = siteBodyElement.querySelector('.trip-events');
render(tripEventsElement, createSortTemplate(), 'beforeend');


const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');


render(tripEventsListElement, createEditPointTemplate(points[0]), 'beforeend');


for (let i = FIRST_EVENT_NUMBER; i < 15; i++ ) {
  render(tripEventsListElement, createEventTemplate(points[i]), 'beforeend');
}
