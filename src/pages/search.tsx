import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Layout } from '../components/Layout'
import { apiClient } from '../config/client'
import { Page } from '../models/Page'
import { SearchCardList } from '../components/SearchCardList'

const Search: NextPage = () => {
  const router = useRouter()
  const query = router.query.q as string

  const [pages, updatePages] = React.useState<Page[]>([])

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      if (!query) {
        return
      }
      const response = await apiClient.get(`/search?q=${query}`)
      const pages = response.data as Page[]
      updatePages(pages)
    }

    fetchData()
  }, [query, updatePages])

  return (
    <>
      <Head>
        <title>{query} - knowledgebox</title>
      </Head>
      <Layout>
        <SearchCardList pages={pages} query={query} />
      </Layout>
    </>
  )
}

export default Search
