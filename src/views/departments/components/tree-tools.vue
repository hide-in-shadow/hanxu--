<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <i v-if="isRoot" class="el-icon-office-building" />
      <i v-else-if="!isRoot" class="el-icon-s-custom" />
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    isRoot: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object, // 对象类型
      required: true // 必传treeNode属性
    }
  },
  methods: {
    // 下拉菜单方法
    operateDepts(type) {
      if (type === 'add' || type === 'edit') {
        // 添加 编辑 子部门的操作
        this.$emit('addDepts', { node: this.treeNode, type })
      } else {
        //  删除操作
        this.$confirm('确定要删除该部门吗')
          .then(() => {
            // 如果点击了确定就会进入then
            return delDepartments(this.treeNode.id) // 返回promise对象
          })
          .then(() => {
            //  如果删除成功了  进入promise 的 then 事件
            this.$emit('delDepts') // 触发自定义事件
            this.$message.success('删除部门成功')
          })
      }
    }
  }
}
</script>
