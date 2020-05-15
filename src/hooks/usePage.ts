import { mutate } from 'swr'
import axios from 'axios'

import { Page } from 'src/models/Page'
import { useRequest } from './useRequest'

export function usePage(title: string | null) {
  return useRequest<Page>(title && { url: `/api/pages/${title}` })
}

export function mutatePage(title: string) {
  mutate(JSON.stringify({ url: `/api/pages/${title}` }))
}

export async function prefetchPage(title: string) {
  const request = { url: `/api/pages/${title}` }
  return axios(request).then(data => {
    mutate(JSON.stringify(request), data, false)
    return data
  })
}
