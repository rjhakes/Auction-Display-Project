import axios from 'axios'

export default() => {
  return axios.create({
    // baseURL: `http://localhost:8081`
    baseURL: `http://${process.env.HOST_NAME}:8081`
  })
}
