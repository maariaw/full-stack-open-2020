import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, change) => {
  const response = await axios.put(`${baseUrl}/${id}`, change)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const addComment = async (id, comment) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    comment,
    config
  )
  return response.data
}

const blogService = {
  getAll,
  create,
  setToken,
  update,
  remove,
  addComment,
}

export default blogService
