<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- 品牌信息 -->
        <div class="footer-brand">
          <div class="brand-logo">
            <span>🧁</span>
            <span class="brand-name">蜜语甜心</span>
          </div>
          <p class="brand-desc">
            用心烘焙每一份甜蜜，让幸福的味道传递给每一个人。
          </p>
        </div>

        <!-- 快速链接 -->
        <div class="footer-links">
          <h4>快速链接</h4>
          <router-link to="/products">全部产品</router-link>
          <router-link to="/about">关于我们</router-link>
          <router-link to="/contact">联系我们</router-link>
        </div>

        <!-- 产品分类 -->
        <div class="footer-links">
          <h4>产品分类</h4>
          <router-link to="/products?category=bread">手工面包</router-link>
          <router-link to="/products?category=cake">精致蛋糕</router-link>
          <router-link to="/products?category=dessert">甜品小食</router-link>
        </div>

        <!-- 联系方式 -->
        <div class="footer-contact">
          <h4>联系我们</h4>
          <div class="contact-item">
            <el-icon><Location /></el-icon>
            <span>上海市静安区南京西路1688号</span>
          </div>
          <div class="contact-item">
            <el-icon><Phone /></el-icon>
            <span>021-6688-8866</span>
          </div>
          <div class="contact-item">
            <el-icon><Clock /></el-icon>
            <span>每日 8:00 - 22:00</span>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="footer-bottom">
        <p>&copy; 2026 蜜语甜心 Sweet Whisper Bakery. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Location, Phone, Clock } from '@element-plus/icons-vue'
</script>

<style scoped>
.app-footer {
  background: #2c2c2c;
  color: #ccc;
  padding: 60px 0 0;
  margin-top: 80px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
  gap: 40px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  margin-bottom: 16px;
}

.brand-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: #d4a574;
}

.brand-desc {
  font-size: 14px;
  line-height: 1.8;
  color: #999;
  margin-bottom: 20px;
}

.footer-links h4,
.footer-contact h4 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 600;
}

.footer-links a {
  display: block;
  color: #999;
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #d4a574;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #999;
}

.footer-bottom {
  text-align: center;
  padding: 20px 0;
  font-size: 13px;
  color: #666;
}

:deep(.el-divider) {
  border-color: #3a3a3a;
  margin: 40px 0 0;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .app-footer {
    padding: 40px 0 0;
  }
}
</style>
