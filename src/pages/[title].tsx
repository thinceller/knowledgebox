import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'

import { Layout } from '../components/Layout'
import { Editor } from '../components/Editor'
import { Page } from '../models/Page'
import { apiClient } from '../config/client'
import { createEmptyPage } from './new'

type PageProps = {
  page: Page
}

const PageDetail: NextPage<PageProps> = ({ page }) => {
  return (
    <>
      <Head>
        <title>{page.title} - knowledgebox</title>
      </Head>
      <Layout>
        <Editor pageData={page} />
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const title = params.title as string
  let page: Page
  try {
    // page 用に最適化したい
    const response = await apiClient.get(`/pages/${title}`)
    page = response.data
  } catch (error) {
    // TODO: title が存在しない場合とそうでないエラーで分岐する
    page = createEmptyPage()
    page.title = title
    page.lines[0].body = title
  }

  return { props: { page } }
}

export default PageDetail
