// @flow
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog/index';
import CircularProgress from 'material-ui/CircularProgress/index';
import SuccessIcon from 'material-ui/svg-icons/action/done';
import { green500 } from 'material-ui/styles/colors';
import { css } from 'glamor';

import delay from '../helpers/delay';

import ActionButton from '../components/ActionButton';
import PinDialog from '../components/PinDialog';
import NumberDialog from '../components/NumberDialog';
import Sidebar from '../components/Sidebar';
import Products from '../components/Products';

import * as cartActions from '../actions/cart';

import type { Element } from 'react';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';
import type { Account } from '../types/Account';
import type { CartProduct } from '../types/CartProduct';

type Props = {
	createOrder: Function,
	addCredits: Function,
	addToCart: Function,
	removeFromCart: Function,
	resetCart: Function,
	cartProducts: {
		[string]: CartProduct
	},
	data: {
		refetch: Function,
		loading: boolean,
		Account: Account,
		allCategories: Array<Category>
	}
}

type State = {
	creditsDialogOpen: boolean,
	pinDialogOpen: boolean,
	dialogOpen: boolean,
	activeCategoryId: ?string,
	finalDialog: boolean,
	orderCreated: boolean
}

const containerStyle = css({
	alignSelf: 'stretch',
	flex: 1,
	display: 'flex',
	flexDirection: 'row'
});

const addCreditsMutation = gql`
	mutation addCredits($id: ID!, $finalBalance: Int!, $amount: Int!) {
		updateAccount(
      id: $id
      balanceCZK: $finalBalance
    ) {
    	id
    	balanceCZK
  	}
  	createCreditTransaction(
  		accountId: $id
  		amount: $amount
  	) {
  		id
  		amount
  	}
	}
`;

const createOrderMutation = gql`
  mutation createOrder($id: ID!, $productIds: [ID!], $finalPrice: Int!, $finalBalance: Int!, $productsRaw: Json) {
  	createOrder(
  		accountId: $id
  		productsIds: $productIds
  		priceCZK: $finalPrice
  		productsRaw: $productsRaw
  	) {
    	id
  	}
  	updateAccount(
      id: $id
      balanceCZK: $finalBalance
    ) {
    	id
    	balanceCZK
  	}
	}
`;

const categoriesAccountQuery = gql`query categoriesAccount($id: ID!) {
		allCategories(orderBy: position_ASC) {
			id
			name
			products (filter: { active: true }, orderBy: position_ASC) {
				id
				name
				priceCZK
			}
		}
		Account(id: $id) {
   		id
    	name
    	balanceCZK
  	}
	}
`;

@graphql(categoriesAccountQuery, {
	options: ({ params }) => ({
		variables: {
			id: params.id
		}
	})
})
@graphql(createOrderMutation, {
	name: 'createOrder'
})
@graphql(addCreditsMutation, {
	name: 'addCredits'
})
@connect(state => ({ cartProducts: state.cart.products }), { ...cartActions })
export default class CreateOrder extends React.Component<void, Props, State> {

	state: State = {
		creditsDialogOpen: false,
		pinDialogOpen: false,
		dialogOpen: false,
		activeCategoryId: null,
		finalDialog: false,
		orderCreated: false
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	openCreditDialog = (): void => {
		this.setState({
			creditsDialogOpen: true
		});
	};

	closeCreditDialog = (): void => {
		this.setState({
			creditsDialogOpen: false
		});
	};

	openPinDialog = (): void => {
		this.setState({
			pinDialogOpen: true
		});
	};

	closePinDialog = (): void => {
		this.setState({
			pinDialogOpen: false
		});
	};

	openDialog = (categoryId: string): void => {
		this.setState({
			dialogOpen: true,
			activeCategoryId: categoryId
		});
	};

	closeDialog = (): void => {
		this.setState({
			dialogOpen: false,
			activeCategoryId: null
		});
	};

	handleOrder = async (finalPrice: number): Promise<void> => {
		const { id, balanceCZK } = this.props.data.Account;
		const products = this.props.cartProducts;

		const finalBalance = balanceCZK - finalPrice;
		const productIds = Object.keys(products);
		const productsRaw = JSON.stringify(products);

		this.setState({
			pinDialogOpen: false,
			finalDialog: true
		});

		try {
			await this.props.createOrder({ variables: { id, productIds, finalPrice, finalBalance, productsRaw } });

			this.setState({
				orderCreated: true
			}, async () => {
				this.props.resetCart();
				await delay(1000);
				browserHistory.push('/');
			});
		}
		catch (error) {
			console.log(error);
		}
	};

	render(): Element<any> {
		const { allCategories } = this.props.data;
		const account: Account = this.props.data.Account;
		const { balanceCZK } = account || 0;
		const { name } = account || '';
		const products = this.props.cartProducts;

		let productKeys: Array<string> = [];
		let finalPrice: number = 0;
		let activeCategory: ?Category = null;

		if (this.state.activeCategoryId) {
			activeCategory = allCategories.find(category => category.id === this.state.activeCategoryId);
		}

		if (this.props.data.loading) {
			return (
				<CircularProgress />
			);
		}

		if (products) {
			productKeys = Object.keys(products);

			productKeys.forEach(productId => (
				finalPrice += products[productId].priceCZK * products[productId].amount
			));
		}

		return (
			<div {...containerStyle}>
				<Sidebar
					loading={this.props.data.loading}
					balanceCZK={balanceCZK}
					name={name}
					productKeys={productKeys}
					finalPrice={finalPrice}
					groupedProducts={products}
					removeFromCart={(product: Product) => this.props.removeFromCart(product)}
					openPinDialog={() => this.openPinDialog()}
				/>
				<Products
					allCategories={allCategories}
					activeCategory={activeCategory}
					dialogOpen={this.state.dialogOpen}
					openDialog={(categoryId: string) => this.openDialog(categoryId)}
					closeDialog={() => this.closeDialog()}
					addToCart={(product: Product) => this.props.addToCart(product)}
				/>
				<Dialog
					modal
					open={this.state.finalDialog}
					bodyStyle={{
						textAlign: 'center',
						fontSize: 24
					}}
				>
					{!this.state.orderCreated &&
					<CircularProgress thickness={7} size={100} />
					}
					{this.state.orderCreated &&
					<div>
						<SuccessIcon color={green500} style={{ width: '100px', height: '100px' }} />
						<br />
						Your order was completed successfully
					</div>
					}
				</Dialog>
				<ActionButton secondary action={() => this.openCreditDialog()} />
				<PinDialog
					errorText="Wrong PIN Number"
					dialogOpen={this.state.pinDialogOpen}
					handleClose={() => this.closePinDialog()}
					action={() => this.handleOrder(finalPrice)}
				/>
				<NumberDialog
					title="Add credits"
					errorText="Wrong input"
					dialogOpen={this.state.creditsDialogOpen}
					refetch={this.props.data.refetch.bind(this)}
					handleClose={() => this.closeCreditDialog()}
					action={(addBalance: number) => this.props.addCredits({
							variables: {
								id: this.props.data.Account.id,
								finalBalance: this.props.data.Account.balanceCZK + addBalance,
								amount: addBalance
							}
						}
					)}
				/>
			</div>
		);
	}
};
