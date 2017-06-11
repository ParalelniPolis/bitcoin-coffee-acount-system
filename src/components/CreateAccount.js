// @flow
import React from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SHA256 from 'js-sha256';
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

class CreateAccount extends React.Component<void, Props, State> {

	state: State = {
		snackbar: false,
		missingName: ''
	};

	closeSnackBar = () => {
		this.setState({
			snackbar: false
		});
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		const { name, pin } = event.target;

		if (name.value === '') {
			this.setState({
				missingName: 'Name is required'
			});

			return false;
		}

		try {
			await this.props.createAccount({
				variables: {
					name: name.value,
					pin: pin.value ? SHA256(pin.value) : null
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
	};

	render() {
		return (
			<Paper zDepth={2} {...paperStyle}>
				<h1>Create new account</h1>
				<Divider />
				<form action="/create-user" name="create-user" method="POST"
							onSubmit={(event) => this.handleSubmit(event)}>
					<TextField name="name" hintText="Name" errorText={this.state.missingName} autoComplete="off" fullWidth />
					<TextField name="pin" hintText="PIN" type="password" minLength={4} maxLength={4} autoComplete="off"
										 inputMode="numeric" fullWidth />
					<RaisedButton type="submit" style={{ marginTop: '20px' }} label="Create User" primary fullWidth />
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
}

const CreateAccountMutation = gql`
	mutation createAccount($name: String!, $pin: String) {
		createAccount(
			name: $name
			pin: $pin
			balanceCZK: 0
		) {
			id
		}
	}`;

const CreateAccountPage = graphql(CreateAccountMutation, {
	name: 'createAccount'
})(CreateAccount);

export default  CreateAccountPage;