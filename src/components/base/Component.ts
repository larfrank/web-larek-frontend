export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) {}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}

	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}
}
