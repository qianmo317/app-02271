import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProducts, getProductById, getCategories } from '@/api'
import { ElMessage } from 'element-plus'

export const useProductStore = defineStore('product', () => {
  // 产品列表
  const products = ref([])
  // 分类列表
  const categories = ref([])
  // 当前选中分类
  const currentCategory = ref('all')
  // 加载状态
  const loading = ref(false)
  // 搜索关键词
  const searchKeyword = ref('')

  // 根据分类和搜索过滤产品
  const filteredProducts = computed(() => {
    let result = products.value

    if (currentCategory.value !== 'all') {
      result = result.filter((p) => p.category === currentCategory.value)
    }

    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword)
      )
    }

    return result
  })

  // 获取推荐产品
  const featuredProducts = computed(() => {
    return products.value.filter((p) => p.featured).slice(0, 8)
  })

  // 新品推荐
  const newProducts = computed(() => {
    return products.value.filter((p) => p.isNew).slice(0, 4)
  })

  // 获取产品列表
  async function fetchProducts() {
    loading.value = true
    try {
      const data = await getProducts()
      products.value = data
    } catch {
      ElMessage.error('获取产品列表失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  // 获取产品详情
  async function fetchProductById(id) {
    loading.value = true
    try {
      const data = await getProductById(id)
      return data
    } catch {
      ElMessage.error('获取产品详情失败，请稍后重试')
      return null
    } finally {
      loading.value = false
    }
  }

  // 获取分类列表
  async function fetchCategories() {
    try {
      const data = await getCategories()
      categories.value = [{ id: 'all', name: '全部', icon: 'Grid' }, ...data]
    } catch {
      ElMessage.error('获取分类列表失败，请稍后重试')
    }
  }

  // 设置当前分类
  function setCategory(category) {
    currentCategory.value = category
  }

  // 设置搜索关键词
  function setSearchKeyword(keyword) {
    searchKeyword.value = keyword
  }

  return {
    products,
    categories,
    currentCategory,
    loading,
    searchKeyword,
    filteredProducts,
    featuredProducts,
    newProducts,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    setCategory,
    setSearchKeyword,
  }
})
