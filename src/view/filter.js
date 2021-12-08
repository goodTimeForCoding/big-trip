import SmartView from './smart.js';

const createFilterItemTemplate = (filterData, currentFilterType) => filterData.map(({ type, name}) => `<div class="trip-filters__filter">
     <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''}>
     <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`).join('');

const createFiltersTemplate = (filterData, currentFilterType) => `<form class="trip-filters" action="#" method="get">
${createFilterItemTemplate(filterData, currentFilterType)}
<button class="visually-hidden" type="submit">Accept filter</button>
</form>`;


export default class SiteFilters extends SmartView {
  constructor(filterData, currentFilterType) {
    super();
    this._filterData = filterData;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filterData, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
