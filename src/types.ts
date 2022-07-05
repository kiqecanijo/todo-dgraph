export interface ContactType {
 createdAt?: string
 email: string
 firstName?: string
 lastName?: string
 phone?: string
 updatedAt: string
 _id: string
}

export interface ResponseType {
 count: number
 perPage: number
 currentPage: number
 totalPages: number
 results: ContactType[]
}

export interface StateType {
 mode: 'light' | 'dark'
 alert: {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
 }
}

export type TaskType = {
 id: string
 title: string
 completed: boolean
}
