import {createElement} from '../util.js';
const createEventListWrap = () => '<ul class="trip-events__list"></ul>';

export default class EventListBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventListWrap();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
