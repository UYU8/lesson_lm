# 后端http伺服
# request axios 调用deepseek api
# jsonify 接口json 化
from flask import Flask,request,jsonify,send_from_directory

# 实例化Flask app 对象
# 后端驱动的开发中 static 静态文件 => 前端
# 传统的后端,mvc 没有前后端分离
# 根路径 和 静态文件路径 在同一个目录下'' 名为static
# 在static 目录下启动静态服务器 cdn
# / 直接指向 static 
app = Flask(__name__,static_url_path='',static_folder='static')

# 装饰器模式 mvc mvvm view
# 把server_index 装饰成路由的处理函数
# 路由 动态资源 router -> 渲染 index.html
# 文件系统 os
@app.route('/')
def server_index():
  return send_from_directory('static','index.html')

# deepseek 路由接口

if __name__ == '__main__':
  app.run(debug=True)