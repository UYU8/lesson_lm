/**
 * @func 就地编辑
 * @params {id,parent 父节点,value 默认值}
 * @author ywk
 * @date 2024-12-01
 */
function EditInPlace(id,parent,value){
    this.id = id; // 跨函数共享属性
    this.parent = parent || document.body;
    this.value = value || '这个家伙很懒，什么都没有留下';
    this.createElement(this.id);// 在自己内部找不到去prototype上找
}
EditInPlace.prototype.createElement = function(id){
    // console.log(id);
    
    // <div id="ep1"></div>
    this.containerElement = document.createElement('div');
    this.containerElement.id = id;
    this.parent.appendChild(this.containerElement);
    
    this.staticElement = document.createElement('span');
    // this.staticElement.id = id + '_static'; 要加吗？
    this.staticElement.innerText = this.value;
    this.containerElement.appendChild(this.staticElement);
}
