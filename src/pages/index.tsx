import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'

import { Layout } from '../components/Layout'
import { Card } from '../components/Card'
import { CardList } from '../components/CardList'
import { useTitles } from 'src/hooks/usePages'
import { MainContainer } from 'src/components/MainContainer'
import { prefetchPage } from 'src/hooks/usePage'

const Index: NextPage = () => {
  const { data: titles } = useTitles()

  React.useEffect(() => {
    if (!titles) return
    if (titles.length === 0) return
    titles.forEach(title => {
      prefetchPage(title.title)
    })
  }, [titles])

  return (
    <>
      <Head>
        <link rel="preload" href="/api/pages" as="fetch" />
      </Head>
      <Layout>
        <MainContainer>
          <CardList>
            {titles &&
              titles.map(title => <Card key={title.id} title={title.title} />)}
          </CardList>
        </MainContainer>
      </Layout>
    </>
  )
}

export default Index
