import EditTripPointView from '../view/point-editor.js';
import TripPointView from '../view/event.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import { isDateTheSame, pickOfferElementDependOnValue } from '../utils/point.js';


const Mode = { //ключ определяющий состояние поинтов
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointListWrap, changeData, changeMode, offers) {//параметры получаем извне, то есть при создании класса
    this._pointListWrap = pointListWrap;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offers = offers;

    this._pointComponent = null;
    this._pointEditorComponent = null;
    this._mode = Mode.DEFAULT;//по умолчанию в режиме просто точка маршрута

    this._rolldownBtnClickHandler = this._rolldownBtnClickHandler.bind(this);
    this._saveClickHandler = this._saveClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(point) {
    this._point = point;

    //предыдущие компоненты
    const previousPointComponent = this._pointComponent;
    const previousPointEditorComponent = this._pointEditorComponent;

    this._pointComponent = new TripPointView(point);
    this._pointEditorComponent = new EditTripPointView(this._offers, point, 'edit_mode');

    this._pointComponent.setRolldownBtnClickHandler(this._rolldownBtnClickHandler);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditorComponent.setRollupBtnClickHandler(this._rollupBtnClickHandler);
    this._pointEditorComponent.setSaveClickHandler(this._saveClickHandler);
    this._pointEditorComponent.setDeleteClickHandler(this._deleteClickHandler);


    if (previousPointComponent === null || previousPointEditorComponent === null) {
      render(this._pointListWrap, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }
    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, previousPointComponent); //предыдущий компонент меняется на новый
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditorComponent, previousPointEditorComponent);
    }

    //предыдущие компоненты удаляются
    remove(previousPointComponent);
    remove(previousPointEditorComponent);
  }

  getOffers(point, offers) {
    pickOfferElementDependOnValue(point, offers);
  }

  //метод по удалению компоненты
  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditorComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._changeViewToPoint();
    }
  }


  _changeViewToEdit() {
    replace(this._pointEditorComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();//метод скроет все формы редактирования кроме текущей, вызываем из trip.js _handleModeChange()
    this._mode = Mode.EDITING;
  }

  _changeViewToPoint() {
    replace(this._pointComponent, this._pointEditorComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._changeViewToPoint();
      this._pointEditorComponent.reset(this._point);
    }
  }

  _rolldownBtnClickHandler() {
    this._changeViewToEdit();
    this._pointEditorComponent.reset(this._point);
  }

  //колбэк (ф-ция обработчик события)
  _saveClickHandler(point) {
    this._changeViewToPoint();

    const isMinorUpdate = (!isDateTheSame(this._point.dateFrom, point.dateFrom) ||
      !isDateTheSame(this._point.dateTo, point.dateTo) ||
      !(this._point.basePrice === point.basePrice));

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  }

  _rollupBtnClickHandler() {
    this._changeViewToPoint();
  }

  //метод на каждый клик по Favorite создаёт новый объект, в которую копируем все поля объекта поинт кроме isFavorite, для неё отдельная логика(ф-ция обработчик события)
  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,//меняем на true или false при клике
        },
      ),
    );
  }

  _deleteClickHandler(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
