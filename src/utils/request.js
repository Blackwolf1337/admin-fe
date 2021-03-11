import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  timeout: 60000 // request timeout
})

const isJson = ({ headers }) => headers['content-type'].includes('application/json')

// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log(`Error ${error}`)

    if (!error.response) {
      Message({
        message: error,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      const errors = Array.isArray(error.response.data) ? error.response.data : [error.response.data]
      errors.forEach(errorData => {
        const edata = errorData.error || errorData
        Message({
          message: isJson(error.response) ? `${error.message} - ${edata}` : `${error.message}`,
          type: 'error',
          duration: 5 * 1000
        })
      })
    }

    return Promise.reject(error)
  }
)

export default service
