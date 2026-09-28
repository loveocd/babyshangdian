import BaseAPI from "./base";
import { ElMessage } from "element-plus";
import request from'@/utils/request'
export class UserAPI extends BaseAPI {
  constructor() {
    super("/users"); //设置调用的路径
  }

  // 登录
  async login(data) {
    try {
      const res = await this.get("/login", data);
      if (res.code === 200) {
        //ElMessage.success("登录成功");
        // 保存当前用户
        if (res.data) {
          sessionStorage.setItem("user", res.data);
        }
      }
      return res;
    } catch (error) {
      ElMessage.error(error.message || "登录失败");
      throw error;
    }
  }
  // 退出登录
  // async logout() {
  // try {
  // const res = await this.post('/logout')
  // // 清除本地存储
  // localStorage.removeItem('token')
  // localStorage.removeItem('userInfo')
  // toast.success('已退出登录')
  // return res
  // } catch (error) {
  // toast.error('退出失败')
  // throw error
  // }
  // }

  //注册
  // async register(data) {
  //   try {
  //     const res = await this.post('/register', data)
  //     if (res.code === 200) {
  //       toast.success('注册成功')
  //     }
  //     return res
  //   } catch (error) {
  //     toast.error(error.message || '注册失败')
  //     throw error
  //   }
  // }
  async register(data) {
    try {
      const res = await this.post("/register", data);
      if (res.code === 200) {
        ElMessage.success("注册成功，请登录");
      }
      return res
    } catch (error) {
      ElMessage.error(error.message || "注册失败");
      throw error
    }
  }
  //修改密码

  async changePassword(data) {
    try {
      const res = await this.post("/changePassword", data);
      if (res.code === 200) {
        ElMessage.success("密码修改成功");
      }
      return res;
    } catch (error) {
      ElMessage.error(error.message || "修改密码失败");
      throw error;
    }
  }
  //订单
  async getList(params) {
    try {
      return await this.get("/list", params);
    } catch (error) {
      ElMessage.error(error.message || "获取用户列表失败");
      throw error;
    }
  }
  // async getUserList(params = {}) {
  //   try {
  //     return await this.get("/list", params);
  //   } catch (error) {
  //     ElMessage.error(error.message || "获取用户列表失败");
  //     throw error;
  //   }
  // }

  // 获取后台用户列表（分页、搜索、状态）
  async getAdminList(params) {
    try {
      return await this.get('/admin/list', params)
    } catch (error) {
      ElMessage.error(error.message || '获取用户列表失败')
      throw error
    }
  }

  // 添加用户（管理员）
  async addUser(data) {
    try {
      const res = await this.post('/admin/add', data)
      ElMessage.success(res.msg || '添加成功')
      return res
    } catch (error) {
      ElMessage.error(error.message || '添加失败')
      throw error
    }
  }

  // 更新用户
  async updateUser(data) {
    try {
      const res = await this.put('/admin/update', data)
      ElMessage.success(res.msg || '更新成功')
      return res
    } catch (error) {
      ElMessage.error(error.message || '更新失败')
      throw error
    }
  }

  // 删除用户
  async deleteUser(id) {
    try {
      const res = await this.delete(`/admin/delete/${id}`)
      ElMessage.success(res.msg || '删除成功')
      return res
    } catch (error) {
      ElMessage.error(error.message || '删除失败')
      throw error
    }
  }

  // 重置密码
  async resetPassword(id) {
    try {
      const res = await this.post('/admin/resetPassword', { id })
      ElMessage.success(res.msg || '重置成功')
      return res
    } catch (error) {
      ElMessage.error(error.message || '重置失败')
      throw error
    }
  }

  // 启用/禁用用户
  async toggleStatus(id, isactive) {
    try {
      const res = await this.put('/admin/toggleStatus', { id, isactive })
      ElMessage.success(res.msg || '状态修改成功')
      return res
    } catch (error) {
      ElMessage.error(error.message || '状态修改失败')
      throw error
    }
  }

  // 获取宝宝统计数据（新增）
  // 宝宝统计
  async getBabyStats() {
    try {
      return await this.get("/babyStats");
    } catch (error) {
      ElMessage.error("获取宝宝统计失败");
      throw error;
    }
  }

  // 宝宝列表
  async getBabyList() {
    try {
      return await this.get("/baby");
    } catch (error) {
      ElMessage.error("获取宝宝列表失败");
      throw error;
    }
  }

  // 添加宝宝（统一格式，和后端完全匹配）
  async addUserBaby(data) {
    try {
      const res = await this.post("/addUserBaby", data);
      return res;
    } catch (error) {
      ElMessage.error("关联宝宝失败：" + error.message);
      throw error;
    }
  }
}

export default new UserAPI();
