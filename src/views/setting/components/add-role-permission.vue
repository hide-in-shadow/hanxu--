<template>
  <el-dialog title="分配权限" :visible="showDialog" @close="close">
    <!-- id作为唯一标识 -->
    <el-tree
      ref="permTree"
      :data="permData"
      :props="defaultProps"
      :show-checkbox="true"
      :check-strictly="true"
      :default-expand-all="true"
      :default-checked-keys="selectCheck"
      node-key="id"
    />
    <!-- 确定 取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK()">确定</el-button>
        <el-button size="small" @click="close()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  components: {},
  props: {},
  data() {
    return {
      showDialog: false, // 控制分配权限弹层的显示后者隐藏
      permData: [], // 专门用来接收权限数据 树形数据
      defaultProps: {
        label: 'name'
      },
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 获取全部权限列表 转化list到树形数据
    async assignPerm() {
      const data = await getPermissionList()
      this.permData = tranListToTreeData(data, '0')
    },
    // 打开弹层 并获取相应数据
    async open(id) {
      this.roleId = id
      this.assignPerm()
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds // 获取角色权限列表
      this.showDialog = true
    },
    // 关闭弹层 并重置数据
    close() {
      this.selectCheck = [] // 重置角色权限列表
      this.showDialog = false
    },
    // 提交数据
    async btnOK() {
      // getCheckedKeys 获取 所有选中的 id
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId
      })
      this.$message.success('分配权限成功')
      this.close()
    }
  }
}
</script>

<style scoped lang="less"></style>
