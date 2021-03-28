<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userInfoRef"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
              :model="userInfo"
              :rules="userInfoRul"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="新密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width:300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser()">更新</el-button>
                <el-button @click="$router.back(-1)">返回</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="个人详情">
            <!-- 打印按钮 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置个人详情 -->
            <component :is="userComponent" />
            <!-- <user-info /> -->
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <!-- 打印按钮 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置岗位详情 -->
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import userInfo from './components/user-info'
import jobInfo from './components/job-info'
export default {
  components: { userInfo, jobInfo },
  props: {},
  data() {
    return {
      userComponent: 'userInfo', // 动态组件名 用于 component :is
      userId: this.$route.params.id, // 直接通过 this.userId进行获取数据
      userInfo: {
        username: '',
        password2: ''
      },
      userInfoRul: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  mounted() {},
  methods: {
    // 获取用户信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 提交信息
    async saveUser() {
      await this.$refs.userInfoRef.validate()
      await saveUserDetailById({
        ...this.userInfo,
        password: this.userInfo.password2
      }) // 将新密码的值替换原密码的值
      this.$message.success('保存成功')
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped lang="scss"></style>
