// @flow
import React from 'react';
import Paper from 'material-ui/Paper/index';
import Subheader from 'material-ui/Subheader/index';
import { List, ListItem } from 'material-ui/List/index';
import Divider from 'material-ui/Divider/index';
import RaisedButton from 'material-ui/RaisedButton/index';
import LinearProgress from 'material-ui/LinearProgress/index';
import { css } from 'glamor';

import { MAX_DEBT } from '../config';

import type { Element } from 'react';

type Props = {
	loading: boolean,
	balanceCZK: number,
	name: string,
	productKeys: Array<string>,
	finalPrice: number,
	groupedProducts: Object,
	removeFromCart: Function,
	openPinDialog: Function
}

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

const Sidebar = ({ loading, balanceCZK, name, productKeys, finalPrice, groupedProducts, removeFromCart, openPinDialog }: Props): Element<Paper> => (
	<Paper {...sidebarStyle}>
		<Subheader style={{ lineHeight: '16px' }}>
			{loading &&
			<LinearProgress mode="indeterminate" />
			}
			{!loading &&
			<h3>{name}: {balanceCZK} CZK</h3>
			}
		</Subheader>
		<Divider />
		<Subheader>
			<h3 style={{ lineHeight: '16px' }}>Order</h3>
		</Subheader>
		<Divider />
		<List {...sidebarItemWrapperStyle}>
			{productKeys.length > 0 && productKeys.map((productGroupKey) => {
				const productGroup = groupedProducts[productGroupKey];

				return [
					<ListItem
						key={productGroup.id}
						onClick={() => removeFromCart(productGroup)}
						{...sidebarItemStyle}
					>
						<span {...sidebarItemNameStyle}><strong>{productGroup.amount}x</strong> {productGroup.name}</span>
						<span {...sidebarItemPriceStyle}><strong>{productGroup.amount * productGroup.priceCZK}
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
					onTouchTap={() => openPinDialog()}
				/>
			</Paper>
		</div>
	</Paper>
);

export default Sidebar;