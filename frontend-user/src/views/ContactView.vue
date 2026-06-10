<template>
  <div class="contact-page">
    <!-- 页面横幅 -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>联系我们</h1>
        <p>期待与您的每一次交流</p>
      </div>
    </div>

    <div class="page-container">
      <div class="contact-grid">
        <!-- 联系信息 -->
        <div class="contact-info">
          <h2>来找我们聊聊吧</h2>
          <p class="info-desc">
            无论是产品咨询、定制需求还是合作洽谈，我们都期待与您沟通。
            您也可以直接到店品尝我们的甜品。
          </p>

          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">
                <el-icon :size="24"><Location /></el-icon>
              </div>
              <div>
                <h4>门店地址</h4>
                <p>上海市静安区南京西路1688号</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <el-icon :size="24"><Phone /></el-icon>
              </div>
              <div>
                <h4>联系电话</h4>
                <p>021-6688-8866</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <el-icon :size="24"><Message /></el-icon>
              </div>
              <div>
                <h4>电子邮箱</h4>
                <p>hello@sweetwhisper.com</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <el-icon :size="24"><Clock /></el-icon>
              </div>
              <div>
                <h4>营业时间</h4>
                <p>每日 8:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系表单 -->
        <div class="contact-form-wrap">
          <div class="form-card">
            <h3>给我们留言</h3>
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="top"
              size="large"
            >
              <el-form-item label="您的姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入您的姓名" />
              </el-form-item>

              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" />
              </el-form-item>

              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入电子邮箱" />
              </el-form-item>

              <el-form-item label="咨询类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择咨询类型" style="width: 100%">
                  <el-option label="产品咨询" value="product" />
                  <el-option label="蛋糕定制" value="custom" />
                  <el-option label="商务合作" value="business" />
                  <el-option label="投诉建议" value="feedback" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>

              <el-form-item label="留言内容" prop="message">
                <el-input
                  v-model="form.message"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入您想说的话..."
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  round
                  class="submit-btn"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  提交留言
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Location, Phone, Message, Clock } from '@element-plus/icons-vue'
import { submitContactForm } from '@/api'
import { ElMessage } from 'element-plus'

const formRef = ref()
const submitting = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  type: '',
  message: '',
})

const rules = {
  name: [{ required: true, message: '请输入您的姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择咨询类型', trigger: 'change' }],
  message: [{ required: true, message: '请输入留言内容', trigger: 'blur' }],
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await submitContactForm(form)
        ElMessage.success(res.message)
        formRef.value.resetFields()
      } catch (error) {
        ElMessage.error('提交失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }
  })
}
</script>

<style scoped>
.page-banner {
  margin-top: 70px;
  height: 240px;
  background: linear-gradient(135deg, #d4a574 0%, #b8825a 100%);
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
  padding: 60px 24px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

/* 联系信息 */
.contact-info h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  color: #333;
  margin-bottom: 16px;
  font-weight: 700;
}

.info-desc {
  font-size: 15px;
  color: #999;
  line-height: 1.8;
  margin-bottom: 32px;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #faf8f5;
  border-radius: 12px;
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateX(4px);
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #d4a574;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-card h4 {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 600;
}

.info-card p {
  font-size: 14px;
  color: #999;
}

/* 联系表单 */
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.form-card h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 24px;
  font-weight: 600;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #666;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: #d4a574;
  border-color: #d4a574;
}

.submit-btn:hover {
  background: #c49664;
  border-color: #c49664;
}

@media (max-width: 768px) {
  .page-banner {
    margin-top: 60px;
    height: 180px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .form-card {
    padding: 24px;
  }
}
</style>
