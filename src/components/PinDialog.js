// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog/index';
import FlatButton from 'material-ui/FlatButton/index';
import TextField from 'material-ui/TextField/index';
import SHA256 from 'js-sha256';
import { css } from 'glamor';

import Keypad from './Keypad';

import delay from '../helpers/delay';
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
	dialogOpen: boolean
}

type State = {
	inputPinNumber: string,
	pinErrorText: string
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
	pinErrorText: ''
};

export default class PinDialog extends React.PureComponent<DefaultProps, Props, State> {

	static defaultProps = {
		title: 'Enter Master PIN',
		errorText: 'Wrong number',
		userPinNumber: MASTER_PIN
	};

	state: State = initialState;

	pinInput = (numberClicked: number): void => {
		this.setState({
			inputPinNumber: this.state.inputPinNumber + numberClicked.toString()
		}, () => this.checkPinNumber());
	};

	checkPinNumber = async (): Promise<void> => {
		if (this.state.inputPinNumber.length === 4) {
			if (SHA256(this.state.inputPinNumber) === this.props.userPinNumber) {
				await delay(200);
				this.props.action();
			}
			else {
				this.setState({
					inputPinNumber: '',
					pinErrorText: this.props.errorText
				});
			}
		}
	};

	handleClose = (): void => {
		this.setState(initialState);
		this.props.handleClose();
	};

	render(): Element<any> {
		return (
			<Dialog
				title={this.props.title}
				onRequestClose={() => this.handleClose()}
				actions={
					<FlatButton
						label="Cancel"
						primary={true}
						onTouchTap={() => this.handleClose()}
					/>
				}
				contentStyle={dialogStyle}
				open={this.props.dialogOpen}
			>
				<TextField
					value={this.state.inputPinNumber}
					errorText={this.state.pinErrorText}
					type="password"
					style={{ fontSize: 70 }}
					name="pin-number"
					fullWidth
					disabled
					{...textInputStyle}
				/>
				<Keypad input={value => this.pinInput(value)} />
			</Dialog>
		);
	}
};