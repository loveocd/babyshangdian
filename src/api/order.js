// import BaseAPI from "./base";
// import { ElMessage } from "element-plus";

// class OrderAPI extends BaseAPI {
//   constructor() {
//     // 对接后端 /order 路由，与后端保持一致
//     super("/order");
//   }

//   // 获取订单列表（分页）- 优化：参数透传+统一错误提示
//   async getList(data) {
//     try {
//       const res = await this.get("/list", data);
//       ElMessage.success(res.msg || "获取订单列表成功");
//       return res;
//     } catch (error) {
//       const errMsg = error.message || "获取订单列表失败，请稍后重试";
//       ElMessage.error(errMsg);
//       throw error;
//     }
//   }

//   // 创建订单 - 优化：适配后端orderData/itemsData参数格式
//   async create(data) {
//     try {
//       const res = await this.post("/create", data);
//       ElMessage.success(res.msg || "创建订单成功");
//       return res;
//     } catch (error) {
//       const errMsg = error.message || "创建订单失败，请检查参数后重试";
//       ElMessage.error(errMsg);
//       throw error;
//     }
//   }

//   // 修改订单状态 - 优化：明确参数格式
// async getList(data) {
//   try {
//     const res = await this.get("/list", data);
//     // 去掉 ElMessage.success
//     return res;
//   } catch (error) {
//     const errMsg = error.message || "获取订单列表失败，请稍后重试";
//     ElMessage.error(errMsg);
//     throw error;
//   }
// }

//   // 删除订单 - 修复：避免delete关键字冲突，优化路径拼接
//   async delOrder(id) {
//     try {
//       const res = await this.delete(`/delete/${id}`);
//       ElMessage.success(res.msg || "删除订单成功");
//       return res;
//     } catch (error) {
//       const errMsg = error.message || "删除订单失败，请稍后重试";
//       ElMessage.error(errMsg);
//       throw error;
//     }
//   }


// }

// export default new OrderAPI();
import BaseAPI from "./base";
import { ElMessage } from "element-plus";

class OrderAPI extends BaseAPI {
  constructor() {
    super("/order");
  }

  // 获取订单列表
  async getList(data) {
    try {
      const res = await this.get("/list", data);
      return res;
    } catch (error) {
      const errMsg = error.message || "获取订单列表失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }

  // 创建订单
  async create(data) {
    try {
      const res = await this.post("/create", data);
      return res;
    } catch (error) {
      const errMsg = error.message || "创建订单失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }

  // 修改订单状态
  async updateStatus(data) {
    try {
      const res = await this.put("/status", data);
      ElMessage.success(res.msg || "状态修改成功");
      return res;
    } catch (error) {
      const errMsg = error.message || "状态修改失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }

  // 删除订单
  async delOrder(id) {
    try {
      const res = await this.delete(`/delete/${id}`);
      return res;
    } catch (error) {
      const errMsg = error.message || "删除订单失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }

  // 获取售后订单列表
  async getAfterSaleList(data) {
    try {
      const res = await this.get("/after-sale/list", data);
      return res;
    } catch (error) {
      const errMsg = error.message || "获取售后订单列表失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }

  // 更新售后状态
  async updateAfterSaleStatus(data) {
    try {
      const res = await this.put("/after-sale/status", data);
      ElMessage.success(res.msg || "更新售后状态成功");
      return res;
    } catch (error) {
      const errMsg = error.message || "更新售后状态失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }

  // 获取评价列表
  async getEvaluationList(data) {
    try {
      const res = await this.get("/evaluation/list", data);
      return res;
    } catch (error) {
      const errMsg = error.message || "获取评价列表失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }

  // 审核评价
  async auditEvaluation(data) {
    try {
      const res = await this.put("/evaluation/audit", data);
      ElMessage.success(res.msg || "审核评价成功");
      return res;
    } catch (error) {
      const errMsg = error.message || "审核评价失败";
      ElMessage.error(errMsg);
      throw error;
    }
  }
  // 新增：提交评价接口
  submitEvaluation(data) {
    return this.post("/evaluation/submit", data); // 路径和后端一致
  }

  getEvaluationList(params) {
    return this.get("/evaluation/list", params);
  }

  auditEvaluation(data) {
    return this.put("/evaluation/audit", data);
  }
}

export default new OrderAPI();