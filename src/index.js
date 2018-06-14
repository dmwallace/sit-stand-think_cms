import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import {ApolloProvider} from 'react-apollo'
import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {BrowserRouter} from 'react-router-dom'
import {ApolloLink} from 'apollo-link';
import {onError} from "apollo-link-error";
import {createUploadLink} from 'apollo-upload-client'
import {apiUrl} from './config';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const httpLink = createUploadLink({uri: `${apiUrl}/graphql`});


const errorHandler = onError(({graphQLErrors, networkError}) => {
	if (graphQLErrors)
		graphQLErrors.map(({message, locations, path}) =>
			console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
		);
	
	if (networkError) {
		console.log(`[Network error]: ${networkError}`);
	}
});

const middleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	//console.log("operation", operation);
	
	return forward(operation);
})

const client = new ApolloClient({
	link: ApolloLink.from([
		errorHandler,
		middleware,
		httpLink,
	]),
	cache: new InMemoryCache()
});

ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App/>
		</ApolloProvider>
	</BrowserRouter>,
	document.getElementById('root'),
)

registerServiceWorker();