import React from 'react'
import { useRouter } from 'next/router'
import produce from 'immer'
import { Editor, EditorState, ContentState } from 'draft-js'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

import { Page } from 'src/models/Page'
import { PageView } from './PageView'
import { apiClient } from 'src/config/client'
import { Line } from 'src/models/Line'

const useStyles = makeStyles({
  main: {
    background: 'white',
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 10,
    '& > *': {
      marginLeft: 10,
    },
  },
  button: {},
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

type DraftEditorProps = {
  page: Page
  toggleView?: () => void
}

export const DraftEditor: React.FC<DraftEditorProps> = ({
  page,
  toggleView = function () {
    return
  },
}) => {
  const styles = useStyles()
  const router = useRouter()

  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText(
        page.lines.map(line => line.body).join(','),
        ',',
      ),
    ),
  )

  const handleCancelClick = React.useCallback(() => {
    const yes = window.confirm('編集した内容は破棄されます。\nよろしいですか？')
    if (!yes) {
      return
    }

    toggleView()
  }, [toggleView])

  const handleSaveClick = React.useCallback(async () => {
    const plainText = editorState.getCurrentContent().getPlainText()
    const lines = plainText.split('\n')

    const newPage = produce(page, draft => {
      draft.title = lines[0]
      draft.lines.splice(lines.length, draft.lines.length - lines.length)
      lines.map((line, i) => {
        if (draft.lines[i]) {
          draft.lines[i].body = line
        } else {
          const newLine = createNewLine(draft.id, i)
          newLine.body = line
          draft.lines[i] = newLine
        }
      })
    })

    // page.id が存在しないのはDBに保存されていないページ
    // そのため、new page でも [title] page でも post をすればよい
    if (!newPage.id) {
      await apiClient.post(`/pages`, newPage)
    } else {
      await apiClient.put(`/pages/${newPage.title}`, newPage)
    }

    // 正常に通信が成功した場合、new page または title が変更されていれば
    //   [title] page に遷移する
    if (router.pathname === '/new' || router.pathname !== `/${newPage.title}`) {
      router.push('/[title]', `/${newPage.title}`)
    }

    toggleView()
  }, [editorState, page, toggleView, router])

  const draftPage: Page = React.useMemo(() => {
    const plainText = editorState.getCurrentContent().getPlainText()
    const lines = plainText.split('\n')

    const newLines = lines.map((line, i) => {
      const newLine = createNewLine(page.id, i)
      newLine.body = line
      return newLine
    })

    return {
      id: page.id,
      title: lines[0],
      created_at: page.created_at,
      updated_at: page.updated_at,
      lines: newLines,
      links: null,
    }
  }, [page, editorState])

  return (
    <>
      <Container
        style={{
          background: 'white',
          border: '1px solid #ddd',
          padding: 10,
        }}
      >
        <Container
          style={{
            width: '50%',
            height: '100%',
            display: 'inline-block',
            border: '1px solid #ddd',
          }}
        >
          <Editor editorState={editorState} onChange={setEditorState} />
        </Container>
        <Container style={{ width: '50%', display: 'inline-block' }}>
          <h2>【Preview】</h2>
          <PageView isPreview page={draftPage} />
        </Container>
      </Container>
      <Box
        display="flex"
        justifyContent="flex-end"
        className={styles.buttonContainer}
      >
        <Button
          variant="contained"
          size="medium"
          onClick={handleCancelClick}
          className={styles.button}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleSaveClick}
          className={styles.button}
        >
          Save
        </Button>
      </Box>
    </>
  )
}
