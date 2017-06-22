// @flow
import type { Product } from './Product'

export type Category = {
	id: string,
	name: string,
	products: Array<Product>
}