import React from 'react'
import reactStringReplace from 'react-string-replace'
// import { makeStyles } from '@material-ui/core/styles'

import { Line } from 'src/models/Line'
import Link from 'next/link'

type LineViewProps = {
  line: Line
}

// const useStyles = makeStyles({
//   main: {
//     background: 'white',
//     padding: 20,
//   },
//   button: {
//     marginLeft: 20,
//   },
// })

const OUTER_LINK_TAG_REGEXP_1 = /\[(https?:\/\/[^\[\]\s]+)\]/g
// TODO: できればやりたい
// const OUTER_LINK_TAG_REGEXP_2 = /\[(https?:\/\/[^\[\]]+)\s([^\[\]]+)\]/g
// const OUTER_LINK_TAG_REGEXP_3 = /\[([^\[\]]+)\s(https?:\/\/[^\[\]]+)\]/g
const LINK_REGEXP = /(https?:\/\/\S+)/g
const LINK_TAG_REGEXP = /\[([^\[\]]*)\]/g
const LIST_REGEXP = /^(\s{1})/g

export const LineView: React.FC<LineViewProps> = ({ line }) => {
  let replacedText: React.ReactNodeArray
  replacedText = reactStringReplace(line.body, LIST_REGEXP, () => {
    return '・'
  })
  replacedText = reactStringReplace(
    replacedText,
    OUTER_LINK_TAG_REGEXP_1,
    (match, i) => {
      return (
        <a
          href={match}
          key={match + i}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match}
        </a>
      )
    },
  )
  replacedText = reactStringReplace(replacedText, LINK_REGEXP, (match, i) => {
    return (
      <a href={match} key={match + i} target="_blank" rel="noopener noreferrer">
        {match}
      </a>
    )
  })
  replacedText = reactStringReplace(
    replacedText,
    LINK_TAG_REGEXP,
    (match, i) => {
      return (
        <Link href="/[title]" as={`/${match}`} key={match + i}>
          <a>{match}</a>
        </Link>
      )
    },
  )

  return line.body ? <p>{replacedText}</p> : <br />
}
