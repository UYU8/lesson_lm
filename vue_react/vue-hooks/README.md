# vue hooks 编程

- react 的 hooks 编程，vue 直接抄
- vue 功能 -> 组件思维
- 内存泄漏 重要
  不会主动取消事件监听，组件销毁，事件处理函数无法找到，造成了内存泄漏

- 生命周期 v-if 组件卸载前打扫内存战场 
- 把问题放心交给LLM 
当 import { useMouse } from '../hooks/useMouse' 引入时，报了以下bug: The requested module '/src/hooks/useMouse.js' does not provide an export named 'useMouse' ,请帮我解决下一，给出代码，不需要useMouse函数的具体功能代码

- es6 模块化
  - import from 引入
    import Obj from | export default 默认输出的对象
    import { A,B,C } from | export 对象
  - export 导出 
   
- hooks 编程风格
  - useMouse 以use开头 是hooks函数的特征 
- 将响应式业务（界面的状态）和 UI 分离 
- 组件更好维护，复用性更高
- UI 组件开工程师 
- 组件拆分为 UI 界面 和 业务逻辑 

- 组件 = UI + State 