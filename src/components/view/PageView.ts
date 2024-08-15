import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPageActions {
	onClick: () => void;
}

export class PageView extends Component<unknown> {
    protected _catalog: HTMLElement;
	protected _totalCount: HTMLSpanElement;
	protected _wrapperLocked: HTMLElement;
	protected basketButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents, protected actions: IPageActions) {
        super(container);

        this._catalog = ensureElement<HTMLElement>('.gallery', this.container);
		this._totalCount = ensureElement<HTMLSpanElement>('.header__basket-counter', this.container);
		this._wrapperLocked = ensureElement<HTMLElement>('.page__wrapper', this.container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

		this.basketButton.addEventListener('click', actions.onClick);
    }

    set totalCount(value: number) {
        this.setText(this._totalCount, value);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set wrapperLocked(value: boolean) {
		this.toggleClass(this._wrapperLocked, 'page__wrapper_locked', value);
	}
}