import { WebSocketLink } from '@apollo/link-ws'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { ThemeProvider } from '@emotion/react'
import {
  useMediaQuery,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  Box
} from '@mui/material'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink
} from '@apollo/client'

import React, { useEffect, useState } from 'react'
import { combineProviders } from 'react-combine-providers'

import ReactDOM from 'react-dom/client'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
// import App from './App'
import reportWebVitals from './reportWebVitals'
import { State, Theme } from './state'
import { getMainDefinition } from '@apollo/client/utilities'
import Todo from './Todo'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const App = () => {
  const browserTheme = useMediaQuery('(prefers-color-scheme: light)')
  const [state, setState] = useRecoilState(State)

  useEffect(() => {
    setState({
      ...state,
      mode: browserTheme ? 'light' : 'dark'
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserTheme])

  const themeSwitchable = useRecoilValue(Theme)

  const { user, getIdTokenClaims, loginWithPopup, logout, isLoading } =
  useAuth0()

  const [token, setToken] = useState<string | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      const token = await getIdTokenClaims()
      setToken(token?.__raw)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const httpLink = new HttpLink({
  // uri: "http://localhost:8080/graphql", // Or your Slash GraphQL endpoint (if you're using Slash GraphQL)
    uri: 'https://blue-surf-590891.us-east-1.aws.cloud.dgraph.io/graphql',
    headers: {
      'X-Auth-Token': token
    }
  })

  const wsLink = new WebSocketLink({
  // uri: `ws://localhost:8080/graphql`, // Can test with your Slash GraphQL endpoint (if you're using Slash GraphQL)
    uri: 'wss://blue-surf-590891.us-east-1.aws.cloud.dgraph.io/graphql',
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: {
        'X-Auth-Token': token
      }
    }
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
  })

  const masterProvider = combineProviders()
 ;[
    {
      Provider: ThemeProvider,
      props: {
        theme: themeSwitchable
      }
    },
    {
      Provider: ApolloProvider,
      props: { client }
    }

  // @ts-expect-error: missing properly type from react-combine-providers
  ].forEach(({ Provider, props }) => masterProvider.push(Provider, props))
  const MasterProvider = masterProvider.master()

  return (
  <MasterProvider>
   <CssBaseline />

   <AppBar position="static">
    <Toolbar>
     <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
     />
     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      <b>{user && `${user?.name}'s Todos`}</b>
     </Typography>
     {!isLoading && (
      <Button
       color="primary"
       variant="outlined"
       onClick={() => {
         user ? logout() : loginWithPopup()
       }}
      >
       {user ? 'Logout' : 'Login'}
      </Button>
     )}
    </Toolbar>
   </AppBar>
   <Container>
    <Box display="flex" justifyContent="center" p={4} flexDirection="column">
     <Todo />
    </Box>
   </Container>
  </MasterProvider>
  )
}

const masterProvider = combineProviders()
;[
  {
    Provider: Auth0Provider,
    props: {
      domain: 'dev-jd4h37v1.us.auth0.com',
      clientId: 'lKNMfAuXLVHCqj8HtGFsUOw8MJpyfs95',
      redirectUri: window.location.origin
    }
  }
].forEach(({ Provider, props }) => masterProvider.push(Provider, props))
const MasterProvider = masterProvider.master()

root.render(
 <MasterProvider>
  <React.StrictMode>
   <RecoilRoot>
    <App />
   </RecoilRoot>
  </React.StrictMode>
 </MasterProvider>
)

reportWebVitals()
