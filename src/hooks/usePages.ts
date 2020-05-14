import { Title } from 'src/models/Page'
import { useRequest } from './useRequest'

export function useTitles() {
  return useRequest<Title[]>({ url: '/api/pages' })
}
