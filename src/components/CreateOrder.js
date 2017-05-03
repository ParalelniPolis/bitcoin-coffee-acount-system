import React from 'react';
import _ from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TouchRipple from 'material-ui/internal/TouchRipple';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import SuccessIcon from 'material-ui/svg-icons/action/done';
import { green500 } from 'material-ui/styles/colors';
import { css } from 'glamor';
import PropTypes from 'prop-types';

import delay from '../helpers/delay';
import vibrate  from '../helpers/vibrate';

import ActionButton from './ActionButton';
import PinDialog from './PinDialog';
import NumberDialog from './NumberDialog';

const containerStyle = css({
		alignSelf: 'stretch',
		flex: 1,
		display: 'flex',
		flexDirection: 'row'
});

const contentStyle = css({
		alignSelf: 'flex-start',
		flexWrap: 'wrap',
		display: 'flex'
});

const paperStyle = css({
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: '3px 20px',
		margin: '10px',
		width: '170px',
		textAlign: 'left'
});

const sidebarStyle = css({
		display: 'flex',
		flexDirection: 'column',
		width: '360px',
		textAlign: 'center'
});

const sidebarItemWrapperStyle = css({
		width: '100%',
		overflowY: 'auto'
});

const sidebarItemStyle = css({
		flex: 1,
		fontSize: '20px!important',
		lineHeight: '20px!important',
		height: '52px!important',
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
		paddingTop: '16px'
});

class CreateOrder extends React.Component {

		static propTypes = {
				createOrder: PropTypes.func
		};

		constructor(props) {
				super(props);

				this.addToCart = this.addToCart.bind(this);

				this.state = {
						creditsDialogOpen: false,
						pinDialogOpen: false,
						dialogOpen: false,
						activeCategoryId: null,
						products: [],
						finalDialog: false,
						orderCreated: false
				};
		}

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
						products: _.filter(this.state.products, (product, index) => index !== indexToRemove)
				});
		}

		handleOrder = async (finalPrice) => {
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
				const account = this.props.data.Account;
				const { balanceCZK } = account || 0;
				const { name } = account || '';
				const { products } = this.state;
				const activeCategory = this.state.activeCategoryId && _.find(allCategories, category => category.id === this.state.activeCategoryId);

				let groupedProducts = {};
				let productKeys = [];
				let finalPrice = 0;

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
										<Subheader>
												{this.props.data.loading &&
												<LinearProgress mode="indeterminate"/>
												}
												{!this.props.data.loading &&
												<h2>{name}: {balanceCZK} CZK</h2>
												}
										</Subheader>
										<Divider/>
										<Subheader>
												<h3>Order</h3>
										</Subheader>
										<Divider/>
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
																disabled={balanceCZK - finalPrice < -30 || finalPrice === 0}
																labelStyle={{
																		fontSize: '32px',
																		textTransform: 'none'
																}}
																style={{ margin: '20px 0 0' }}
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
																<h2>{category.name}</h2>
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
														width: '810px',
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
																		<h2>{product.name}</h2>
																		<h3>{product.priceCZK} CZK</h3>
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
												fontSize: '32px'
										}}
								>
										{!this.state.orderCreated &&
										<CircularProgress thickness={7} size={100}/>
										}
										{this.state.orderCreated &&
										<div>
												<SuccessIcon color={green500} style={{ width: '100px', height: '100px' }}/>
												<br/>
												Your order was completed successfully
										</div>
										}
								</Dialog>
								<ActionButton secondary action={() => this.openCreditDialog()}/>
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
		allCategories {
			id
			name
			products (filter: { active: true }) {
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
