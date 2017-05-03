import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SHA256 from 'js-sha256';
import { css } from 'glamor';
import PropTypes from 'prop-types';

import { MASTER_PIN } from '../config/config';

const dialogStyle = {
		width: '30%',
		maxWidth: 'none',
		textAlign: 'center',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'stretch'
};

const labelStyle = {
		margin: '10px',
		height: '50px',
		fontSize: '32px'
};

const textInputStyle = css({
		textAlign: 'center'
});

const initialState = {
		inputPinNumber: '',
		pinErrorText: ''
};

export default class PinDialog extends React.PureComponent {

		static propTypes = {
				title: PropTypes.string,
				errorText: PropTypes.string,
				userPinNumber: PropTypes.string,
				action: PropTypes.func.isRequired,
				handleClose: PropTypes.func.isRequired,
				dialogOpen: PropTypes.bool.isRequired
		};

		static defaultProps = {
				title: 'Enter Master PIN',
				errorText: 'Wrong number',
				userPinNumber: MASTER_PIN
		};

		constructor(props) {
				super(props);

				this.state = initialState;
		}

		pinInput(numberClicked) {
				window.navigator.vibrate(50);

				this.setState({
						inputPinNumber: this.state.inputPinNumber + numberClicked.toString()
				}, () => this.checkPinNumber());
		}

		checkPinNumber() {
				if (this.state.inputPinNumber.length === 4) {
						if (SHA256(this.state.inputPinNumber) === this.props.userPinNumber) {
								setTimeout(() => this.props.action(), 200);
						}
						else {
								this.setState({
										inputPinNumber: '',
										pinErrorText: this.props.errorText
								});
						}
				}
		}

		handleClose() {
				this.setState(initialState);
				this.props.handleClose();
		}

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
										style={{ fontSize: '90px' }}
										name="pin-number"
										fullWidth
										disabled
										{...textInputStyle}
								/>
								<FlatButton label="1" onClick={() => this.pinInput(1)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="2" onClick={() => this.pinInput(2)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="3" onClick={() => this.pinInput(3)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="4" onClick={() => this.pinInput(4)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="5" onClick={() => this.pinInput(5)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="6" onClick={() => this.pinInput(6)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="7" onClick={() => this.pinInput(7)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="8" onClick={() => this.pinInput(8)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="9" onClick={() => this.pinInput(9)} style={labelStyle} labelStyle={labelStyle}/>
								<FlatButton label="0" onClick={() => this.pinInput(0)} style={labelStyle} labelStyle={labelStyle}/>
						</Dialog>
				);
		}
};