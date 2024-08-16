import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccessActions {
	onClick: () => void;
}

export class SuccessView extends Component<unknown> {
	protected _total: HTMLElement;
	protected successButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._total = ensureElement('.order-success__description', this.container);
		this.successButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this.successButton.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}
