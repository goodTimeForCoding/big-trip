import EditTripPointView from '../view/point-editor.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class PointNew {
  constructor(pointListWrap, changeData, offers) {//параметры получаем извне, то есть при создании класса
    this._pointListWrap = pointListWrap;
    this._changeData = changeData;
    this._offers = offers;


    this._pointEditorComponent = null;

    this._saveClickHandler = this._saveClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init() {
    if (this._pointEditorComponent !== null) {
      return;
    }

    this._pointEditorComponent = new EditTripPointView(this._offers);

    this._pointEditorComponent.setSaveClickHandler(this._saveClickHandler);
    this._pointEditorComponent.setDeleteClickHandler(this._deleteClickHandler);
    render(this._pointListWrap, this._pointEditorComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  //метод по удалению компоненты
  destroy() {
    if (this._pointEditorComponent === null) {
      return;
    }
    remove(this._pointEditorComponent);
    this._pointEditorComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }


  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }


  //колбэк (ф-ция обработчик события)
  _saveClickHandler(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({ id: nanoid() }, point),
    );
    this.destroy();
  }


  _deleteClickHandler() {
    this.destroy();
  }
}
