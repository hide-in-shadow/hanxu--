<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="`${title}权限点`" :visible="showDialog" @close="close">
    <!-- 表单 -->
    <el-form
      ref="formDataRul"
      :model="formData"
      :rules="formDataRul"
      label-width="120px"
    >
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getPermissionDetail,
  updatePermission,
  addPermission
} from '@/api/permission'
export default {
  components: {},
  props: {},
  data() {
    return {
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型
        pid: '', // 父权限id 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      formDataRul: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      title: '添加' // 标题文本
    }
  },
  created() {},
  mounted() {},
  methods: {
    async open(row, type) {
      if (row && type === 'updata') {
        // 编辑
        this.title = '编辑'
        this.formData = await getPermissionDetail(row.id)
      } else if (row) {
        // 添加 二级权限
        this.title = '添加'
        this.formData.pid = row.id // 添加权限的父权限id
        this.formData.type = 2 // 根权限还是子权限
      } else {
        // 添加 根权限
        this.title = '添加'
        this.formData.pid = '0'
        this.formData.type = 1
      }
      this.showDialog = true
    },
    close() {
      // 重置表单
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型
        pid: '', // 父权限id 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.formDataRul.resetFields() // 重置校验字段
      this.showDialog = false
    },
    async btnOK() {
      if (this.title === '编辑') {
        await updatePermission(this.formData)
      } else {
        await addPermission(this.formData)
      }
      this.$message.success(`${this.title}成功`)
      this.$parent.getPermissionList() // 调用父组件方法
      this.close()
    }
  }
}
</script>

<style scoped lang="scss"></style>
