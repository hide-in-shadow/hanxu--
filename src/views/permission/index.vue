<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission()"
          >添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-card v-loading="loading">
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template v-slot="{ row }">
              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPermission(row)"
              >添加</el-button>
              <el-button
                type="text"
                @click="addPermission(row, 'updata')"
              >编辑</el-button>
              <el-button
                type="text"
                @click="deletePermission(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 添加或修改弹窗 -->
      <add-permission ref="addPermission" />
    </div>
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import addPermission from './components/add-permission'
export default {
  name: 'Permission',
  components: {
    addPermission
  },
  props: {},
  data() {
    return {
      loading: false,
      list: []
    }
  },
  created() {
    this.getPermissionList()
  },
  mounted() {},
  methods: {
    // 获取权限列表 并转化为树状结构
    async getPermissionList() {
      this.loading = true
      const data = await getPermissionList()
      this.list = tranListToTreeData(data, '0')
      this.loading = false
    },
    // 删除权限
    async deletePermission(id) {
      await this.$confirm('是否确定删除')
      await delPermission(id)
      this.getPermissionList()
      this.$message.success('删除成功')
    },
    // 添加或修改 权限
    addPermission(row, type) {
      this.$refs.addPermission.open(row, type)
    }
  }
}
</script>

<style scoped lang="scss"></style>
