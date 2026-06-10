import axios from 'axios'
import { APP_CONFIG } from '@/config'
import { setupMockAdapter } from '@/mock/adapter'

// 创建 axios 实例
const request = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 挂载 Mock 拦截器（所有请求仍经过下方的请求/响应拦截器）
setupMockAdapter(request)

// 请求拦截器 —— 统一注入 token 等认证信息
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 —— 统一解包 data，业务错误向上 reject 由调用层处理
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== undefined && res.code !== 200) {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data !== undefined ? res.data : res
  },
  (error) => Promise.reject(error)
)

// ============ 业务 API 函数（全部通过 axios 实例发起请求）============

/** 获取产品列表 */
export function getProducts() {
  return request.get('/api/products')
}

/** 获取产品详情 */
export function getProductById(id) {
  return request.get(`/api/products/${id}`)
}

/** 获取分类列表 */
export function getCategories() {
  return request.get('/api/categories')
}

/** 提交联系表单 */
export function submitContactForm(formData) {
  return request.post('/api/contact', formData)
}

export default request
