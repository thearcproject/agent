// import ApolloClient, { createNetworkInterface } from 'apollo-client'
// import { createStore, combineReducers, compose } from 'redux'
// import {flags} from './reducers/flags'
// import { reducer as notifReducer } from 'redux-notifications'

import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory'
import introspectionQueryResultData from '../fragmentTypes.json'
import { defaults, resolvers } from "./resolvers";
import {withClientState} from 'apollo-link-state'
import {ApolloLink} from 'apollo-link'
import getNotifications from '../queries/getNotifications';
import gql from 'graphql-tag'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const cache = new InMemoryCache({
  dataIdFromObject: object => object.key || null,
  addTypename: true,
  fragmentMatcher
})

const stateLink = withClientState({
  cache,
  defaults: defaults,
  resolvers: {
    Mutation: {
      updateNotification: (_, {id, message, type}, {cache}) => {
        const query = gql`
        query GetNotification {
          notification @client {
            __typename
            id
            message
            type
          }
        }
      `
        const previousState = cache.readQuery({query})
        console.log(previousState)
        previousState.notification.id = id
        previousState.notification.message = message
        previousState.notification.type = type
        const data = {
          ...previousState,
          notification: {
            id: id,
            type: type,
            message: message,
            __typename: 'Notification'
          }
        }
        cache.writeQuery({query, data})
        console.log(cache)
      }
    }
  }
})

const link = ApolloLink.from([
  stateLink,
  new HttpLink({
  uri: 'https://ocp.freedomcoop.eu/api/graph'
  // uri: 'https://testocp.freedomcoop.eu/api/graph'
  })
])

export const client = new ApolloClient({
  link,
  cache: cache.restore(window.__APOLLO_CLIENT__),
  ssrMode: true,
  ssrForceFetchDelay: 100,
  connectToDevTools: true,
  queryDeduplication: true,
  clientState: {
    defaults,
    // resolvers,
    // typeDefs
  }
})

// export const store = createStore(
//   combineReducers({
//     notifs: notifReducer,
//     flags
//   }),
//   compose(
//     // applyMiddleware(client.middleware()),
//     // eslint-disable-next-line no-underscore-dangle
//     // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// )
