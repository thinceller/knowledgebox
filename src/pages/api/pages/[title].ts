import { NextApiRequest, NextApiResponse } from 'next'
import { AxiosError } from 'axios'

import { apiClient } from 'src/config/client'
import { createEmptyPage } from 'src/models/Page'

const path = '/pages'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    // body,
    method,
  } = req

  const title = req.query.title as string

  const url = `${path}/${encodeURI(title)}`

  switch (method) {
    case 'GET': {
      apiClient
        .get(url)
        .then(response => {
          res.status(response.status).json(response.data)
        })
        .catch(error => {
          if (!error.response) {
            return res.status(500).json(error)
          }

          const { response } = error as AxiosError
          // 404 のときだけは正常な動作であるため 空のページを生成して返すようにする
          if (response.status === 404) {
            const page = createEmptyPage()
            page.title = title
            page.lines[0].body = title
            return res.status(200).json(page)
          }

          res.status(error.response.status).json(error.response.data)
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
