import { NextPage, GetServerSideProps } from 'next'
import fetch from 'node-fetch'

const Index: NextPage<any> = ({ data }) => (
  <div>{data}</div>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:1323')
  const data = await res.text()

  return { props: { data } }
}

export default Index
