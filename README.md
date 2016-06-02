# helloGitHub
Study git&hub

# 为啥从SVN转向Git
1. 无网络时开发，也能使用版本管理功能
2. 更好的支持多人合作开发
3. 一个本地rep可以对应多个远程rep
4. 多个工作电脑同步

# github 是啥？ 一个基于git，提供代码托管的网站

# github 使用基本步骤
1. fork   某个开源项目到自己的账号
2. clone  下载项目到本地
3.【edit】 编辑，增删改查
4. add    添加到 stage
5. commit 提交到本地 repository
6. pull   下载与合并 checkout and merge
7. push  推送到git服务器的 repository

# 旁支：准备
1. github 注册账号，托管代码
2. git    安装本地程序
3. ssh-keygen 创建公钥和私钥，并在github配置。
   # 参考 https://help.github.com/categories/ssh/
   1) Checking for existing SSH keys
      $ls -al ~/.ssh
   2) 创建 $ssh-keygen -t rsa -C 'some@mail.com'
      When you're prompted to "Enter a file in which to save the key," press Enter. This accepts the default file location.
   3) Adding your SSH key to the ssh-agent
      # Ensure ssh-agent is enabled: $eval "$(ssh-agent -s)"
      # start the ssh-agent in the background
      $ssh-add ~/.ssh/id_rsa
   4) Copy the SSH key to your clipboard. 防止复制多少空白 使用 clip 工具
      $ clip < ~/.ssh/id_rsa.pub
   5) github site:In the top right corner of any page, click your profile photo, then click Settings.
      # pubkey 添加到 github, Key is already in use. 一对key 只能用于一个账号。
      In the user settings sidebar, click SSH and GPG keys.
      Click New SSH key.
      In the "Title" field, add a descriptive label for the new key. For example, "Personal MacBook Air".
      Paste your key into the "Key" field.
      Click Add SSH key.
      Confirm the action by entering your GitHub password.
4. ssh -T -v git@github.com
   ssh -T git@github.com
   验证账号可用
   # 如果使用 https 协议则不需要 3,4 两步。

# 旁支：概念：工作区，暂存区（stage,index），repository
git status  查看代码库状态
git diff
git log --pretty=online

# 基本使用2：添加已有工程到 git, 并推送到代码托管服务器 github
1. 在代码目录新建 .gitignore 用正则式写明不需要上传服务器的文件
2. git init  初始化本地 repository
3. git remote add origin remote-git-url
4. git pull origin master 在本地进行代码更新和合并
5. git add .
6. git commit -m "some words"
7. git push origin master
8. over
9. git branch --set-upstream-to=origin/master master
   # 设置 upstream 之后 pull 和 push 就有默认参数了

# 进阶使用
https://developer.github.com/
http://www.gitguys.com/

# 命令行创建 github repository
curl -u 'username' https://api.github.com/user/repos -d '{"name":"RepoName","description":"","auto_init","true"}'
git remote add origin https://github.com/zslx/RepoName.git

git diff   显示您的工作目录和index之间的差异.
git diff –cached   显示index和最近的commit之间的差异.
git diff HEAD   显示您的工作目录和最新的commit之间的差异.
git diff --stat  查看 diff 统计结果 
git diff HEAD^ HEAD   比较上次提交commit和上上次提交

# ssh key 多账号设置 【多个github帐号的SSH key切换】
http://justjavac.com/git/2012/04/13/multiple-ssh-keys.html

# 技巧
git commit -a是把unstaged的文件变成staged（这里不包括新建(untracked)的文件），然后commit.
用 git commit -am'comments' 代替 git add . 和 git commit -m'comments'
