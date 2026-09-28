import BaseAPI from "./base";
import { ElMessage } from "element-plus";

class CartAPI extends BaseAPI {
  constructor() {
    super("/cart");
  }

  async getList(user_id) {
    try {
      return await this.get("/list", { user_id });
    } catch (error) {
      ElMessage.error(error.message || "获取购物车失败");
      throw error;
    }
  }

  async getCount(user_id) {
    try {
      return await this.get("/count", { user_id });
    } catch (error) {
      console.error(error);
      return { data: { count: 0 } };
    }
  }

  async add(data) {
    try {
      const res = await this.post("/add", data);
      ElMessage.success(res.msg || "添加成功");
      return res;
    } catch (error) {
      ElMessage.error(error.message || "添加失败");
      throw error;
    }
  }

  async updateQuantity(data) {
    try {
      const res = await this.put("/quantity", data);
      return res;
    } catch (error) {
      ElMessage.error(error.message || "更新数量失败");
      throw error;
    }
  }

  async updateSelected(data) {
    try {
      const res = await this.put("/selected", data);
      return res;
    } catch (error) {
      ElMessage.error(error.message || "操作失败");
      throw error;
    }
  }

  async batchUpdateSelected(data) {
    try {
      const res = await this.put("/batch-selected", data);
      return res;
    } catch (error) {
      ElMessage.error(error.message || "操作失败");
      throw error;
    }
  }

  async deleteItem(id, user_id) {
    try {
      const res = await this.delete(`/delete/${id}`, { user_id });
      ElMessage.success(res.msg || "删除成功");
      return res;
    } catch (error) {
      ElMessage.error(error.message || "删除失败");
      throw error;
    }
  }

  async batchDelete(data) {
    try {
      const res = await this.delete("/batch-delete", data);
      ElMessage.success(res.msg || "批量删除成功");
      return res;
    } catch (error) {
      ElMessage.error(error.message || "批量删除失败");
      throw error;
    }
  }

  async clear(user_id) {
    try {
      const res = await this.delete("/clear", { user_id });
      ElMessage.success(res.msg || "清空成功");
      return res;
    } catch (error) {
      ElMessage.error(error.message || "清空失败");
      throw error;
    }
  }

  async getSelectedItems(user_id) {
    try {
      return await this.get("/selected-items", { user_id });
    } catch (error) {
      ElMessage.error(error.message || "获取结算信息失败");
      throw error;
    }
  }
}

export default new CartAPI();