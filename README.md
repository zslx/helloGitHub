# Hello Git and Hub
https://git-scm.com/book/zh/v2
Study git&hub, 先看上面的官网文档。

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

# 定义快捷方式
git status
git config --global alias.st 'status'
git st

全局配置文件在 ~/.gitconfig
当前项目的配置文件在 .git/config

# 放弃现有修改
恢复到最后一次提交的改动：

git checkout -- + 需要恢复的文件名

但是，需要注意的是，如果该文件已经 add 到暂存队列中，上面的命令就不灵光喽
需要先让这个文件取消暂存：

git reset HEAD -- + 需要取消暂存的文件名

然后再使用第一条命令。

如果感觉命令多了记不住，那就做一两个匿名呗，比如：

git config --global alias.unstage 'reset HEAD --'
git config --global alias.restore 'checkout --'

我们拿 README.md 这个文件举例，比如修改了一段文字描述，想恢复回原来的样子：

git restore README.md

即可，如果修改已经被 git add README.md 放入暂存队列，那就要

git unstage README.md
git restore README.md

才能恢复成功哦。

# 问题：用另一个账号下载和提交了代码，如何切换回去？
1 此方法无效：git commit --amend --author='ZSL <shenglinzh@gmail.com>'

2 修改 .git/config  也没成功
url = https://github.com/zslx/linux.git
改为
url = https://zslx@github.com/zslx/linux.git
再试
url = https://user:password@github.com/user/blahblah.git
这里提示 用户名或密码错误， 改回不带用户名密码的链接后，出现：
Git Credential Manager fow Windows
要求重新输入密码。 Oh yeah!!
成功！！！

了解 Git Credential Manager
http://blog.miniasp.com/post/2016/02/01/Useful-tool-Git-Credential-Manager-for-Windows.aspx

git config --global credential.helper manager
使用 Git Credential Manager for Windows

正常來說，只要把 Git Credential Manager for Windows 裝好，甚麼都不用設定就會自動生效！

無論你用 TortoiseGit 或命令提示字元下的 Git.exe 命令列工具，只要第一試圖跟遠端儲存庫連線且需要密碼時，
他都會自動跳出帳戶密碼提示，而當你輸入完帳號密碼後，
該組帳號密碼就會被儲存到系統的 Windows Credential Store 儲存區中 (認證管理員)。

找到它啦： 控制面板\用户帐户\凭据管理器

3 You must define:
environment variable %HOME%
put a _netrc file in %HOME%
If you are using Windows 7

run the cmd type this:

setx HOME %USERPROFILE%
and the %HOME% will be set to 'C:\Users\"username"'

then go to it and make a file called '_netrc'

Note: for Windows, you need a '_netrc' file, not a '.netrc'.

Its content is quite standard (Replace the with your values):

machine <hostname1>
login <login1>
password <password1>
machine <hostname2>
login <login2>
password <password2>
