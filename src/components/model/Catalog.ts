import { ICatalog, IItem } from '../../types';
import { IEvents } from '../base/events';

export class Catalog implements ICatalog {
	protected _items: IItem[];
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set items(items: IItem[]) {
		this._items = items;
		this.events.emit('initialData:loaded');
	}

	get items() {
		return this._items;
	}

	getItem(id: string): IItem {
		return this._items.find((item) => item.id === id);
	}

	set preview(itemId: string | null) {
		if (!itemId) {
			this._preview = null;
			return;
		}
		const selectedItem = this.getItem(itemId);
		if (selectedItem) {
			this._preview = itemId;
			this.events.emit('item:selected');
			return;
		}
		console.log(`card ${itemId} not found`);
	}

	get preview() {
		return this._preview;
	}
}
