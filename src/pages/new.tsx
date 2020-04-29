import React from 'react'
import { NextPage } from 'next'

import { Layout } from '../components/Layout'
import { Editor } from '../components/Editor'
import { Page } from '../models/Page'

/* eslint-disable @typescript-eslint/camelcase */
export const createEmptyPage = (): Page => ({
  id: null,
  title: '',
  lines: [
    {
      id: null,
      body: '',
      page_id: null,
      page_index: 0,
    },
  ],
})
/* eslint-enable @typescript-eslint/camelcase */

const New: NextPage = () => (
  <Layout>
    <Editor pageData={createEmptyPage()} />
  </Layout>
)

export default New
