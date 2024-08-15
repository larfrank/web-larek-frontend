import { TOrderInfo } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { FormView } from "./FormView";

export class OrderView extends FormView {
	protected paymentButtons: HTMLButtonElement[];

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.paymentButtons = ensureAllElements('.button_alt', this.container);

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', (evt) => {
				const target = evt.target as HTMLButtonElement;
				const value = target.name;
				this.onPaymentChange(value, 'payment');
				if (!target.classList.contains('button_alt-active')) {
					this.selected = value;
				}
			});
		});
	}

	protected onPaymentChange(value: string, field: keyof TOrderInfo) {
		this.events.emit(`${this.container.name}.${field}:change`, {field, value});
	}

	set selected(name: string) {
		this.paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.setDisabled(button, button.name === name);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}