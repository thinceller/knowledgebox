import React from 'react'
import { NextPage } from 'next'

import { Layout } from '../components/Layout'
import { Card } from '../components/Card'
import { CardList } from '../components/CardList'
import { useTitles } from 'src/hooks/usePages'
import { MainContainer } from 'src/components/MainContainer'

const Index: NextPage = () => {
  const { data: titles } = useTitles()

  return (
    <Layout>
      <MainContainer>
        <CardList>
          {titles &&
            titles.map(title => <Card key={title.id} title={title.title} />)}
        </CardList>
      </MainContainer>
    </Layout>
  )
}

export default Index
