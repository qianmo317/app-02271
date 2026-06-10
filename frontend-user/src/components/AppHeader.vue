<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <span class="logo-icon">🧁</span>
        <span class="logo-text">蜜语甜心</span>
      </router-link>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <!-- 右侧操作区 -->
      <div class="header-actions">
        <el-input
          v-model="searchText"
          placeholder="搜索甜品..."
          :prefix-icon="Search"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleClear"
        />
        <router-link to="/orders" class="action-link" title="我的订单">
          <el-icon :size="20"><Tickets /></el-icon>
        </router-link>
        <router-link to="/cart" class="action-link cart-link" title="购物车">
          <el-badge
            :value="cartStore.totalCount"
            :hidden="cartStore.totalCount === 0"
            :max="99"
          >
            <el-icon :size="20"><ShoppingCart /></el-icon>
          </el-badge>
        </router-link>
      </div>

      <!-- 移动端菜单按钮 -->
      <el-icon class="mobile-menu-btn" @click="showMobileMenu = true" :size="24">
        <Menu />
      </el-icon>
    </div>

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-model="showMobileMenu"
      direction="rtl"
      size="70%"
      :show-close="false"
    >
      <template #header>
        <span class="drawer-logo">🧁 蜜语甜心</span>
      </template>
      <div class="mobile-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-item"
          @click="showMobileMenu = false"
        >
          {{ item.name }}
        </router-link>
        <router-link
          to="/cart"
          class="mobile-nav-item"
          @click="showMobileMenu = false"
        >
          购物车 ({{ cartStore.totalCount }})
        </router-link>
        <router-link
          to="/orders"
          class="mobile-nav-item"
          @click="showMobileMenu = false"
        >
          我的订单
        </router-link>
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { Search, Menu, ShoppingCart, Tickets } from '@element-plus/icons-vue'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const searchText = ref('')
const isScrolled = ref(false)
const showMobileMenu = ref(false)

const navItems = [
  { name: '首页', path: '/' },
  { name: '全部产品', path: '/products' },
  { name: '关于我们', path: '/about' },
  { name: '联系我们', path: '/contact' },
]

function handleSearch() {
  if (searchText.value.trim()) {
    productStore.setSearchKeyword(searchText.value.trim())
    router.push('/products')
  }
}

function handleClear() {
  productStore.setSearchKeyword('')
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.app-header.scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 700;
  color: #d4a574;
  letter-spacing: 2px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
  padding: 4px 0;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #d4a574;
  transition: width 0.3s;
  border-radius: 1px;
}

.nav-item:hover,
.nav-item.active {
  color: #d4a574;
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 200px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: #f5f5f5;
  box-shadow: none;
}

.search-input :deep(.el-input__wrapper:hover),
.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #d4a574;
}

.action-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
}

.action-link:hover {
  color: #d4a574;
  background: #fff9f0;
}

.action-link :deep(.el-badge__content) {
  background-color: #e74c3c;
  border-color: #fff;
}


.mobile-menu-btn {
  display: none;
  cursor: pointer;
  color: #666;
}

.drawer-logo {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: #d4a574;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
}

.mobile-nav-item {
  padding: 16px 0;
  text-decoration: none;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.3s;
}

.mobile-nav-item:hover {
  color: #d4a574;
}

@media (max-width: 768px) {
  .nav-menu,
  .search-input {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .header-container {
    height: 60px;
  }

  .logo-text {
    font-size: 18px;
  }
}
</style>
