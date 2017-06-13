// @flow
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress/index';
import Paper from 'material-ui/Paper/index';
import { List, ListItem } from 'material-ui/List/index';
import Divider from 'material-ui/Divider/index';
import { css } from 'glamor';
import ActionButton from './ActionButton';

import type { Element } from 'react';

type Account = {
	name: string,
	id: string
}

type Props = {
	data: {
		loading: boolean,
		refetch: Function,
		allAccounts: Array<Account>
	}
}

const paperStyle = css({
		width: 400,
		padding: 10,
		textAlign: 'center'
});

const listStyle = css({
		maxHeight: 400,
		overflowY: 'auto'
});

const listItemStyle = {
		padding: 5,
		fontSize: 16
};

class AccountsPage extends React.PureComponent<void, Props, void> {

		componentDidUpdate() {
				this.props.data.refetch();
		}

		render(): Element<any> {
				if (this.props.data.loading) {
						return (
								<CircularProgress />
						);
				}

				return (
						<Paper zDepth={2} {...paperStyle}>
								<List {...listStyle}>
										<h1>Choose your account</h1>
										<Divider />
										{this.props.data.allAccounts.map(account => (
												<ListItem
														primaryText={account.name}
														key={account.id}
														style={listItemStyle}
														onClick={() => browserHistory.push(`/create/${account.id}`)}
												/>
										))}
								</List>
								<ActionButton action={() => browserHistory.push('/create-account/')}/>
						</Paper>
				);
		}
}

const FeedQuery = gql`query allAccounts {
  allAccounts {
    id
    name
  }
}`;

const AccountsPageWithData = graphql(FeedQuery)(AccountsPage);

export default AccountsPageWithData;
