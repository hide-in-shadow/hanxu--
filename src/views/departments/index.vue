<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepartments($event)"
        />
        <!-- 树形图 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all
          highlight-current
          icon-class="el-icon-circle-plus-outline"
        >
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的数据 对应相应的每一项-->
          <!-- 顺序是 执行slot-scope的赋值 通过 props的传值 给每一横 -->
          <tree-tools
            slot-scope="{ data: res }"
            :tree-node="res"
            :is-root="false"
            @delDepts="getDepartments()"
            @addDepts="addDepartments($event)"
          />
        </el-tree>
      </el-card>

      <!-- 编辑弹窗 -->
      <addDept ref="show" @delDepts="getDepartments()" />
    </div>
  </div>
</template>

<script>
import treeTools from './components/tree-tools'
import addDept from './components/add-dept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Departments',
  components: {
    treeTools,
    addDept
  },
  props: {},
  data() {
    return {
      loading: false, // 加载弹层
      company: {}, // 树状 标题
      departs: [], // 树状 内容
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      type: '' // 添加还是 编辑
    }
  },
  created() {
    this.getDepartments()
  },
  mounted() {},
  methods: {
    // 初始化 树形图 数据
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // 调用方法 将数据转换为 树形结构
      this.departs = tranListToTreeData(result.depts, '')
      this.loading = false
    },
    // 添加 或 编辑 部门
    addDepartments(obj) {
      this.$refs.show.showById(obj.node, obj.type)
    }
  }
}
</script>

<style scoped lang="scss">
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
