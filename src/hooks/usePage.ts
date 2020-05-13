import { mutate } from 'swr'

import { Page } from 'src/models/Page'
import { useRequest } from './useRequest'

export function usePage(title: string | null) {
  return useRequest<Page>(title && { url: `/api/pages/${title}` })
}

export function mutatePage(title: string) {
  mutate(JSON.stringify({ url: `/api/pages/${title}` }))
}
