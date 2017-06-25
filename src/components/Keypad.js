// @flow
import React from 'react';
import FlatButton from 'material-ui/FlatButton/index';

import type { Element } from 'react';

type Props = {
	pinInput: Function
}

const labelStyle = {
	margin: 5,
	height: 40,
	fontSize: 28
};

const Keypad = ({ pinInput }: Props): Element<any> => (
	<div>
		<FlatButton label="1" onClick={() => pinInput(1)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="2" onClick={() => pinInput(2)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="3" onClick={() => pinInput(3)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="4" onClick={() => pinInput(4)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="5" onClick={() => pinInput(5)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="6" onClick={() => pinInput(6)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="7" onClick={() => pinInput(7)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="8" onClick={() => pinInput(8)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="9" onClick={() => pinInput(9)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="0" onClick={() => pinInput(0)} style={labelStyle} labelStyle={labelStyle} />
	</div>
);

export default Keypad;