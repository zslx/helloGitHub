# helloGitHub
学用git和hub

1. 无网络时开发，也能使用版本管理功能
2. 多个工作电脑同步
3. 多人合作开发
4. 

基本步骤
1. fork   某个开源项目到自己的账号
2. clone  下载项目到本地
3.【edit】 编辑，增删改查
4. add
5. commit
6. pull   下载与合并 checkout and merge
7. push

旁支：准备
1. github 注册账号，托管代码
2. git    按照本地程序
3. ssh-keygen  如果使用 https 协议则不需要 3,4 两步
4. ssh -T -v git@github.com

旁支：工作区，暂存区（stage,index），repository
git status
git diff
git log --pretty=online

基本使用 2 添加已有工程到 git, 并推送到代码托管服务器 github
1. 在代码目录新建 .gitignore 用正则式写明不需要上传服务器的文件
2. git init  初始化本地 repository
3. git remote add origin remote-git-url
4. git pull origin master 在本地进行代码更新和合并
5. git add .
6. git commit -m "some words"
7. git push origin master
8. over
