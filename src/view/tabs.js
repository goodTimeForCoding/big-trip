import {createElement} from '../util.js';

const createNavTabsTemplate = () => `<nav class="trip-controls__trip-tabs  trip-tabs">
<a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
<a class="trip-tabs__btn" href="#">Stats</a>
</nav>`;

export default class SiteNavTab {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNavTabsTemplate();
  }

  getElement() {
    //проверка, если элемент есть то повторно создавать уже не будем
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
