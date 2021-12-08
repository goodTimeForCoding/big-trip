import FiltersView  from './../view/filter.js';
import { remove, render, replace, RenderPosition } from './../utils/render.js';
import { FilterType, UpdateType } from './../const.js';


export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);

    this._filterModel.addObserver(this._onModelEvent);
    this._pointsModel.addObserver(this._onModelEvent);
  }


  init() {
    const filterData = this._getFilterData();
    const previousFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(filterData, this._filterModel.getActiveFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);


    if (previousFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  }


  _getFilterData() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: FilterType.EVERYTHING,
      },
      {
        type: FilterType.FUTURE,
        name: FilterType.FUTURE,
      },
      {
        type: FilterType.PAST,
        name: FilterType.PAST,
      },
    ];
  }

  _onModelEvent() {
    this.init();
  }


  _onFilterTypeChange(filterType) {
    if (this._filterModel.getActiveFilter() === filterType) {
      return;
    }
    this._filterModel.setActiveFilter(UpdateType.MAJOR, filterType);
  }
}
