import React from 'react'
import { NextPage } from 'next'

import { Layout } from '../components/Layout'
import { Page } from '../models/Page'
import { DraftEditor } from 'src/components/DraftEditor'
import { MainContainer } from 'src/components/MainContainer'

/* eslint-disable @typescript-eslint/camelcase */
export const createEmptyPage = (): Page => ({
  id: null,
  title: '',
  created_at: null,
  updated_at: null,
  lines: [
    {
      id: null,
      body: '',
      page_id: null,
      page_index: 0,
      created_at: null,
      updated_at: null,
    },
  ],
  links: null,
})
/* eslint-enable @typescript-eslint/camelcase */

const New: NextPage = () => {
  const emptyPage = createEmptyPage()

  return (
    <Layout>
      <MainContainer>
        <DraftEditor page={emptyPage} />
      </MainContainer>
    </Layout>
  )
}

export default New
