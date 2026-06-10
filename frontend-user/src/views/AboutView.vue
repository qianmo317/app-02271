<template>
  <div class="about-page">
    <!-- 页面横幅 -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>关于我们</h1>
        <p>用心烘焙，传递每一份甜蜜</p>
      </div>
    </div>

    <div class="page-container">
      <!-- 品牌故事 -->
      <section class="about-section">
        <div class="about-grid">
          <div class="about-image">
            <img
              src="/images/about/story.jpg"
              alt="关于蜜语甜心"
            />
          </div>
          <div class="about-content">
            <span class="tag">Our Story</span>
            <h2>蜜语甜心的故事</h2>
            <p>
              2018年的一个清晨，创始人林小糖在巴黎塞纳河畔的一间百年面包店里，
              被那刚出炉的可颂面包深深打动。那一刻，她决定将这份纯粹的美味带回中国。
            </p>
            <p>
              回国后，林小糖带领团队走访了法国、日本、意大利等烘焙大国，
              拜师学艺，融合东西方烘焙精华，创立了"蜜语甜心"品牌。
              我们相信，好的甜品不仅能满足味蕾，更能温暖人心。
            </p>
            <p>
              如今，蜜语甜心已在上海开设3家门店，服务超过10万位顾客。
              但我们始终未忘初心——用最好的原料，最用心的手艺，
              为每一位顾客带来幸福的味道。
            </p>
          </div>
        </div>
      </section>

      <!-- 品牌理念 -->
      <section class="values-section">
        <h2 class="section-title">我们的理念</h2>
        <div class="values-grid">
          <div v-for="value in values" :key="value.title" class="value-card">
            <div class="value-icon">{{ value.icon }}</div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 数据展示 -->
      <section class="stats-section">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- 团队介绍 -->
      <section class="team-section">
        <h2 class="section-title">核心团队</h2>
        <p class="section-subtitle">每一位成员都怀揣着对烘焙的热爱与匠心</p>
        <div class="team-grid">
          <div v-for="member in team" :key="member.name" class="team-card">
            <div class="team-avatar">
              <img :src="member.avatar" :alt="member.name" />
            </div>
            <h3>{{ member.name }}</h3>
            <span class="team-role">{{ member.role }}</span>
            <p>{{ member.desc }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const values = [
  {
    icon: '🌿',
    title: '天然健康',
    desc: '坚持使用天然原料，拒绝添加剂和人工色素，让每一口都安心。',
  },
  {
    icon: '✨',
    title: '匠心品质',
    desc: '每一款产品都经过反复试做，确保口感与品质达到最佳状态。',
  },
  {
    icon: '🎨',
    title: '创意美学',
    desc: '将艺术融入烘焙，让甜品不仅美味可口，更是一件赏心悦目的艺术品。',
  },
  {
    icon: '💫',
    title: '温暖传递',
    desc: '每一份甜品都承载着祝福与心意，传递生活中的甜蜜与温暖。',
  },
]

const stats = [
  { number: '8+', label: '年烘焙经验' },
  { number: '100,000+', label: '服务顾客' },
  { number: '50+', label: '甜品种类' },
  { number: '3', label: '线下门店' },
]

const team = [
  {
    name: '林小糖',
    role: '创始人 / 首席甜品师',
    avatar: '/images/team/member-1.jpg',
    desc: '毕业于法国蓝带国际学院，拥有8年法式甜品制作经验。',
  },
  {
    name: '张大厨',
    role: '首席面包师',
    avatar: '/images/team/member-2.jpg',
    desc: '师从日本面包大师，精通各类欧式面包和日式面包制作。',
  },
  {
    name: '王美琳',
    role: '产品研发总监',
    avatar: '/images/team/member-3.jpg',
    desc: '曾任五星级酒店甜品主厨，擅长融合创新与经典。',
  },
]
</script>

<style scoped>
.page-banner {
  margin-top: 70px;
  height: 280px;
  background:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('/images/about/about-banner.jpg') center / cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: #fff;
}

.banner-content h1 {
  font-family: 'Noto Serif SC', serif;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
}

.banner-content p {
  font-size: 16px;
  opacity: 0.9;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 品牌故事 */
.about-section {
  padding: 80px 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-image {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.about-image img {
  width: 100%;
  display: block;
}

.about-content .tag {
  color: #d4a574;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.about-content h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 30px;
  color: #333;
  margin: 12px 0 24px;
  font-weight: 700;
}

.about-content p {
  font-size: 15px;
  color: #666;
  line-height: 1.9;
  margin-bottom: 16px;
}

/* 品牌理念 */
.values-section {
  padding: 80px 0;
  background: #faf8f5;
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
}

.section-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 30px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 48px;
}

.section-subtitle {
  text-align: center;
  color: #999;
  margin-top: -36px;
  margin-bottom: 48px;
  font-size: 15px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.value-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: transform 0.3s;
}

.value-card:hover {
  transform: translateY(-4px);
}

.value-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.value-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.value-card p {
  font-size: 14px;
  color: #999;
  line-height: 1.7;
}

/* 数据展示 */
.stats-section {
  padding: 60px 0;
  background: linear-gradient(135deg, #d4a574, #b8825a);
  margin: 0 -24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.stat-number {
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  font-family: 'Noto Serif SC', serif;
}

.stat-label {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
}

/* 团队 */
.team-section {
  padding: 80px 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.team-card {
  text-align: center;
  padding: 32px 24px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s;
}

.team-card:hover {
  transform: translateY(-4px);
}

.team-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 3px solid #f0e6d9;
}

.team-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 4px;
}

.team-role {
  font-size: 13px;
  color: #d4a574;
  font-weight: 500;
}

.team-card p {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .page-banner {
    margin-top: 60px;
    height: 200px;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .values-grid,
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 32px;
  }
}
</style>
