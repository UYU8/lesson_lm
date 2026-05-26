- vue3 响应式 的响应式机制
  - ref .value 响应式对象 value Object.defineProperty 性能好
  - reactive 响应式代理 proxy 代理对象 开销大 

@child-message 这个事件属于 父组件，但它监听的是 子组件 发出的自定义事件。具体来说：
@child-message 是 Vue 的语法糖，用于在父组件中监听子组件发出的自定义事件。
child-message 是子组件内部通过 emits 函数触发的事件名称。
handleChildMessage 是父组件中定义的处理函数，用于接收并处理子组件传递的数据。

虽然这个事件是在父组件中定义属于父组件的，但是是由子组件发出的。子组件向父组件传递数据是通过事件的方式。
@child-message：监听子组件发出的 child-message 事件。当子组件通过 emits('child-message', payload) 触发该事件时，父组件中的 handleChildMessage 方法会被调用。

- 父子组件通信
  - props 父向子传递数据 数据 
  - @child-message="handEvent" 自定义事件名称+处理函数 attrs 
  - 子组件 一切由外界传的 都得申明()一下
    emit 汇报一下某件事情
    emits = defineEmits(['child-message'])
  - emits(event_name,params) 