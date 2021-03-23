<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable align="center">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable align="center">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="240">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
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
          <el-pagination
            layout="prev, pager, next"
            :page-size="params.size"
            :current-page="params.page"
            :total="total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>

      <!-- 新增部门 -->
      <add-employee />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 枚举文件
import AddEmployee from './components/add-employee'
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  props: {},
  data() {
    return {
      loading: false,
      list: [], // 接收的数据列表
      params: {
        page: 1, // 当前页码
        size: 10 // 每页展示条数
      },
      total: 0 // 总数
    }
  },
  created() {
    this.getEmployeeList()
  },
  mounted() {},
  methods: {
    changePage(newPage) {
      this.params.page = newPage
      this.getEmployeeList()
    },
    // 获取 员工列表
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.params)
      console.log(rows)
      this.total = total
      this.list = rows
      this.loading = false
    },
    // 枚举 格式化 聘用形式
    formatEmployment(row, column, cellValue, index) {
      // row 表示每行数据
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(
        item => item.id === row.formOfEmployment
      )
      return obj ? obj.value : '未知'
    },
    // 删除 员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (err) {
        console.log(err)
        this.$message.success('删除员工失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
