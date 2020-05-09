import React from 'react'
import {render} from 'react-dom'
import {AUTH_TOKEN} from './constant'
import {ThemeProvider} from '@material-ui/core/styles'
import {ApolloProvider} from '@apollo/react-hooks'
import 'dotenv/config'
import {getTheme} from './lib/appTheme'
import ApolloClient from 'apollo-boost'
import App from "./components/App/App"

const client = new ApolloClient({
  uri     : 'http://localhost:4000',
  request : (operation) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    operation.setContext({headers : {Authorization : token ? `Bearer ${token}` : '',}})
  },
  onError : ({graphQLErrors, networkError}) => {
    if(graphQLErrors) {
      graphQLErrors.forEach(err => {
        // alert(err.message)
      })
    } else if(networkError) {
      alert(networkError)
    }
  }
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
