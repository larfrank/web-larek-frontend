import { IItem, IItemCategory } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface ICardActions {
	onClick: (event: MouseEvent) => void;
}


export class Card extends Component<IItem>{
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected button: HTMLElement;

    constructor(protected container: HTMLElement, protected actions?: ICardActions) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
		this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
		this.button = ensureElement<HTMLElement>('.card__button', this.container);
    }

    set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	set price(value: number | null) {
		if (value !== null) {
			this.setText(this.cardPrice, `${value} синапсов`);
            return;
		} 
		this.setText(this.cardPrice, 'Бесценно');
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}
}

export class CardBasket extends Card {
	protected cardIndex: HTMLElement;

	constructor(protected container: HTMLElement, protected actions?: ICardActions) {
		super(container);
		this.cardIndex = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this.button.addEventListener('click', actions.onClick);
	}

	set index(value: number) {
		this.cardIndex.textContent = String(value);
	}
}

export class CardCatalog extends Card {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
	
    constructor(protected container: HTMLElement, protected actions?: ICardActions) {
		super(container);

		this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);

		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
                return;
			}
			container.addEventListener('click', actions.onClick);
		}
	}
    
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

    set image(value: string) {
		this.setImage(this.cardImage, value, this.title);
	}

	set category(value: keyof typeof IItemCategory) {
		if (this.cardCategory) {
			this.setText(this.cardCategory, value);
			this.cardCategory.classList.add(`card__category_${IItemCategory[value]}`);
		}
	}
}

export class CardPreview extends CardCatalog {
    protected cardDescription: HTMLElement;

	constructor(
        protected container: HTMLElement, 
        protected events: IEvents, 
        protected actions?: ICardActions
    ) {
		super(container, actions);

		this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
	}

    set description(value: string) {
		this.setText(this.cardDescription, value);
	}

    set buttonState(state: { IsNull: boolean; IsInBasket: boolean }) {
		if (this.button) {
			if (state.IsNull) {
				this.setDisabled(this.button, true);
				this.setText(this.button, 'Недоступно для покупки');
			}
			if (state.IsInBasket) {
				this.setText(
					this.button,
					state.IsInBasket ? 'Убрать из корзины' : 'В корзину'
				);
			}
		}
	}
}