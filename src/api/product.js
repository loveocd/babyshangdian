import BaseAPI from "./base";
import { ElMessage } from "element-plus";
class ProductAPI extends BaseAPI {
  constructor() {
    super("/product"); //设置调用的路径
  }

  // 获取商品列表  { currentPage: ,pageSize: }
  async getList(data) {
    try {
      const res = await this.get("/list",data);      
      return res;
    } catch (error) {
      ElMessage.error(error.message || "获取数据失败");
      throw error;
    }
  }

  // 新增商品
  async add(data) {
    try {
      const res = await this.post("/add", data);
      return res;
    } catch (error) {
      ElMessage.error(error.message || "新增失败");
      throw error;
    }
  }

  // 编辑商品
  async update(data) {
    try {
      const res = await this.put("/update", data);
      return res;
    } catch (error) {
      ElMessage.error(error.message || "编辑失败");
      throw error;
    }
  }

  // 删除商品
  async pdelete(id) {
    try {
      const res = await this.delete(`/delete/${id}`);
      return res;
    } catch (error) {
      ElMessage.error(error.message || "删除失败");
      throw error;
    }
  }

  // 获取商品详情
  async getDetail(id) {
    try {
      const res = await this.get(`/detail/${id}`);
      return res;
    } catch (error) {
      ElMessage.error(error.message || "获取详情失败");
      throw error;
    }
  }
}


  

export default new ProductAPI();
