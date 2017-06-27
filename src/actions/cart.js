// @flow
import * as Constants from '../constants/cart';

import type { Product } from '../types/Product';

type Action = {
	type: string,
	product?: Product
}

export function addToCart(productToAdd: Product): Action {
	return {
		type: Constants.ADD_PRODUCT,
		product: productToAdd
	}
}

export function removeFromCart(productToRemove: Product): Action {
	return {
		type: Constants.REMOVE_PRODUCT,
		product: productToRemove
	}
}

export function resetCart(): Action {
	return {
		type: Constants.RESET_CART
	}
}