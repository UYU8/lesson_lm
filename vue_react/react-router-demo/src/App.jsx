// / 页面级别组件
// 二级路由 about  /about
// Outlet rotuer-view 
import './App.css'
import { 
  Outlet,
  NavLink 
} from "react-router-dom"  
function App() {

  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <Outlet />
    </>
  )
}

export default App