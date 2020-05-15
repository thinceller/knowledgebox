import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { Layout } from '../components/Layout'
import { PageView } from 'src/components/PageView'
import { DraftEditor } from 'src/components/DraftEditor'
import { MainContainer } from 'src/components/MainContainer'
import { usePage, mutatePage } from 'src/hooks/usePage'
import { useTitles } from 'src/hooks/usePages'
import { SuggestCardList } from 'src/components/SuggestCardList'

const PageDetail: NextPage = () => {
  const router = useRouter()
  const title = router.query.title as string

  const { data: page } = usePage(title)
  const { data: titles } = useTitles()

  const [isEditable, toggleIsEditable] = React.useState(false)

  const toggleView = React.useCallback(() => {
    mutatePage(title)
    toggleIsEditable(!isEditable)
  }, [title, isEditable])

  return (
    <>
      <Head>
        <title>{title} - knowledgebox</title>
        <link rel="preload" href={`/api/pages/${title}`} as="fetch" />
      </Head>
      <Layout>
        {page && (
          <MainContainer>
            {isEditable ? (
              <DraftEditor page={page} toggleView={toggleView} />
            ) : (
              <PageView page={page} handleButtonClick={toggleView} />
            )}
            {page && titles && (
              <SuggestCardList
                links={page.links}
                titles={titles}
                ownTitle={title}
              />
            )}
          </MainContainer>
        )}
      </Layout>
    </>
  )
}

export default PageDetail
