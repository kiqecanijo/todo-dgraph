import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink
} from '@apollo/client'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { useAuth0 } from '@auth0/auth0-react'
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState
} from 'react'
import { ADD_TODO, ADD_USER, UPDATE_USER } from './GraphQLData'
import { WebSocketLink } from '@apollo/link-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const Test = () => {
  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0()

  // add an user
  const [addUser] = useMutation(ADD_USER)
  // const [updateTask] = useMutation(UPDATE_TODO);
  const [addTask] = useMutation(ADD_TODO)

  // get user
  // const { data : userQuery } = useQuery(GET_USER, {
  //   variables: {
  //     username: user?.email
  //   }
  // })

  const { data: userData } = useSubscription(UPDATE_USER, {
    variables: {
      username: user?.email
    }
  })

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskCompleted, setTaskCompleted] = useState(false)

  return (
  <>
   <h2>Hello {user?.name || 'Guest'}</h2>
   <h3>Your name is: {userData?.getUser?.name}</h3>
   {isAuthenticated
     ? (
    <>
     <input
      type="text"
      value={taskTitle}
      onChange={e => setTaskTitle(e.target.value)}
     />
     <br />
     <input
      type="text"
      value={taskDescription}
      onChange={e => {
        setTaskDescription(e.target.value)
      }}
     />
     <br />
     <input
      type="checkbox"
      checked={taskCompleted}
      onChange={() => {
        setTaskCompleted(!taskCompleted)
      }}
     />
     <br />
     <button
      onClick={() => {
        addTask({
          variables: {
            task: [
              {
                title: taskTitle,
                completed: taskCompleted,
                user: { username: user?.email }
              }
            ]
          }
        })
      }}
     >
      Add me a task
     </button>
     <br />
     <button
      onClick={() => {
        addUser({
          variables: { user: { name: user?.name, username: user?.email } }
        })
      }}
     >
      Add me as a user
     </button>

     <br />
     <button onClick={() => logout()}>Logout</button>
     <h2>Task from your user subscription</h2>
     {userData?.getUser?.tasks?.map(
       (task: {
       title:
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | ReactFragment
        | ReactPortal
        | null
        | undefined
       description:
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | ReactFragment
        | ReactPortal
        | null
        | undefined
       completed: any
      }) => (
       <div key={String(task.title)}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p>{task.completed ? 'Completed' : 'Not completed'}</p>
       </div>
       )
     )}
    </>
       )
     : (
    <button onClick={() => loginWithRedirect({})}>Login</button>
       )}
  </>
  )
}

const App = () => {
  const { user, getIdTokenClaims } = useAuth0()

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
    uri: 'https://throbbing-field-240031.us-west-2.aws.cloud.dgraph.io/graphql',
    headers: {
      'X-Auth-Token': token
    }
  })

  const wsLink = new WebSocketLink({
  // uri: `ws://localhost:8080/graphql`, // Can test with your Slash GraphQL endpoint (if you're using Slash GraphQL)
    uri: 'wss://throbbing-field-240031.us-west-2.aws.cloud.dgraph.io/graphql',
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

  return (
  <ApolloProvider client={client}>
   <Test />
  </ApolloProvider>
  )
}

export default App
