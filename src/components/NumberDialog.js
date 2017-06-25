// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog/index';
import FlatButton from 'material-ui/FlatButton/index';
import TextField from 'material-ui/TextField/index';
import { css } from 'glamor';

import PinDialog from './PinDialog';
import Keypad from './Keypad';

import { MASTER_PIN } from '../config/index';

import type { Element } from 'react';

type DefaultProps = {
	title: string,
	errorText: string,
	userPinNumber: string
}

type Props = {
	title?: string,
	errorText?: string,
	userPinNumber?: string,
	action: Function,
	handleClose: Function,
	refetch: Function,
	dialogOpen: boolean
}

type State = {
	inputPinNumber: string,
	pinErrorText: string,
	pinEnter: boolean
}

const dialogStyle = {
	width: 350,
	maxWidth: 'none',
	textAlign: 'center',
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	alignItems: 'stretch'
};

const textInputStyle = css({
	textAlign: 'center'
});

const initialState = {
	inputPinNumber: '',
	pinErrorText: '',
	pinEnter: false
};

export default class NumberDialog extends React.PureComponent<DefaultProps, Props, State> {

	static defaultProps = {
		title: 'Enter Master PIN',
		errorText: 'Wrong number',
		userPinNumber: MASTER_PIN
	};

	state: State = initialState;

	pinInput = (numberClicked: number): void => {
		this.setState({
			inputPinNumber: this.state.inputPinNumber + numberClicked.toString()
		});
	};

	handleClose = (): void => {
		this.props.handleClose();
		this.setState(initialState);
		this.props.refetch();
	};

	handleAddCredits = async (): Promise<void> => {
		if (this.state.inputPinNumber) {
			await this.props.action(parseInt(this.state.inputPinNumber, 10));

			this.handleClose();
		}
	};

	enterMasterPin = (): void => {
		this.setState({
			pinEnter: true
		});
	};

	render(): Element<any> {
		if (this.state.pinEnter) {
			return (
				<PinDialog
					dialogOpen={this.state.pinEnter}
					handleClose={() => this.handleClose()}
					action={() => this.handleAddCredits()}
				/>
			);
		}

		return (
			<Dialog
				title={this.props.title}
				onRequestClose={() => this.handleClose()}
				actions={
					[
						<FlatButton
							label="OK"
							primary={true}
							onTouchTap={() => this.enterMasterPin()}
						/>,
						<FlatButton
							label="Cancel"
							primary={true}
							onTouchTap={() => this.handleClose()}
						/>
					]
				}
				contentStyle={dialogStyle}
				open={this.props.dialogOpen}
			>
				<TextField
					value={this.state.inputPinNumber}
					errorText={this.state.pinErrorText}
					type="text"
					style={{ fontSize: 24 }}
					name="pin-number"
					fullWidth
					disabled
					{...textInputStyle}
				/>
				<Keypad pinInput={value => this.pinInput(value)} />
			</Dialog>
		);
	}
};