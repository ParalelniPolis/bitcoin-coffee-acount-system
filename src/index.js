// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import AccountsPage from './components/AccountsPage';
import CreateOrder from './components/CreateOrder';
import CreateUser from './components/CreateAccount';
import Montly from './components/Monthly';
import App from './components/App'
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { black } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './normalize.css';
import './index.css';

import { GRAPHQL_ENDPOINT } from './config/';

const networkInterface = createNetworkInterface({ uri: GRAPHQL_ENDPOINT });

const client = new ApolloClient({ networkInterface });

const muiTheme = getMuiTheme({
		appBar: {
				color: black,
		},
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render((
				<ApolloProvider client={client}>
						<MuiThemeProvider muiTheme={muiTheme}>
								<Router history={browserHistory}>
										<Route path="/" component={App}>
												<IndexRoute component={AccountsPage}/>
												<Route path="create/:id" component={CreateOrder}/>
												<Route path="create-account" component={CreateUser}/>
												<Route path="monthly" component={Montly} />
										</Route>
								</Router>
						</MuiThemeProvider>
				</ApolloProvider>
		),
		document.getElementById('root')
);
