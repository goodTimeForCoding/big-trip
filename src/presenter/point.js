import EditTripPointView from '../view/point-editor.js';
import TripPointView from '../view/event.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class Point {
  constructor(pointListWrap) {
    this._pointListWrap = pointListWrap;

    this._pointComponent = null;
    this._pointEditorComponent = null;

    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._saveClickHandler = this._saveClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new TripPointView(point);
    this._pointEditorComponent = new EditTripPointView(point);

    this._pointComponent.setRollupBtnClickHandler(this._rollupBtnClickHandler);
    this._pointEditorComponent.setRollupBtnClickHandler(this._saveClickHandler);
    this._pointEditorComponent.setSaveClickHandler(this._saveClickHandler);

    render(this._pointListWrap,  this._pointComponent, RenderPosition.BEFOREEND);
  }

  _changeViewToEdit() {
    replace(this._pointEditorComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _changeViewToPoint() {
    replace(this._pointComponent, this._pointEditorComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._changeViewToPoint();
    }
  }

  _rollupBtnClickHandler() {
    this._changeViewToEdit();
  }

  _saveClickHandler() {
    this._changeViewToPoint();
  }
}
