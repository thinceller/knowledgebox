import { Line } from './Line'

export type Page = {
  id: number
  title: string
  created_at: Date
  updated_at: Date
  lines: Line[]
  links: string[] | null
}

export type Title = Pick<Page, 'id' | 'title' | 'links'>

/* eslint-disable @typescript-eslint/camelcase */
export const createEmptyPage = (): Page => ({
  id: null,
  title: '',
  created_at: null,
  updated_at: null,
  lines: [
    {
      id: null,
      body: '',
      page_id: null,
      page_index: 0,
      created_at: null,
      updated_at: null,
    },
  ],
  links: null,
})
/* eslint-enable @typescript-eslint/camelcase */
