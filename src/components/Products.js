// @flow
import React from 'react';
import Paper from 'material-ui/Paper/index';
import Dialog from 'material-ui/Dialog/index';
import TouchRipple from 'material-ui/internal/TouchRipple';
import FlatButton from 'material-ui/FlatButton/index';
import { css } from 'glamor';

import type { Element } from 'react';
import type { Category } from '../types/Category';

type Props = {
	allCategories: Array<Category>,
	activeCategory: ?Category,
	dialogOpen: boolean,
	openDialog: Function,
	closeDialog: Function,
	addToCart: Function
}

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

export default ({ allCategories, activeCategory, dialogOpen, openDialog , closeDialog, addToCart }: Props): Element<any> => (
	<div {...contentStyle}>
		{allCategories && allCategories.map(category => (
			<Paper
				key={category.id}
				onClick={() => openDialog(category.id)}
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
			onRequestClose={() => closeDialog()}
			open={dialogOpen}
			actions={
				<FlatButton
					label="OK"
					primary={true}
					onTouchTap={() => closeDialog()}
				/>
			}
		>
			{activeCategory && activeCategory.products.map(product => (
				<Paper
					key={product.id}
					onClick={() => addToCart(product)}
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
)