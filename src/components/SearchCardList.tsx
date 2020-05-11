import React from 'react'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'

import { Page } from '../models/Page'
import { MainContainer } from '../components/MainContainer'
import { SearchCard } from './SearchCard'
import { NewCard } from './NewCard'

import { apiClient } from 'src/config/client'

const useStyles = makeStyles({
  searchCardList: {
    paddingTop: 50,
  },
})

type SearchCardListProps = {
  query: string
}

export const SearchCardList: React.FC<SearchCardListProps> = ({ query }) => {
  const styles = useStyles()

  const [pages, updatePages] = React.useState<Page[]>([])

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      if (!query) {
        return
      }
      const response = await apiClient.get(`/search?q=${query}`)
      const pages = (response.data as Page[]) || []
      updatePages(pages)
    }

    fetchData()
  }, [query, updatePages])

  return (
    <MainContainer>
      {!pages.some(page => page.title === query) && (
        <List component="ul" className={styles.searchCardList}>
          <NewCard title={query} />
        </List>
      )}
      <List component="ul" className={styles.searchCardList}>
        {pages.map(page => (
          <SearchCard page={page} key={page.id} />
        ))}
      </List>
    </MainContainer>
  )
}
