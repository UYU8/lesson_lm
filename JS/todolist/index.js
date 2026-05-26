//用户每次创建一个todo，就存进数组
//循环数组，生成数组长度相同的li结构

var tooData = []
var addTodo = document.querySelector('.btn')//要写#或.
var todoList = document.querySelector('.list')
//新增按钮的点击
function addNewTodo(){
    //input中是否有值
    if(document.getElementById('newTodo').value !== ''){
    tooData.push({
        id:Date.now(),
        content:document.getElementById('newTodo').value,
        completed:false
      })

     //渲染列表
     render()
     document.getElementById('newTodo').value = ''
    }
}

function render(){
    var str=''
    for(var i=0; i < tooData.length; i++){
        var item = tooData[i]

        str+=`
         <li class="list-item">
            <input type="checkbox" class="item-check" id="">
            <p class="item-content">${item.content}</p>
            <span class="close" data-id="${item.id}  data-action="remove" >✖</span>
         </li>
        `
    }
  //向ul中填入str、
  todoList.innerHTML = str
}
function removeTodo(e){
  console.log(e.target);
  if(e.target.dataset.action == "remove" && e.target.dataset.id == tooData[i].id){
     tooData.splice(i,1)
     }
  render()
  }


addTodo.addEventListener('click',addNewTodo)
todoList.addEventListener('click',removeTodo) 