import axios from 'axios'

import { apiHost } from './config'

export const apiClient = axios.create({
  baseURL: apiHost,
  headers: {
    'Content-Type': 'application/json',
  },
})
