<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 角色页面-->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRole()"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="角色名称"
                width="240"
              />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="success"
                    @click="addRolePermission(scope.row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="addRole(scope.row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(scope.row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="params.page"
                :page-size="params.pagesize"
                :total="total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>

          <!-- 公司页面 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <add-role ref="addRole" @update="getRoleList()" />
      <add-role-permission ref="addRolePermission" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleList, getCompanyInfo, deleteRole } from '@/api/setting'
import addRole from './components/add-role'
import addRolePermission from './components/add-role-permission'
export default {
  name: 'Setting',
  components: {
    addRole,
    addRolePermission
  },
  props: {},
  data() {
    return {
      list: [], // 承接数组
      // 放置页码及相关数据
      params: {
        page: 1,
        pagesize: 10
      },
      total: 0, // 记录总数
      formData: {} // 公司详情
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  mounted() {},
  methods: {
    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 获取角色列表
    async getRoleList() {
      const { total, rows } = await getRoleList(this.params)
      this.total = total
      this.list = rows
      // console.log(rows)
    },
    // newPage是当前点击的页码
    changePage(newPage) {
      this.params.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id) // 调用删除 接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (err) {
        console.log(err)
        this.$message.success('删除角色失败')
      }
    },
    // 编辑 或 新增 角色
    addRole(id) {
      this.$refs.addRole.open(id)
    },
    // 分配权限
    addRolePermission(id) {
      this.$refs.addRolePermission.open(id)
    }
  }
}
</script>

<style scoped lang="less"></style>
