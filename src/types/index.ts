export type PaymentType = 'online' | 'offline';

export type IItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IItem {
  _id: string;
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
}

export interface IBasket {
  items: IItem[];
  total: number | null;
  addItem(item: IItem): void;
  removeItem(id: string): void;
  resetBasket(): void;
}

export interface ICatalog {
  items: IItem[];
  preview: string | null;
  getItem(id: string): IItem;
}

export interface IOrderData {
  setOrderInfo(orderData: IOrder): void;
  checkOrderValidation(orderData: Record<keyof TOrederInfo, string>): boolean;
  resetInfo(): void;
}

export type TItemInfo = Pick<IItem, 'title' | 'description' | 'category' | 'image' | 'price'>;

export type TBasketItemInfo = Pick<IItem, 'title' | 'price'>;

export type TOrederInfo = Pick<IOrder, 'email' | 'phone' | 'payment' | 'address'>;

export type TSuccessOrder = Pick<IBasket, 'total'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(uri:string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>; 
}