// react 全面hooks 函数式编程
import { useEffect } from 'react'
const Home = () => {
    useEffect(() => {
        document.title = '关于你的一切'
    },[])
  return (
    <div>
      <h1>关于</h1>
      <div>东华理工大学</div>
    </div>
  )
}

export default Home