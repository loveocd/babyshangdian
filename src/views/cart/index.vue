<template>
  <div>
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">我的购物车</h1>
      <div class="flex gap-2">
        <el-button type="danger" plain :disabled="cartList.length === 0" @click="handleClearCart">
          <el-icon><Delete /></el-icon>
          清空购物车
        </el-button>
        <el-button type="primary" @click="goToShop">
          <el-icon><ShoppingCart /></el-icon>
          继续购物
        </el-button>
      </div>
    </div>

    <!-- 购物车列表 -->
    <el-card v-if="cartList.length > 0">
      <el-table :data="cartList" stripe border>
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.product?.imageUrl"
              :src="row.product.imageUrl"
              fit="cover"
              class="w-16 h-16 rounded-md"
            />
            <span v-else class="text-gray-300">无图</span>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" min-width="200">
          <template #default="{ row }">
            <div>{{ row.product?.name || '商品已下架' }}</div>
            <div v-if="!row.isValid" class="text-xs text-red-500">已下架或库存不足</div>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="120" align="center">
          <template #default="{ row }">
            ¥{{ row.product?.price?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>

        <el-table-column label="数量" width="140" align="center">
          <template #default="{ row }">
            <el-input-number
              v-model="row.quantity"
              :min="1"
              :max="row.product?.stock || 0"
              :disabled="!row.isValid"
              size="small"
              @change="(val) => handleQuantityChange(row.id, val)"
            />
          </template>
        </el-table-column>

        <el-table-column label="小计" width="140" align="center">
          <template #default="{ row }">
            ¥{{ (row.quantity * (row.product?.price || 0)).toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button size="small" type="danger" link @click="handleDeleteItem(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部汇总 -->
      <div class="flex items-center justify-end mt-4 pt-4 border-t">
        <div class="flex items-center gap-4">
          <div>
            <span class="text-gray-600">合计：</span>
            <span class="text-2xl font-bold text-red-500">¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <el-button type="primary" size="large" @click="handleCheckout">
            去结算
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 空状态 -->
    <el-card v-else class="text-center py-12">
      <el-empty description="购物车还是空的" :image-size="120">
        <el-button type="primary" @click="goToShop">去逛逛</el-button>
      </el-empty>
    </el-card>

    <!-- 结算确认弹窗（可选） -->
    <el-dialog v-model="checkoutDialogVisible" title="确认结算" width="500px">
      <div>您确定要结算当前购物车中的所有商品吗？</div>
      <div class="mt-2">总金额：<strong class="text-red-500">¥{{ totalPrice.toFixed(2) }}</strong></div>
      <template #footer>
        <el-button @click="checkoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCheckout">确认结算</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Delete, ShoppingCart } from '@element-plus/icons-vue'
import cartApi from '@/api/cart'

const router = useRouter()

// 获取用户ID（简单解析，避免报错）
let userId = null
const userStr = sessionStorage.getItem('user')
if (userStr && userStr !== 'undefined' && userStr !== 'null') {
  try {
    const user = JSON.parse(userStr)
    userId = user?.id || user?.user_id
  } catch (e) {
    console.warn('用户信息解析失败')
    sessionStorage.removeItem('user')
  }
}

const cartList = ref([])
const checkoutDialogVisible = ref(false)

// 总价计算
const totalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => {
    if (item.isValid && item.product) {
      return sum + item.quantity * item.product.price
    }
    return sum
  }, 0)
})

// 获取购物车列表
async function getCartList() {
  if (!userId) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    const res = await cartApi.getList(userId)
    if (res.code === 200) {
      cartList.value = res.data.list || []
      // 标记商品有效性（下架或库存不足视为无效）
      cartList.value.forEach(item => {
        const p = item.product
        item.isValid = p && p.isup === true && p.stock > 0
      })
    }
  } catch (err) {
    ElMessage.error('获取购物车失败：' + err.message)
  }
}

// 更新购物车数量（触发顶部角标更新）
async function updateCartCount() {
  if (!userId) return
  try {
    const res = await cartApi.getCount(userId)
    if (res.code === 200) {
      window.dispatchEvent(new CustomEvent('cart-update', { detail: { count: res.data.count } }))
    }
  } catch (err) {
    console.error('更新数量失败', err)
  }
}

// 修改数量
async function handleQuantityChange(id, quantity) {
  try {
    await cartApi.updateQuantity({ id, user_id: userId, quantity })
    await getCartList()
    await updateCartCount()
    ElMessage.success('更新成功')
  } catch (err) {
    ElMessage.error('更新失败：' + err.message)
    await getCartList() // 恢复
  }
}

// 删除单个
async function handleDeleteItem(id) {
  try {
    await ElMessageBox.confirm('确定删除该商品？', '提示', { type: 'warning' })
    await cartApi.deleteItem(id, userId)
    await getCartList()
    await updateCartCount()
    ElMessage.success('删除成功')
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  }
}

// 清空购物车
async function handleClearCart() {
  if (cartList.value.length === 0) return
  try {
    await ElMessageBox.confirm('确定清空购物车？', '警告', { type: 'warning' })
    await cartApi.clear(userId)
    await getCartList()
    await updateCartCount()
    ElMessage.success('清空成功')
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('清空失败')
  }
}

// 去结算
function handleCheckout() {
  if (cartList.value.length === 0) {
    ElMessage.warning('购物车为空')
    return
  }
  checkoutDialogVisible.value = true
}

// 确认结算（跳转订单确认页）
function confirmCheckout() {
  checkoutDialogVisible.value = false
  // 简单传递总金额，实际开发可传商品列表
  router.push({
    path: '/order/confirm',
    query: { totalPrice: totalPrice.value }
  })
}

// 继续购物
function goToShop() {
  router.push('/main/product/list')
}

onMounted(() => {
  if (userId) {
    getCartList()
    updateCartCount()
  } else {
    ElMessage.warning('未登录，请先登录')
  }
})
</script>

<style scoped>
:deep(.el-table th.el-table__cell) {
  background-color: #fafafa;
}
</style>