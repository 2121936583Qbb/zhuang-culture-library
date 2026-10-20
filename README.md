# AI驱动的壮族文化数字资源库 · 桌面演示系统

基于 **Electron + Vue3** 的本地离线桌面演示系统，全部 Mock 模拟数据，**无需后端、无需联网、无需真实 AI/3D/区块链/AR 硬件**。

- 配色：`#382b6b`（深蓝紫）· `#865F50`（棕褐）· `#EFD8B9`（米黄），壮锦国风卡片布局
- 打包目标：**Windows 单文件便携版 exe**（无需安装、双击即用、自带依赖、用户电脑不用装 Node）

---

## 一、项目目录结构

```
zhuang-culture-library/
├── package.json                  # 依赖与脚本
├── vite.config.js                # Vite 配置（base:'./' 适配 Electron file:// 加载）
├── electron-builder.yml          # 打包配置（portable 单文件 exe）
├── index.html                    # 入口 HTML
├── .gitignore
├── electron/
│   ├── main.js                   # Electron 主进程
│   └── preload.js                # 预加载脚本
├── .github/workflows/
│   └── build-portable.yml        # 在线打包（GitHub Actions）
└── src/
    ├── main.js                   # Vue 入口
    ├── App.vue                   # 根组件（侧边栏 + 顶栏 + 内容区）
    ├── router/index.js           # 路由（hash 模式）
    ├── assets/styles/global.css  # 全局主题（壮锦国风）
    ├── data/mock.js              # 全部 Mock 数据
    ├── utils/toast.js            # 全局 Toast
    ├── components/
    │   ├── SideNav.vue           # 侧边导航栏
    │   ├── Modal.vue             # 通用弹窗
    │   └── Toast.vue             # 提示组件
    └── views/
        ├── Home.vue              # 首页（复刻海报）
        ├── MaterialIntake.vue    # 文化素材入库
        ├── Model3D.vue           # 三维模型管理
        ├── DNACertificate.vue    # 文化DNA证书
        ├── ARTeaching.vue        # AR教学数据
        ├── VRGame.vue            # VR游戏资源管理
        └── Statistics.vue        # 数据统计看板
```

## 二、功能页面（侧边导航栏）

| 导航项 | 内容 |
| --- | --- |
| 🏠 首页 | 复刻海报：标题/标语、壮族语言·壮乡山歌·服饰纹样·建筑形制四大门类、采集→分析→建模→入库→应用技术流程、项目指标卡片 |
| 🤖 AI智能入库 | 完整业务流水线：采集(上传jpg/png)→AI深度分析(识别类型/提取色彩)→数字化建模(Three.js预览+GLB导出)→入库(4类资源库)→应用(首页/看板检索预览) |
| 📥 文化素材入库 | 登记表单 + 素材列表 + AI 分析弹窗 + 详情弹窗（前端可新增） |
| 🧊 三维模型管理 | 模型卡片 + 假 3D 旋转立方体查看弹窗 |
| 🧬 文化DNA证书 | 证书卡片（印章样式）+ 链上存证详情 + 模拟验证 |
| 🥽 AR教学数据 | AR 资源卡片 + 模拟相机取景框弹窗 |
| 🎮 VR游戏资源管理 | VR 资源卡片 + 场景加载动画弹窗 |
| 📊 数据统计看板 | KPI + 柱状图 + 环形图 + 进度条 + 最近动态 |

> 所有交互均为前端模拟：点击弹窗反馈，无真实 AI/3D/区块链/AR。

---

## 三、🎁 打包成单文件 exe · 傻瓜式教程（在线打包，无需本地安装 Node.js）

> 核心思路：把代码推到 **GitHub**，用 **GitHub Actions**（免费在线云主机）自动完成「安装 Node → 装依赖 → 构建前端 → 打包 exe」，最后下载 exe 即可。**你的电脑全程不需要装任何东西**（Node、npm、Electron 都不用）。

### 第 1 步：注册 GitHub 账号
1. 打开 https://github.com ，点右上角 **Sign up** 注册（用邮箱即可，免费）。
2. 注册完登录。

### 第 2 步：新建仓库
1. 点右上角 **＋ → New repository**。
2. 仓库名填 `zhuang-culture-library`，选 **Public**（私有仓库的 Actions 有额度，但公开更省心）。
3. 其它保持默认，点 **Create repository**。

### 第 3 步：上传项目文件（两种方式任选）

**方式 A（推荐，最省事）：直接在网页上传**
1. 进入刚建的仓库，点 **uploading an existing file**（上传已有文件）。
2. 把本项目文件夹里的所有文件和子文件夹**原样拖进去**（保持 `electron/`、`src/`、`.github/` 等目录结构不变）。
3. 底部点 **Commit changes**（提交）。

> 注意：不要上传 `node_modules`、`dist`、`release` 这些文件夹（`.gitignore` 已忽略它们，但拖拽上传时请手动排除，尤其是本机如果生成过这些目录）。

**方式 B：用 Git 命令上传**
```bash
git init
git add .
git commit -m "init zhuang culture library"
git branch -M main
git remote add origin https://github.com/你的用户名/zhuang-culture-library.git
git push -u origin main
```

### 第 4 步：运行在线打包
1. 进入仓库页面，点顶部 **Actions** 标签。
2. 左侧找到工作流 **Build Windows Portable EXE**，点它。
3. 点右侧 **Run workflow**（运行工作流）按钮，再点绿色 **Run workflow** 确认。
   > 首次使用若提示 "Enable workflow"，点 **I understand my workflows, go ahead and enable them** 启用即可。

### 第 5 步：等待并下载 exe
1. 页面会显示一个正在转圈的黄色圆点（进行中），整个流程约 **5~10 分钟**。
2. 等它变成 **绿色 ✓**，说明打包成功。
3. 点进去，拉到页面底部 **Artifacts**（产物）区，找到 **壮族文化数字资源库-便携版**，点它下载。
4. 下载得到的是一个 `.zip`，解压后里面的 `壮族文化数字资源库-v1.0.0-便携版.exe` 就是成品。

### 第 6 步：双击运行
把 exe 拷到任意 Windows 电脑，**双击直接运行**，无需安装、无需 Node、无需联网。

---

## 四、（可选）本地打包教程

如果你的电脑**已经装了 Node.js**，也可以本地一键打包：

```bash
# 1. 安装依赖（国内可加镜像）
npm install --registry=https://registry.npmmirror.com

# 2. 构建前端 + 打包单文件便携 exe
npm run build:win
```

完成后 exe 在 `release/` 目录下。

> 本地打包如果卡在下载 Electron/打包工具二进制，设置镜像环境变量：
> ```bash
> set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
> set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
> ```

### 本地开发预览
```bash
npm install
npm run dev            # 仅浏览器预览前端
npm run dev:electron   # Electron 窗口预览（需 Node）
```

---

## 五、常见问题（FAQ）

**Q1：为什么是「便携版 portable」而不是安装版？**
`electron-builder` 的 `portable` 目标会把整个运行时打成一个 `.exe`，双击即用、不需要安装、用户电脑无需 Node，完全符合需求。

**Q2：exe 很大正常吗？**
正常。Electron 自带 Chromium + Node 运行时，单文件 exe 通常 100~200 MB，这是「自带依赖」的代价。

**Q3：Actions 一直转圈或失败？**
- 进入失败的那次运行，点开红色 ✗ 查看日志。
- 多数是下载 electron/打包工具超时，重跑一次通常能好（已配国内镜像加速）。

**Q4：想改应用图标？**
在项目根目录新建 `build/` 文件夹，放入 `icon.ico`（256×256），打包时会自动使用。

**Q5：想改标题、版本号？**
改 `package.json` 里的 `productName` 和 `version`，以及 `electron-builder.yml` 里的 `productName`。

**Q6：数据是真是假？**
全是 `src/data/mock.js` 里的模拟数据，所有按钮点击都是前端弹窗反馈，不联网、无后端。
