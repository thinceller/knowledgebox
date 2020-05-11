import React from 'react'
import { NextPage } from 'next'
import {
  Editor,
  EditorState,
  CompositeDecorator,
  DraftDecorator,
} from 'draft-js'

import { Layout } from '../components/Layout'
import { MainContainer } from '../components/MainContainer'

function findWithRegex(regex: RegExp, contentBlock: any, callback: any) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const listStrategy: DraftDecorator['strategy'] = (contentBlock, callback) => {
  findWithRegex(/^\s{1}/g, contentBlock, callback)
}

const ListSpan: DraftDecorator['component'] = props => (
  <span {...props} style={{ textDecoration: 'underline' }}>
    {props.children}
  </span>
)

const linkStrategy: DraftDecorator['strategy'] = (contentBlock, callback) => {
  findWithRegex(/\[.*\]/g, contentBlock, callback)
}

const LinkSpan: DraftDecorator['component'] = props => (
  <span {...props} style={{ background: 'skyblue' }}>
    {props.children}
  </span>
)

const New: NextPage = () => {
  const compositeDecorator = new CompositeDecorator([
    {
      strategy: listStrategy,
      component: ListSpan,
    },
    {
      strategy: linkStrategy,
      component: LinkSpan,
    },
  ])

  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty(compositeDecorator),
  )

  const buttonClick = (): void =>
    console.log(editorState.getCurrentContent().getPlainText())

  return (
    <Layout>
      <MainContainer>
        <h2>- Editor -</h2>
        <div
          style={{
            background: 'white',
            border: '1px solid #ddd',
            padding: 10,
          }}
        >
          <Editor editorState={editorState} onChange={setEditorState} />
        </div>
        <button onClick={buttonClick}>content state</button>
      </MainContainer>
    </Layout>
  )
}

export default New
