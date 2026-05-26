declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
// 告诉 TypeScript 编译器如何处理 .vue 文件