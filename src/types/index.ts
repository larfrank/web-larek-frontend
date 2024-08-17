export type PaymentType = 'online' | 'offline' | null;

export enum IItemCategory {
	'софт-скил' = 'soft',
	'другое' = 'other',
	'дополнительное' = 'additional',
	'кнопка' = 'button',
	'хард-скил' = 'hard',
}

export interface IItem {
	id: string;
	title: string;
	description: string;
	category: IItemCategory;
	image: string;
	price: number | null;
}

export interface IOrder {
	address: string;
	payment: PaymentType;
	email: string;
	phone: string;
	items: IItem[];
	total: number | null;
}

export interface ICatalog {
	items: IItem[];
	preview: string | null;
	getItem(id: string): IItem;
}

export interface IOrderData {
	addItem(item: IItem): void;
	removeItem(id: string): void;
	setOrderInfo(orderData: Partial<IOrder>): void;
	getOrderInfo(): IOrder;
	checkOrderValidation(): void;
	resetInfo(success: boolean): void;
}

export interface IFormErrors {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IEventObject {
	item: IItem;
	inBasket: boolean;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type TOrderInfo = Pick<
	IOrder,
	'address' | 'payment' | 'email' | 'phone'
>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
