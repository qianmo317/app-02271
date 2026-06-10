<template>
  <div class="home-page">
    <!-- 轮播 Banner -->
    <HeroBanner />

    <!-- 分类入口 -->
    <section class="section categories-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">探索美味</h2>
          <p class="section-subtitle">每一种类别都蕴藏着独特的甜蜜惊喜</p>
        </div>
        <div class="category-cards">
          <div
            v-for="cat in categoryCards"
            :key="cat.name"
            class="category-card"
            @click="goToCategory(cat.id)"
          >
            <div class="category-icon">{{ cat.emoji }}</div>
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 人气推荐 -->
    <section class="section featured-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">人气推荐</h2>
          <p class="section-subtitle">最受欢迎的甜品，每一款都值得品尝</p>
        </div>
        <div class="products-grid" v-loading="productStore.loading">
          <ProductCard
            v-for="product in productStore.featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <div class="section-action">
          <el-button type="primary" size="large" round @click="$router.push('/products')">
            查看全部产品
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </section>

    <!-- 品牌故事 -->
    <section class="section story-section">
      <div class="section-container">
        <div class="story-grid">
          <div class="story-image">
            <img
              src="/images/about/story.jpg"
              alt="我们的故事"
            />
          </div>
          <div class="story-content">
            <span class="story-tag">Our Story</span>
            <h2>用心烘焙，传递幸福</h2>
            <p>
              蜜语甜心创立于2018年，源于对烘焙的热爱与对品质的执着追求。
              我们坚信，一块好的面包、一份精致的甜品，承载的不仅是味觉的享受，
              更是一种生活的仪式感。
            </p>
            <p>
              每天清晨，我们的烘焙师们便开始准备新鲜的食材，
              用双手揉制每一块面团，用心关注每一个细节。
              从选材到成品，我们始终坚持手工制作，
              只为将最新鲜、最美味的甜品送到您的手中。
            </p>
            <el-button type="primary" round size="large" @click="$router.push('/about')">
              了解更多
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 新品上市 -->
    <section class="section new-section" v-if="productStore.newProducts.length">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">新品上市</h2>
          <p class="section-subtitle">探索我们最新创作的甜蜜之作</p>
        </div>
        <div class="products-grid">
          <ProductCard
            v-for="product in productStore.newProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- 优势特色 -->
    <section class="section features-section">
      <div class="section-container">
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import HeroBanner from '@/components/HeroBanner.vue'
import ProductCard from '@/components/ProductCard.vue'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const productStore = useProductStore()

const categoryCards = [
  { id: 'bread', name: '手工面包', emoji: '🍞', desc: '每日新鲜出炉，天然酵母发酵' },
  { id: 'cake', name: '精致蛋糕', emoji: '🎂', desc: '法式工艺，匠心制作' },
  { id: 'dessert', name: '甜品小食', emoji: '🍰', desc: '精致小食，下午茶首选' },
]

const features = [
  { icon: '🌾', title: '优选原料', desc: '全球甄选优质食材，从源头把控品质' },
  { icon: '👨‍🍳', title: '匠心手作', desc: '资深烘焙师手工制作，传承法式工艺' },
  { icon: '🚚', title: '新鲜直达', desc: '每日现做现卖，冷链配送保鲜到家' },
  { icon: '💝', title: '用心服务', desc: '定制服务满足每一位顾客的个性化需求' },
]

function goToCategory(categoryId) {
  productStore.setCategory(categoryId)
  router.push('/products')
}

onMounted(() => {
  productStore.fetchProducts()
  productStore.fetchCategories()
})
</script>

<style scoped>
.section {
  padding: 80px 0;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 16px;
  color: #999;
}

/* 分类入口 */
.categories-section {
  background: #faf8f5;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.category-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(212, 165, 116, 0.2);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.category-card h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.category-card p {
  font-size: 14px;
  color: #999;
}

/* 产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.section-action {
  text-align: center;
  margin-top: 40px;
}

.section-action .el-button {
  background: #d4a574;
  border-color: #d4a574;
  padding: 12px 36px;
  font-size: 16px;
  height: auto;
}

.section-action .el-button:hover {
  background: #c49664;
  border-color: #c49664;
}

/* 品牌故事 */
.story-section {
  background: #faf8f5;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.story-image {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.story-content .story-tag {
  display: inline-block;
  color: #d4a574;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.story-content h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 32px;
  color: #333;
  margin-bottom: 24px;
  font-weight: 700;
}

.story-content p {
  font-size: 15px;
  color: #666;
  line-height: 1.9;
  margin-bottom: 20px;
}

.story-content .el-button {
  background: #d4a574;
  border-color: #d4a574;
  margin-top: 8px;
}

.story-content .el-button:hover {
  background: #c49664;
  border-color: #c49664;
}

/* 特色优势 */
.features-section {
  background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 32px 16px;
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 600;
}

.feature-card p {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .section {
    padding: 50px 0;
  }

  .section-title {
    font-size: 24px;
  }

  .category-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .story-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
