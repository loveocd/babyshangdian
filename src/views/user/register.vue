<!-- <template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 shadow-lg">
          <el-icon :size="40"><User /></el-icon>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">用户注册</h2>
        <p class="text-gray-500">请填写信息完成注册</p>
      </div>

      <el-card class="border-0 shadow-2xl backdrop-blur-sm bg-white/90">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-position="top"
          class="p-6"
          @keyup.enter="handleRegister"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入账号"
              :prefix-icon="User"
              size="large"
              class="custom-input"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              show-password
              size="large"
              class="custom-input"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入手机号"
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱"
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 border-0 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-4"
            :loading="loading"
            @click="handleRegister"
          >
            注 册
          </el-button>

          <div class="text-center mt-6">
            <span class="text-gray-500 text-sm">已有账号？</span>
            <el-link type="primary" underline="never" class="ml-1" @click="toLogin">返回登录</el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { UserAPI } from '@/api/user'

const userApi = new UserAPI()

const formData = reactive({
  username: '',
  password: '',
  phone: '',
  email: '',
  isactive: '1'
})

const formRef = ref(null)
const loading = ref(false)

const formRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true

    let rtn = await userApi.register(formData)
    
    if (rtn.code == 200) {
      ElMessage.success('注册成功！请登录')
      router.push('/login')
    }
  } catch (error) {
    ElMessage.error('注册失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

:deep(.custom-input .el-input__wrapper) { @apply shadow-sm hover:shadow-md transition-shadow; }
:deep(.custom-input .el-input__inner) { @apply h-12; }
</style> -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 shadow-lg">
          <el-icon :size="40"><User /></el-icon>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">用户注册</h2>
        <p class="text-gray-500">请填写信息完成注册</p>
      </div>

      <el-card class="border-0 shadow-2xl backdrop-blur-sm bg-white/90">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-position="top"
          class="p-6"
          @keyup.enter="handleRegister"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入账号"
              :prefix-icon="User"
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              show-password
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <!-- 新增：确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入手机号"
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱"
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 border-0 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-4"
            :loading="loading"
            @click="handleRegister"
          >
            注 册
          </el-button>

          <div class="text-center mt-6">
            <span class="text-gray-500 text-sm">已有账号？</span>
            <el-link type="primary" underline="never" class="ml-1" @click="toLogin">返回登录</el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { UserAPI } from '@/api/user'

const userApi = new UserAPI()

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',  // 仅用于前端校验
  phone: '',
  email: '',
  isactive: '1'
})

const formRef = ref(null)
const loading = ref(false)

// 自定义确认密码校验器
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const formRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true

    // 提交时剔除 confirmPassword 字段
    const { confirmPassword, ...submitData } = formData
    let rtn = await userApi.register(submitData)
    
    if (rtn.code == 200) {
      ElMessage.success('注册成功！请登录')
      router.push('/login')
    }
  } catch (error) {
    ElMessage.error('注册失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

:deep(.custom-input .el-input__wrapper) { @apply shadow-sm hover:shadow-md transition-shadow; }
:deep(.custom-input .el-input__inner) { @apply h-12; }
</style>