// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog/index';
import FlatButton from 'material-ui/FlatButton/index';
import TextField from 'material-ui/TextField/index';
import SHA256 from 'js-sha256';
import { css } from 'glamor';

import delay from '../helpers/delay';
import vibrate from '../helpers/vibrate';
import { MASTER_PIN } from '../config/index';

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

const labelStyle = {
	margin: 5,
	height: 40,
	fontSize: 28
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

	pinInput = (numberClicked: number) => {
		vibrate();

		this.setState({
			inputPinNumber: this.state.inputPinNumber + numberClicked.toString()
		}, () => this.checkPinNumber());
	};

	checkPinNumber = async () => {
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

	handleClose = () => {
		this.setState(initialState);
		this.props.handleClose();
	};

	render() {
		return (
			<Dialog
				title={this.props.title}
				onRequestClose={this.handleClose.bind(this)}
				actions={
					<FlatButton
						label="Cancel"
						primary={true}
						onTouchTap={this.handleClose.bind(this)}
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
				<FlatButton label="1" onClick={() => this.pinInput(1)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="2" onClick={() => this.pinInput(2)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="3" onClick={() => this.pinInput(3)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="4" onClick={() => this.pinInput(4)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="5" onClick={() => this.pinInput(5)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="6" onClick={() => this.pinInput(6)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="7" onClick={() => this.pinInput(7)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="8" onClick={() => this.pinInput(8)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="9" onClick={() => this.pinInput(9)} style={labelStyle} labelStyle={labelStyle} />
				<FlatButton label="0" onClick={() => this.pinInput(0)} style={labelStyle} labelStyle={labelStyle} />
			</Dialog>
		);
	}
};