import React from 'react'
import { useRouter } from 'next/router'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import cloneDeep from 'lodash-es/cloneDeep'
import { useImmer } from 'use-immer'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { useMainStyles } from './CardList'
import { Page } from '../models/Page'
import { Line } from '../models/Line'
import { apiClient } from '../config/client'

export const useStyles = makeStyles({
  editor: {
    background: 'white',
    marginTop: 100,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
})

/* eslint-disable @typescript-eslint/camelcase */
const createNewLine = (pageId: number, pageIndex: number): Line => ({
  id: undefined,
  body: '',
  page_id: pageId,
  page_index: pageIndex,
  created_at: undefined,
  updated_at: undefined,
})

type EditorProps = {
  pageData: Page
}

export const Editor: React.FC<EditorProps> = ({ pageData }) => {
  const mainStyles = useMainStyles()
  const styles = useStyles()
  const router = useRouter()

  const [page, updatePage] = useImmer<Page>(cloneDeep(pageData))
  // const [isTitleChanged, setIsTitleChanged] = React.useState(false)
  const latestUpdatedLine = React.useRef<number>(null)

  // focus to latest updated line
  React.useEffect(() => {
    const currentIndex = latestUpdatedLine.current
    if (currentIndex) {
      const line = document.querySelectorAll('.line')[
        currentIndex - 1
      ] as HTMLElement
      line.focus()
    }
  }, [page])

  const insertNewLine = React.useCallback(
    (pageIndex: string) => {
      updatePage(draft => {
        // 新しい行を追加
        const index = Number(pageIndex) + 1
        draft.lines.splice(index, 0, createNewLine(draft.id, index))
        // index 振り直し
        draft.lines.forEach((line, i) => {
          line.page_index = i
        })
        latestUpdatedLine.current = index
      })
    },
    [updatePage],
  )

  const handleTitleChange = React.useCallback(
    (event: ContentEditableEvent) => {
      const title = event.target.value
      updatePage(draft => {
        draft.title = title
        draft.lines[0].body = title
      })
    },
    [updatePage],
  )

  const handleLineChange = React.useCallback(
    (event: ContentEditableEvent): void => {
      const { index } = event.currentTarget.dataset
      const body = event.target.value

      updatePage(draft => {
        draft.lines.find(line => line.page_index === Number(index)).body = body
      })
      latestUpdatedLine.current = Number(index)
    },
    [updatePage],
  )

  const checkPressEnter = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      const keyCode = event.keyCode || event.which
      const { index } = event.currentTarget.dataset

      if (keyCode === 13) {
        event.nativeEvent.returnValue = false
        if (event.preventDefault) {
          event.preventDefault()
        }
        insertNewLine(index)
      }
    },
    [insertNewLine],
  )

  const handleSaveClick = React.useCallback(async (): Promise<void> => {
    // page.id が存在しないのはDBに保存されていないページ
    // そのため、new page でも [title] page でも post をすればよい
    if (!page.id) {
      await apiClient.post(`/pages`, page)
    } else {
      await apiClient.put(`/pages/${page.title}`, page)
    }

    // 正常に通信が成功した場合、new page または title が変更されていれば
    //   [title] page に遷移する
    if (router.pathname === '/new' || router.pathname !== `/${page.title}`) {
      router.push('/[title]', `/${page.title}`)
    }
  }, [page, router])

  return (
    <Container className={mainStyles.mainContainer}>
      <Container className={styles.editor}>
        {page.lines.map(line => {
          if (line.page_index === 0) {
            return (
              <ContentEditable
                className={styles.title}
                key={line.page_index}
                html={line.body}
                onKeyPress={checkPressEnter}
                onChange={handleTitleChange}
                data-index={line.page_index}
              />
            )
          }
          return (
            <ContentEditable
              className="line"
              key={line.page_index}
              html={line.body}
              onKeyPress={checkPressEnter}
              onChange={handleLineChange}
              data-index={line.page_index}
            />
          )
        })}
      </Container>
      <Button variant="contained" color="primary" onClick={handleSaveClick}>
        Save
      </Button>
    </Container>
  )
}
/* eslint-enable @typescript-eslint/camelcase */
