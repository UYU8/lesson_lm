import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  useEffect(() => {
    document.title = '关于你的一切'
  }, [])

  return (
    <div>
      <h1>About</h1>
      <Link to="/">回到首页</Link>
    </div>
  )
}

export default About