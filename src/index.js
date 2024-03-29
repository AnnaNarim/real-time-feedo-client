import React from 'react'
import {render} from 'react-dom'
import {AUTH_TOKEN} from './constant'
import {ThemeProvider} from '@material-ui/core/styles'
import {ApolloProvider} from '@apollo/react-hooks'
import 'dotenv/config'
import {getTheme} from './lib/appTheme'
// import ApolloClient from 'apollo-boost'
import App from "./components/App/App"

import {HttpLink, InMemoryCache, ApolloClient} from 'apollo-client-preset'
// import {WebSocketLink} from 'apollo-link-ws'
import { WebSocketLink } from "@apollo/link-ws";
import {ApolloLink, split} from 'apollo-link'
import {getMainDefinition} from 'apollo-utilities'
import {SubscriptionClient} from 'subscriptions-transport-ws'
// import WebSocket from 'ws';

// var ws = new WebSocket('wss://real-time-feedo-server.herokuapp.com');
// const ws = new WebSocket('wss://real-time-feedo-server.herokuapp.com');

const httpLink = new HttpLink({uri : 'http://real-time-feedo-server.herokuapp.com'});

const middlewareLink = new ApolloLink((operation, forward) => {
  // get the authentication token from local storage if it exists
  const tokenValue = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  operation.setContext({
    headers : {
      Authorization : tokenValue ? `Bearer ${tokenValue}` : '',
    },
  });
  return forward(operation)
});

// authenticated httplink
const httpLinkAuth = middlewareLink.concat(httpLink);

const _link = new SubscriptionClient(`ws://real-time-feedo-server.herokuapp.com`, {
  reconnect: true,
  connectionParams : {
    Authorization : `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
  },
});
const wsLink = new WebSocketLink(_link);
// const wsLink = new WebSocketLink({
//   uri     : `ws://real-time-feedo-server.herokuapp.com`,
//   options : {
//     reconnect        : true,
//     connectionParams : {
//       Authorization : `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
//     },
//   },
//   // webSocketImpl: ws,
// });

const link = split(
    // split based on operation type
    ({query}) => {
      const {kind, operation} = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLinkAuth,
);

// apollo client setup
const client = new ApolloClient({
  link              : ApolloLink.from([link]),
  cache             : new InMemoryCache(),
  connectToDevTools : true,
});

const token = localStorage.getItem(AUTH_TOKEN);

const MyApp = () => (
    <ApolloProvider client={client}>
      <ThemeProvider theme={getTheme()}>
        <App token={token}/>
      </ThemeProvider>
    </ApolloProvider>
);

render(<MyApp/>, document.getElementById('root'));
