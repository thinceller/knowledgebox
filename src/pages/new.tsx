import React from 'react'
import { NextPage } from 'next'

import { Layout } from '../components/Layout'
import { Editor } from '../components/Editor'

const Index: NextPage = () => (
  <Layout>
    <Editor>{'new page'}</Editor>
  </Layout>
)
export default Index
