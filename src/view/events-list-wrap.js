import AbstractView from './abstract.js';

const createEventListWrap = () => '<ul class="trip-events__list"></ul>';

export default class EventListBoard extends AbstractView {
  getTemplate() {
    return createEventListWrap();
  }
}
