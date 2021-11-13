import NavigationView from './view/tabs.js';
import FiltersView from './view/filter.js';
import SortBarView from './view/sort.js';
import EventListWrapView from './view/events-list-wrap.js';
import EditTripPointView from './view/point-editor.js';
import TripPointView from './view/event.js';
import NoPointView from './view/no-point.js';
import {render, RenderPosition, replace} from './utils/render.js';
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
    //синтаксис: .replaceChild(newChild, oldChild);
    replace(pointComponent, pointEditorComponent);
  };

  const changeViewToEdit = () => {
    replace(pointEditorComponent, pointComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      changeViewToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setRollupBtnClickHandler(() => {
    changeViewToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditorComponent.setRollupBtnClickHandler(() => {
    changeViewToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditorComponent.setSaveClickHandler(() => {
    changeViewToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointListElement, pointComponent,RenderPosition.BEFOREEND);
};

const renderBoard = (pointData) => {
  const eventListWrapComponent = new EventListWrapView();
  const capComponent = new NoPointView();

  if(pointData.length === 0) {
    render(tripEventsElement, capComponent,RenderPosition.BEFOREEND);
    return;
  }
  render(tripEventsElement, new SortBarView(), RenderPosition.BEFOREEND);
  render(tripEventsElement, eventListWrapComponent.getElement(), RenderPosition.BEFOREEND);
  for (let i = 0; i < pointData.length; i++) {
    renderPoint(eventListWrapComponent.getElement(), pointData[i]);
  }
};

render(tripNavigationElement, new NavigationView(), RenderPosition.BEFOREEND);

render(tripFilterControlElement, new FiltersView(), RenderPosition.BEFOREEND);

renderBoard(points);
