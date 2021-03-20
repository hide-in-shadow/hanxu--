<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="showDialog">
    <el-form
      ref="fromRef"
      label-width="120px"
      :model="formData"
      :rules="formRul"
    >
      <el-form-item label="部门名称">
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人">
        <!-- 员工列表 获取光标时请求 获取最新列表 -->
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple()"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="add()">确定</el-button>
        <el-button size="small" @click="close()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  components: {},
  props: {},
  data() {
    // 函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据   找技术部所有的子节点
      let isRepeat = null
      // 有id就是编辑模式
      if (this.formData.id) {
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts
          .filter(
            item =>
              item.id !== this.formData.id && item.pid === this.treeNode.pid
          )
          .some(item => item.name === value)
      } else {
        // 新增 张三 => 校验规则  同级部门下 不能有叫张三的
        isRepeat = depts
          .filter(item => item.pid === this.treeNode.id)
          .some(item => item.name === value)
      }
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式  因为编辑模式下 不能算自己
        isRepeat = depts.some(
          item => item.id !== this.formData.id && item.code === value && value
        )
      } else {
        isRepeat = depts.some(item => item.code === value && value)
        // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }
    return {
      showDialog: false,
      // 部门信息表单
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 表单校验规则
      formRul: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      peoples: [], // 员工简单列表
      title: '', // 标题
      type: '' // 类型
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 获取员工简单列表
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 编辑时 或者添加  获取 数据信息
    async showById(id, type) {
      this.type = type // 确定时 编辑 还是 新增
      this.showDialog = true // 打开弹层
      if (this.type === 'edit') {
        this.title = '编辑部门'
        this.formData = await getDepartDetail(id)
      } else {
        this.title = '新增部门'
        this.formData.pid = id
      }
    },
    // 关闭弹层
    close() {
      // 重置表单
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.fromRef.resetFields() // 重置校验字段
      this.showDialog = false
    },
    // 确定 提交 信息
    add() {
      this.$refs.fromRef.validate(async isOK => {
        if (isOK) {
          if (this.type === 'edit') {
            // 编辑模式  调用编辑接口
            await updateDepartments(this.formData)
          } else {
            // 调用新增接口 添加父部门的id
            // 获取的 部门id 作为 新添加部门的上级部门id
            await addDepartments(this.formData)
          }
          this.$emit('delDepts')
          this.close()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
