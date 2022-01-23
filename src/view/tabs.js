import AbstractView from './abstract.js';
import { MenuItem, Tag } from '../const.js';


const createNavTabsTemplate = () => `<nav class="trip-controls__trip-tabs  trip-tabs">
<a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
<a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
</nav>`;

export default class SiteMenu extends AbstractView {
  constructor() {
    super();
    this._previousClickValue = MenuItem.TABLE;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createNavTabsTemplate();
  }

  setMenuListener(callback) {
    this._callback.menuItemClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }


  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== Tag.A) {
      return;
    }
    if (evt.target.dataset.menuItem === this._previousClickValue) {
      return;
    }
    this._callback.menuItemClick(evt.target.dataset.menuItem);
    this._previousClickValue = evt.target.dataset.menuItem;
    this._changeActiveItem();
  }


  _changeActiveItem() {
    const tableItem = this.getElement().querySelector(`[data-menu-item=${MenuItem.TABLE}]`);
    const statsItem = this.getElement().querySelector(`[data-menu-item=${MenuItem.STATS}]`);
    if (tableItem !== null && statsItem !== null) {
      tableItem.classList.toggle('trip-tabs__btn--active');
      statsItem.classList.toggle('trip-tabs__btn--active');
    }
  }
}
