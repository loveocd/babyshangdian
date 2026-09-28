<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">售后处理</h1>
      <el-button type="primary" @click="$router.push('/main/order/list')">
        ← 返回订单列表
      </el-button>
    </div>
    <el-tabs v-model="activeTab" type="border-card" class="w-full">
      <!-- 售后订单列表 -->
      <el-tab-pane label="售后订单" name="after-sale-order">
        <el-card>
          <div class="mb-4">
            <el-select v-model="afterSaleStatusFilter" placeholder="全部售后订单" style="width: 240px" @change="getAfterSaleList">
              <el-option label="全部售后订单" :value="-1" />
              <el-option label="无售后" :value="0" />
              <el-option label="申请中" :value="1" />
              <el-option label="处理中" :value="2" />
              <el-option label="已完成" :value="3" />
              <el-option label="已拒绝" :value="4" />
            </el-select>
          </div>
          <el-table :data="afterSaleList" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="order_no" label="订单编号" />
            <el-table-column label="商品名称" width="180">
              <template #default="{ row }">
                {{ row.items?.[0]?.product_name || '无' }}
              </template>
            </el-table-column>
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
            <el-table-column label="售后状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getAfterSaleTagType(row.after_sale_status)">
                  {{ getAfterSaleText(row.after_sale_status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" type="primary" link @click="handleAfterSaleDetail(row)">
                  详情
                </el-button>
                <el-button size="small" type="warning" link @click="handleAfterSaleEdit(row)">
                  处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container mt-4 flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-sm text-gray-600 mr-2">每页显示</span>
              <el-select v-model="pageSize" @change="handleAfterSaleSizeChange" size="small" style="width: 100px">
                <el-option label="10条/页" :value="10" />
                <el-option label="20条/页" :value="20" />
                <el-option label="50条/页" :value="50" />
              </el-select>
              <span class="text-sm text-gray-600 ml-4">
                共 <span class="text-blue-600 font-medium">{{ total }}</span> 条数据
              </span>
            </div>
            <!--  官方分页 -->
            <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total"
              layout="prev, pager, next, jumper" @current-change="getAfterSaleList" />
          </div>
        </el-card>
      </el-tab-pane>
      <!-- 评价审核列表 -->
      <el-tab-pane label="评价审核" name="evaluation-audit">
        <el-card>
          <div class="mb-4">
            <el-select v-model="auditStatusFilter" placeholder="全部评价" style="width: 240px" @change="getEvaluationList">
              <el-option label="全部评价" :value="-1" />
              <el-option label="待审核" :value="0" />
              <el-option label="已通过" :value="1" />
              <el-option label="已拒绝" :value="2" />
            </el-select>
          </div>
          <el-table :data="evaluationList" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="商品名称" width="200">
              <template #default="{ row }">
                {{ row.orderItem?.product_name || '未知商品' }}
              </template>
            </el-table-column>
            <el-table-column label="用户" width="120">
              <template #default="{ row }">
                {{ row.user?.username || '未知用户' }}
              </template>
            </el-table-column>
            <el-table-column prop="score" label="评分" width="100">
              <template #default="{ row }">
                <el-rate v-model="row.score" :max="5" disabled show-score text-color="#ff9900" />
              </template>
            </el-table-column>
            <el-table-column prop="content" label="评价内容" min-width="300" />
            <!-- 新增：评价图片（有图片才显示） -->
            <!-- <el-table-column label="评价图片" width="150">
              <template #default="{ row }">
                <div v-if="row.images" class="flex">
                  <el-image 
                    v-for="(img, index) in JSON.parse(row.images)" 
                    :key="index"
                    :src="img"
                    :preview-src-list="JSON.parse(row.images)"
                    style="width: 40px; height: 40px; margin-right: 5px"
                    fit="cover"
                  />
                </div>
              </template>
            </el-table-column> -->
            <el-table-column label="审核状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getAuditTagType(row.audit_status)">
                  {{ getAuditText(row.audit_status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button size="small" type="primary" link @click="handleAudit(row)">
                  审核
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container mt-4 flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-sm text-gray-600 mr-2">每页显示</span>
              <el-select v-model="evalPageSize" @change="handleEvalSizeChange" size="small" style="width: 100px">
                <el-option label="10条/页" :value="10" />
                <el-option label="20条/页" :value="20" />
                <el-option label="50条/页" :value="50" />
              </el-select>
              <span class="text-sm text-gray-600 ml-4">
                共 <span class="text-blue-600 font-medium">{{ evalTotal }}</span> 条数据
              </span>
            </div>
            <div class="flex items-center">
              <el-button :disabled="evalCurrentPage === 1" @click="prevEvalPage" size="small" class="mx-1">上一页</el-button>
              <el-button :disabled="evalCurrentPage >= evalTotalPages" @click="nextEvalPage" size="small" class="mx-1">下一页</el-button>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 售后处理弹窗 -->
    <el-dialog v-model="afterSaleDialogVisible" title="处理售后订单" width="500px">
      <el-form label-width="100px" v-if="currentAfterSaleOrder">
        <el-form-item label="订单编号">
          <span>{{ currentAfterSaleOrder.order_no }}</span>
        </el-form-item>
        <el-form-item label="当前售后状态">
          <el-tag :type="getAfterSaleTagType(currentAfterSaleOrder.after_sale_status)">
            {{ getAfterSaleText(currentAfterSaleOrder.after_sale_status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="目标状态">
          <el-select v-model="afterSaleForm.status" style="width: 100%">
            <el-option label="申请中" :value="1" />
            <el-option label="处理中" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已拒绝" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="售后评分" v-if="afterSaleForm.status === 3">
          <el-rate v-model="afterSaleForm.score" :max="5" />
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="afterSaleForm.note" type="textarea" :rows="3" placeholder="请输入处理备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="afterSaleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAfterSale">确定处理</el-button>
      </template>
    </el-dialog>
    <!-- 评价审核弹窗 -->
    <el-dialog v-model="auditDialogVisible" title="审核评价" width="500px">
      <el-form label-width="100px" v-if="currentEvaluation">
        <el-form-item label="商品名称">
          <span>{{ currentEvaluation.orderItem?.product_name || '未知商品' }}</span>
        </el-form-item>
        <el-form-item label="用户评价">
          <div>
            <el-rate v-model="currentEvaluation.score" :max="5" disabled class="mb-2" />
            <p>{{ currentEvaluation.content }}</p>
            <!-- 新增：评价图片预览 -->
            <div v-if="currentEvaluation.images" class="mt-2">
              <el-image 
                v-for="(img, index) in JSON.parse(currentEvaluation.images)" 
                :key="index"
                :src="img"
                :preview-src-list="JSON.parse(currentEvaluation.images)"
                style="width: 80px; height: 80px; margin-right: 10px"
                fit="cover"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="审核结果">
          <el-select v-model="auditForm.audit_status" style="width: 100%">
            <el-option label="通过" :value="1" />
            <el-option label="拒绝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="auditForm.note" type="textarea" :rows="3" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">确定审核</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import OrderAPI from '@/api/order'
// 售后订单相关
const afterSaleList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = ref(0)
const afterSaleStatusFilter = ref(-1)
// 评价审核相关
const evaluationList = ref([])
const evalCurrentPage = ref(1)
const evalPageSize = ref(10)
const evalTotal = ref(0)
const evalTotalPages = ref(1)
const auditStatusFilter = ref(-1)
// 标签页
const activeTab = ref('after-sale-order')
// 弹窗与表单
// 售后弹窗：控制显示、当前订单、表单数据
const afterSaleDialogVisible = ref(false)
const currentAfterSaleOrder = ref(null)
const afterSaleForm = ref({ status: 3, score: 5, note: '' })
// 审核弹窗：控制显示、当前评价、表单数据
const auditDialogVisible = ref(false)
const currentEvaluation = ref(null)
const auditForm = ref({ audit_status: 1, note: '' })
// 状态文本映射
const getAfterSaleText = (s) => {
  const m = { 0: '无售后', 1: '申请中', 2: '处理中', 3: '已完成', 4: '已拒绝' }
  return m[s] || '未知'
}
const getAfterSaleTagType = (s) => {
  const t = { 0: 'info', 1: 'warning', 2: 'primary', 3: 'success', 4: 'danger' }
  return t[s] || 'info'
}
const getAuditText = (s) => {
  const m = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
  return m[s] || '未知'
}
const getAuditTagType = (s) => {
  const t = { 0: 'warning', 1: 'success', 2: 'danger' }
  return t[s] || 'info'
}
// 获取售后订单列表
async function getAfterSaleList() {
  try {
    const res = await OrderAPI.getAfterSaleList({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      after_sale_status: afterSaleStatusFilter.value
    })
    afterSaleList.value = res.data.list || []
    total.value = res.data.pagination.total
    totalPages.value = Math.ceil(total.value / pageSize.value)
  } catch (e) {
    ElMessage.error('加载售后订单失败')
    console.error(e)
  }
}
// 获取评价列表
async function getEvaluationList() {
  try {
    const res = await OrderAPI.getEvaluationList({
      currentPage: evalCurrentPage.value,
      pageSize: evalPageSize.value,
      audit_status: auditStatusFilter.value === -1 ? undefined : auditStatusFilter.value
    })
    evaluationList.value = res.data.list || []
    evalTotal.value = res.data.pagination.total
    evalTotalPages.value = Math.ceil(evalTotal.value / evalPageSize.value) || 1
  } catch (e) {
    ElMessage.error('加载评价列表失败')
    console.error(e)
  }
}
// 售后订单分页
const handleAfterSaleSizeChange = () => {
  currentPage.value = 1
  getAfterSaleList()
}
const prevAfterSalePage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    getAfterSaleList()
  }
}
const nextAfterSalePage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    getAfterSaleList()
  }
}
// 评价分页
const handleEvalSizeChange = () => {
  evalCurrentPage.value = 1
  getEvaluationList()
}
const prevEvalPage = () => {
  if (evalCurrentPage.value > 1) {
    evalCurrentPage.value--
    getEvaluationList()
  }
}
const nextEvalPage = () => {
  if (evalCurrentPage.value < evalTotalPages.value) {
    evalCurrentPage.value++
    getEvaluationList()
  }
}
// 售后处理操作
function handleAfterSaleDetail(row) {
  ElMessage.info('详情功能已关联订单列表')
}
function handleAfterSaleEdit(row) {
  currentAfterSaleOrder.value = row
  afterSaleForm.value = { status: row.after_sale_status || 1, score: 5, note: '' }
  afterSaleDialogVisible.value = true
}
async function submitAfterSale() {
  try {
    await OrderAPI.updateAfterSaleStatus({
      id: currentAfterSaleOrder.value.id,
      status: afterSaleForm.value.status,
      score: afterSaleForm.value.score,// 评分
      note: afterSaleForm.value.note
    })
    afterSaleDialogVisible.value = false
    getAfterSaleList()
    ElMessage.success('售后处理成功 → 订单列表已同步')
  } catch (e) {
    ElMessage.error('售后处理失败')
    console.error(e)
  }
}
// 评价审核操作
function handleAudit(row) {
  currentEvaluation.value = row
  auditForm.value = { audit_status: 1, note: '' }
  auditDialogVisible.value = true
}
async function submitAudit() {
  try {
    await OrderAPI.auditEvaluation({
      id: currentEvaluation.value.id,
      audit_status: auditForm.value.audit_status,
      note: auditForm.value.note
    })
    auditDialogVisible.value = false
    getEvaluationList()
    ElMessage.success('评价审核成功')
  } catch (e) {
    ElMessage.error('评价审核失败')
    console.error(e)
  }
}
// 监听标签页切换
watch(activeTab, (val) => {
  if (val === 'after-sale-order') {
    getAfterSaleList()
  } else if (val === 'evaluation-audit') {
    getEvaluationList()
  }
})
// 初始化加载
onMounted(() => {
  getAfterSaleList()
})
</script>
<style scoped>
</style>