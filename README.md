# 记账本 - Account Book

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-54.0.0-black.svg)](https://expo.dev/)
[![EAS Update](https://img.shields.io/badge/EAS_Update-Enabled-4630EB.svg)](https://expo.dev/eas)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一个极简、现代、且注重隐私的个人记账应用。基于 React Native + Expo 开发，完美支持 iOS 和 Android 双平台。

本项目已深度集成 **EAS (Expo Application Services) 云端热更新架构**，实现了代码秒级部署与无感更新，带来媲美原生 App 的极速体验。

## ✨ 核心工程亮点

- **☁️ 云端热更新 (EAS Update)**：告别繁琐的本地打包与局域网限制。代码一键推送到云端，手机端重启即无感拉取最新 UI 与业务逻辑。
- **⚡️ 极速响应架构 (Optimistic UI)**：底层状态管理采用乐观更新（Optimistic Update）机制，数据变更瞬间映射至视图层，彻底消除异步读写延迟。
- **🔒 绝对隐私安全**：100% 纯本地化 AsyncStorage 存储，无任何第三方服务器收集数据，你的财务隐私仅存在于你的设备中。

## 📱 功能特性

- **高效记账**：支持收入/支出记录，内置 11 种支出分类 + 7 种收入分类。
- **月度看板**：首页直观呈现本月总支出、总收入及结余情况。
- **灵活筛选**：一键按“全部 / 支出 / 收入”维度过滤交易流水。
- **图表统计**：按月生成消费排行与占比进度条，财务状况一目了然。
- **数据管家**：支持一键导出账单明细，或清空重置所有数据。
- **手势交互**：列表页支持长按唤出快捷删除菜单。

## 🚀 云端体验与本地开发

### 方式一：直接体验（无需配置本地环境）
由于项目已接入 EAS，你可以通过以下方式直接在手机上运行最新版：
1. 在手机上安装 [Expo Go](https://expo.dev/client) App。
2. 确保配置了对应项目的 `ProjectId` 和 `RuntimeVersion`，通过快捷指令或 DeepLink（`exp://u.expo.dev/...`）直接唤醒云端生产环境版本。

### 方式二：本地开发指南

**前提条件：**
安装 [Node.js](https://nodejs.org/)（推荐 v18+）与 [Git](https://git-scm.com/)。

**运行步骤：**
```bash
# 1. 克隆项目
git clone [https://github.com/yml582484-collab/AccountBook.git](https://github.com/yml582484-collab/AccountBook.git)
cd AccountBook

# 2. 安装依赖 (包含 expo-updates)
npm install

# 3. 启动开发服务器
npx expo start

```

*启动后，确保手机和电脑在同一个 WiFi 局域网下，使用 Expo Go 扫描终端二维码即可实时预览。*

## ☁️ EAS 云端部署指令

日常修改代码后，只需在终端执行以下命令，即可全网平滑热更新：

```bash
# 将最新代码推送到生产环境 (Production Channel)
eas update --branch production --message "更新说明，例如：修复了收支统计的Bug"

```

## 📂 项目结构

```text
AccountBook/
├── App.tsx                    # 应用入口 + 全局导航配置
├── app.json                   # Expo 核心配置 (含 EAS ID 与 RuntimeVersion)
├── src/
│   ├── constants/
│   │   └── categories.ts      # 静态枚举：收支分类与图标映射
│   ├── data/
│   │   ├── storage.ts         # 本地持久化层 (AsyncStorage 封装)
│   │   └── TransactionContext.tsx  # 状态管理层 (Optimistic Update 逻辑)
│   ├── screens/
│   │   ├── HomeScreen.tsx     # 账单流水页
│   │   ├── AddTransaction.tsx # 记一笔页
│   │   ├── StatsScreen.tsx    # 数据统计页
│   │   └── SettingsScreen.tsx # 系统设置页
│   ├── components/
│   │   ├── EmptyState.tsx     # 缺省页占位组件
│   │   └── FilterChip.tsx     # 筛选标签组件
│   └── utils/
│       └── helpers.ts         # 公共工具函数 (日期格式化等)

```

## 📋 分类清单

### 支出分类（11种）

| 图标 | 名称 | 颜色代码 | 图标 | 名称 | 颜色代码 |
| --- | --- | --- | --- | --- | --- |
| 🍔 | 餐饮 | `#FF6B6B` | 📚 | 教育 | `#98D8C8` |
| 🚗 | 交通 | `#4ECDC4` | 👔 | 服饰 | `#F7DC6F` |
| 🛍️ | 购物 | `#45B7D1` | 📱 | 通讯 | `#BB8FCE` |
| 🎮 | 娱乐 | `#96CEB4` | 🧴 | 日用品 | `#85C1E9` |
| 🏠 | 住房 | `#FFEAA7` | 📦 | 其他 | `#BDC3C7` |
| 💊 | 医疗 | `#DDA0DD` |  |  |  |

### 收入分类（7种）

| 图标 | 名称 | 颜色代码 | 图标 | 名称 | 颜色代码 |
| --- | --- | --- | --- | --- | --- |
| 💰 | 工资 | `#27AE60` | 🏆 | 兼职 | `#9B59B6` |
| 💵 | 奖金 | `#F39C12` | 🔄 | 退款 | `#1ABC9C` |
| 💹 | 理财 | `#3498DB` | 📦 | 其他 | `#95A5A6` |
| 🎁 | 礼金 | `#E74C3C` |  |  |  |

## 🔨 构建独立的原生 App (.apk / .ipa)

如果想脱离 Expo Go 运行独立的 App 安装包，请使用 EAS Build 进行云端打包：

```bash
# 全局安装 EAS CLI
npm install -g eas-cli

# 登录你的 Expo 账号
eas login

# 执行云端构建
eas build --platform ios      # 构建 iOS 安装包
eas build --platform android  # 构建 Android 安装包

```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的代码 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送至云端 (`git push origin feature/AmazingFeature`)
5. 发起 Pull Request

## 📄 开源协议

本项目基于 [MIT](https://www.google.com/search?q=LICENSE) 协议开源，你可以自由地使用、修改和分发。

## 👤 开发者

* GitHub: [@yml582484-collab](https://github.com/yml582484-collab)

---

*If this project helps you, please give it a ⭐️ Star!*

```

```
