import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import fetch from 'node-fetch'

import { Layout } from '../components/Layout'
import { Page } from '../models/Page'
import { Card } from '../components/Card'
import { CardList } from '../components/CardList'

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
  const res = await fetch('http://localhost:1323/pages')
  const pages = await res.json()

  return { props: { pages } }
}

export default Index
