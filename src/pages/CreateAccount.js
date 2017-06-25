// @flow
import React from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Divider from 'material-ui/Divider/index';
import Paper from 'material-ui/Paper/index';
import TextField from 'material-ui/TextField/index';
import RaisedButton from 'material-ui/RaisedButton/index';
import Snackbar from 'material-ui/Snackbar/index';
import { css } from 'glamor';

type Props = {
	createAccount: Function
}

type State = {
	snackbar: boolean,
	missingName: string
}

const paperStyle = css({
	width: '50%',
	padding: '20px',
	textAlign: 'center'
});

const CreateAccountMutation = gql`
	mutation createAccount($name: String!) {
		createAccount(
			name: $name
			balanceCZK: 0
		) {
			id
		}
	}`;

@graphql(CreateAccountMutation, {
	name: 'createAccount'
})
export default class CreateAccount extends React.Component<void, Props, State> {

	state: State = {
		snackbar: false,
		missingName: ''
	};

	closeSnackBar = () => {
		this.setState({
			snackbar: false
		});
	};

	handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (event.target instanceof HTMLInputElement) {
			const { name } = event.target;

			if (name.value === '') {
				this.setState({
					missingName: 'Name is required'
				});

				return false;
			}

			try {
				await this.props.createAccount({
					variables: {
						name: name.value
					}
				});

				browserHistory.push('/');
			}
			catch (error) {
				console.log(error);

				this.setState({
					snackbar: true
				});
			}
		}
	};

	render() {
		return (
			<Paper zDepth={2} {...paperStyle}>
				<h1>Create new account</h1>
				<Divider />
				<form action="/create-user" name="create-user" method="POST"
							onSubmit={(event) => this.handleSubmit(event)}>
					<TextField name="name" hintText="Name" errorText={this.state.missingName} autoComplete="off" fullWidth />
					<RaisedButton type="submit" style={{ marginTop: '20px' }} label="Create account" primary fullWidth />
				</form>
				<Snackbar
					open={this.state.snackbar}
					message="User with this name already exists."
					autoHideDuration={4000}
					onRequestClose={this.closeSnackBar}
				/>
			</Paper>
		);
	}
};
