- 为什么要用git？
  - 版本控制软件 去公司要和多人协作，几个亿的项目
  - 写项目？ 电脑坏了 保存代码的版本且安全 
  - 团队间代码的协作
  - git 帮我们在本地 管理代码的版本，远程仓库（分布式的）

- 常用操作，自我代码管理和简单的协作
- git 有哪些命令？
  - git init 初始化一个新的Git仓库
  把代码加入到仓库分三步
  - git add . 
  - git commit -m " "
  - git push origin main

  - git branch 分支
  - git checkout 切换分支
  - git merge 合并分支

## 大厂需要的git能力？
 - git 是必备技能
 - 高级技巧和考点
 - git 文档内置
   git help 常用的git命令
   git help -a 列出所有的名单（all）
   vi 编辑器 ：j：k 可以上下翻页 :q退出
   git help add 深入了解某一个命令 
   你是如何了解git命令的作用和参数的？
   
## 代码仓库
  文件夹 -> 开发目录（web网站）-> 代码仓库（）
  - 好处
  可以保存项目代码的版本（version） git关注的是代码的版本 
  时光穿梭机 文件的任意版本 有时候我们要回退 
  git 仓库里存的是啥？
  文件的版本
  拿着相机的一直拍 
  .git 目录 就是 仓库
  git相关的内容（文件的版本等）就放在.git 目录里
  - git config 配置 操作留下了责任人，多人协作的思想 
    老板就知道谁提交的代码？
    git config --global user.name""
    git config --global user.email"" 用于将本地代码传递到远程仓库时进行比对\
    config配置git的配置, --global 全局

  - git status
    当前仓库的状态 用于显示工作目录和暂存区的状态。
    on branch main 在主分支上 默认分支

    untracked file 未跟踪文件 还没有纳入版本管理 
    use commit 来跟踪?(add) 

    添加到仓库是一件比较严谨的事情
    - git add file
    将文件当前的版本 先添加到暂存区 
     git status 

    - 为什么需要暂存区，仓库两个概念
      - 后悔药
      - 分几次add，然后一次性commit
        进货 一辆买菜车 （git add 多次 提交到暂存区 ）买完了 （git commit 一次）买好菜了

    - git status
    让我们了解当前仓库的状态，摸鱼后还能人间清醒

    - git log
    代码提交记录
    --oneline 简化版 一行显示

    - 暂存区 仓库
      - 一次性多个文件多次加入暂存区，可以后悔，且可以组成一个提交逻辑（任务）
      - 一次commit -m''要规范 讲清楚做了什么任务
      - 不要随便提交commit ,需要围绕开发需求提交
        一个上午2-5次commit。