import { NextPage, GetServerSideProps } from 'next'
import fetch from 'node-fetch'

import { Layout } from '../components/Layout'
import { Page } from '../models/Page'
import {Card} from '../components/Card'

type IndexProps = {
  pages: Page[]
}

const Index: NextPage<IndexProps> = ({ pages }) => (
  <Layout>
    {pages.map(page => (
      <Card key={page.id} title={page.title} />
    ))}
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:1323/pages')
  const pages = await res.json()

  return { props: { pages } }
}

export default Index
