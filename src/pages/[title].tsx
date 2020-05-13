import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { Layout } from '../components/Layout'
import { PageView } from 'src/components/PageView'
import { DraftEditor } from 'src/components/DraftEditor'
import { MainContainer } from 'src/components/MainContainer'
import { usePage, mutatePage } from 'src/hooks/usePage'

const PageDetail: NextPage = () => {
  const router = useRouter()
  const title = router.query.title as string

  const { data: page } = usePage(title)

  const [isEditable, toggleIsEditable] = React.useState(false)

  const toggleView = React.useCallback(() => {
    mutatePage(title)
    toggleIsEditable(!isEditable)
  }, [title, isEditable])

  return (
    <>
      <Head>
        <title>{title} - knowledgebox</title>
      </Head>
      <Layout>
        {page && (
          <MainContainer>
            {isEditable ? (
              <DraftEditor page={page} toggleView={toggleView} />
            ) : (
              <PageView page={page} handleButtonClick={toggleView} />
            )}
          </MainContainer>
        )}
      </Layout>
    </>
  )
}

export default PageDetail
