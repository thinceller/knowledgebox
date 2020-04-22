import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Error from 'next/error'
import fetch from 'node-fetch'

import { Layout } from '../components/Layout'
import { Page } from '../models/Page'

type PageProps = {
  page: Page
}

const PageDetail: NextPage<PageProps> = ({ page }) => {
  if (!page.title) {
    return <Error statusCode={404} />
  }
  return (
    <Layout>
      <h2>{page.title}</h2>
      {page.lines &&
        page.lines.map(line => <div key={line.id}>{line.body}</div>)}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { title } = params
  // page 用に最適化したい
  const response = await fetch(`http://localhost:1323/pages/${title}`)
  const page = await response.json()
  console.log(page)

  return { props: { page } }
}

export default PageDetail
