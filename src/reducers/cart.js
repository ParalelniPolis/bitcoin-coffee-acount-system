// @flow
import * as Constants from '../constants/cart';
import type { Product } from '../types/Product';
import type { CartProduct } from '../types/CartProduct';

type State = {
	products: {
		[string]: CartProduct
	}
}

type Action = {
	type: string,
	product: Product
}

const initialState = {
	products: {}
};

export default (state: State = initialState, action: Action): State => {
	switch (action.type) {
		case Constants.ADD_PRODUCT:
			return {
				products: {
					...state.products,
					[action.product.id]: {
						...action.product,
						amount: state.products[action.product.id] ? state.products[action.product.id].amount + 1 : 1
					}
				}
			};

		case Constants.REMOVE_PRODUCT:
			if (state.products[action.product.id].amount === 1) {
				const newProducts = { ...state.products };
				delete newProducts[action.product.id];

				return {
					products: newProducts
				};
			}
			else {
				return {
					products: {
						...state.products,
						[action.product.id]: {
							...action.product,
							amount: state.products[action.product.id].amount - 1
						}
					}
				};
			}

		case Constants.RESET_CART:
			return initialState;

		default:
			return state;
	}
};