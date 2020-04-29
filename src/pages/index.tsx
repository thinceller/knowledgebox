import React from 'react'
import { NextPage, GetServerSideProps } from 'next'

import { Layout } from '../components/Layout'
import { Page } from '../models/Page'
import { Card } from '../components/Card'
import { CardList } from '../components/CardList'
import { apiClient } from '../config/client'

type IndexProps = {
  pages: Page[]
}

const Index: NextPage<IndexProps> = ({ pages }) => (
  <Layout>
    <CardList>
      {pages.map(page => (
        <Card key={page.id} title={page.title} />
      ))}
    </CardList>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await apiClient.get('/pages')
  const pages = res.data

  return { props: { pages } }
}

export default Index
