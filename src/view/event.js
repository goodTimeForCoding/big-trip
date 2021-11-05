import {converDataAfterCompare, dateFormat} from './../util.js';

const createOfferTemp = (offers) => offers.length > 0 ? `${offers.map(({title, price}) =>
  `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
   </li>`).join('')}`
  : '';

export const createEventTemplate = (point) => {
  const {type, basePrice, isFavorite, dateFrom, dateTo, offers} = point;
  const {town} =  point.destination;
  const buttonActive = (isFavorite === true)
    ? 'event__favorite-btn--active'
    : '';

  return `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${dateFormat(dateFrom,'YYYY-MM-DD')}">${dateFormat(dateFrom,'D MMM')}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${town}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFormat(dateFrom,'YYYY-MM-DDTHH:mm')}">${dateFormat(dateFrom,'HH:mm')}</time>
      &mdash;
      <time class="event__end-time" datetime="${dateFormat(dateTo,'YYYY-MM-DDTHH:mm')}">${dateFormat(dateTo,'HH:mm')}</time>
    </p>
    <p class="event__duration">${converDataAfterCompare(dateTo, dateFrom)}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${createOfferTemp(offers)}
  </ul>
  <button class="event__favorite-btn ${buttonActive}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`;
};
