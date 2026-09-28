<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">订单管理</h1>
      <div>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新建订单
        </el-button>
        <el-button type="success" @click="$router.push('/main/order/after-sale')" class="ml-2">
          <el-icon><Service /></el-icon>
          售后处理中心
        </el-button>
      </div>
    </div>

    <!-- 多条件筛选（新增售后状态筛选） -->
    <el-card class="mb-4">
      <el-form :inline="true" :model="searchForm" class="w-full">
        <el-form-item label="订单编号">
          <el-input v-model="searchForm.order_no" placeholder="请输入订单编号" clearable style="width:200px" />
        </el-form-item>
        <!-- v-model="searchForm"：双向绑定筛选数据 -->
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="全部订单状态" clearable style="width:150px">
            <el-option label="未付款" :value="0" />
            <el-option label="已付款" :value="1" />
            <el-option label="已发货" :value="2" />
            <el-option label="已收货" :value="3" />
            <el-option label="已取消" :value="4" />
            <el-option label="退货" :value="5" />
            <el-option label="售后" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="售后状态">
          <el-select v-model="searchForm.after_sale_status" placeholder="全部售后状态" clearable style="width:150px">
            <el-option label="无售后" :value="0" />
            <el-option label="申请中" :value="1" />
            <el-option label="处理中" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已拒绝" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width:200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOrderList">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="order_no" label="订单编号" min-width="120" />
        <el-table-column label="用户" width="120">
          <template #default="{ row }">
            {{ row.user?.username || '未知用户' }}
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.total_amount }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 新增：售后状态列（核心联动） -->
        <el-table-column label="售后状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getAfterSaleTagType(row.after_sale_status || 0)" effect="dark">
              {{ getAfterSaleText(row.after_sale_status || 0) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <!-- 改造：操作列新增「提交评价」按钮（仅已完成/已收货订单显示） -->
        <el-table-column label="操作" width="350">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleDetail(row)">查看</el-button>
            <el-button size="small" type="warning" link @click="handleChangeStatus(row)">改状态</el-button>
            <!-- 无售后时才显示删除按钮 -->
            <el-button 
              size="small" 
              type="danger" 
              link 
              @click="handleDelete(row)" 
            >
              删除
            </el-button>
            <!-- 售后处理按钮：已完成/已拒绝状态禁用 -->
            <el-button 
              size="small" 
              type="info" 
              link 
              @click="handleOrderAfterSale(row)" 
               :disabled="[3,4].includes(row.after_sale_status)"

            >
              <el-icon><Service /></el-icon>
              售后处理
            </el-button>
            <!-- 新增：提交评价按钮（仅已收货/已完成订单显示，且未提交过评价） -->
            <el-button 
              size="small" 
              type="success" 
              link 
              @click="handleSubmitEvaluation(row)" 
               :disabled="[0,1,2,4,5].includes(row.status)"
              
            >
            <!--  -->
              <el-icon><Comment /></el-icon>
              提交评价
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-600 mr-2">每页显示</span>
          <el-select
            v-model="pageSize"
            @change="handleSizeChange"
            size="small"
            style="width: 100px"
          >
            <el-option label="10条/页" :value="10" />
            <el-option label="20条/页" :value="20" />
            <el-option label="50条/页" :value="50" />
          </el-select>
          <span class="text-sm text-gray-600 ml-4">
            共 <span class="text-blue-600 font-medium">{{ total }}</span> 条数据
          </span>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          @current-change="getOrderList"
        />
      </div>
    </el-card>

    <!-- 订单详情弹窗（新增售后相关信息） -->
    <el-dialog v-model="detailVisible" title="订单详情" width="700px" append-to-body>
      <el-descriptions :column="2" border v-if="currentOrder">
        <el-descriptions-item label="订单号">{{ currentOrder.order_no }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentOrder.user?.username || '未知用户' }}</el-descriptions-item>
        <el-descriptions-item label="总金额">¥{{ currentOrder.total_amount }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusTagType(currentOrder.status)">{{ getStatusText(currentOrder.status) }}</el-tag>
        </el-descriptions-item>
        <!-- 新增：售后状态显示 -->
        <el-descriptions-item label="售后状态">
          <el-tag :type="getAfterSaleTagType(currentOrder.after_sale_status || 0)">{{ getAfterSaleText(currentOrder.after_sale_status || 0) }}</el-tag>
        </el-descriptions-item>
        <!-- 新增：售后评分（有评分才显示） -->
        <el-descriptions-item label="售后评分" v-if="currentOrder.after_sale_score > 0">
          <el-rate v-model="currentOrder.after_sale_score" disabled :max="5" />
        </el-descriptions-item>
        <el-descriptions-item label="收货人">{{ currentOrder.receiver || '无' }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ currentOrder.phone || '无' }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ currentOrder.address || '无' }}</el-descriptions-item>
        <!-- 新增：售后备注（有备注才显示） -->
        <el-descriptions-item label="售后备注" :span="2" v-if="currentOrder.after_sale_note">
          {{ currentOrder.after_sale_note }}
        </el-descriptions-item>
        <!-- 新增：订单评价（有评价才显示） -->
        <el-descriptions-item label="订单评价" :span="2" v-if="currentOrder.evaluations && currentOrder.evaluations.length > 0">
          <div class="flex items-center mb-2">
            <el-rate v-model="currentOrder.evaluations[0].score" disabled :max="5" />
            <el-tag :type="getAuditTagType(currentOrder.evaluations[0].audit_status)" class="ml-2">
              {{ getAuditText(currentOrder.evaluations[0].audit_status) }}
            </el-tag>
          </div>
          <p>{{ currentOrder.evaluations[0].content }}</p>
        </el-descriptions-item>
      </el-descriptions>

      <div class="mt-4" v-if="currentOrder">
        <h3 class="font-bold mb-2">订单商品</h3>
        <el-table :data="currentOrder.items || []" border size="small">
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="price" label="单价" width="100" />
          <el-table-column prop="quantity" label="数量" width="80" />
        </el-table>
      </div>
    </el-dialog>

    <!-- 原有：修改订单状态弹窗 -->
    <el-dialog v-model="statusDialogVisible" title="修改订单状态" width="500px">
      <el-form label-width="100px" v-if="currentOrder">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusTagType(currentOrder.status)">{{ getStatusText(currentOrder.status) }}</el-tag>
        </el-form-item>
        <el-form-item label="目标状态">
          <el-select v-model="statusForm.status" style="width:100%">
            <el-option label="未付款" :value="0" />
            <el-option label="已付款" :value="1" />
            <el-option label="已发货" :value="2" />
            <el-option label="已收货" :value="3" />
            <el-option label="已取消" :value="4" />
            <el-option label="退货" :value="5" />
            <el-option label="售后" :value="6" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitStatus">确定修改</el-button>
      </template>
    </el-dialog>

    <!-- 新增：订单列表直连售后处理弹窗（核心联动） -->
    <el-dialog v-model="orderAfterSaleDialogVisible" title="订单售后处理" width="500px">
      <el-form label-width="100px" v-if="currentOrder">
        <el-form-item label="订单编号">
          {{ currentOrder.order_no }}
        </el-form-item>
        <el-form-item label="订单状态">
          <el-tag :type="getStatusTagType(currentOrder.status)">{{ getStatusText(currentOrder.status) }}</el-tag>
        </el-form-item>
        <el-form-item label="当前售后状态">
          <el-tag :type="getAfterSaleTagType(currentOrder.after_sale_status || 0)">
            {{ getAfterSaleText(currentOrder.after_sale_status || 0) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="修改售后状态" required>
          <el-select v-model="afterSaleForm.status" style="width:100%">
            <el-option label="无售后" :value="0" />
            <el-option label="申请中" :value="1" />
            <el-option label="处理中" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已拒绝" :value="4" />
          </el-select>
        </el-form-item>
        <!-- 已完成状态才显示评分 -->
        <el-form-item label="售后评分" v-if="afterSaleForm.status === 3">
          <el-rate v-model="afterSaleForm.score" :max="5" placeholder="请给售后处理评分" />
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="afterSaleForm.note" type="textarea" :rows="3" placeholder="请输入售后处理备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="orderAfterSaleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrderAfterSale">确定处理</el-button>
      </template>
    </el-dialog>

    <!-- 原有：新建订单弹窗 -->
    <el-dialog v-model="createVisible" title="新建订单" width="900px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="选择用户">
          <el-select v-model="createForm.user_id" placeholder="请选择用户" style="width:100%">
            <el-option v-for="u in userList" key="u.id" :label="u.username" :value="u.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="总金额">
          <el-input v-model.number="totalAmount" readonly placeholder="自动计算" style="background:#f5f7fa" />
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="createForm.receiver" placeholder="收货人姓名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="createForm.phone" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="createForm.address" type="textarea" :rows="2" placeholder="收货地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="createForm.status">
            <el-option label="未付款" :value="0" />
            <el-option label="已付款" :value="1" />
          </el-select>
        </el-form-item>
        <el-divider>选择商品</el-divider>
        <el-form-item label="已选商品">
          <el-table :data="selectedItems" border size="small" max-height="220">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="price" label="单价" width="100">
              <template #default="{ row }">¥{{ row.price }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="110">
              <template #default="{ row }">
                <el-input-number v-model="row.quantity" :min="1" size="small" @change="calcTotal" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button size="small" type="danger" link @click="removeItem(row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="small" type="primary" class="mt-2" @click="openProductSelect">+ 添加商品</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">创建订单</el-button>
      </template>
    </el-dialog>

    <!-- 原有：选择商品弹窗 -->
    <el-dialog v-model="showProductSelect" title="选择商品" width="750px">
      <el-table :data="productList" stripe size="small">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="typeName" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="selectProduct(row)">选中</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增：提交评价弹窗 -->
    <el-dialog v-model="evaluationDialogVisible" title="提交订单评价" width="500px">
      <el-form label-width="100px" :model="evaluationForm" v-if="currentOrder">
        <el-form-item label="订单编号">
          {{ currentOrder.order_no }}
        </el-form-item>
        <el-form-item label="选择商品" required>
          <el-select v-model="evaluationForm.order_item_id" style="width:100%">
            <el-option 
              v-for="item in currentOrder.items" 
              :key="item.id" 
              :label="item.product_name" 
              :value="item.id" 
            />
            <!-- 遍历当前订单的所有商品 -->
          </el-select>
        </el-form-item>
        <el-form-item label="商品评分" required>
          <el-rate v-model="evaluationForm.score" :max="5" />
        </el-form-item>
        <el-form-item label="评价内容" required>
          <el-input v-model="evaluationForm.content" type="textarea" :rows="3" placeholder="请输入评价内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="evaluationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEvaluation">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Service, Comment } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import OrderAPI from '@/api/order'
import ProductAPI from '@/api/product'
import UserAPI from '@/api/user'

// 订单列表相关
const orderList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)

// 搜索表单
const searchForm = reactive({
  order_no: '',
  status: '',
  after_sale_status: '',
  username: ''
})

// 弹窗相关
const detailVisible = ref(false)
const currentOrder = ref({})
const statusDialogVisible = ref(false)
const statusForm = reactive({ status: 0 })
const createVisible = ref(false)
const createForm = ref({
  user_id: null,
  total_amount: 0,
  receiver: '',
  phone: '',
  address: '',
  status: 0
})
const showProductSelect = ref(false)
const productList = ref([])
const selectedItems = ref([])
const userList = ref([])
const totalAmount = ref(0)

// 新增：售后处理弹窗相关
const orderAfterSaleDialogVisible = ref(false)
const afterSaleForm = reactive({
  status: 0,
  score: 5,
  note: ''
})

// 新增：评价提交弹窗相关
const evaluationDialogVisible = ref(false)
const evaluationForm = reactive({
  order_id: '',
  order_item_id: '',
  user_id: '',
  score: 5,
  content: ''
})

// 订单状态文本映射
const getStatusText = (s) => {
  const m = { 0:'未付款',1:'已付款',2:'已发货',3:'已收货',4:'已取消',5:'退货',6:'售后' }
  return m[s] || '未知'
}
const getStatusTagType = (s) => {
  const t = { 0:'info',1:'primary',2:'warning',3:'success',4:'danger',5:'warning',6:'warning' }
  return t[s] || 'info'
}

// 新增：售后状态文本映射
const getAfterSaleText = (s) => {
  const m = { 0:'无售后',1:'申请中',2:'处理中',3:'已完成',4:'已拒绝' }
  return m[s] || '未知'
}
const getAfterSaleTagType = (s) => {
  const t = { 0:'info',1:'warning',2:'primary',3:'success',4:'danger' }
  return t[s] || 'info'
}

// 新增：审核状态文本映射
const getAuditText = (s) => {
  const m = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
  return m[s] || '未知'
}
const getAuditTagType = (s) => {
  const t = { 0: 'warning', 1: 'success', 2: 'danger' }
  return t[s] || 'info'
}

// 获取订单列表（新增售后状态筛选参数）
async function getOrderList() {
  try {
    //调用后端的getlist
    const res = await OrderAPI.getList({ 
      currentPage: currentPage.value, 
      pageSize: pageSize.value,
      after_sale_status: searchForm.after_sale_status,
      order_no: searchForm.order_no,
      status: searchForm.status,
      username: searchForm.username
    })
    orderList.value = res.data.list || []
    total.value = res.data.pagination.total
    totalPages.value = Math.ceil(total.value / pageSize.value)
  } catch (e) {
    ElMessage.error('加载订单列表失败')
  }
}

// 搜索重置
function resetSearch() {
  searchForm.order_no = ''
  searchForm.status = ''
  searchForm.after_sale_status = ''
  searchForm.username = ''
  getOrderList()
}

// 分页相关
const handleSizeChange = () => { currentPage.value = 1; getOrderList() }

// 订单详情
function handleDetail(row) {
  currentOrder.value = { ...row }
  detailVisible.value = true
}

// 修改订单状态
function handleChangeStatus(row) {
  currentOrder.value = { ...row }
  statusForm.status = row.status
  statusDialogVisible.value = true
}
const submitStatus = async () => {
  try {
    await OrderAPI.updateStatus({
      id: currentOrder.value.id,
      status: statusForm.status
    })
    statusDialogVisible.value = false
    getOrderList()
    ElMessage.success('修改成功')
  } catch (e) {
    ElMessage.error('修改失败')
  }
}  

// 删除订单
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确定删除该订单？删除后不可恢复！', '警告', { type: 'warning' })
    await OrderAPI.delOrder(row.id)
    ElMessage.success('删除成功')
    getOrderList()
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 新建订单相关
async function loadUsers() {
  const res = await UserAPI.getList({ currentPage:1, pageSize:100 })
  userList.value = res.data.list || []
}
function handleCreate() {
  createForm.value = { user_id: null, total_amount:0, receiver:'', phone:'', address:'', status:0 }
  selectedItems.value = []
  totalAmount.value = 0
  loadUsers()
  createVisible.value = true
}
async function openProductSelect() {
  // 从后端获取所有商品数据
  const res = await ProductAPI.getList({ currentPage:1, pageSize:100 })
   // 把商品数据存入productList，供弹窗表格展示
  productList.value = res.data.formattedProducts || []
  //弹窗
  showProductSelect.value = true
}
function selectProduct(row) {
  const has = selectedItems.value.find(i => i.id === row.id)
  if (has) { ElMessage.warning('该商品已添加'); return }
  selectedItems.value.push({ ...row, product_id: row.id, quantity:1 })
  calcTotal()
   //  关闭商品选择弹窗
  showProductSelect.value = false
}
function removeItem(row) {
  //  过滤掉要移除的商品，更新已选列表
  selectedItems.value = selectedItems.value.filter(i => i.id !== row.id)
  // 重新计算总金额
  calcTotal()
}
function calcTotal() {
  // 遍历已选商品列表，累加「单价 × 数量」得到总金额
  totalAmount.value = selectedItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
}
async function submitCreate() {
  if (!createForm.value.user_id) return ElMessage.warning('请选择用户')
  if (selectedItems.value.length === 0) return ElMessage.warning('至少选择一个商品')
  //  把计算好的总金额赋值给订单表单
  createForm.value.total_amount = totalAmount.value
  try {
    await OrderAPI.create({
      orderData: createForm.value,
      itemsData: selectedItems.value.map(i => ({
        product_id: i.product_id,
        product_name: i.name,
        price: i.price,
        quantity: i.quantity
      }))
    })
    createVisible.value = false
    getOrderList()
    ElMessage.success('创建成功')
  } catch {
    ElMessage.error('创建失败')
  }
}

// 新增：订单列表直接处理售后
function handleOrderAfterSale(row) {
  currentOrder.value = { ...row }
  afterSaleForm.status = row.after_sale_status || 0
  afterSaleForm.score = row.after_sale_score || 5
  afterSaleForm.note = row.after_sale_note || ''
  orderAfterSaleDialogVisible.value = true
}
// 提交售后处理
async function submitOrderAfterSale() {
  try {
    await OrderAPI.updateAfterSaleStatus({
      id: currentOrder.value.id,
      status: afterSaleForm.status,
      score: afterSaleForm.score,
      note: afterSaleForm.note
    })
    orderAfterSaleDialogVisible.value = false
    getOrderList()
    ElMessage.success('售后处理成功')
  } catch (e) {
    ElMessage.error('售后处理失败')
  }
}

//打开提交评价弹窗
function handleSubmitEvaluation(row) {
   //  把当前订单数据存入currentOrder
  currentOrder.value = { ...row }
  //  初始化评价表单（关联订单/用户ID）
  evaluationForm.order_id = row.id       // 订单ID
  evaluationForm.user_id = row.user_id
  evaluationForm.order_item_id = row.items[0]?.id || ''
  evaluationForm.score = 5
  evaluationForm.content = ''
  // 打开评价弹窗
  evaluationDialogVisible.value = true
}

// 新增：提交评价
async function submitEvaluation() {
  if (!evaluationForm.order_item_id) return ElMessage.warning('请选择评价商品')
  if (!evaluationForm.content) return ElMessage.warning('请输入评价内容')
  
  try {
    //  调用后端评价提交接口
    await OrderAPI.submitEvaluation({
      order_id: evaluationForm.order_id,
      order_item_id: evaluationForm.order_item_id,
      user_id: evaluationForm.user_id,
      score: evaluationForm.score,
      content: evaluationForm.content,
      images: '[]',
      audit_status: 0
    })
    evaluationDialogVisible.value = false
    getOrderList()
    ElMessage.success('评价提交成功，等待管理员审核')
  } catch (e) {
    ElMessage.error('评价提交失败')
  }
}

// 页面初始化
onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
</style>