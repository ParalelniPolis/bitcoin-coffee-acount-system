// @flow
import React, { Element } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { sumBy } from 'lodash';
import moment from 'moment';
import CircularProgress from 'material-ui/CircularProgress/index';
import {
	Paper,
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
	DatePicker
} from 'material-ui';

import type { Product } from '../types/Product';

type Order = {
	priceCZK: number,
	products: Array<Product>
}

type creditTransaction = {
	amount: number
}

type Account = {
	id: string,
	name: string,
	orders: Array<Order>,
	creditTransactions: Array<creditTransaction>
}

type Props = {
	data: {
		loading: boolean,
		allAccounts: Array<Account>,
		variables: {
			dateFrom: string,
			dateTo: string
		},
		refetch: Function
	}
}

const lastMonthStart = moment()
	.subtract(1, 'month')
	.set({ date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
	.format();
const lastMonthEnd = moment()
	.set({ date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
	.subtract(1, 'millisecond')
	.format();

const MonthlyOrdersQuery = gql`query allOrders($dateFrom: DateTime!, $dateTo: DateTime!) {
  allAccounts(orderBy: name_ASC) {
  	id
  	name
  	orders(filter: {
			AND:[{
				createdAt_gte: $dateFrom
			}, {
				createdAt_lte: $dateTo
			}
		]}) {
  		priceCZK
  	}
  	creditTransactions(filter: {
  		AND:[{
				createdAt_gte: $dateFrom
			}, {
				createdAt_lte: $dateTo
			}]
  	}) {
  		amount
  	}
  }
}`;

@graphql(MonthlyOrdersQuery, {
	options: () => ({
		variables: {
			dateFrom: lastMonthStart,
			dateTo: lastMonthEnd
		}
	})
})
export default class MonthlyPage extends React.PureComponent<void, Props, void> {

	changeDateFrom = (dateFrom: string): void => {
		this.props.data.refetch({dateFrom: moment(dateFrom).format() });
	};

	changeDateTo = (dateTo: string): void => {
		this.props.data.refetch({ dateTo: moment(dateTo).set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).format() });
	};

	render(): ?Element<any> {
		if (this.props.data.loading) {
			return <CircularProgress />;
		}

		const allAccounts: Array<Account> = this.props.data.allAccounts;
		let ordersTotal = 0;
		let creditsTotal = 0;

		return (
			<div style={{ maxWidth: 800, marginTop: 10, height: 'auto', overflow: 'auto' }}>
				<Paper style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
					<h2>Choose date</h2>
					<DatePicker name="fromDate"
											defaultDate={new Date(this.props.data.variables.dateFrom)} floatingLabelText="From date"
											mode="landscape" onChange={(event, date) => this.changeDateFrom(date)} />
					<DatePicker name="toDate"
											defaultDate={new Date(this.props.data.variables.dateTo)} floatingLabelText="To date"
											mode="landscape" onChange={(event, date) => this.changeDateTo(date)} />
				</Paper>
				<Table style={{ maxWidth: 800, marginTop: 10 }}>
					<TableHeader displaySelectAll={false}>
						<TableRow>
							<TableHeaderColumn style={{ textAlign: 'left' }}>
								Name
							</TableHeaderColumn>
							<TableHeaderColumn style={{ textAlign: 'right' }}>
								Amount CZK
							</TableHeaderColumn>
							<TableHeaderColumn style={{ textAlign: 'right' }}>
								Added credits in CZK
							</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{
							allAccounts.map((account) => {
								const id = account.id;
								const name = account.name;

								const userOrdersTotal = sumBy(account.orders, 'priceCZK') || 0;

								const accountWithCredits = allAccounts.find(account => account.id === id);
								const accountCreditsAdded = (accountWithCredits && sumBy(accountWithCredits.creditTransactions, 'amount')) || 0;

								ordersTotal += userOrdersTotal;
								creditsTotal += accountCreditsAdded;

								return (
									<TableRow key={id}>
										<TableRowColumn>{name}</TableRowColumn>
										<TableRowColumn style={{ textAlign: 'right' }}>{userOrdersTotal} CZK</TableRowColumn>
										<TableRowColumn style={{ textAlign: 'right' }}>{accountCreditsAdded} CZK</TableRowColumn>
									</TableRow>
								);
							})
						}
						<TableRow>
							<TableRowColumn><strong>Total</strong></TableRowColumn>
							<TableRowColumn style={{ textAlign: 'right' }}><strong>{ordersTotal} CZK</strong></TableRowColumn>
							<TableRowColumn style={{ textAlign: 'right' }}><strong>{creditsTotal} CZK</strong></TableRowColumn>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}
};
