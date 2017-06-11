// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog/index';
import FlatButton from 'material-ui/FlatButton/index';
import TextField from 'material-ui/TextField/index';
import { css } from 'glamor';

import vibrate from '../helpers/vibrate';

import PinDialog from './PinDialog';

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

	pinInput = (numberClicked: number) => {
		vibrate();

		this.setState({
			inputPinNumber: this.state.inputPinNumber + numberClicked.toString()
		});
	};

	handleClose = () => {
		this.props.handleClose();
		this.setState(initialState);
		this.props.refetch();
	};

	handleAddCredits = async () => {
		if (this.state.inputPinNumber) {
			await this.props.action(parseInt(this.state.inputPinNumber, 10));

			this.handleClose();
		}
	};

	enterMasterPin = () => {
		this.setState({
			pinEnter: true
		});
	};

	render() {
		if (this.state.pinEnter) {
			return (
				<PinDialog
					dialogOpen={this.state.pinEnter}
					handleClose={this.handleClose}
					action={this.handleAddCredits}
				/>
			);
		}

		return (
			<Dialog
				title={this.props.title}
				onRequestClose={this.handleClose}
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
							onTouchTap={this.handleClose}
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