<template>
  <section class="hero-banner">
    <el-carousel
      :interval="5000"
      arrow="hover"
      height="560px"
      indicator-position="outside"
    >
      <el-carousel-item v-for="(slide, index) in slides" :key="index">
        <div class="slide" :style="{ backgroundImage: `url(${slide.image})` }">
          <div class="slide-overlay">
            <div class="slide-content">
              <span class="slide-tag">{{ slide.tag }}</span>
              <h1 class="slide-title">{{ slide.title }}</h1>
              <p class="slide-desc">{{ slide.description }}</p>
              <el-button
                type="primary"
                size="large"
                round
                class="slide-btn"
                @click="$router.push(slide.link)"
              >
                {{ slide.btnText }}
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

const slides = [
  {
    image: '/images/banners/banner-1.jpg',
    tag: '匠心烘焙',
    title: '每一口都是幸福的味道',
    description: '精选全球优质原料，法式工艺手工制作，为您呈现最纯粹的甜蜜。',
    btnText: '探索产品',
    link: '/products',
  },
  {
    image: '/images/banners/banner-2.jpg',
    tag: '春季新品',
    title: '春日限定·樱花系列',
    description: '以春日樱花为灵感，推出限定甜品系列，感受春天的甜蜜气息。',
    btnText: '查看新品',
    link: '/products',
  },
  {
    image: '/images/banners/banner-3.jpg',
    tag: '甜蜜礼遇',
    title: '精美礼盒·传递心意',
    description: '每一份礼盒都承载着满满心意，是送给挚爱之人的最好选择。',
    btnText: '选购礼盒',
    link: '/products',
  },
]
</script>

<style scoped>
.hero-banner {
  margin-top: 70px;
}

.slide {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.slide-overlay {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
  display: flex;
  align-items: center;
}

.slide-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
  width: 100%;
}

.slide-tag {
  display: inline-block;
  background: rgba(212, 165, 116, 0.9);
  color: #fff;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.slide-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.slide-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  max-width: 500px;
  line-height: 1.8;
}

.slide-btn {
  background: #d4a574;
  border-color: #d4a574;
  font-size: 16px;
  padding: 12px 32px;
  height: auto;
}

.slide-btn:hover {
  background: #c49664;
  border-color: #c49664;
}

:deep(.el-carousel__indicators--outside) {
  margin-top: -30px;
  position: relative;
  z-index: 10;
}

:deep(.el-carousel__indicator .el-carousel__button) {
  width: 30px;
  height: 4px;
  border-radius: 2px;
  background: #d4a574;
  opacity: 0.3;
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  opacity: 1;
  width: 50px;
}

@media (max-width: 768px) {
  .hero-banner {
    margin-top: 60px;
  }

  :deep(.el-carousel) {
    height: 400px !important;
  }

  .slide-content {
    padding: 0 24px;
  }

  .slide-title {
    font-size: 28px;
  }

  .slide-desc {
    font-size: 14px;
  }
}
</style>
