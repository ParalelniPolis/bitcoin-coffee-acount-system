// @flow
import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton/index';
import ContentAdd from 'material-ui/svg-icons/content/add';
import type { Element } from 'react'

type Props = {
	action: Function,
	mini?: boolean,
	secondary?: boolean,
	disabled?: boolean
}

const floatingButtonStyle = {
		position: 'fixed',
		bottom: '50px',
		right: '50px'
};

const ActionButton = (props: Props): Element<any> => (
		<FloatingActionButton
				style={floatingButtonStyle}
				onTouchTap={props.action}
				mini={props.mini}
				secondary={props.secondary}
				disabled={props.disabled}

		>
				<ContentAdd />
		</FloatingActionButton>
);

ActionButton.defaultProps = {
		mini: false,
		secondary: false,
		disabled: false
};

export default ActionButton;