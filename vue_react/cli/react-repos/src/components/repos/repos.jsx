import { useState } from 'react'
import './repos.css'

function Repos(){
    // const repos =[
    //     {
    //         id:1,
    //         name:'lesson_hm',
    //     },
    //     {
    //         id:2,
    //         name:'algo-hello',
    //     },
    //     {
    //         id:3,
    //         name:'prompt',
    //     },
    // ]

    // 类似于vue 中的 template
    // 返回一段html模板 
    // js 区域
    
    // 使用一个响应式数据状态
    // 初始值 返回的是一个数组 解构 数组的第一项是当前的状态，数组的第二项是修改状态的方法
    const [repos,setRepos] = useState([]) // repos 变成了响应式数据 状态
    const [loading,setLoading] = useState(true);

    fetch('https://api.github.com/users/uyu8/repos')
    .then(res => res.json()) // 二进制流 转 json 格式
    .then(data => {
        // console.log(data)
        setLoading(false);
        setRepos(data)
    })

    return(
        // html？react 发明了 JSX 语法 可以在 js 里面写 html
        // JS 
        <div className = "github-repos"> 
        <h2>Github Repositories</h2>
        {loading && <p>Loading...</p>}
        <ul>
            {
                repos.map(repo => (
                    <li key={repo.id}><a href={repo.html_url}>
                        {repo.name}</a>
                        <span>作者：{repo.owner.login}</span>
                    </li>
                ))
            }
        </ul>
        {!loading && repos.length === 0 && <p>没有repos</p>}
        </div>
    )
}

export default Repos