import {
	IOrderData,
	IOrder,
	PaymentType,
	IItem,
	IFormErrors,
} from '../../types';
import { IEvents } from '../base/events';

export class OrderData implements IOrderData {
	protected address: string;
	protected payment: PaymentType;
	protected email: string;
	protected phone: string;
	protected events: IEvents;
	protected _items: IItem[];
	protected _total: number | null;
	protected _formErrors: IFormErrors;

	constructor(events: IEvents) {
		this.events = events;
		this._items = [];
		this._total = 0;
		this._formErrors = {
			address: null,
			payment: null,
			email: null,
			phone: null,
		};
	}

	set items(items: IItem[]) {
		this._items = items;
		this.events.emit('basket:changed');
	}

	get items() {
		return this._items;
	}

	get total(): number | null {
		return this._total;
	}

	setOrderInfo(orderData: Partial<IOrder>) {
		Object.assign(this, orderData);
	}

	getOrderInfo() {
		return {
			address: this.address,
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			total: this._total,
			items: this._items,
		};
	}

	checkOrderValidation() {
		if (!this.address) {
			this._formErrors.address = 'некорректный адрес';
		} else {
			this._formErrors.address = null;
		}

		if (!this.payment) {
			this._formErrors.payment = 'не выбран способ оплаты';
		} else {
			this._formErrors.payment = null;
		}

		if (!this.email) {
			this._formErrors.email = 'некорректный email';
		} else {
			this._formErrors.email = null;
		}

		if (!this.phone) {
			this._formErrors.phone = 'некорректный номер';
		} else {
			this._formErrors.phone = null;
		}

		this.events.emit('formErrors:change', this._formErrors);
	}

	resetInfo(success: boolean) {
		this.address = '';
		this.email = '';
		this.payment = null;
		this.phone = '';
		this._formErrors = {
			address: null,
			payment: null,
			email: null,
			phone: null,
		};
		if (success) {
			this._items = [];
			this._total = 0;
			return;
		}
		this.events.emit('basket:changed');
	}

	addItem(item: IItem) {
		this._items.push(item);
		this._total += item.price;
		this.events.emit('basket:changed');
	}

	removeItem(id: string) {
		this._items = this._items.filter((item) => {
			if (item.id == id) {
				this._total -= item.price;
				return false;
			}
			return true;
		});
		this.events.emit('basket:changed');
	}

	isInBasket(id: string) {
		return Boolean(this._items.find((item) => item.id === id));
	}
}
