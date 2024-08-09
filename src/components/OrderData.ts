import { IOrderData, IOrder, PaymentType, TOrderInfo, IItem } from "../types";
import { IEvents } from "./base/events";

export class OrderData implements IOrderData {
    protected address: string;
    protected payment: PaymentType;
    protected email: string;
    protected phone: string;
    protected events: IEvents;
    protected _items: IItem[];
    protected _total: number | null;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(items:IItem[]) {
        this._items = items;
        this.events.emit('basket:changed');
    }

    get items() {
        return this._items;
    }

    get total(): number | null {
        return this._total;
    }

    setOrderInfo(orderData: IOrder) {
        this.address = orderData.address;
        this.email = orderData.email;
        this.payment = orderData.payment;
        this.phone = orderData.phone;
        this.events.emit('orderData:changed');
    }

    checkOrderValidation(orderData: Record<keyof TOrderInfo, string>): boolean {
        let result = true;
        Object.keys(orderData).forEach(key => {
            if (orderData[key as keyof typeof orderData] === '') {
                result = false;
            }
        })
        this.events.emit('orderData:changed');
        return result;
    }

    resetInfo() {
        this.address = '';
        this.email = '';
        this.payment = null;
        this.phone = '';
        this._items = [];
        this._total = null;
        this.events.emit('orderData:changed');
        this.events.emit('basket:changed');
    }

    addItem(item: IItem) {
        this._items.push(item);
        this._total += item.price;
        this.events.emit('basket:changed');
    }

    removeItem(id: string) {
        this._items = this._items.filter(item => {
            if (item.id == id) {
                this._total -= item.price;
                return false;
            }
            return true;
        })
        this.events.emit('basket:changed');
    }

}