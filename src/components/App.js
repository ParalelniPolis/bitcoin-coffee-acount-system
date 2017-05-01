import React from 'react';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import { css } from 'glamor';

const wrapperStyle = css({
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		height: '100%'
});

const containerStyle = css({
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
});

const appBarStyle = css({
		justifyContent: 'center'
});

export default ({ children }) => (
		<div {...wrapperStyle}>
				<AppBar showMenuIconButton={false} titleStyle={{ display: 'none' }} {...appBarStyle}>
						<Link to="/">
								<img src="/bitcoin-coffee-logo.png" alt="Bitcoin Coffee" height="80"/>
						</Link>
				</AppBar>
				<div {...containerStyle}>
						{children}
				</div>
		</div>
);