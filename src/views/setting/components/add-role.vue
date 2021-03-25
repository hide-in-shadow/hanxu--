<template>
  <el-dialog
    :title="title"
    :visible="showDialog"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      ref="roleFormRef"
      :model="roleForm"
      :rules="roleFormRul"
      label-width="120px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleDetail, updateRole, addRole } from '@/api/setting'
export default {
  components: {},
  props: {},
  data() {
    return {
      title: '',
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      roleFormRul: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 打开弹层
    async open(id) {
      if (id) {
        this.title = '编辑角色'
        this.roleForm = await getRoleDetail(id)
      } else {
        this.title = '新增角色'
      }
      this.showDialog = true // 数据获取后再开弹层 避免 闪烁
    },
    // 关闭弹层
    close() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 重置校验字段
      this.$refs.roleFormRef.resetFields()
      this.showDialog = false
    },
    // 提交 表单
    btnOK() {
      this.$refs.roleFormRef.validate(async isOK => {
        if (isOK) {
          if (this.roleForm.id) {
            // 编辑模式  调用编辑接口
            await updateRole(this.roleForm)
          } else {
            // 调用新增接口 添加父部门的id
            await addRole(this.roleForm)
          }
          this.$emit('update')
          this.close()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
