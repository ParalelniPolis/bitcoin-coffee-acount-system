// @flow
import React, { Element } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { groupBy, sum } from 'lodash';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui';

type Product = {
	name: string,
	priceCZK: number
}

type Order = {
	priceCZK: number,
	account: {
		id: string,
		name: string
	},
	products: Array<Product>
}

type Account = {
	id: string,
	name: string,
	balanceCZK: number
}

type GroupedOrders = {
	[account_id: string]: ?Array<Order>
}

type Props = {
	data: {
		loading: boolean,
		allOrders: Array<Order>,
		allAccounts: Array<Account>
	}
}

const MonthlyOrdersQuery = gql`query allOrders {
  allOrders(filter: {
    AND:[{
      createdAt_gte: "2017-05-01T00:00:00.000Z"
    }, {
      createdAt_lte: "2017-05-31T23:59:59.000Z"
    }
  ]}) {
    account {
    	id
      name
    }
    products {
    	name
    	priceCZK
    }
    priceCZK
  }
  allAccounts {
  	id
  	name
  	balanceCZK
  	orders {
  		priceCZK
  	}
  }
}`;


@graphql(MonthlyOrdersQuery)
export default class MonthlyPage extends React.PureComponent<void, Props, void> {
	render(): ?Element<any> {
		if (this.props.data.loading) {
			return null;
		}

		const groupedOrders: GroupedOrders = groupBy(this.props.data.allOrders, 'account.id');
		console.log(groupedOrders);

		return (
			<Table style={{ maxWidth: 800, marginTop: 10 }}>
				<TableHeader displaySelectAll={false}>
					<TableRow>
						<TableHeaderColumn>
							Name
						</TableHeaderColumn>
						<TableHeaderColumn>
							Amount CZK
						</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody displayRowCheckbox={false}>
					{
						Object.keys(groupedOrders).map((orderGroup) => {

							if (!groupedOrders[orderGroup]) return null;

							const id = groupedOrders[orderGroup][0].account.id;
							const name = groupedOrders[orderGroup][0].account.name;
							const pricesArray = groupedOrders[orderGroup].map(order => order.priceCZK);
							const computedPrice = sum(pricesArray);

							return (
								<TableRow key={id}>
									<TableRowColumn>{name}</TableRowColumn>
									<TableRowColumn style={{ textAlign: 'right' }}>{computedPrice} CZK</TableRowColumn>
								</TableRow>
							);
						})
					}
				</TableBody>
			</Table>
		);
	}
}
