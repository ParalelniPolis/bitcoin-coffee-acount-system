import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { css } from 'glamor';

import ActionButton from './ActionButton';
import PinDialog from './PinDialog';

const paperStyle = css({
		width: '50%',
		padding: '20px',
		textAlign: 'center'
});

const listStyle = css({
		maxHeight: '500px',
		overflowY: 'auto'
});

const listItemStyle = {
		padding: '10px',
		fontSize: '24px'
};

const initialState = {
		dialogOpen: false,
		accountId: null,
		userPinNumber: null
};

class AccountsPage extends React.Component {
		static propTypes = {
				data: React.PropTypes.object
		};

		constructor(props) {
				super(props);

				this.state = initialState;
		}

		handleOpen(accountId, userPinNumber) {
				window.navigator.vibrate(50);

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
