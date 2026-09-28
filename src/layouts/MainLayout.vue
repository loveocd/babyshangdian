<template>
  <div class="flex h-screen bg-gray-50">
    
    <!-- 左侧菜单 -->
    <el-menu
      :default-active="activeMenu"
      class="!border-r !h-full bg-white shadow-sm transition-all duration-300"
      :class="[tabsStore.menuCollapsed ? '!w-16' : '!w-64']"
      :collapse="tabsStore.menuCollapsed"
      :collapse-transition="false"
      @select="handleMenuSelect"
    >
      <!-- Logo区域 - 折叠时只显示图标，展开时显示图标+文字 -->
      <div class="h-16 flex items-center border-b" :class="[tabsStore.menuCollapsed ? 'justify-center px-0' : 'px-4']">
        <div class="flex items-center" :class="[tabsStore.menuCollapsed ? 'flex-col' : '']">
          <el-icon :size="24" class="text-blue-600">
            <ShoppingTrolley />
          </el-icon>
          <span v-if="!tabsStore.menuCollapsed" class="ml-2 text-xl font-bold text-blue-600 truncate">商城后台</span>
        </div>
      </div>

      <!-- 菜单项 -->
      <el-menu-item index="/main/dashboard">
        <el-icon><Odometer/></el-icon>
        <template #title>
          <span class="ml-2">仪表盘</span>
        </template>
      </el-menu-item>
      
      <el-sub-menu index="/main/product">
        <template #title>
          <el-icon><Goods /></el-icon>
          <span class="ml-2">商品管理</span>
        </template>
        <el-menu-item index="/main/product/list">商品列表</el-menu-item>
        <el-menu-item index="/main/product/category">商品分类</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="/main/order">
        <template #title>
          <el-icon><List /></el-icon>
          <span class="ml-2">订单管理</span>
        </template>
        <el-menu-item index="/main/order/list">订单列表</el-menu-item>
        <el-menu-item index="/main/order/after-sale">售后处理</el-menu-item>
      </el-sub-menu>

      <!-- 新增购物车菜单 -->
      <el-menu-item index="/main/cart">
        <el-icon><ShoppingCart /></el-icon>
        <template #title><span class="ml-2">购物车</span></template>
      </el-menu-item>
      
      <el-sub-menu index="/main/user">
        <template #title>
          <el-icon><User /></el-icon>
          <span class="ml-2">用户管理</span>
        </template>
        <el-menu-item index="/main/user">用户列表</el-menu-item>
        <el-menu-item index="/main/user/baby">宝宝情况统计</el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 右侧内容区-->
    <div 
      class="flex-1 flex flex-col overflow-hidden transition-all duration-300"      
    >
      <!-- 顶部导航 - 标题和折叠按钮放在一起 -->
      <header class="h-16 bg-white border-b flex items-center justify-between px-4">
        <div class="flex items-center space-x-3">
          <!-- 折叠按钮 - 放在标题旁边 -->
          <el-button 
            :icon="tabsStore.menuCollapsed ? Expand : Fold" 
            @click="toggleCollapse"
            circle
            size="default"
          />
          <h2 class="text-lg font-medium text-gray-700">{{ currentTitle }}</h2>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 新增购物车角标 -->
          <router-link to="/main/cart" class="relative">
            <el-badge :value="cartCount" :hidden="cartCount === 0">
              <el-icon :size="20"><ShoppingCart /></el-icon>
            </el-badge>
          </router-link>

          <el-dropdown>
            <span class="flex items-center cursor-pointer">
              <el-avatar :size="32" src="/images/user.png" />
              <span class="ml-2 hidden sm:inline">管理员</span>
              <el-icon class="ml-1"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goProfile">个人中心</el-dropdown-item>
                <el-dropdown-item @click="showChangePwdDialog">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Tab 标签页区域 -->
      <div class="flex-1 overflow-hidden flex flex-col p-4">
        <el-tabs
          v-model="tabsStore.activeTab"
          type="card"
          class="flex-1 flex flex-col"
          closable
          @tab-remove="removeTab"
          @tab-click="handleTabClick"
        >
          <el-tab-pane
            v-for="item in tabsStore.tabList"
            :key="item.path"
            :label="item.title"
            :name="item.path"
            :closable="item.closable"
            lazy
          >
            <template #label>
              <span class="flex items-center">
                <el-icon :size="14" class="mr-1">
                  <component :is="getRouteIcon(item.path)" />
                </el-icon>
                {{ item.title }}
              </span>
            </template>
            
            <!-- 内容区域 -->
            <div class="h-full bg-white rounded-lg p-4 overflow-auto">           
              <router-view />             
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- ====================== 修改密码弹窗 ====================== -->
    <el-dialog v-model="pwdDialogVisible" title="修改密码" width="460px" append-to-body>
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="80px" class="mt-4">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="pwdForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入6-20位新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="pwdLoading" @click="handleChangePwd">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserAPI from '@/api/user'
import cartApi from '@/api/cart'   // 新增购物车API
import { 
  ArrowDown, 
  Fold, 
  Expand,
  Odometer,
  Goods,
  Collection,
  List,
  User,
  Document,
  ShoppingTrolley,
  ShoppingCart   // 新增购物车图标
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 当前页面标题
const currentTitle = computed(() => {
  const tab = tabsStore.tabList.find(t => t.path === route.path)
  return tab?.title || '商城后台'
})

// 切换折叠状态
const toggleCollapse = () => {
  tabsStore.toggleMenuCollapse()
}

// 获取路由图标（新增购物车图标映射）
const getRouteIcon = (path) => {
  const routeMap = {
    '/main/dashboard': 'Odometer',
    '/main/product/list': 'Goods',
    '/main/product/category': 'Collection',
    '/main/order/list': 'List',
    '/main/order/after-sale': 'List',
    '/main/user': 'User',
    '/main/cart': 'ShoppingCart'   // 购物车标签页图标
  }
  return routeMap[path] || 'Document'
}

// 菜单选择处理
const handleMenuSelect = async (index) => {
  const routeInfo = router.getRoutes().find(r => r.path === index)
  if (routeInfo) {
    tabsStore.addTab({
      path: index,
      title: routeInfo.meta.title,
      closable: index !== '/main/dashboard'
    })
    await router.push(index)
  }
}

// 移除标签页
const removeTab = async (path) => {
  tabsStore.removeTab(path)
  if (tabsStore.activeTab) {
    await router.push(tabsStore.activeTab)
  } else {
    await router.push('/main/dashboard')
  }
}

// 点击标签页
const handleTabClick = async (tab) => {
  await router.push(tab.props.name)
}

// ====================== 购物车角标数量 ======================
// 安全获取用户ID（兼容 sessionStorage 中可能存储的对象或字符串）
let userId = null
const userStr = sessionStorage.getItem('user')
if (userStr && userStr !== 'undefined' && userStr !== 'null') {
  try {
    const user = JSON.parse(userStr)
    userId = user?.id || user?.user_id
  } catch (e) {
    console.warn('用户信息格式异常，已清除')
    sessionStorage.removeItem('user')
  }
}

const cartCount = ref(0)

const fetchCartCount = async () => {
  if (userId) {
    try {
      const res = await cartApi.getCount(userId)
      if (res.code === 200) cartCount.value = res.data.count
    } catch (err) {
      console.error('获取购物车数量失败', err)
    }
  }
}

onMounted(() => {
  fetchCartCount()
  // 监听购物车更新事件（由购物车组件触发）
  window.addEventListener('cart-update', (e) => {
    cartCount.value = e.detail.count
  })
})

// ====================== 退出登录 ======================
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出当前账号吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 清除登录信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    sessionStorage.removeItem('user')  // 清除用户信息
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    // 用户取消
  }
}

// ====================== 修改密码 ======================
const pwdDialogVisible = ref(false)
const pwdFormRef = ref(null)
const pwdLoading = ref(false)

const pwdForm = ref({
  username: "",          
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
})

const pwdRules = {
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    { validator: (rule, value, callback) => {
      if (value !== pwdForm.value.newPassword) {
        callback(new Error("两次输入密码不一致"))
      } else {
        callback()
      }
    }, trigger: "blur" }
  ]
}

// 打开弹窗
const showChangePwdDialog = () => {
  pwdForm.value = {
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }
  pwdDialogVisible.value = true
}

// 提交修改
const handleChangePwd = async () => {
  try {
    await pwdFormRef.value.validate()
    pwdLoading.value = true

    const { username, oldPassword, newPassword } = pwdForm.value

    const res = await UserAPI.changePassword({
      username,
      oldPassword,
      newPassword
    })

    if (res.code === 200) {
      ElMessage.success("密码修改成功！")
      pwdDialogVisible.value = false
      handleLogout()
    } else {
      ElMessage.error(res.message || "修改失败：原密码错误")
    }
  } catch (err) {
    ElMessage.error("修改失败：原密码错误或网络异常")
    console.error(err)
  } finally {
    pwdLoading.value = false
  }
}

// 个人中心
const goProfile = () => {
  router.push('/main/user')
}
</script>

<style scoped>
/* 菜单过渡动画 */
.el-menu:not(.el-menu--collapse) {
  width: 256px;
}

.el-menu--collapse {
  width: 64px;
}

/* 确保菜单项在折叠时正确显示 */
:deep(.el-menu--collapse .el-sub-menu__title span) {
  display: none;
}

:deep(.el-menu--collapse .el-menu-item span) {
  display: none;
}

:deep(.el-menu--collapse .el-sub-menu__title .el-icon) {
  margin: 0;
}

:deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin: 0;
}

/* 标签页样式 */
:deep(.el-tabs__content) {
  flex: 1;
  overflow: auto;
  padding: 0 !important;
}

:deep(.el-tabs--card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>