import './scss/styles.scss';
import { Catalog } from './components/Catalog';
import { OrderData } from './components/OrderData';
import { EventEmitter } from './components/base/events';
import { IApi } from './types';
import { Api } from './components/base/api';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { CardCatalog } from './components/view/CardView';

const events = new EventEmitter();

const orderData = new OrderData(events);
const catalog = new Catalog(events);

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);

events.on('initialData:loaded', () => {
    return;
})





api
    .getItemList()
    .then(res => {
        catalog.items = res;
        console.log(catalog.items);
    })
    .catch(err => console.log(err));