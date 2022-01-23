import SiteMenuView from './view/tabs.js';
import ButtonNewView from './view/button-new.js';
import StatsView from './view/stats.js';
import { render, RenderPosition, remove } from './utils/render.js';
import { POINT_COUNT, MenuItem, FlagMode, UpdateType, FilterType } from './const.js';
import { generateWaypoint } from './mock/point-data.js';
import { generateRandomOffers } from './mock/point-data.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';


const siteBodyElement = document.querySelector('.page-body');
const sortsElement = document.querySelector('.trip-controls__filters');
const headerElement = siteBodyElement.querySelector('.page-header__container');
const mainElement = siteBodyElement.querySelector('.page-main__container');
const tripDetailsElement = document.querySelector('.trip-main');
const tripNavigationElement = tripDetailsElement.querySelector('.trip-controls__navigation');
const tripFilterControlElement = tripDetailsElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteBodyElement.querySelector('.trip-events');

let statisticsComponent = null;

const offersModel = new OffersModel();
const randomOffersData = generateRandomOffers();
offersModel.setOffers(randomOffersData);
export const allTypeOffers = offersModel.getOffers();

const points = new Array(POINT_COUNT).fill().map(generateWaypoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);//записываем в модель данные
const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();
render(tripNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const buttonNewComponent = new ButtonNewView();
render(tripDetailsElement, buttonNewComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, offersModel);//экземпляр модели передаём в презентер(2 - ой параметр)
tripPresenter.init();

const filterPresenter = new FilterPresenter(tripFilterControlElement, filterModel, pointsModel);
filterPresenter.init();


const onNewPointClose = () => {
  buttonNewComponent.toggleDisablesStatus();
};

const onMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_EVENT:
      tripPresenter.destroy();
      filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createPoint(onNewPointClose);
      buttonNewComponent.toggleDisablesStatus();
      break;
    case MenuItem.TABLE:
      remove(statisticsComponent);
      filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      filterPresenter.init();
      buttonNewComponent.toggleDisablesStatus();
      sortsElement.classList.remove('visually-hidden');
      headerElement.classList.toggle('page-header__container--statistics');
      mainElement.classList.toggle('page-main__container--statistics');
      break;
    case MenuItem.STATS:
      filterPresenter.init(FlagMode.TRUE);
      tripPresenter.destroy();
      buttonNewComponent.toggleDisablesStatus();
      sortsElement.classList.add('visually-hidden');
      headerElement.classList.toggle('page-header__container--statistics');
      mainElement.classList.toggle('page-main__container--statistics');
      statisticsComponent = new StatsView(pointsModel.getPoints());
      render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
    default:
      throw new Error('Unknown menu-item. Check MenuItem value');
  }
};

siteMenuComponent.setMenuListener(onMenuClick);
buttonNewComponent.setButtonNewListener(onMenuClick);
