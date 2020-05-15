import { mutate } from 'swr'

import { Title } from 'src/models/Page'
import { useRequest } from './useRequest'

export function useTitles() {
  return useRequest<Title[]>({ url: '/api/pages' })
}

export function mutateTitles() {
  mutate(JSON.stringify({ url: '/api/pages' }))
}
