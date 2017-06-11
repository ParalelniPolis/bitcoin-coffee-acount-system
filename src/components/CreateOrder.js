// @flow
import React from 'react';
import _ from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List/index';
import Subheader from 'material-ui/Subheader/index';
import Divider from 'material-ui/Divider/index';
import Paper from 'material-ui/Paper/index';
import Dialog from 'material-ui/Dialog/index';
import TouchRipple from 'material-ui/internal/TouchRipple';
import FlatButton from 'material-ui/FlatButton/index';
import RaisedButton from 'material-ui/RaisedButton/index';
import CircularProgress from 'material-ui/CircularProgress/index';
import LinearProgress from 'material-ui/LinearProgress/index';
import SuccessIcon from 'material-ui/svg-icons/action/done';
import { green500 } from 'material-ui/styles/colors';
import { css } from 'glamor';

import { MAX_DEBT } from '../config';

import delay from '../helpers/delay';
import vibrate  from '../helpers/vibrate';

import ActionButton from './ActionButton';
import PinDialog from './PinDialog';
import NumberDialog from './NumberDialog';

type Account = {
	id: string,
	name: string,
	pin: string,
	balanceCZK: number
}

type Product = {
	id: string,
	name: string,
	priceCZK: number
}

type Category = {
	id: string,
	name: string,
	products: Array<Product>
}

type Props = {
	createOrder: Function,
	addCredits: Function,
	data: {
		refetch: Function,
		Account: Account,
		allCategories: Array<Category>
	}
}

type State = {
	creditsDialogOpen: boolean,
	pinDialogOpen: boolean,
	dialogOpen: boolean,
	activeCategoryId: ?string,
	products: Array<Product>,
	finalDialog: boolean,
	orderCreated: boolean
}

const containerStyle = css({
	alignSelf: 'stretch',
	flex: 1,
	display: 'flex',
	flexDirection: 'row'
});

const contentStyle = css({
	alignSelf: 'flex-start',
	flexWrap: 'wrap',
	flex: 2.5,
	display: 'flex'
});

const paperStyle = css({
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	padding: '3px 14px',
	margin: '8px',
	width: '150px',
	textAlign: 'left'
});

const sidebarStyle = css({
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	textAlign: 'center'
});

const sidebarItemWrapperStyle = css({
	width: '100%',
	overflowY: 'auto'
});

const sidebarItemStyle = css({
	flex: 1,
	fontSize: '16px!important',
	lineHeight: '16px!important',
	height: '50px!important',
	'::before, ::after': {
		content: '',
		display: 'table',
		clear: 'both'
	}
});

const sidebarItemNameStyle = css({
	float: 'left'
});

const sidebarItemPriceStyle = css({
	float: 'right'
});

const sidebarTotalWrapperStyle = css({
	flexGrow: 1,
	flexShrink: 0,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end'
});

const sidebarTotalStyle = css({
	paddingTop: 12
});

class CreateOrder extends React.Component<void, Props, State> {

	state: State = {
	creditsDialogOpen: false,
	pinDialogOpen: false,
	dialogOpen: false,
	activeCategoryId: null,
	products: [],
	finalDialog: false,
	orderCreated: false
};

	componentDidMount() {
		this.props.data.refetch();
	}

	openCreditDialog() {
		this.setState({
			creditsDialogOpen: true
		});
	}

	closeCreditDialog() {
		this.setState({
			creditsDialogOpen: false
		});
	}

	openPinDialog() {
		vibrate();

		this.setState({
			pinDialogOpen: true
		});
	}

	closePinDialog() {
		this.setState({
			pinDialogOpen: false
		});
	}

	openDialog(categoryId) {
		vibrate();

		this.setState({
			dialogOpen: true,
			activeCategoryId: categoryId
		});
	}

	closeDialog() {
		vibrate();

		this.setState({
			dialogOpen: false,
			activeCategoryId: null
		});
	}

	addToCart(product) {
		vibrate();

		this.setState({
			products: [...this.state.products, product]
		});
	}

	removeFromCart(productToRemove) {
		vibrate();

		const indexToRemove = _.findIndex(this.state.products, product => product.id === productToRemove.id);
		this.setState({
			products: this.state.products.filter((product, index) => index !== indexToRemove)
		});
	}

	handleOrder = async (finalPrice: number) => {
		const { id, balanceCZK } = this.props.data.Account;
		const { products } = this.state;

		const finalBalance = balanceCZK - finalPrice;
		const productIds = products.map(product => product.id);

		this.setState({
			pinDialogOpen: false,
			finalDialog: true
		});

		try {
			await this.props.createOrder({ variables: { id, productIds, finalPrice, finalBalance } });

			this.setState({
				orderCreated: true
			}, async () => {
				await delay(1000);
				browserHistory.push('/');
			});
		}
		catch (error) {
			console.log(error);
		}
	};

	render() {
		const { allCategories } = this.props.data;
		const account: Account = this.props.data.Account;
		const { balanceCZK } = account || 0;
		const { name } = account || '';
		const { products } = this.state;
		const activeCategory = this.state.activeCategoryId && _.find(allCategories, category => category.id === this.state.activeCategoryId);

		let groupedProducts: Object = {};
		let productKeys: Array<string> = [];
		let finalPrice: number = 0;

		if (this.props.data.loading) {
			return (
				<CircularProgress />
			);
		}

		if (products) {
			groupedProducts = _.groupBy(products, 'id');
			productKeys = Object.keys(groupedProducts);

			products.forEach(product => (
				finalPrice += product.priceCZK
			));
		}

		return (
			<div {...containerStyle}>
				<Paper {...sidebarStyle}>
					<Subheader style={{ lineHeight: '16px' }}>
						{this.props.data.loading &&
						<LinearProgress mode="indeterminate" />
						}
						{!this.props.data.loading &&
						<h3>{name}: {balanceCZK} CZK</h3>
						}
					</Subheader>
					<Divider />
					<Subheader>
						<h3 style={{ lineHeight: '16px' }}>Order</h3>
					</Subheader>
					<Divider />
					<List {...sidebarItemWrapperStyle}>
						{productKeys.length > 0 && _.map(productKeys, (productGroupKey, index) => {
							const productGroup = groupedProducts[productGroupKey];
							const product = productGroup[0];

							return [
								<ListItem
									key={product.id + index}
									onClick={() => this.removeFromCart(product)}
									{...sidebarItemStyle}
								>
									<span {...sidebarItemNameStyle}><strong>{productGroup.length}x</strong> {product.name}</span>
									<span {...sidebarItemPriceStyle}><strong>{productGroup.length * product.priceCZK}
										CZK</strong></span>
								</ListItem>,
								<Divider />
							];

						})}
					</List>
					<div {...sidebarTotalWrapperStyle}>
						<Paper>
							<div {...sidebarTotalStyle}>
								<strong>Total: {finalPrice} CZK</strong>
							</div>
							<RaisedButton
								primary
								fullWidth
								disabled={balanceCZK - finalPrice < -MAX_DEBT || finalPrice === 0}
								labelStyle={{
									fontSize: 24,
									textTransform: 'none'
								}}
								style={{ margin: '14px 0 0' }}
								label="Checkout"
								onTouchTap={() => this.openPinDialog()}
							/>
						</Paper>
					</div>
				</Paper>
				<div {...contentStyle}>
					{allCategories && allCategories.map(category => (
						<Paper
							key={category.id}
							onClick={() => this.openDialog(category.id)}
							{...paperStyle}
						>
							<TouchRipple>
								<h3>{category.name}</h3>
							</TouchRipple>
						</Paper>
					))}
					<Dialog
						title={activeCategory && activeCategory.name}
						autoScrollBodyContent
						bodyStyle={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							alignItems: 'stretch',
							justifyContent: 'flex-start'
						}}
						contentStyle={{
							width: 810,
							maxWidth: '100%',
							textAlign: 'center'
						}}
						onRequestClose={this.closeDialog.bind(this)}
						open={this.state.dialogOpen}
						actions={
							<FlatButton
								label="OK"
								primary={true}
								onTouchTap={this.closeDialog.bind(this)}
							/>
						}
					>
						{activeCategory && activeCategory.products.map(product => (
							<Paper
								key={product.id}
								onClick={() => this.addToCart(product)}
								{...paperStyle}
							>
								<TouchRipple>
									<h3>{product.name}</h3>
									<h4>{product.priceCZK} CZK</h4>
								</TouchRipple>
							</Paper>
						))}
					</Dialog>
				</div>
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
					title={this.props.data.Account.pin ? 'Enter your PIN' : undefined}
					errorText="Wrong PIN Number"
					dialogOpen={this.state.pinDialogOpen}
					userPinNumber={this.props.data.Account.pin || undefined}
					handleClose={this.closePinDialog.bind(this)}
					action={() => this.handleOrder(finalPrice)}
				/>
				<NumberDialog
					title="Add credits"
					errorText="Wrong input"
					dialogOpen={this.state.creditsDialogOpen}
					refetch={this.props.data.refetch.bind(this)}
					handleClose={this.closeCreditDialog.bind(this)}
					action={(addBalance) => this.props.addCredits({
							variables: {
								id: this.props.data.Account.id,
								finalBalance: this.props.data.Account.balanceCZK + addBalance
							}
						}
					)}
				/>
			</div>
		);
	}
}

const addCreditsMutation = gql`
	mutation addCredits($id: ID!, $finalBalance: Int!) {
		updateAccount(
      id: $id
      balanceCZK: $finalBalance
    ) {
    	id
    	balanceCZK
  	}
	}
`;

const createOrderMutation = gql`
  mutation createOrder($id: ID!, $productIds: [ID!], $finalPrice: Int!, $finalBalance: Int!) {
  	createOrder(
  		accountId: $id
  		productsIds: $productIds
  		priceCZK: $finalPrice
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
    	pin
    	balanceCZK
  	}
	}
`;

const OrderPage = compose(
	graphql(addCreditsMutation, {
		name: 'addCredits'
	}),
	graphql(createOrderMutation, {
		name: 'createOrder'
	}),
	graphql(categoriesAccountQuery, {
		options: ({ params }) => ({
			variables: {
				id: params.id
			}
		})
	})
)(CreateOrder);

export default OrderPage;
