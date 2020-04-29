import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Error from 'next/error'

import { Layout } from '../components/Layout'
import { Editor } from '../components/Editor'
import { Page } from '../models/Page'
import { apiClient } from '../config/client'

type PageProps = {
  page: Page
}

const PageDetail: NextPage<PageProps> = ({ page }) => {
  if (!page.title) {
    // TODO: 新しいページを作る画面に遷移
    return <Error statusCode={404} />
  }
  return (
    <Layout>
      <Editor pageData={page} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { title } = params
  // page 用に最適化したい
  const response = await apiClient.get(`/pages/${title}`)
  const page = response.data

  return { props: { page } }
}

export default PageDetail
