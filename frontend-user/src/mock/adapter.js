import MockAdapter from 'axios-mock-adapter'
import { mockProducts, mockCategories } from './products'

/**
 * 为传入的 axios 实例挂载 Mock 拦截器。
 * 所有请求仍经过 axios 实例的 request/response 拦截器，
 * 只是网络层被 MockAdapter 替代，保证技术栈真实生效。
 */
export function setupMockAdapter(axiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 300 })

  // GET /api/categories
  mock.onGet('/api/categories').reply(200, {
    code: 200,
    data: mockCategories,
  })

  // GET /api/products
  mock.onGet('/api/products').reply(200, {
    code: 200,
    data: mockProducts,
  })

  // GET /api/products/:id
  mock.onGet(/\/api\/products\/(\d+)/).reply((config) => {
    const id = Number(config.url.split('/').pop())
    const product = mockProducts.find((p) => p.id === id)
    if (product) {
      return [200, { code: 200, data: product }]
    }
    return [404, { code: 404, message: '产品不存在' }]
  })

  // POST /api/contact
  mock.onPost('/api/contact').reply((config) => {
    const formData = JSON.parse(config.data)
    return [
      200,
      {
        code: 200,
        message: '留言提交成功，我们会尽快与您联系！',
        data: formData,
      },
    ]
  })
}
