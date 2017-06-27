// @flow
import React from 'react';
import FlatButton from 'material-ui/FlatButton/index';

import type { Element } from 'react';

type Props = {
	input: Function
}

const labelStyle = {
	margin: 5,
	height: 40,
	fontSize: 28
};

const Keypad = ({ input }: Props): Element<any> => (
	<div>
		<FlatButton label="1" onClick={() => input(1)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="2" onClick={() => input(2)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="3" onClick={() => input(3)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="4" onClick={() => input(4)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="5" onClick={() => input(5)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="6" onClick={() => input(6)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="7" onClick={() => input(7)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="8" onClick={() => input(8)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="9" onClick={() => input(9)} style={labelStyle} labelStyle={labelStyle} />
		<FlatButton label="0" onClick={() => input(0)} style={labelStyle} labelStyle={labelStyle} />
	</div>
);

export default Keypad;