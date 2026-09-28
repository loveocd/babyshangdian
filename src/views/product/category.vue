<!-- <template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">商品分类</h1>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <el-card>
      <el-table :data="categoryList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="productCount" label="商品数量" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'">
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
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const categoryList = ref([
  { id: 1, name: '手机', sort: 1, productCount: 23, status: '启用' },
  { id: 2, name: '笔记本', sort: 2, productCount: 15, status: '启用' },
  { id: 3, name: '平板', sort: 3, productCount: 8, status: '启用' },
  { id: 4, name: '穿戴设备', sort: 4, productCount: 12, status: '启用' },
  { id: 5, name: '配件', sort: 5, productCount: 45, status: '停用' }
])
</script> -->
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">商品分类</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <el-card>
      <el-table :data="categoryList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        
        <!-- 排序：字段名 typenum -->
        <el-table-column prop="typenum" label="排序" width="100" />
        
        <!-- 商品数量 -->
        <el-table-column prop="productCount" label="商品数量" width="120">
          <template #default="{ row }">
            {{ row.productCount || 0 }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">
              {{ row.isActive ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '新增分类'" width="400px">
      <el-form :model="form" label-width="80px" class="mt-4">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input v-model.number="form.typenum" type="number" placeholder="请输入排序号" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.isActive">
            <el-radio :value="true">启用</el-radio>
            <el-radio :value="false">停用</el-radio>
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
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import categoryApi from '@/api/category.js'

const categoryList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const form = ref({
  id: '',
  name: '',
  typenum: 0,
  isActive: true
})

// 获取列表
async function getCategoryList() {
  try {
    const res = await categoryApi.getList()
    categoryList.value = res.data || []
  } catch (err) {
    ElMessage.error('加载失败')
  }
}

onMounted(() => {
  getCategoryList()
})

// 新增
const handleAdd = () => {
  isEdit.value = false
  form.value = { id: '', name: '', typenum: 0, isActive: true }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  try {
    if (isEdit.value) {
      await categoryApi.update(form.value)
      ElMessage.success('修改成功')
    } else {
      await categoryApi.add(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getCategoryList()
  } catch (err) {
    ElMessage.error('保存失败')
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除？', '提示')
    await categoryApi.delete(row.id)
    ElMessage.success('删除成功')
    getCategoryList()
  } catch (err) {
    ElMessage.info('已取消')
  }
}
</script>

<style scoped>
</style>