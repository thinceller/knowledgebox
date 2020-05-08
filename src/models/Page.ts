import { Line } from './Line'

export type Page = {
  id: number
  title: string
  created_at: Date
  updated_at: Date
  lines: Line[]
}
