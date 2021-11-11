import {TYPES, TOWNS} from '../const.js';
import {dateFormat, getRandomElementArr, getRandomInteger, createElement} from '../util.js';
import dayjs from 'dayjs';

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

const createTownsTemplate = (cities) => cities.map((city) => `<option value="${city}">`).join('');


const createOfferTemp = (offers) => offers.length > 0 ?
  `<section class="event__section  event__section--offers">
<h3 class="event__section-title  event__section-title--offers">Offers</h3> <div class="event__available-offers">
${offers.map(({title, price}) => {
    const offerClassName = title.split(' ').pop();
    const checkedAttribute = getRandomInteger() ? 'checked' : '';
    return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerClassName}-1" type="checkbox" name="event-offer-${offerClassName}" ${checkedAttribute}>
  <label class="event__offer-label" for="event-offer-${offerClassName}-1">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`;
  }).join('')}
</div></section>`
  : '';

const BLANK_POINT = {
  type: getRandomElementArr(TYPES),
  offers: [],
  destination: {
    town: getRandomElementArr(TOWNS),
    description: '',
    picture: [],
  },
  dateFrom: dayjs(),
  dateTo: dayjs(),
  basePrice: '',
};


const createEditPointTemplate = (point) => {
  const {type, dateFrom, dateTo, basePrice, offers, destination} = point;
  return`<li class="trip-events__item">
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
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFormat(dateFrom,'DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateFormat(dateTo,'DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${createOfferTemp(offers)}
      ${createDestinationTemp(destination)}
    </section>
  </form>
  </li>`;
};

export default class EditTripPoint {
  constructor(point = BLANK_POINT) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createEditPointTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
