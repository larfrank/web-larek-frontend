import { TOrderInfo } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IFormView extends TOrderInfo {
	valid: boolean;
	formErrors: string[];
}

export class FormView extends Component<IFormView> {
	protected _formErrors: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.submitButton = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this.container.addEventListener('input', (evt) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.onInputChanged(field, value);
		});
	}

	protected onInputChanged(field: string, value: string) {
		this.events.emit(`${this.container.name}.${field}:change`, {field, value});
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set formErrors(value: string) {
		this.setText(this._formErrors, value);
	}

	render(state: Partial<TOrderInfo> & IFormView) {
		const { valid, formErrors, ...inputs } = state;
		super.render({ valid, formErrors });
		Object.assign(this, inputs);
		return this.container;
	}
}