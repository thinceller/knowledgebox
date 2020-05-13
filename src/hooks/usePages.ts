import { Page } from 'src/models/Page'
import { useRequest } from './useRequest'

export function usePages() {
  return useRequest<Page[]>({ url: '/api/pages' })
}
