<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">宝宝情况统计</h2>
      <el-button type="primary" @click="openDialog">添加用户宝宝</el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-6">
      <el-col :span="6">
        <el-card>
          <div class="text-center">
            <div class="text-sm text-gray-500">0 - 6 个月宝宝</div>
            <div class="text-2xl font-bold text-blue-600 mt-2">{{ stats.zeroToSix }}</div>
            <div class="text-xs text-gray-400 mt-1">人</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-center">
            <div class="text-sm text-gray-500">6 - 12 个月宝宝</div>
            <div class="text-2xl font-bold text-green-600 mt-2">{{ stats.sixToTwelve }}</div>
            <div class="text-xs text-gray-400 mt-1">人</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-center">
            <div class="text-sm text-gray-500">1 - 3 岁宝宝</div>
            <div class="text-2xl font-bold text-orange-600 mt-2">{{ stats.oneToThree }}</div>
            <div class="text-xs text-gray-400 mt-1">人</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-center">
            <div class="text-sm text-gray-500">3 - 6 岁宝宝</div>
            <div class="text-2xl font-bold text-purple-600 mt-2">{{ stats.threeToSix }}</div>
            <div class="text-xs text-gray-400 mt-1">人</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 宝宝详情列表 -->
    <el-card class="mb-4">
      <template #header>
        <span class="font-bold">用户宝宝详情列表</span>
      </template>
      <el-table :data="babyList" border stripe size="small">
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="babyName" label="宝宝姓名" min-width="120" />
        <el-table-column prop="babyGender" label="宝宝性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.babyGender === '男' ? 'primary' : 'danger'">
              {{ row.babyGender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="babyBirthday" label="宝宝生日" width="130" />
        <el-table-column prop="ageText" label="宝宝年龄" width="120" />
        <el-table-column prop="ageGroup" label="所属年龄段" min-width="130">
          <template #default="{ row }">
            <el-tag type="success">{{ row.ageGroup }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 科学喂养指南 -->
    <el-card class="mb-4">
      <template #header>科学喂养指南</template>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-bold mb-1">0-6个月：母乳/配方奶</h4>
          <p class="text-sm">• 纯母乳最佳，无需喂水</p>
          <p class="text-sm">• 每日喂养8-12次</p>
          <p class="text-sm">• 出生后补充维生素D</p>
        </div>
        <div>
          <h4 class="font-bold mb-1">6-12个月：辅食添加</h4>
          <p class="text-sm">• 第一口：高铁米粉</p>
          <p class="text-sm">• 逐步加蔬菜泥、肉泥</p>
          <p class="text-sm">• 由稀到稠、由细到粗</p>
        </div>
        <div>
          <h4 class="font-bold mb-1">1-3岁：三餐两点</h4>
          <p class="text-sm">• 每日奶量300-500ml</p>
          <p class="text-sm">• 少盐少糖、不挑食</p>
          <p class="text-sm">• 自主进食，不追喂</p>
        </div>
        <div>
          <h4 class="font-bold mb-1">3-6岁：均衡饮食</h4>
          <p class="text-sm">• 谷薯、肉蛋、果蔬均衡</p>
          <p class="text-sm">• 规律饮食，控制零食</p>
          <p class="text-sm">• 培养良好饮食习惯</p>
        </div>
      </div>
    </el-card>

    <el-card>
      <template #header>宝宝发育与日常护理</template>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-bold mb-1">睡眠护理</h4>
          <p class="text-sm">• 0-1岁：12-16小时/天</p>
          <p class="text-sm">• 1-3岁：11-14小时/天</p>
          <p class="text-sm">• 建立规律作息</p>
        </div>
        <div>
          <h4 class="font-bold mb-1">生长发育</h4>
          <p class="text-sm">• 定期体检，监测身高体重</p>
          <p class="text-sm">• 多爬、多走、多互动</p>
          <p class="text-sm">• 亲子阅读与启蒙</p>
        </div>
        <div>
          <h4 class="font-bold mb-1">疫苗与健康</h4>
          <p class="text-sm">• 按时接种疫苗</p>
          <p class="text-sm">• 注意保暖，避免感染</p>
          <p class="text-sm">• 生病及时就医</p>
        </div>
        <div>
          <h4 class="font-bold mb-1">行为与心理</h4>
          <p class="text-sm">• 多鼓励，少批评</p>
          <p class="text-sm">• 培养安全感与表达力</p>
          <p class="text-sm">• 正确引导情绪</p>
        </div>
      </div>
    </el-card>

    <!-- 关联用户宝宝弹窗 -->
    <el-dialog v-model="dialogVisible" title="关联用户宝宝" width="700px">
      <el-form ref="formRef" :model="form" label-width="100px" :rules="formRules">
        <el-form-item label="选择用户" prop="userId">
          <el-select
            v-model="form.userId"
            placeholder="请选择用户"
            style="width: 100%"
            filterable
            @visible-change="handleSelectVisible"
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.username"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="宝宝姓名" prop="babyName">
          <el-input v-model="form.babyName" placeholder="请输入宝宝姓名" />
        </el-form-item>

        <el-form-item label="宝宝生日" prop="babyBirthday">
          <el-date-picker
            v-model="form.babyBirthday"
            type="date"
            placeholder="请选择宝宝生日"
            style="width: 100%"
            :disabled-date="disabledFutureDate"
          />
        </el-form-item>

        <el-form-item label="宝宝性别" prop="babyGender">
          <el-radio-group v-model="form.babyGender">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认关联</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import UserAPI from '@/api/user';

// 弹窗状态
const dialogVisible = ref(false);

// 表单配置
const formRef = ref(null);
const form = ref({
  userId: '',
  babyName: '',
  babyBirthday: '',
  babyGender: ''
});

// 表单校验规则
const formRules = ref({
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  babyName: [{ required: true, message: '请输入宝宝姓名', trigger: 'blur' }],
  babyBirthday: [{ required: true, message: '请选择宝宝生日', trigger: 'change' }],
  babyGender: [{ required: true, message: '请选择宝宝性别', trigger: 'change' }]
});

// 数据存储
const userList = ref([]);
const stats = ref({
  zeroToSix: 0,  // 0-6个月数量
  sixToTwelve: 0,
  oneToThree: 0,
  threeToSix: 0
});
const babyList = ref([]);

// 禁用未来日期
const disabledFutureDate = (time) => {
  return time.getTime() > Date.now();
};

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  formRef.value?.resetFields();
};

// 下拉展开获取用户
const handleSelectVisible = async (visible) => {
  if (visible && userList.value.length === 0) {
    await getUserList();
  }
};

// 获取用户列表
const getUserList = async () => {
  try {
    const res = await UserAPI.getList({ pageSize: 100 });
    if (res.code === 200) {
      userList.value = res.data.list || [];
    }
  } catch (err) {
    console.log('用户加载失败', err);
  }
};

// 获取宝宝统计
// 从后端获取统计数据
const getBabyStats = async () => {
  try {
    // 调用用户API的getBabyStats方法，获取后端统计好的数据
    const res = await UserAPI.getBabyStats();
    if (res.code === 200) {
      // 把后端返回的统计数据赋值给stats，卡片会自动更新
      stats.value = res.data;
    }
  } catch (err) {
    ElMessage.error('获取统计失败');
  }
};

// 获取宝宝列表
const getBabyList = async () => {
  try {
    const res = await UserAPI.getBabyList();
    if (res.code === 200) {
      babyList.value = res.data;
    }
  } catch (err) {
    ElMessage.error('获取宝宝列表失败');
  }
};

// 提交关联
const submitForm = async () => {
  try {
    await formRef.value.validate();
    await ElMessageBox.confirm('确认要关联该宝宝信息吗？', '提示', { type: 'warning' });
    
    const res = await UserAPI.addUserBaby(form.value);
    if (res.code === 200) {
      ElMessage.success('关联成功！');
      dialogVisible.value = false;
      getBabyStats();
      getBabyList();
    }
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('操作失败');
  }
};

// 页面加载
onMounted(() => {
  getBabyStats();
  getBabyList();
});
</script>

<style scoped>
.grid {
  display: grid;
  gap: 8px;
}
.el-card {
  margin-bottom: 16px;
}
</style>