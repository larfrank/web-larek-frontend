# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении 

Тип данных для способа оплаты

```
export type PaymentType = 'online' | 'offline' | null;
```

Данные категории товара

```
export enum IItemCategory {
	'софт-скил' = 'soft',
	'другое' = 'other',
	'дополнительное' = 'additional',
	'кнопка' = 'button',
	'хард-скил' = 'hard',
}
```

Данные товара

```
export interface IItem {
	id: string;
	title: string;
	description: string;
	category: IItemCategory;
	image: string;
	price: number | null;
}
```

Данные заказа

```
export interface IOrder {
	address: string;
	payment: PaymentType;
	email: string;
	phone: string;
	items: IItem[];
	total: number | null;
}
```

Интерфейс, реализующий класс каталога

```
export interface ICatalog {
	items: IItem[];
	preview: string | null;
	getItem(id: string): IItem;
}
```

Интерфейс, реализующий класс заказа

```
export interface IOrderData {
	addItem(item: IItem): void;
	removeItem(id: string): void;
	setOrderInfo(orderData: Partial<IOrder>): void;
	getOrderInfo(): IOrder;
	checkOrderValidation(): void;
	resetInfo(success: boolean): void;
}
```

Данные ошибки

```
export interface IFormErrors {
	payment: string;
	address: string;
	email: string;
	phone: string;
}
```

Данные ответа с бэкенда

```
export interface IOrderResult {
	id: string;
	total: number;
}
```

Инфрмация о заказе

```
export type TOrderInfo = Pick<
	IOrder,
	'address' | 'payment' | 'email' | 'phone'
>;
```

Тип данных Api

```
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данных;
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие;
- `emit` - инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Слой данных

#### Catalog
Класс отвечает за хранение и логику работы каталога товаров.  

Конструктор класса принимает инстант брокера событий.  

В полях класса хранятся следующие данные:
- `_items: IItem[]` - массив товаров;
- `_preview: string | null` - id товара, выбранного для просмотра в модальном окне;
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными, а именно:
- `getItem(id: string): IItem` - возвращает товар по его id;
- а так же сеттеры и геттеры для сохранения и получения данных из полей класса.


#### OrderData
Класс отвечает за хранение и логику работы данных о заказе товаров.  

Конструктор класса принимает инстант брокера событий.  

В полях класса хранятся следующие данные:
- `address: string` - адрес для доставки заказа;
- `payment: PaymentType` - способ оплаты заказа;
- `email: string` - почта покупателя;
- `phone: string` - номер телефона покупателя;
- `_items: IItem[]` - массив товаров, лежащих в козине;
- `_total: number | null` - сумма стоимости всех товаров, лежащих в козине;
- `_formErrors: IFormErrors` - ошибки формы заказа;
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными, а именно:
- `setOrderInfo(orderData: Partial<IOrder>): void` - устанавливает данные заказа;
- `getOrderInfo(): IOrder` - предоставляет данные для отправки заказа на бэкенд;
- `checkOrderValidation(): void` - проверяет данные заказа на валидность;
- `resetInfo(success: boolean): void` - очищает данные заказа;
- `addItem(item: IItem): void` - добавляет товар в корзину и вызывает событие изменения массива;
- `removeItem(id: string): void` - удаляет товар из корзины и вызывает событие изменения массива;
- `isInBasket(id: string): boolean` - проверяет есть ли товар в корзине;
- а так же сеттеры и геттеры для сохранения и получения данных из полей класса.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый класс Component
Данный класс является базовым классом представления, от которого наследуются другие классы слоя представления.
Конструктор класса принимает элемент разметки, который является контейнером компонента, а также класс предоставляет следующие методы: 
- `render(data?: Partial<T>): HTMLElement` - помогает обновить содержимое HTML-элемента;
- `setText(element: HTMLElement, value: unknown)` - устанавливает текст элемента;
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает класс элемента;
- `setDisabled(element: HTMLElement, state: boolean)` - блокирует кнопку.

#### Класс PageView
Класс PageView расширает класс Component. Данный класс отвечает за отображение главных элементов страницы. Конструктор принимает на вход контейнер HTML-элемента, инстант брокера событий и функцию-колбек, сработающую при нажатии на коризну товаров. Содержит в себе сеттеры и геттеры для сохранения и получения данных из полей класса, таких как каталог товаров на странице, количество товаров в корзине и блокировка страницы.

#### Класс ModalView
Данный класс также расширяет класс Component и отвечает за отображение модального окна. Устанавливает слушателей на клик по крестику или оверлею для закрытия. Конструктор принимает контейнер HTML-элемента и инстант брокера событий.
Поля класса: 
- `_content: HTMLElement` - элемент для размещения контента;
- `closeButton: HTMLButtonElement` -  кнопка закрытия модального окна.

Методы класса:
- `open` - открывает модальное окно;
- `close` - закрывает модальное окно;
- `render` - отрисовывает элемент в контейнере;
- а также сеттер для контента.

#### Класс BasketView
Данный класс также расширает класс Component и отвечает за отображение корзины товаров. Конструктор принимает контейнер HTML-элемента и функцию-колбек, сработающую при клике на кнопке оформления заказа.

Поля класса:
- `list: HTMLElement` - элемент разметки со списком;
- `_total: HTMLElement` - элемент разметки для вывода общей суммы заказа;
- `basketButton: HTMLButtonElement` - элемент разметки кнопки оформления заказа.

Методы:
- `disabledBasketButton(valid: boolean)` - меняет активность кнопки в корзине;
- `render(data?: IBasketView)` - собирает и возвращает контейнер с корзиной;
- а также сеттеры для элементов корзины.

#### Класс Card
Класс Card расширяет класс Component и отвечает за отображения карточки товара в различных ее состояниях. Данная возмодность реализована с использованием дополнительных классов `CardBasket`, `CardCatalog` и `CardPreview`. Первые два наследуются от класса Card, а CardPreview расширяет класс CardCatalog. 
В данных классах устанавливаются слушатели на необходимые элементы, в результате чего генерируются нужные события. 
Поля классов содержат разной подробности информацию о карточках, методы для работы с ними, а также сеттеры и геттеры для сохранения и получения информации из полей классов.

#### Класс FormView
Данный класс предназначен для реализации формы. Наследуется от базового класса Сomponent.

От данного класса наследуются `DeliverView` и `ContactsView`, работающие с конкретными полями формы.

При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.

Поля класса:
- `_formErrors: HTMLElement` - элемент для вывода ошибок валидации;
- `submitButton: HTMLButtonElement` - кнопка подтверждения.

Методы:
- `onInputChanged(field: string, value: string)` - инициирует событие изменения полей форм ввода, возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем;
- `render(state: Partial<IFormView>)` - собирает и возвращает контейнер с формой;
- а также сеттеры для изменения активности кнопки и размещения текста ошибок.

#### Класс SuccessView
Класс расширяет Сomponent и предназначен для реализации отображения успешной оплаты заказа. Получает данные суммы списания, которые нужно отобразить.

Конструктор принимает HTMLElement контейнера, по которому в разметке страницы будет идентифицирован темплейт и колбек-функцию для возможности инициации событий.

Поля класса:

- `_total: HTMLElement`- элемент разметки для вывода общей суммы;
- `successButton: HTMLButtonElement` - элемент разметки кнопки перейти к покупкам.

Методы:
- сеттер для вывода общей суммы оплаты.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.
Взаимодействие осуществляется за счет событий генерируемых с помощью инициации событий и обработчиков этих событий, описанных в `index.ts`.
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Список всех событий, которые могут генерироваться в системе

События изменения данных (генерируются классами моделями данных):
- `basket:changed` - корзина изменилась;
- `initialData:loaded` - данные генерируемые при инициализации страницы;
- `item:selected` - изменение открываемой в модальном окне картинки карточки;

События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление):
- `modal:open` - открытие модального окна;
- `modal:close` - закрытие модального окна;
- `preview:open` - открытие превью карточки;
- `item:add-to-basket` - продукт добавлен в корзину;
- `item:delete-from-basket` - продукт удален из корзины;
- `item:delete-from-basket-itself` - продукт удален из корзины (удаляем, находясь в интерфейсе корзины);
- `order:open` - открытие форма заказа;
- `order.payment:change` - изменилось поле оплаты заказа;
- `order.address:change` - изменилось поле адреса заказа;
- `contacts.email:change` - изменилось поле почты заказа;
- `contacts.phone:change` - изменилось поле телефона заказа;
- `order:submit` - первая форма заказа корректно запонена;
- `contacts:submit` - заказ корректно запонен;
- `formErrors:change` - изменились ошибки;
- `order:clean` - заказ очищен.

Названия некоторых из приведенных событий получаются из совмещений атрибутов DOM-элементов и их конкретной части, а также типа события. Один из таких примеров - это событие "order.payment:change".