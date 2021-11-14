import SortBarView from '../view/sort.js';
import EventListWrapView from '../view/events-list-wrap.js';
import NoPointView from '../view/no-point.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point.js';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._eventListWrapComponent = new EventListWrapView();
    this._sortComponent = new SortBarView();
    this._capComponent = new NoPointView();
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции rendertrip в main.js

    this._renderTrip();
  }

  _renderNoPoint() {
    // Метод для рендеринга заглушки
    render(this._tripContainer, this._capComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderWrap() {
    // Метод для рендеринга контейнера для поинтов
    render(this._tripContainer, this._eventListWrapComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderPoint в main.js
    const pointPresenter = new PointPresenter(this._eventListWrapComponent);
    pointPresenter.init(point);
  }

  _renderPoints() {
    // Метод для рендеринга N-задач за раз
    for (let i = 0; i < this._tripPoints.length; i++) {
      this._renderPoint(this._tripPoints[i]);
    }
  }


  _renderTrip() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    if(this._tripPoints.length === 0) {
      this._renderNoPoint();
      return;
    }
    this._renderSort();
    this._renderWrap();
    this._renderPoints();
  }
}
