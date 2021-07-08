module.exports = {
  devServer: {
    proxy: {
      // 配置代理服务器
      // 解决跨越
      // 处理以api开头路径的请求
      // "/api" : http://localhost:4000  http://localhost:4000/api/search/users
      '/api': {
        target: 'http://api.vikingship.xyz/api', // 转发目标地址
        pathRewrite: {
          '^/api': '' // 转发请求时去除路径前面的/api
        },
        changeOrigin: true // 支持跨域，如果协议/主机也不相同，必须加上
      }
    }
  }
}
