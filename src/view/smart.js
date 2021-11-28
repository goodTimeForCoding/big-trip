import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._state = {};
  }

  updateElement() {
    const previousElement = this.getElement();
    const parentElement = previousElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parentElement.replaceChild(newElement, previousElement);
    this.restoreHandlers();//добавляем обработчики перерисованному DOM элементу
  }

  updateData(update) {
    if (!update) {
      return;
    }
    this._pointState = Object.assign(
      {},
      this._pointState,
      update,
    );
    this.updateElement();
  }

  restoreListeners() {
    throw new Error('Abstract method not implemented: restoreListeners');
  }
}
