import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { css } from 'glamor';
import PropTypes from 'prop-types';

import vibrate from '../helpers/vibrate';

import ActionButton from './ActionButton';
import PinDialog from './PinDialog';

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

const initialState = {
		dialogOpen: false,
		accountId: null,
		userPinNumber: null
};

class AccountsPage extends React.Component {
		static propTypes = {
				data: PropTypes.object
		};

		constructor(props) {
				super(props);

				this.state = initialState;
		}

		componentDidUpdate() {
				this.props.data.refetch();
		}

		handleOpen(accountId, userPinNumber) {
				vibrate();

				this.setState({
						dialogOpen: true,
						accountId,
						userPinNumber
				});
		};

		handleClose() {
				this.setState(initialState);
		};

		render() {
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
														onClick={() => this.handleOpen(account.id, account.pin)}
												/>
										))}
										<PinDialog
												title={this.state.userPinNumber ? 'Enter your PIN' : undefined}
												errorText="Wrong PIN Number"
												dialogOpen={this.state.dialogOpen}
												userPinNumber={this.state.userPinNumber || undefined}
												handleClose={this.handleClose.bind(this)}
												action={() => browserHistory.push(`/create/${this.state.accountId}`)}
										/>
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
    pin
  }
}`;

const AccountsPageWithData = graphql(FeedQuery)(AccountsPage);

export default AccountsPageWithData;
