import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Layout } from '../components/Layout'
import { SearchCardList } from '../components/SearchCardList'

const Search: NextPage = () => {
  const router = useRouter()
  const query = router.query.q as string

  return (
    <>
      <Head>
        <title>{query} - knowledgebox</title>
      </Head>
      <Layout>
        <SearchCardList query={query} />
      </Layout>
    </>
  )
}

export default Search
