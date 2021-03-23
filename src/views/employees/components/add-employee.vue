<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    :close-on-click-modal="false"
    @close="close"
  >
    <!-- 表单 -->
    <el-form
      ref="formRef"
      label-width="120px"
      :model="formData"
      :rules="formDataRul"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="formData.name"
          style="width:50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width:50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width:50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width:50%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width:50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <!-- 放置一个tree组件 -->
        <el-tree
          v-loading="loading"
          :data="treeData"
          default-expand-all
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width:50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="close()">取消</el-button>
          <el-button type="primary" size="small" @click="add()">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {},
  props: {},
  data() {
    return {
      showTree: false, // 是否展示部门选择框
      treeData: {}, // 树形结构的数据
      loading: false,
      showDialog: false,
      formData: {
        username: '', // 姓名
        mobile: '', // 手机
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      },
      formDataRul: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        correctionTime: [
          { required: true, message: '转正时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 获取 员工部门
    async getDepartments() {
      this.showTree = true // 展示下拉菜单 选框
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 转换成 树形结构
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 选择部门
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 关闭弹层
    close() {
      // 重置表单
      this.formData = {
        username: '', // 姓名
        mobile: '', // 手机
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      }
      this.$refs.formRef.resetFields() // 重置校验字段
      this.showDialog = false
    },
    // 开启弹层
    open() {
      this.showDialog = true
    },
    // 确定提交表单
    add() {
      this.open()
    }
  }
}
</script>

<style></style>
