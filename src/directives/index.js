export const imageerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options是 指令中的变量的解释  其中有一个属性叫做 value
    // dom 表示当前指令作用的dom对象   dom认为此时就是图片
    // 当src 为null时 不会触发 所以 还要判断是否为 null
    dom.src = dom.src || options.value
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的事件 => onerror
    // 监听 img 标签的错误事件 onerror
    dom.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  },
  // 在 节点更新 后执行 进一步判断 null 的情况
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
