import { NextPage, GetServerSideProps } from 'next'
import fetch from 'node-fetch'

const Index: NextPage<any> = ({ data }) => (
  <div>{JSON.stringify(data)}</div>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:1323/pages')
  const data = await res.json()

  return { props: { data } }
}

export default Index
