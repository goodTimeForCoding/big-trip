import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { TYPES, TOWNS, Index, TRUE_FLAG, FlagMode } from '../const.js';
import { getRandomElementArr } from '.././utils/common.js';
import { dateFormat, pickDescriptionElementDependOnValue, pickOfferElementDependOnValue, pickElementDependOnValue } from '.././utils/point.js';
import { destinations } from './../mock/point-data.js';
import dayjs from 'dayjs';


const ValidityMessage = {
  DESTINATION: 'Выберите направление',
  PRICE: 'Введите стоимость',
};

const BLANK_POINT = {
  type: getRandomElementArr(TYPES),
  offers: [],
  destination: {
    town: getRandomElementArr(TOWNS),
    description: '',
    picture: [],
  },
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  basePrice: '',
};

const createPicturesTemp = (picturesArr) => picturesArr.map((picture) => ` <img class="event__photo" src="${picture.src}" alt="${picture.alt}">`).join('');


const createDestinationTemp = (destination) => {
  if (destination.description.length !== 0 && destination.picture.length !== 0) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
    <div class="event__photos-tape">
    ${createPicturesTemp(destination.picture)}
    </div>
  </div>
  </section>`;
  } else if (destination.description.length !== 0 && destination.picture.length === 0) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
  </section>`;
  } else if (destination.description.length === 0 && destination.picture.length !== 0) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <div class="event__photos-container">
    <div class="event__photos-tape">
    ${createPicturesTemp(destination.picture)}
    </div>
  </div>
  </section>`;
  }
  return '';
};


const createEventTypeItemTemplate = (availableTypes) => availableTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');

const createTownsTemplate = (TOWNS) => TOWNS.map((city) => `<option value="${city}">`).join('');


const createOfferTemp = (type, offers, allTypeOffers) => {
  const availableOffers = pickElementDependOnValue(type, allTypeOffers);
  return `<section class="event__section  event__section--offers">
  ${availableOffers.length > 0 ?
    `<h3 class="event__section-title  event__section-title--offers"> Offers</h3> <div class="event__available-offers">
${availableOffers.map(({ title, price }) => {
    const offerClassName = title.split(' ').pop();
    const checkedAttribute = offers.some((offer) => offer.title === title) ? 'checked' : '';
    return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerClassName}-1" type="checkbox" name="event-offer-${offerClassName}" value="${title}" ${checkedAttribute}>
  <label class="event__offer-label" for="event-offer-${offerClassName}-1">
  <span class="event__offer-title">${title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${price}</span>
  </label>
  </div>`;
  }).join('')}
  </div>` : ''}
  </section>`;
};


const createEditPointTemplate = (data, allTypeOffers, pointMode) => {
  const { type, dateFrom, dateTo, basePrice, offers, destination } = data;
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItemTemplate(TYPES)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.town}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createTownsTemplate(TOWNS)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFormat(dateFrom, 'DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateFormat(dateTo, 'DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${pointMode ? 'Delete' : 'Cancel'}</button>
        ${pointMode ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">
      ${createOfferTemp(type, offers, allTypeOffers)}
      ${createDestinationTemp(destination)}
    </section>
  </form>
  </li>`;
};

export default class EditTripPoint extends SmartView {
  constructor(offers, point = BLANK_POINT, pointMode) {
    super(); //вызываем родительский конструктор (в простых не выхываем так как конструктор не редактируем и он вызывается автоматически)
    this._pointState = EditTripPoint.parsePointToData(point);//храним состояние EditTripPoint
    this._pointMode = pointMode;
    this._offers = offers;

    this._FromDatePicker = null;
    this._ToDatePicker = null;

    this._OnPointEditSubmit = this._OnPointEditSubmit.bind(this);
    this._OnRollupBtnClick = this._OnRollupBtnClick.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._onPointTypeChange = this._onPointTypeChange.bind(this);
    this._onPointInput = this._onPointInput.bind(this);
    this._onPointDelete = this._onPointDelete.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._onOfferChange = this._onOfferChange.bind(this);

    this._setInnerListeners();//возвращаем обработчики
    this._setFromDatePicker(this._FromDatePicker, FlagMode.TRUE);
    this._setToDatePicker(this._ToDatePicker);
  }

  reset(point) {
    this.updateData(EditTripPoint.parsePointToData(point));
  }

  removeElement() {
    super.removeElement();
    if (this._FromDatePicker || this._ToDatePicker) {
      this._FromDatePicker.destroy();
      this._FromDatePicker = null;
      this._ToDatePicker.destroy();
      this._ToDatePicker = null;
    }
  }

  getTemplate() {
    return createEditPointTemplate(this._pointState, this._offers, this._pointMode);
  }


  _setFromDatePicker() {
    if (this._FromDatePicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._FromDatePicker.destroy();
      this._FromDatePicker = null;
    }
    this._FromDatePicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._pointState.dateFrom,
        onChange: this._dateFromChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _dateFromChangeHandler(userDateFrom) {
    if ((dayjs(this._pointState.dateFrom).diff(dayjs(userDateFrom))) < 0) {
      this.updateData({
        dateFrom: userDateFrom,
        dateTo: userDateFrom,
      });
      return;
    }
    this.updateData({
      dateFrom: userDateFrom,
    });
  }

  _setToDatePicker() {
    if (this._ToDatePicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._ToDatePicker.destroy();
      this._ToDatePicker = null;
    }
    this._ToDatePicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._pointState.dateTo,
        onChange: this._dateToChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _dateToChangeHandler(userDateTo) {
    if ((dayjs(userDateTo).diff(dayjs(this._pointState.dateFrom))) < 0) {
      userDateTo = this._pointState.dateFrom;
    }
    this.updateData({
      dateTo: userDateTo,
    });
  }

  _OnRollupBtnClick() {
    this._callback.rollupBtnClick();
  }

  _OnPointEditSubmit(evt) {
    evt.preventDefault();
    this._callback.pointEditSubmit(EditTripPoint.parseDataToPoint(this._pointState));//передаём состояние в виде данных презентеру
  }

  _onPointTypeChange(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }


  _onPointInput(evt) {
    if (!TOWNS.includes(evt.target.value)) {
      evt.target.setCustomValidity(`${ValidityMessage.DESTINATION}: ${TOWNS.join(', ')}`);
    } else {
      evt.target.setCustomValidity('');
      evt.preventDefault();
      this.updateData({
        destination: pickElementDependOnValue(evt.target.value, destinations, FlagMode.TRUE),//получаем описание соответствующее выбранному городу
      });
    }
    evt.target.reportValidity();
  }

  _onPointDelete(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditTripPoint.parseDataToPoint(this._pointState));
  }

  //обработчики которые отвечают за выбор города и типа
  _setInnerListeners() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._onPointTypeChange);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._onPointInput);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._onPriceChange);
    this.getElement().querySelector('.event__section--offers').addEventListener('change', this._onOfferChange);
  }

  setRollupBtnClickHandler(callback) {
    if (this.getElement().querySelector('.event__rollup-btn') !== null) {
      this._callback.rollupBtnClick = callback;
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._OnRollupBtnClick);
    }
  }

  setSaveClickHandler(callback) {
    this._callback.pointEditSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._OnPointEditSubmit);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._onPointDelete);
  }

  //добавит обработчики
  restoreHandlers() {
    this._setInnerListeners();
    this._setFromDatePicker();
    this._setToDatePicker();
    this.setRollupBtnClickHandler(this._callback.rollupBtnClick);
    this.setSaveClickHandler(this._callback.pointEditSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  //превращает данные в состояние
  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
    );
  }

  //превращает состояние в данные
  static parseDataToPoint(data) {
    return Object.assign(
      {},
      data,
    );
  }

  _onPriceChange(evt) {
    evt.preventDefault();
    if (!/^\d+$/.test(evt.target.value) || evt.target.value < Index.NEXT) {
      evt.target.setCustomValidity(ValidityMessage.PRICE);
    } else {
      evt.target.setCustomValidity('');
      this.updateData({
        basePrice: parseInt(evt.target.value),
      },
      TRUE_FLAG,
      );
    }
    evt.target.reportValidity();
  }


  _onOfferChange(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const selectedOffer = evt.target.value;
    const index = this._pointState.offers.findIndex((offer) => offer.title === selectedOffer);
    if (index < 0) {
      const availableOffers = pickOfferElementDependOnValue(this._pointState.type, this._offers);
      const newOffer = availableOffers.find((offer) => offer.title === selectedOffer);
      this.updateData({
        offers: [newOffer, ...this._pointState.offers],
      },
      TRUE_FLAG,
      );
    } else {
      this.updateData({
        offers: [...this._pointState.offers.slice(0, index), ...this._pointState.offers.slice(index + Index.NEXT)],
      },
      TRUE_FLAG,
      );
    }
  }
}
