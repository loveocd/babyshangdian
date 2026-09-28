import request from '../utils/request'

const categoryApi = {
  getList() {
    return request({ url: '/product/category/list', method: 'get' })
  },
  add(data) {
    // 前端删掉 id
    const { id, ...postData } = data;
    return request({ url: '/product/category/add', method: 'post', data: postData })
  },
  update(data) {
    return request({ url: '/product/category/update', method: 'put', data })
  },
  delete(id) {
    return request({ url: `/product/category/delete/${id}`, method: 'delete' })
  }
}

export default categoryApi