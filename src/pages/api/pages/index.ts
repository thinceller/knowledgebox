import { NextApiHandler } from 'next'

import { apiClient } from 'src/config/client'

const path = '/pages'

const Index: NextApiHandler = async (req, res) => {
  const response = await apiClient.get(path)
  const pages = response.data

  res.status(200).json(pages)
}

export default Index
