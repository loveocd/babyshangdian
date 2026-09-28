<!-- <template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">商品列表</h1>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新增商品
      </el-button>
    </div>

    <el-card>
      <el-table :data="productList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '上架' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button size="small" type="primary" link>编辑</el-button>
            <el-button size="small" type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const productList = ref([
  { id: 1, name: 'iPhone 15', category: '手机', price: 6999, stock: 100, status: '上架' },
  { id: 2, name: '华为 Mate 60', category: '手机', price: 5999, stock: 50, status: '上架' },
  { id: 3, name: '联想小新 Pro', category: '笔记本', price: 5299, stock: 30, status: '上架' },
  { id: 4, name: 'iPad Air', category: '平板', price: 4799, stock: 0, status: '下架' },
  { id: 5, name: '小米手环 8', category: '穿戴', price: 299, stock: 200, status: '上架' }
])
</script> -->

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">商品列表</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增商品
      </el-button>
    </div>

    <el-card>
      <el-table :data="productList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />

        <!-- 表格显示商品图片 -->
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.imageUrl"
              :src="row.imageUrl"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 6px"
            />
            <span v-else class="text-gray-300 text-sm">无图</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品名称">
          <template #default="{ row }">
            <span class="text-blue-600 cursor-pointer" @click="handleShowDetail(row)">
              {{ row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="typeName" label="分类" width="120" />

        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>

        <el-table-column prop="stock" label="库存" width="100" />

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isup ? 'success' : 'danger'">
              {{ row.isup ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
            <!-- 新增加入购物车按钮（仅上架商品可添加） -->
            <el-button size="small" type="success" link :disabled="!row.isup" @click="handleAddToCart(row)">
              加入购物车
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-600 mr-2">每页显示</span>
          <el-select
            v-model="pageSize"
            @change="handleSizeChange"
            size="small"
            style="width: 100px"
          >
            <el-option label="1条/页" :value="1" />
            <el-option label="2条/页" :value="2" />
            <el-option label="3条/页" :value="3" />
            <el-option label="5条/页" :value="5" />
            <el-option label="10条/页" :value="10" />
          </el-select>
          <span class="text-sm text-gray-600 ml-4">
            共 <span class="text-blue-600 font-medium">{{ total }}</span> 条数据
          </span>
        </div>

        <div class="flex items-center">
          <el-button :disabled="currentPage === 1" @click="goToPage(1)" size="small" circle>
            <el-icon><DArrowLeft /></el-icon>
          </el-button>

          <el-button :disabled="currentPage === 1" @click="prevPage" size="small" class="mx-1">
            上一页
          </el-button>

          <el-button :disabled="currentPage === totalPages" @click="nextPage" size="small" class="mx-1">
            下一页
          </el-button>

          <el-button :disabled="currentPage === totalPages" @click="goToPage(totalPages)" size="small" circle>
            <el-icon><DArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </el-card>

    <!--  商品详情弹窗 -->
    <el-dialog v-model="detailVisible" title="商品详情" width="700px" append-to-body>
      <div class="p-6 bg-gray-50 rounded-lg">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- 左侧大图 -->
          <div class="flex-shrink-0">
            <el-image
              v-if="currentDetail.imageUrl"
              :src="currentDetail.imageUrl"
              :preview-src-list="[currentDetail.imageUrl]"
              fit="cover"
              style="width: 240px; height: 240px; border-radius: 12px; box-shadow: 0 2px 10px #0000001c"
            />
            <div v-else class="w-[240px] h-[240px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
              暂无图片
            </div>
          </div>

          <!-- 右侧信息 -->
          <div class="flex-1 space-y-4">
            <h2 class="text-xl font-bold text-gray-800">{{ currentDetail.name }}</h2>

            <el-descriptions :column="1" border size="small" class="bg-white rounded-lg">
              <el-descriptions-item label="商品分类">
                {{ currentDetail.typeName || '未分类' }}
              </el-descriptions-item>
              <el-descriptions-item label="价格">
                <span class="text-red-500 text-lg font-bold">¥{{ currentDetail.price }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="库存">
                {{ currentDetail.stock }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="currentDetail.isup ? 'success' : 'danger'">
                  {{ currentDetail.isup ? '上架中' : '已下架' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ currentDetail.createdAt || '未知' }}
              </el-descriptions-item>
            </el-descriptions>

            <!-- 描述 -->
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <h3 class="font-semibold mb-2">商品描述</h3>
              <p class="text-gray-600 whitespace-pre-line leading-6">{{ currentDetail.description || '暂无描述' }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 新增 / 编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '新增商品'" width="500px">
      <el-form :model="form" label-width="80px" class="mt-4">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品分类">
          <el-select v-model="form.protype_id" placeholder="请选择商品分类" style="width: 100%">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div v-if="form.imageUrl" class="mt-2">
              <el-image
                :src="form.imageUrl"
                fit="cover"
                style="width: 100px; height: 100px; border-radius: 4px"
              />
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="价格">
          <el-input v-model.number="form.price" type="number" placeholder="请输入价格" />
        </el-form-item>

        <el-form-item label="库存">
          <el-input v-model.number="form.stock" type="number" placeholder="请输入库存" />
        </el-form-item>

        <el-form-item label="商品描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-form-item label="上架状态">
          <el-radio-group v-model="form.isup">
            <el-radio :value="true">上架</el-radio>
            <el-radio :value="false">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Plus, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import ProductAPI from '@/api/product'
import categoryApi from '@/api/category'
import cartApi from '@/api/cart'

const productList = reactive([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const loading = ref(false)

const detailVisible = ref(false)
const currentDetail = ref({})

const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: '',
  name: '',
  price: '',
  stock: '',
  isup: true,
  protype_id: 1,
  imageUrl: '',
  description: ''
})

const categoryList = ref([])

async function getProductList() {
  if (loading.value) return
  loading.value = true
  try {
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
    //调用后端getList
    let result = await ProductAPI.getList(params)
    productList.length = 0
    productList.push(...result.data.formattedProducts)
    total.value = result.data.pagination.total
    totalPages.value = result.data.pagination.totalPages
  } catch (err) {
    console.error("获取列表失败:", err)
    if (err.message !== '取消重复请求') {
      ElMessage.error('获取列表失败')
    }
  } finally {
    loading.value = false
  }
}

async function getCategoryList() {
  try {
    const res = await categoryApi.getList()
    categoryList.value = res.data || []
  } catch (err) {
    ElMessage.error('加载分类失败')
  }
}

onMounted(() => {
  nextTick(() => {
    getProductList()
    getCategoryList()
  })
})

const handleSizeChange = () => {
  currentPage.value = 1
  getProductList()
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    getProductList()
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    getProductList()
  }
}
const goToPage = (p) => {
  if (p !== currentPage.value) {
    currentPage.value = p
    getProductList()
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    id: '',
    name: '',
    price: '',
    stock: '',
    isup: true,
    protype_id: 1,
    imageUrl: '',
    description: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该商品？', '提示', { type: 'warning' })
    await ProductAPI.pdelete(row.id)
    ElMessage.success('删除成功')
    getProductList()
  } catch (err) {
    ElMessage.info('已取消')
  }
}

const beforeUpload = (file) => {
  const isImage = file.type.includes('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('只能上传图片！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleUpload = (options) => {
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.src = e.target.result
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const maxSize = 800
      let width = img.width
      let height = img.height
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (maxSize / width) * height
          width = maxSize
        } else {
          width = (maxSize / height) * width
          height = maxSize
        }
      }
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
      form.value.imageUrl = compressedDataUrl
    }
  }
  reader.readAsDataURL(file)
}

const handleSave = async () => {
  try {
    const params = {
      name: form.value.name,
      price: form.value.price,
      stock: form.value.stock,
      isup: form.value.isup,
      protype_id: form.value.protype_id,
      imageUrl: form.value.imageUrl,
      description: form.value.description
    }
    if (isEdit.value) {
      params.id = form.value.id
      await ProductAPI.update(params)
      ElMessage.success('编辑成功')
    } else {
      await ProductAPI.add(params)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getProductList()
  } catch (err) {
    ElMessage.error('保存失败')
    console.error(err)
  }
}

const handleShowDetail = async (row) => {
  try {
    // 调用后端商品详情接口，传入当前商品ID
    let res = await ProductAPI.getDetail(row.id)
    //赋值给currentDetail
    currentDetail.value = res.data
    detailVisible.value = true
  } catch (err) {
    currentDetail.value = row
    detailVisible.value = true
  }
}

// 获取当前登录用户ID
const getUserId = () => {
  const userStr = sessionStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      return user.id || user.user_id
    } catch (e) {
      return null
    }
  }
  return null
}

// 加入购物车
const handleAddToCart = async (product) => {
  const userId = getUserId()
  if (!userId) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    await cartApi.add({
      user_id: userId,
      product_id: product.id,
      quantity: 1
    })
    // 触发顶部角标更新
    const countRes = await cartApi.getCount(userId)
    if (countRes.code === 200) {
      window.dispatchEvent(new CustomEvent('cart-update', { detail: { count: countRes.data.count } }))
    }
  } catch (err) {
    ElMessage.error(err.message || '加入购物车失败')
  }
}
</script>

<style scoped>
</style>