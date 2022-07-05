import { useMutation, useSubscription } from '@apollo/react-hooks'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { ADD_TODO, DELETE_TODO, UPDATE_TODO, UPDATE_USER } from './GraphQLData'

import { notifyState, userState } from './state'

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  LinearProgress,
  Modal,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography
} from '@mui/material'

import { Edit, Delete } from '@mui/icons-material'
import { TaskType } from './types'
import { useRecoilState } from 'recoil'

const Todo = () => {
  const [userLocal, setUser] = useRecoilState(userState)
  const [notification, setNotification] = useRecoilState(notifyState)
  const [editableTask, setEditableTask] = useState<TaskType | null>(null)
  const { user, isAuthenticated, loginWithPopup, isLoading } = useAuth0()

  const [addTask] = useMutation(ADD_TODO)
  const [deleteTask] = useMutation(DELETE_TODO)
  const [UpdateTask] = useMutation(UPDATE_TODO)
  const { data: userData, loading } = useSubscription(UPDATE_USER, {
    variables: {
      username: user?.email
    }
  })

  const [newTask, setNewTask] = useState({
    title: '',
    completed: false
  })

  useEffect(() => {
    setUser(userData?.getUser)
  }, [userData])

  if (loading || isLoading) {
    return <LinearProgress />
  }

  if (!isAuthenticated) {
    return (
   <Box
    sx={{
      flexDirection: 'column',
      display: 'flex'
    }}
   >
    <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
     Login to use this App
    </Typography>

    <Button
     color="primary"
     variant="contained"
     onClick={() => loginWithPopup()}
    >
     <b>Login</b>
    </Button>
   </Box>
    )
  }

  return (
  <>
   <Snackbar
    autoHideDuration={6000}
    open={notification.open}
    onClose={() =>
      setNotification({
        ...notification,
        open: false
      })
    }
   >
    <Alert severity={notification.severity} sx={{ width: '100%' }}>
     {notification.message}
    </Alert>
   </Snackbar>
   <Modal open={!!editableTask} onClose={() => setEditableTask(null)}>
    <Paper
     style={{
       position: 'absolute',
       top: '50%',
       left: '50%',
       transform: 'translate(-50%, -50%)',
       width: 400,
       padding: '2rem'
     }}
    >
     <Box flexDirection="row" display="flex" justifyContent="center">
      <TextField
       label="Title"
       value={editableTask?.title}
       onChange={e =>
         setEditableTask({
           ...(editableTask as TaskType),
           title: e.target.value
         })
       }
      />

      <FormControlLabel
       control={
        <Switch
         checked={editableTask?.completed}
         onChange={e => {
           setEditableTask({
             ...(editableTask as TaskType),
             completed: e.target.checked
           })
         }}
        />
       }
       label="Finished"
       labelPlacement="bottom"
      />

      <Button
       disabled={!editableTask?.title}
       variant="outlined"
       onClick={() => {
         UpdateTask({
           variables: {
             taskID: editableTask?.id,
             task: {
               title: editableTask?.title,
               completed: editableTask?.completed
             }
           }
         })
           .then(() => {
             setNotification({
               severity: 'success',
               message: 'Successfully updated task',
               open: true
             })
             setEditableTask(null)
           })
           .catch(err => {
             setNotification({
               severity: 'error',
               message: err.message,
               open: true
             })
           })
       }}
      >
       Update Task
      </Button>
     </Box>
    </Paper>
   </Modal>
   <Typography
    variant="h5"
    gutterBottom
    sx={{
      fontWeight: 'bold'
    }}
   >
    Add a new task:
   </Typography>
   <Box display="flex" justifyContent="center">
    <TextField
     size="small"
     label="Title"
     value={newTask.title}
     onChange={e =>
       setNewTask({
         ...newTask,
         title: e.target.value
       })
     }
    />

    <FormControlLabel
     control={
      <Switch
       size="small"
       checked={newTask.completed}
       onChange={e => {
         setNewTask({
           ...newTask,
           completed: e.target.checked
         })
       }}
      />
     }
     label="Finished"
     labelPlacement="top"
    />
    <Button
     size="small"
     disabled={!newTask.title}
     variant="outlined"
     onClick={() => {
       setNewTask({
         title: '',
         completed: false
       })
       addTask({
         variables: {
           task: [
             {
               title: newTask.title,
               completed: newTask.completed,
               user: { username: user?.email }
             }
           ]
         }
       })
     }}
    >
     Add Task
    </Button>
   </Box>

   <Typography
    variant="h5"
    gutterBottom
    sx={{
      fontWeight: 'bold'
    }}
   >
    Todo:
   </Typography>
   <Box
    gap={2}
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}
   >
    {userLocal?.tasks.map((task: TaskType, index: number) => (
     <Card key={String(task.title)} sx={{ minWidth: 275 }}>
      <CardContent>
       <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
       >
        <Typography sx={{ fontSize: 14 }}>{task.title}</Typography>
        <Typography
         sx={{
           fontSize: 14,
           fontWeight: 'bold'
         }}
         color={task.completed ? 'success.main' : 'error.main'}
         gutterBottom
        >
         {task.completed ? 'Finished' : 'Not Finished'}
        </Typography>
       </Box>
      </CardContent>
      <CardActions
       sx={{
         justifyContent: 'space-around'
       }}
      >
       <Button
        size="small"
        color="secondary"
        variant="outlined"
        startIcon={<Edit />}
        sx={{
          textTransform: 'none'
        }}
        onClick={() => {
          setEditableTask(task)
        }}
       >
        Edit
       </Button>
       <Button
        size="small"
        color="error"
        variant="outlined"
        endIcon={<Delete />}
        sx={{
          textTransform: 'none'
        }}
        onClick={() => {
          deleteTask({
            variables: {
              taskID: task.id
            }
          })
            .then(() => {
              setNotification({
                severity: 'success',
                message: 'Successfully deleted task',
                open: true
              })
            })
            .catch(err => {
              setNotification({
                severity: 'error',
                message: err.message,
                open: true
              })
            })
        }}
       >
        Delete
       </Button>
      </CardActions>
     </Card>
    ))}
   </Box>
  </>
  )
}

export default Todo
