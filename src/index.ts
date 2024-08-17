import './scss/styles.scss';
import { Catalog } from './components/model/Catalog';
import { OrderData } from './components/model/OrderData';
import { EventEmitter } from './components/base/events';
import { IApi, IFormErrors, IItem, IOrder } from './types';
import { Api } from './components/base/api';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { PageView } from './components/view/PageView';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
	CardBasket,
	CardCatalog,
	CardPreview,
} from './components/view/CardView';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BascetView';
import { ContactsView } from './components/view/ContactForm';
import { DeliverView } from './components/view/DeliverForm';
import { SuccessView } from './components/view/SuccessView';

const events = new EventEmitter();

const orderData = new OrderData(events);
const catalog = new Catalog(events);
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);

const pageElement = ensureElement<HTMLBodyElement>('.page');
const cardCatalogElement = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalElement = ensureElement<HTMLElement>('#modal-container');
const cardPreviewElement = ensureElement<HTMLTemplateElement>('#card-preview');
const basketElement = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketElement = ensureElement<HTMLTemplateElement>('#card-basket');
const contactFormElement = ensureElement<HTMLTemplateElement>('#contacts');
const orderFormElement = ensureElement<HTMLTemplateElement>('#order');
const successFormElement = ensureElement<HTMLTemplateElement>('#success');

const page = new PageView(pageElement, events, {
	onClick: () => events.emit('basket:open'),
});
const modal = new ModalView(modalElement, events);
const basket = new BasketView(cloneTemplate(basketElement), {
	onClick: () => events.emit('order:open'),
});
const contactForm = new ContactsView(cloneTemplate(contactFormElement), events);
const deliverForm = new DeliverView(cloneTemplate(orderFormElement), events);
const successForm = new SuccessView(cloneTemplate(successFormElement), {
	onClick: () => {
		modal.close();
		events.emit('modal:close');
	},
});

events.on('initialData:loaded', () => {
	const items = catalog.items.map((item) => {
		const cardCatalog = new CardCatalog(cloneTemplate(cardCatalogElement), {
			onClick: () => events.emit('preview:open', item),
		});

		return cardCatalog.render({
			title: item.title,
			price: item.price,
			id: item.id,
			category: item.category,
			image: item.image,
		});
	});
	page.catalog = items;
	return;
});

events.on('preview:open', (item: IItem) => {
	const cardPreview = new CardPreview(
		cloneTemplate(cardPreviewElement),
		events,
		{
			onClick: () => {
				if (!orderData.isInBasket(item.id)) {
					events.emit('item:add-to-basket', item);
				} else {
					events.emit('item:delete-from-basket', item);
					modal.close();
				}
			},
		}
	);
	modal.render({
		content: cardPreview.render({
			title: item.title,
			price: item.price,
			id: item.id,
			category: item.category,
			image: item.image,
			description: item.description,
			buttonState: {
				nullable: item.price === null,
				inBasket: orderData.isInBasket(item.id),
			},
		}),
	});
});

events.on('item:add-to-basket', (item: IItem) => {
	orderData.addItem(item);
	events.emit('basket:changed');
	modal.close();
});

events.on('item:delete-from-basket', (item: IItem) => {
	orderData.removeItem(item.id);
	events.emit('basket:changed');
});

events.on('basket:open', () => {
	modal.render({
		content:basket.render()
	})
})

events.on('basket:changed', () => {
	const items = orderData.items.map((item, index) => {
		const cardBasket = new CardBasket(cloneTemplate(cardBasketElement), {
			onClick: () => events.emit('item:delete-from-basket', item),
		});

		return cardBasket.render({
			title: item.title,
			price: item.price,
			id: item.id,
			index: index + 1,
		});
	});

	page.totalCount = orderData.items.length;

	modal.render({
		content: basket.render({ items: items, total: orderData.total }),
	});
});

events.on('modal:open', () => {
	page.wrapperLocked = true;
});

events.on('modal:close', () => {
	page.wrapperLocked = false;
});

events.on('order:open', () => {
	orderData.resetInfo(false);
	deliverForm.selected = null;
	deliverForm.address = '';
	modal.render({
		content: deliverForm.render({
			valid: false,
			formErrors: [],
		}),
	});
});

events.on(/(^order|^contacts)\..*:change/, (data: Partial<IOrder>) => {
	orderData.setOrderInfo(data);
	orderData.checkOrderValidation();
});

events.on('formErrors:change', (errors: Partial<IFormErrors>) => {
	const { payment, address, email, phone } = errors;
	deliverForm.valid = !payment && !address;
	deliverForm.formErrors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join(';  ');
	contactForm.valid = !email && !phone;
	contactForm.formErrors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	contactForm.phone = '';
	contactForm.email = '';
	modal.render({
		content: contactForm.render({
			valid: false,
			formErrors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.postOrder(orderData.getOrderInfo())
		.then((res) => {
			modal.render({
				content: successForm.render({
					total: res.total,
				}),
			});
			events.emit('order:clean');
		})
		.catch((err) => console.log(err));
});

events.on('order:clean', () => {
	orderData.resetInfo(true);
	page.totalCount = orderData.items.length;
});

api
	.getItemList()
	.then((res) => {
		catalog.items = res;
	})
	.catch((err) => console.log(err));
