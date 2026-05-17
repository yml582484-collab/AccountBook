
# 记账本 - Account Book

[![React Native](https://img.shields.io/badge/React%20Native-0.71.x-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-54.0.0-black.svg)](https://expo.dev/)
[![EAS Build](https://img.shields.io/badge/EAS_Build-Verified-success.svg)](https://expo.dev/eas)
[![EAS Update](https://img.shields.io/badge/EAS_Update-Enabled-4630EB.svg)](https://expo.dev/eas)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一个基于 Apple 极简主义美学设计的、注重极致隐私的跨平台个人记账应用。项目基于 React Native + Expo 架构，已全面打通移动端现代工程化流水线。

本项目不仅实现了纯本地高性能数据存储，更深度集成了 **EAS (Expo Application Services) 云端多渠道 CI/CD 编译打包与 OTA 热更新架构**。目前已完美攻克双端真机底层渲染差异，具备完全独立交付原生 App 的商业级成熟度。

---

## 🚀 核心工程化亮点

### 1. 🌐 全链路 CI/CD 云端构建与多渠道分发
- **自动化编译**：引入 `EAS Build` 流水线，深度定制 `eas.json` 与 `app.json` 参数（明确锁定了合法的原生包名 `com.lym629.accountbook`）。利用云端虚拟机自动解耦、解析、编译与锻造原生 Android 产物，规避了本地配置重量级 Android Studio 的环境成本。
- **依赖冲突防御**：针对移动端生态常见的 Peer Dependencies 版本断层，工程层通过云端全局注入 `npm_config_legacy_peer_deps` 环境变量，强行平滑抹平依赖链版本冲突，确保构建高可用性。

### 2. ⚡️ 线上动态热更新（OTA 无感下发）
- **多通道解耦**：接入 `EAS Update` 机制。通过将 `preview` 打包外壳与生产环境更新通道（`production channel`）建立路由映射，达成**只需下发一次 `.apk` 外壳，后续所有 UI 迭代与业务更新无需重新下载安装包、应用冷启动秒级全网无感动态同步**的现代移动端运维能力。

### 3. 📱 像素级双端真机兼容性调优
深入重构渲染层，针对 iOS 与 Android 系统的物理底层差异进行了全方位的平滑像素级兼容适配：
- **安全区防裁剪 (SafeArea Fallback)**：彻底解决 iOS `SafeAreaView` 在 Android 平台失效的通病。通过 `Platform.OS` 硬件级嗅探，动态计算 Android 状态栏（`StatusBar.currentHeight`）绝对像素，防止顶部收支看板文字被刘海屏或前置摄像头挖孔硬性裁剪。
- **键盘遮挡自适应 (Keyboard Defend)**：针对双平台键盘弹起时全然相反的视口推挤逻辑，动态复写 `KeyboardAvoidingView` 的 `behavior` 属性（iOS 强制 `padding` 推挤 / Android 保持 `height` 动态形变），确保记账输入框与“保存”按钮永不被软键盘死死遮挡。

### 4. ⚡️ 极速响应架构 (Optimistic UI) & 隐私安全
- **状态管理**：底层采用 React Context 结合乐观更新（Optimistic Update）回滚机制，数据变更瞬间优先映射至视图层同步渲染，彻底消除由于系统 I/O 读写导致的按键卡顿与白屏。
- **数据管家**：100% 纯本地化 `AsyncStorage` 离线异步持久化存储，无任何第三方服务器收集用户资产隐私，离线状态下同样支持毫秒级启动与高频记账。

---

## 📱 功能特性

- **极简记账流**：支持收入/支出秒级记录，内置 11 种高频支出分类 + 7 种收入分类，UI 采用高质感低饱和度配色方案。
- **全局月度看板**：首页直观呈现本月总支出、总收入及纯结余情况，卡片式数据视觉层级设计。
- **多维流水检索**：一键按“全部 / 支出 / 收入”状态无缝切换过滤账单交易流水。
- **可视化消费洞察**：按月生成消费类别排行与占比动态进度条，支持长按滑动高阶手势快捷唤出删除菜单。

---

## 📦 真机下载体验与本地开发

### 方式一：独立原生 Android 端安装体验（推荐）
项目已完成线上构建，直接获取凝聚了全套底层优化的二进制安装包：
1. 从发布流水线产物中直接下载生成的 `AccountBook_v1.0.0.apk`（约 67.3 MB，纯本地轻量应用包）。
2. 在安卓设备中安装，若遇到系统未知来源提示，选择“信任并继续安装”即可。
3. **亮点体验**：安装此版本后，今后开发者再次迭代应用代码，您只需重启应用即可**自动、无感地连入云端拉取最新功能**。

### 方式二：本地开发指南

**前提条件：**
确保本地环境中已安装 [Node.js](https://nodejs.org/) (推荐 LTS v18+) 以及 [Git](https://git-scm.com/)。

**运行步骤：**
```bash
# 1. 克隆项目仓库
git clone [https://github.com/yml582484-collab/AccountBook.git](https://github.com/yml582484-collab/AccountBook.git)
cd AccountBook

# 2. 安装全部工程依赖
npm install

# 3. 唤醒 Expo 局域网本地开发服务器
npx expo start

```

*启动后，使用手机上的 Expo Go 客户端扫描终端打印出的二维码，即可进行实时热重载开发调试（无需连接海外服务器）。*

---

## 🛠️ 高阶云端工程化部署指令

若您在此基础上修改了源代码，作为项目所有者，您拥有以下两条极速部署主干命令的使用权：

### 1. 动态发布代码更新 (OTA)

当您仅仅修改了 TypeScript 业务代码、修正了样式 Bug，**无需重新打包分发新的文件**，只需闪击推送到热更新通道：

```powershell
eas update --branch production --message "完美修复了安全区与键盘遮挡问题"

```

### 2. 重新锻造原生独立 App 外壳 (.apk)

如果您更改了应用名称、替换了物理图片文件（如修改 `assets/icon.png` 桌面图标或启动图），此时必须通过云端重新烧录原生外壳：

```powershell
eas build --platform android --profile preview

```

---

## 📂 精简高效的项目结构

```text
AccountBook/
├── App.tsx                    # 应用中央入口：配置 Tab 全局原子路由导航
├── app.json                   # 核心配置文件：登记包名(package)、projectId 与 插件关联
├── eas.json                   # 线上运维配置文件：指定多渠道热更新通道(channel)与打包环境参数
├── assets/                    # 静态资源中心：存放经过严密 PNG 格式转换的自适应应用图标及启动页
├── src/
│   ├── constants/
│   │   └── categories.ts      # 静态枚举层：收支类别核心定义与 Lucide-react-native 图标映射
│   ├── data/
│   │   ├── storage.ts         # 数据存取层：封装 AsyncStorage 底层持久化异步读写逻辑
│   │   └── TransactionContext.tsx  # 全局状态管理层：接管核心账单状态与 Optimistic UI 数据流
│   ├── screens/
│   │   ├── HomeScreen.tsx     # 账单流水首页：融合了 Android 状态栏安全区动态适配
│   │   ├── AddTransactionScreen.tsx # 核心记账视口：运用 KeyboardAvoidingView 双端平滑防遮挡逻辑
│   │   ├── StatsScreen.tsx    # 财务数据报表页：按比例计算消费占比并生成高 aesthetic 可视化进度条
│   │   └── SettingsScreen.tsx # 系统设置视口：支持全局一键清空重置 AsyncStorage 本地冷缓存
│   ├── components/
│   │   ├── EmptyState.tsx     # 优雅缺省页：解决无账单记录时的视觉空洞感占位组件
│   │   └── FilterChip.tsx     # 动态筛选组件：解耦单选交互的高性能小而美 Chip
│   └── utils/
│       └── helpers.ts         # 公共核心工具：精准进行时间戳解析与人民币格式化

```

---

## 📄 开源协议

本项目基于 **[MIT](https://www.google.com/search?q=LICENSE)** 协议开源，你可以完全自由地使用、修改、分发该项目的核心业务代码。

## 👤 开发者

* **GitHub**: [@yml582484-collab](https://github.com/yml582484-collab)

---

*如果这个项目在工程化、云端热更新以及跨平台真机适配思路上对你有所启发，请为这个项目点亮一枚 ⭐️ Star 吧！*

***

```
