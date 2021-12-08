import SortBarView from '../view/sort.js';
import EventListWrapView from '../view/events-list-wrap.js';
import NoPointView from '../view/no-point.js';
import PointNewPresenter from './point-new.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import PointPresenter from './point.js';
import { sortPriceUp, sortTimeUp, sortDateUp } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType, TRUE_FLAG } from '../const.js';
import { filter } from './../utils/filter.js';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, offersModel) {
    this._pointsModel = pointsModel;
    this._tripContainer = tripContainer;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._pointPresenter = {};//здесь хранятся все point презентеры
    this._offers = this._offersModel.getOffers();
    this._currentSortType = SortType.DAY;//сортировка по умолчанию


    this._sortComponent = null;


    this._eventListWrapComponent = new EventListWrapView();
    this._capComponent = new NoPointView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);//добавляем в подписчики
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._eventListWrapComponent, this._handleViewAction, this._offers);
  }

  init() {
    this._renderTrip();
  }

  _getPoints() { //метод для получения точек маршрута, он дёргает метод модели
    const activeFilter = this._filterModel.getActiveFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[activeFilter](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDateUp);
      case SortType.TIME:
        return filteredPoints.sort(sortTimeUp);
      case SortType.PRICE:
        return filteredPoints.sort(sortPriceUp);
      default:
        throw new Error('Unknown sort-type. Check SortType value');
    }
  }

  //перед созданием новой точки сбрасываем всё по ТЗ
  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _handleModeChange() {//вызываем у всех point презентеров resetVie() из point.js
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  //обработка действий на представлении, колбэк которая отдаётся вьюшкам
  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить, не нужен модели, получаем его из вьюшки, затем прогоняем через модель
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);//при клике будет вызываться метод модели который, с помощью метода notify наблюдателя будет вызывать подписчика, в данном случает _handleModelEvent
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
      default:
        throw new Error('Unknown action-type. Check UserAction value');
    }
  }

  //колбэк передаём в модель, данный колбек требует наблюдатель, модель будет дёргать именно его, когда нужно будет ей уведомить презентер о том, что что-то поменялось
  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        //обновит часть списка(например когда поменялось описание)
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        //обновит список (например когда задача ушла в архив)
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        //обновит всю доску(при переключении фильтра)
        this._clearTrip(TRUE_FLAG);
        this._renderTrip();
        break;
      default:
        throw new Error('Unknown update-type. Check UpdateType value');
    }
  }


  _handleSortTypeChange(sortType) { //функцию обработчик который навешивается на каждый из фильтров
    // 1 - Сортируем массив с точками маршрута
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    // 2 - Очищаем список который отрисован
    this._clearTrip();
    // 3 - Рендерим список заново по отсортированному массиву из первого шага
    this._renderTrip();
  }

  _renderNoPoint() {
    // Метод для рендеринга заглушки
    render(this._tripContainer, this._capComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent =  new SortBarView(this._currentSortType);
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
    const pointPresenter = new PointPresenter(this._eventListWrapComponent, this._handleViewAction, this._handleModeChange, this._offers);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter; //при каждом создании точки маршрута в объект this._pointPresenter записывается экземпляр(инстанс) pointPresenter класса, по ключу id, получаем в объекте весь список экземпляров pointPresenter
  }

  _renderPoints() {
    // Метод для рендеринга N-точек за раз
    this._getPoints().forEach((point) => this._renderPoint(point));
  }

  _clearTrip(resetSortType) {
    //метод для очистки списка точек маршрута из объекта this._pointPresenter, где сохранены все точки маршрута
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)//метод обхода значений объекта
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
    remove(this._sortComponent);
    remove(this._eventListWrapComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _getOffers() {
    this._offers = this._offersModel.getOffers();
  }

  _renderTrip() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    if (this._getPoints().length === 0) {
      this._renderNoPoint();
      return;
    }
    this._renderSort();
    this._renderWrap();
    this._renderPoints();
  }
}
