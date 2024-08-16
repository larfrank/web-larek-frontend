import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IBasketActions {
	onClick: () => void;
}

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class BasketView extends Component<IBasketView> {
	protected list: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(protected container: HTMLElement, actions: IBasketActions) {
		super(container);

		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.basketButton.addEventListener('click', actions.onClick);
	}

	disabledBasketButton(valid: boolean) {
		this.setDisabled(this.basketButton, valid);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.list.replaceChildren(...items);
			this.disabledBasketButton(false);
		} else {
			this.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.disabledBasketButton(true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${String(total)} синапсов`);
	}

	render(data?: IBasketView) {
		if (!data) return this.container;
		return super.render({ items: data.items, total: data.total });
	}
}
