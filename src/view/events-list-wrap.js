import SmartView from './smart.js';

const createEventListWrap = () => '<ul class="trip-events__list"></ul>';

export default class EventListBoard extends SmartView {
  getTemplate() {
    return createEventListWrap();
  }
}
