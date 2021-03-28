<template>
  <el-dialog title="分配角色" :visible="showDialog" @close="close()">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="update()"
        >确定</el-button>
        <el-button size="small" @click="close()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  components: {},
  props: {},
  data() {
    return {
      showDialog: false,
      list: [], // 角色列表
      userId: null, // 用户id
      roleIds: [] // 用户 的 角色列表
    }
  },
  created() {
    this.getRole()
  },
  mounted() {},
  methods: {
    // 获取所有角色列表
    async getRole() {
      const { rows } = await getRoleList()
      this.list = rows
      console.log(rows)
    },
    // 打开弹层 获取当前用户角色列表
    async open(id) {
      this.userId = id // 存储当前角色id
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
      this.showDialog = true
    },
    // 关闭弹层
    close() {
      this.showDialog = false
      this.roleIds = [] // 初始化用户角色列表
    },
    // 提交数据
    async update() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('分配成功')
      this.close()
    }
  }
}
</script>

<style scoped lang="scss"></style>
