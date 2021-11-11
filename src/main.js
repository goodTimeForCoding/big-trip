import NavigationView from './view/tabs.js';
import FiltersView from './view/filter.js';
import SortBarView from './view/sort.js';
import EventListWrapView from './view/events-list-wrap.js';
import EditTripPointView from './view/point-editor.js';
import TripPointView from './view/event.js';
import NoPointView from './view/no-point.js';
import {render, RenderPosition} from './util.js';
import {POINT_COUNT} from './const.js';
import {generateWaypoint} from './mock/point-data.js';


const siteBodyElement = document.querySelector('.page-body');

const points = new Array(POINT_COUNT).fill().map(generateWaypoint);
console.log(points);

const tripDetailsElement = document.querySelector('.trip-main');
const tripNavigationElement = tripDetailsElement.querySelector('.trip-controls__navigation');
const tripFilterControlElement = tripDetailsElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteBodyElement.querySelector('.trip-events');


const renderPoint = (pointListElement, pointData) => {
  const pointEditorComponent = new EditTripPointView(pointData);
  const pointComponent = new TripPointView(pointData);

  const changeViewToPoint = () => {
    //синтаксис .replaceChild(newChild, oldChild);
    pointListElement.replaceChild(pointComponent.getElement(), pointEditorComponent.getElement());
  };

  const changeViewToEdit = () => {
    pointListElement.replaceChild(pointEditorComponent.getElement(), pointComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      changeViewToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    changeViewToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditorComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click',() => {
    changeViewToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditorComponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    changeViewToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointListElement, pointComponent.getElement(),RenderPosition.BEFOREEND);
};

const renderBoard = (pointData) => {
  const eventListWrapComponent = new EventListWrapView();
  const capComponent = new NoPointView();

  if(pointData.length === 0) {
    render(tripEventsElement, capComponent.getElement(),RenderPosition.BEFOREEND);
    return;
  }
  render(tripEventsElement, new SortBarView().getElement(), RenderPosition.BEFOREEND);
  render(tripEventsElement, eventListWrapComponent.getElement(), RenderPosition.BEFOREEND);
  for (let i = 0; i < pointData.length; i++) {
    renderPoint(eventListWrapComponent.getElement(), pointData[i]);
  }
};

render(tripNavigationElement, new NavigationView().getElement(), RenderPosition.BEFOREEND);

render(tripFilterControlElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

renderBoard(points);
