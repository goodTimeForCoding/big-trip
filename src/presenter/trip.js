import SortBarView from '../view/sort.js';
import EventListWrapView from '../view/events-list-wrap.js';
import NoPointView from '../view/no-point.js';
import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import PointPresenter from './point.js';
import {sortPriceUp, sortTimeUp} from '../utils/point.js';
import {SortType} from '../const.js';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};//здесь хранятся все point презентеры
    this.currentSortType = SortType.DAY;//сортировка по умолчанию

    this._eventListWrapComponent = new EventListWrapView();
    this._sortComponent = new SortBarView();
    this._capComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripPoints) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции rendertrip в main.js
    this._tripPoints = tripPoints.slice();

    //сохраняем исходный порядок моков для сортировки по умолчанию
    this._sourcedTripPoints = tripPoints.slice();

    this._renderTrip();
  }

  _handleModeChange() {//вызываем у всех point презентеров resetVie() из point.js
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  //updatedPoint изменённый пользователем объект point, т.е. метод получит обновленный объект описывающий точку маршрута, например занесли точку маршрута в избранное
  _handlePointChange(updatedPoint) {
    // console.log(this._tripPoints.find((prevPoint) => prevPoint.id === updatedPoint.id));//достаём из this._tripPoints, где хранятся все точки маршрута, задачу с id - шником по которой кликнем, увидим какой она была до клика, далее после клика обновляются моки, ф-ция ниже
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);//вызываем утилитарную функцию updateItem которая изменит моки
    // console.log(updatedPoint);//изменённое свойство
    this._sourcedTripPoints = updateItem(this._sourcedTripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);//вызывает init у существующего this._pointPresenter, так как берём по старому id, но с обновлённым объектом задачи
  }

  _sortPoints(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.TIME:
        this._tripPoints.sort(sortTimeUp);
        break;
      case SortType.PRICE:
        this._tripPoints.sort(sortPriceUp);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._tripPoints = this._sourcedTripPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) { //функцию обработчик который навешивается на каждый из фильтров
    // 1 - Сортируем массив с точками маршрута
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    // 2 - Очищаем список который отрисован
    this._clearPointList();
    // 3 - Рендерим список заново по отсортированному массиву из первого шага
    this._renderPoints();
  }

  _renderNoPoint() {
    // Метод для рендеринга заглушки
    render(this._tripContainer, this._capComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderWrap() {
    // Метод для рендеринга контейнера для поинтов
    render(this._tripContainer, this._eventListWrapComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderPoint в main.js
    const pointPresenter = new PointPresenter(this._eventListWrapComponent, this._handlePointChange, this._handleModeChange); //this._handlePointChange передаём вторым параметром
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter; //при каждом создании точки маршрута в объект this._pointPresenter записывается экземпляр(инстанс) pointPresenter класса, по ключу id, получаем в объекте весь список экземпляров pointPresenter
  }

  _renderPoints() {
    // Метод для рендеринга N-точек за раз
    for (let i = 0; i < this._tripPoints.length; i++) {
      this._renderPoint(this._tripPoints[i]);
    }
  }

  _clearPointList() {
    //метод для очистки списка точек маршрута из объекта this._pointPresenter, где сохранены все точки маршрута
    Object
      .values(this._pointPresenter)//метод обхода значений объекта
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
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
