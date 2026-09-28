<!-- <template>
    <div>
        <h1>用户管理</h1>
        <p>测试 axios</p>
    </div> 
   
</template>

<script setup>
//import axios from 'axios'
// import { onMounted,inject } from 'vue'
// let axios = inject('axios')
// onMounted(() => {
//     axios({
//         method: 'get',
//         url:"api/teacher/gettest",
//         params: {
//             id: '3'
//         }
//     }).then (res => {
//         console.log(res.data);
//     });
    // axios.post('api/teacher/testpost', {
    //     no:'123456',
    //     name: '张三',
    //     age: 18,
    //     address: '男'
    // })
//})

</script> -->
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <el-card>
      <!-- 搜索栏 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <el-input
            v-model="searchKeyword"
            placeholder="用户名/手机/邮箱"
            clearable
            style="width: 200px"
            @clear="fetchData"
            @keyup.enter="fetchData"
          />
          <el-select v-model="searchStatus" placeholder="状态" clearable style="width: 120px" @change="fetchData">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
          <el-button type="primary" @click="fetchData">搜索</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isactive === '1' ? 'success' : 'danger'">
              {{ row.isactive === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="{ row }">
                {{ new Date(row.createdAt).toLocaleString() }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="warning" link @click="handleResetPwd(row)">重置密码</el-button>
            <el-button
              size="small"
              :type="row.isactive === '1' ? 'danger' : 'success'"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.isactive === '1' ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-600 mr-2">每页显示</span>
          <el-select v-model="pageSize" @change="handleSizeChange" size="small" style="width: 100px">
            <el-option label="10条/页" :value="10" />
            <el-option label="20条/页" :value="20" />
            <el-option label="50条/页" :value="50" />
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" v-if="!isEdit">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.isactive">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserAPI from '@/api/user'

const userList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const searchKeyword = ref('')
const searchStatus = ref('')

const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  username: '',
  password: '',
  phone: '',
  email: '',
  isactive: '1'
})

async function fetchData() {
  try {
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: searchStatus.value
    }
    const res = await UserAPI.getAdminList(params)
    userList.value = res.data.list || []
    total.value = res.data.pagination.total
    totalPages.value = res.data.pagination.totalPages
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  }
}

const handleSizeChange = () => {
  currentPage.value = 1
  fetchData()
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchData()
  }
}
const goToPage = (p) => {
  if (p !== currentPage.value) {
    currentPage.value = p
    fetchData()
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    username: '',
    password: '',
    phone: '',
    email: '',
    isactive: '1'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    username: row.username,
    password: '',
    phone: row.phone,
    email: row.email,
    isactive: row.isactive
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.username || !form.phone || !form.email) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (!isEdit.value && !form.password) {
    ElMessage.warning('请输入密码')
    return
  }
  try {
    if (isEdit.value) {
      await UserAPI.updateUser({
        id: form.id,
        username: form.username,
        phone: form.phone,
        email: form.email,
        isactive: form.isactive
      })
    } else {
      await UserAPI.addUser({
        username: form.username,
        password: form.password,
        phone: form.phone,
        email: form.email,
        isactive: form.isactive
      })
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    // 错误已在 API 中提示
  }
}

const handleResetPwd = async (row) => {
  try {
    await ElMessageBox.confirm(`确定重置用户“${row.username}”的密码为 123456 吗？`, '提示', { type: 'warning' })
    await UserAPI.resetPassword(row.id)
    fetchData()
  } catch (err) {
    if (err !== 'cancel') ElMessage.info('已取消')
  }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.isactive === '1' ? '0' : '1'
  const action = newStatus === '1' ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定${action}用户“${row.username}”吗？`, '提示', { type: 'warning' })
    await UserAPI.toggleStatus(row.id, newStatus)
    fetchData()
  } catch (err) {
    if (err !== 'cancel') ElMessage.info('已取消')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除用户“${row.username}”吗？删除后不可恢复。`, '提示', { type: 'error' })
    await UserAPI.deleteUser(row.id)
    fetchData()
  } catch (err) {
    if (err !== 'cancel') ElMessage.info('已取消')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
</style>