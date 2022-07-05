import { AlertColor, createTheme } from '@mui/material'
import { atom, selector } from 'recoil'
import { theme } from './theme'
import { StateType, TaskType } from './types'

export const State = atom<StateType>({
  key: 'state',
  default: {
    mode: 'dark',
    alert: {
      type: 'info',
      message: ''
    }
  }
})

export const Theme = selector({
  key: 'theme',
  get: ({ get }) =>
    createTheme({
      ...theme[get(State).mode],
      spacing: 8,
      shape: {
        borderRadius: 20
      }
    })
})
export const notifyState = atom<{
 severity: AlertColor
 message: string
 open?: boolean
}>({
  key: 'notifyState',
  default: {
    open: false,
    severity: 'info',
    message: ''
  }
})
export const userState = atom<{
 username: string
 name: string
 tasks: TaskType[]
} | null>({
  key: 'userState',
  default: null
})
