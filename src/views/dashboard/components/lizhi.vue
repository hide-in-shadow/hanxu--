<template>
  <!-- 弹出层 -->
  <el-dialog
    :visible="showDialog"
    :title="`${ruleForm.processName}申请`"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="110px"
      :rules="rules"
    >
      <!--离职表单-->
      <el-form-item label="期望离职时间" prop="exceptTime">
        <el-date-picker
          v-model="ruleForm.exceptTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="离职原因" prop="reason">
        <el-input
          v-model="ruleForm.reason"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8 }"
          style="width: 70%;"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { startProcess } from '@/api/approvals'
export default {
  components: {},
  props: {},
  data() {
    return {
      showDialog: false,
      ruleForm: {
        exceptTime: '',
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      },
      rules: {
        exceptTime: [{ required: true, message: '离职时间不能为空' }],
        reason: [{ required: true, message: '离职原因不能为空' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    open() {
      this.showDialog = true
    },
    close() {
      // 重置表单
      this.ruleForm = {
        exceptTime: '',
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      }
      this.$refs.ruleFormRef.resetFields()
      this.showDialog = false
    },
    btnOK() {
      this.$refs.ruleFormRef.validate(async isOK => {
        if (isOK) {
          await startProcess({
            ...this.ruleForm,
            userId: this.$store.getters.userId
          })
          this.$message.success('提交流程成功')
        }
      })
      this.close()
    }
  }
}
</script>

<style scoped lang="scss"></style>
