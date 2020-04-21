import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import fetch from 'node-fetch'

import { Layout } from '../components/Layout'
import { Page } from '../models/Page'

type PageProps = {
  page: Page
}

const PageDetail: NextPage<PageProps> = ({ page }) => {
  return (
    <Layout>
      <h2>{page.title}</h2>
      {page.lines &&
        page.lines.map(line => <div key={line.id}>{line.body}</div>)}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { title } = ctx.params
  const res = await fetch(`http://localhost:1323/pages/${title}`)
  const page = await res.json()
  console.log(page)

  return { props: { page } }
}

export default PageDetail
