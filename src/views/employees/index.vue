<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >Excel 导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportExcel"
          >Excel 导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="addEmployee()"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="姓名" sortable prop="username" width="100" />
          <el-table-column
            label="工号"
            sortable
            prop="workNumber"
            width="100"
          />
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/img.jpeg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
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
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="update(row.id)"
              >角色</el-button>
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

      <!-- 二维码弹层 -->
      <el-dialog
        title="二维码"
        :visible.sync="showCodeDialog"
        @close="imgUrl = ''"
      >
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>

      <!-- 新增员工 -->
      <add-employee ref="addEmployee" />

      <!-- 角色弹层 -->
      <assign-role ref="assignRole" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 枚举文件
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  name: 'Employees',
  components: {
    AddEmployee,
    AssignRole
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
      total: 0, // 总数
      showCodeDialog: false // 控制二维码弹层
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
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (err) {
        console.log(err)
        this.$message.success('删除员工失败')
      }
    },
    // 新增员工
    addEmployee() {
      this.$refs.addEmployee.open()
    },
    // 导出 excel 文件
    exportExcel() {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // Object.keys(obj) 会将 对象的key值 转成数组
      // console.log(Object.keys(headers))
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填 数组
          multiHeader, // 复杂表头 [[], []] 数组包数组
          merges, // 需要合并选项 数组
          data, // 具体数据 必填  [[], []] 数组包数组
          filename: 'excel-list', // 文件名
          autoWidth: true, // 单元格是否要自适应宽度 默认true
          bookType: 'xlsx' // 导出文件类型 xlsx, csv, txt等 默认xlsx
        })
      })
    },
    // 将数组对象 处理成 二维数组
    formatJson(headers, rows) {
      // item => {'key': 'value','key': 'value','key': 'value'}
      return rows.map(item => {
        // Object.keys(headers) => ['key', 'key', 'key']
        return Object.keys(headers).map(key => {
          // 入职日期 转正日期 转化时间
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 聘用形式 转换 相应的 内容
            var en = EmployeeEnum.hireType.find(
              obj => obj.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          }
          return item[headers[key]] // item的key 是 headers的值
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
    },
    // 点击头像 预览 二维码
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          // 组件渲染完成后才能获取 ref
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 用户角色弹窗
    update(id) {
      this.$refs.assignRole.open(id)
    }
  }
}
</script>

<style scoped lang="scss"></style>
