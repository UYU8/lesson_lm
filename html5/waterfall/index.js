 //确定第一行能放几n张图
   //1.或许用户屏幕宽度
   //2.获取图片的宽度
 //操作第 n+1 张摆放它的位置 放在第一行高度最小的那一列的下面
   //1.获取每一列的高度
   //2.更新这一列的高度

imgLocation('container','box')//调用一个函数实现瀑布流

function imgLocation(parent,child){
  var cParent = document.getElementById(parent)  //用一个变量来获取container
  var cChild = document.getElementsByClassName(child)  //用一个变量来获取box

  var scrennWidth = window.innerWidth  //获取用户屏幕宽度
  var imgWidth = cChild[0].offsetWidth  //获取图片宽度
  var num = Math.floor(scrennWidth / imgWidth)  //一行能放进几张图片  math.floor()去掉小数向下兼容
  cParent.style.Width = `${imgWidth * num}px`  //最外层container宽度 根据用户使用不同设备所决定

  //处理num+1张
  var boxHeightArr = []
  for(var i = 0 ; i < cChild.length ; i++){
    if(i < num){ //只能存入num张
    boxHeightArr.push(cChild[i].offsetHeight)  //将第一行图片的宽度全部存入数组中
    }
    else{
      var minHeight = Math.min(...boxHeightArr)  //获取第一行中高度最小的图片值  
      var minindex = boxHeightArr.indexOf(minHeight)  //获高度最小的图片的数组下标
      
      cChild[i].style.position = 'absolute'  //将图片改为绝对定位
      cChild[i].style.top = minHeight + 'px' 
      cChild[i].style.left = cChild[minindex].offsetLeft + 'px'
      
      //更新这一列的高度
      boxHeightArr[minindex] = boxHeightArr[minindex] + cChild[i].offsetHeight
    }
  }
}






