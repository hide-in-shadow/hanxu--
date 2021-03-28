<template>
  <div>
    <!-- list-type	文件列表的类型
         action	    必选参数，上传的地址
         file-list	上传的文件列表
         limit	    最大允许上传个数
         on-preview	点击文件列表中已上传的文件时的钩子
         on-remove	文件列表移除文件时的钩子
         on-change  文件列表改变时触发 上传 删除 更新
         before-upload	上传文件之前的钩子，参数为上传的文件
         http-request	覆盖默认的上传行为，可以自定义上传的实现 -->
    <el-upload
      list-type="picture-card"
      action="#"
      :file-list="fileList"
      :limit="1"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="this.fileList.length === 1 ? 'disabled' : ''"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <!-- 进度条 -->
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />

    <!-- 预览弹窗 -->
    <el-dialog title="图片" :visible.sync="dialogVisible">
      <img :src="imgUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云sdk
const cos = new COS({
  SecretId: 'AKIDoOO8nEWkdJkwASETndHDvNkxucuwNDZt', // 身份识别ID
  SecretKey: 'JML2bgX7rSn28yKSJ5ZCeqmnZ4TbgMlu' // 身份密钥
})
export default {
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      imgUrl: '', // 预览图片
      fileList: [], // 上传图片地址设置为数组
      currentFileUid: '', // 存储上传的uid
      showPercent: false, // 控制进度条的显示
      percent: 0 // 进度条的长度 0-1
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 点击预览
    preview(file) {
      this.imgUrl = file.url
      this.dialogVisible = true
    },
    // 移除文件列表
    handleRemove(file) {
      // 过滤掉 删除的文件 就是 新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 将上传的本地数据 赋值给 this.fileList
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传前  对上传文件的校验
    beforeUpload(file) {
      // 检查 文件类型 和 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true // 开启进度条
      return true
    },
    // 自定义上传动作 params.file  是我们上传到腾讯云的内容
    upload(params) {
      console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'hanxu-1305395355', // 存储桶
            Region: 'ap-nanjing', // 地域
            Key: params.file.uid + '', // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 默认 标准模式
            // 进度条
            onProgress: params => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            console.log(data)
            // 需要判断错误与成功
            if (!err && data.statusCode === 200) {
              // upload为true表示 该图片已经成功上传到服务器
              if (!err && data.statusCode === 200) {
                // 将 原本 本地的地址 更改为 线上的 地址
                this.fileList = this.fileList.map(item => {
                  // 通过记录的 uid 寻找
                  if (item.uid === this.currentFileUid) {
                    // 将成功的地址赋值给原来的url属性
                    return { url: 'http://' + data.Location, upload: true }
                    // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  }
                  return item
                })
              }
              this.$message.success('上传成功')
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            } else {
              this.$message('上传失败')
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="scss">
.disabled > .el-upload--picture-card {
  display: none;
}
</style>
