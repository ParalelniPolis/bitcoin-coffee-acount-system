import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const floatingButtonStyle = {
		position: 'fixed',
		bottom: '50px',
		right: '50px'
};

const ActionButton = ({ action, mini, secondary, disabled }) => (
		<FloatingActionButton
				style={floatingButtonStyle}
				onTouchTap={action}
				mini={mini}
				secondary={secondary}
				disabled={disabled}

		>
				<ContentAdd />
		</FloatingActionButton>
);

ActionButton.propTypes = {
		mini: React.PropTypes.bool,
		secondary: React.PropTypes.bool,
		disabled: React.PropTypes.bool
};

ActionButton.defaultProps = {
		mini: false,
		secondary: false,
		disabled: false
};

export default ActionButton;