import { IApi, IItem, IOrder, IOrderResult } from "../types";

type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IAppApi {
	getItemList: () => Promise<IItem[]>;
	postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi implements IAppApi {
	private _baseApi: IApi;
	readonly cdn: string;

	constructor(cdn: string, baseApi: IApi) {
		this.cdn = cdn;
		this._baseApi = baseApi;
	}

	async getItemList(): Promise<IItem[]> {
		return await this._baseApi
			.get('/product')
			.then((data: ApiListResponse<IItem>) =>
				data.items.map((item) => ({
					...item,
					image: this.cdn + item.image,
				}))
			);
	}

	async postOrder(orderData: IOrder): Promise<IOrderResult> {
		const payload = ({
            ...orderData,
            items: orderData.items.map(el => el.id)
        })
        
        return await this._baseApi
			.post('/order', payload)
			.then((data: IOrderResult) => data);
	}
}