import { NextApiRequest, NextApiResponse } from 'next'
import { AxiosError } from 'axios'

import { apiClient } from 'src/config/client'
import { createEmptyPage } from 'src/models/Page'

const path = '/pages'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { title },
    // body,
    method,
  } = req

  const url = `${path}/${encodeURI(String(title))}`

  switch (method) {
    case 'GET': {
      apiClient
        .get(url)
        .then(response => {
          res.status(response.status).json(response.data)
          return
        })
        .catch(error => {
          if (!error.response) {
            res.status(500).json(error)
          }

          const { response } = error as AxiosError
          // 404 のときだけは正常な動作であるため 空のページを生成して返すようにする
          if (response.status === 400) {
            res.status(200).json(createEmptyPage())
            return
          }

          res.status(error.response.status).json(error.response.data)
          return
        })
      return
    }
    // case 'PUT': {
    //   const response = await apiClient.put(url, body)
    //   const page = response.data

    //   res.status(200).json(page)
    //   return
    // }
  }
}
