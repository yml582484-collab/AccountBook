# 记账本 - Account Book

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一個簡潔好用的個人記賬應用，使用 React Native + Expo 開發，支持 iOS 和 Android 平台。

## 📱 功能特性

- **记账**：支持收入/支出記錄，11種支出分類 + 7種收入分類
- **月度概覽**：首頁顯示本月支出、收入、結餘
- **篩選**：按全部/支出/收入篩選交易記錄
- **統計**：按月查看各分類消費排行和佔比
- **數據管理**：支持導出數據、清除數據
- **本地存儲**：所有數據保存在手機本地，安全可靠
- **長按刪除**：長按交易記錄可刪除

## 🚀 快速開始

### 前提條件

1. 安裝 [Node.js](https://nodejs.org/)（推薦 v18+）
2. 安裝 [Expo Go](https://expo.dev/client) App 在手機上

### 安裝步驟

```bash
# 克隆項目
git clone https://github.com/yourusername/account-book.git
cd account-book

# 安裝依賴
npm install

# 啟動開發服務器
npx expo start
```

### 在手機上運行

1. 確保手機和電腦在同一個 WiFi 網絡下
2. 打開手機上的 Expo Go App
3. 掃描終端顯示的二維碼
4. 等待加載完成即可使用！

## 📂 項目結構

```
AccountBook/
├── App.tsx                    # 應用入口 + 導航配置
├── index.js                   # Expo 註冊入口
├── app.json                   # Expo 配置
├── package.json               # 依賴管理
├── tsconfig.json              # TypeScript 配置
├── src/
│   ├── constants/
│   │   └── categories.ts      # 分類定義（支出11類 + 收入7類）
│   ├── data/
│   │   ├── storage.ts         # 本地數據存儲 (AsyncStorage)
│   │   └── TransactionContext.tsx  # 全局狀態管理
│   ├── screens/
│   │   ├── HomeScreen.tsx     # 賬單列表頁
│   │   ├── AddTransactionScreen.tsx  # 添加記錄頁
│   │   ├── StatsScreen.tsx    # 統計頁
│   │   └── SettingsScreen.tsx # 設置頁
│   ├── components/
│   │   ├── EmptyState.tsx     # 空狀態組件
│   │   └── FilterChip.tsx     # 篩選標簽組件
│   └── utils/
│       └── helpers.ts         # 工具函數
```

## 🎨 界面預覽

### 賬單頁（首頁）
- 頂部：本月支出/收入/結餘概覽
- 中間：全部/支出/收入篩選
- 列表：按日期分組的交易記錄
- 右下角藍色 + 按鈕：添加新記錄

### 添加記錄頁
- 切換收入/支出類型
- 輸入金額
- 選擇分類（圖標網格）
- 添加備註（選填）
- 選擇日期

### 統計頁
- 左右切換月份
- 支出/收入分類排行
- 每個分類的金額和百分比進度條

### 設置頁
- 導出數據
- 清除所有數據
- 查看版本和記錄數

## 🛠 技術棧

- **框架**：React Native 0.81.5
- **開發平台**：Expo SDK 54
- **語言**：TypeScript 5.9
- **導航**：@react-navigation/native v7
- **存儲**：@react-native-async-storage/async-storage
- **日期處理**：date-fns
- **圖標**：系統表情符號

## 📋 分類列表

### 支出分類（11種）
| 圖標 | 名稱 | 顔色 |
|:---:|:---:|:---:|
| 🍔 | 餐飲 | #FF6B6B |
| 🚗 | 交通 | #4ECDC4 |
| 🛍️ | 購物 | #45B7D1 |
| 🎮 | 娛樂 | #96CEB4 |
| 🏠 | 住房 | #FFEAA7 |
| 💊 | 醫療 | #DDA0DD |
| 📚 | 教育 | #98D8C8 |
| 👔 | 服飾 | #F7DC6F |
| 📱 | 通訊 | #BB8FCE |
| 🧴 | 日用品 | #85C1E9 |
| 📦 | 其他 | #BDC3C7 |

### 收入分類（7種）
| 圖標 | 名稱 | 顔色 |
|:---:|:---:|:---:|
| 💰 | 工資 | #27AE60 |
| 💵 | 獎金 | #F39C12 |
| 💹 | 理財 | #3498DB |
| 🎁 | 禮金 | #E74C3C |
| 🏆 | 兼職 | #9B59B6 |
| 🔄 | 退款 | #1ABC9C |
| 📦 | 其他 | #95A5A6 |

## ⚠️ 注意事項

- **同一 WiFi**：電腦和手機必須在同一個局域網下
- **Expo Go**：需要保持 Expo Go App 在前台運行
- **數據安全**：數據存儲在手機本地，卸載 Expo Go 會丟失數據
- **獨立 App**：如需獨立 App（不依賴 Expo Go），需要使用 `eas build` 構建

## 🔨 構建獨立 App

### 使用 EAS Build

```bash
# 安裝 EAS CLI
npm install -g eas-cli

# 登錄 Expo 賬號
eas login

# 配置構建
eas build:configure

# 構建 iOS App
eas build --platform ios

# 構建 Android App
eas build --platform android
```

## 🤝 貢獻指南

1. Fork 本倉庫
2. 創建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改變 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打開一個 Pull Request

## 📄 開源協議

本項目採用 [MIT](LICENSE) 協議開源。

## 👤 作者

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 致謝

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)

---

如果覺得這個項目對你有幫助，請給個 ⭐️ Star 支持一下！
