# 🇵🇭 Cebu IT Park カフェ検索アプリ

[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.x-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

**デジタルノマド・英語学習者・リモートワーカー向けの、セブIT Park カフェ情報検索アプリ**

---

## 📱 サイトの特徴

### 🎯 何ができるのか

セブシティのIT Park周辺にある**200+ のカフェ**から、あなたの目的にぴったりなカフェを見つけられます。

```
🔍 検索 → 📍 マップで確認 → 💬 レビューを読む → ✨ お気に入り保存
```

### 💡 こんな人のためのアプリ

- 📍 「WiFiが強いカフェ、どこにあるの？」
- 🔌 「充電できるカフェを探してる」
- 🌙 「深夜まで作業できるカフェが欲しい」
- 👥 「友達と集まれるカフェを知りたい」
- 🏪 「新しいカフェを探索したい」

### 🎨 ダークテーマ・高級感あるデザイン

- 🌙 ダークガラスモーフィズムデザイン
- ⚡ サクサク動く高速UI
- 📱 スマホ・タブレット・PCに完全対応

---

## ✨ 主な機能

| 機能 | 説明 |
|-----|------|
| 🔍 **スマート検索** | カフェ名・キーワードで即座に検索 |
| 🗺 **対話的マップ** | Leaflet + CartoDB の高精度地図 |
| 📶 **WiFiスペック** | EXCELLENT / GOOD / AVERAGE で明確表示 |
| 🔌 **電源状況** | YES / LIMITED / NO で一目瞭然 |
| 🕐 **営業時間** | 24時間営業対応、現在営業中かを自動判定 |
| 💬 **ユーザーレビュー** | 実際のユーザーからのリアルな評価 |
| ♡ **お気に入り機能** | 登録不要で保存可能 |
| ☕ **カフェ診断** | 3問の質問で最適なカフェを提案 |
| 📸 **写真アップロード** | 実際の雰囲気を共有可能 |
| 🌙 / ☀️ **テーマ切り替え** | ダーク・ライトモード対応 |

---

## 🚀 クイックスタート

### 📋 必要な環境

```
- PHP 8.3+
- Node.js 18+
- npm 9+
- Composer
```

### ⚡ 5分でスタート

```bash
# 1. クローン
git clone https://github.com/your-username/cafe-finder.git
cd cafe-finder

# 2. セットアップ実行（すべて自動）
composer run setup

# 3. 開発サーバー起動
composer run dev

# 4. ブラウザで開く
open http://127.0.0.1:8000
```

---

## 📖 ドキュメント

詳細な説明書は以下のファイルを参照：

- 📘 **[GUIDE.md](./GUIDE.md)** - 完全な使い方・セットアップガイド
  - ユーザー向け操作ガイド
  - 管理者向け操作ガイド
  - 開発者向けセットアップ
  - トラブルシューティング

---

## 🛠 技術構成

```
Frontend
├── React 19.x
├── Tailwind CSS 4.x
├── Vite 8.x
└── Leaflet + react-leaflet

Backend
├── Laravel 13.x
├── SQLite
└── PHP 8.3+

Deployment
└── Vercel (Serverless)
```

---

## 🌐 デプロイ

### Vercel へのデプロイ（推奨）

```bash
# 1. GitHub にプッシュ
git push origin main

# 2. Vercel にインポート
# vercel.com → Import Project → GitHub リポジトリ選択

# 3. 自動デプロイ完了
```

詳細は [GUIDE.md のデプロイメントセクション](./GUIDE.md#デプロイメント) を参照。

---

## 📊 スクリーンショット

### 🏠 ホーム画面
```
[カフェ一覧 / マップ表示]
上部：検索バー + フィルター
```

### ☕ 詳細ページ
```
[カフェ情報]
📍 地図 + コンセント + WiFi 情報
📸 写真ギャラリー
💬 レビュー一覧
```

### 👨‍💼 管理画面
```
[ダッシュボード]
📊 統計情報
☕ カフェ管理
💬 レビュー管理
```

---

## 🔐 セキュリティ機能

✅ **API キーなし**：Leaflet + OpenStreetMap で実装（無料・安全）  
✅ **CSRF 保護**：Laravel セッションベース認証  
✅ **ファイル検証**：MIME タイプ・サイズチェック  
✅ **XSS 対策**：React の自動エスケープ  
✅ **SQLインジェクション対策**：ORM で完全保護  

---

## 📚 データベーススキーマ

```sql
users          → ユーザー情報
cafes          → カフェ情報（名前、営業時間、WiFi、電源など）
reviews        → レビュー（評価、コメント）
cache, jobs    → Laravel インフラ
```

---

## 🆘 よくある質問

**Q: 何もインストールせず、すぐに使いたい**  
A: オンライン版を用意予定です。ご連絡ください。

**Q: iPhoneで使える？**  
A: ✅ 完全対応。PWA対応予定。

**Q: 自分のカフェを追加したい**  
A: 管理者にお問い合わせください（審査あり）。

**Q: レビューを削除したい**  
A: 「レビュー」→「削除」で可能。

---

## 🤝 貢献

改善提案・バグ報告：

```
1. Issue を作成
2. フォークして修正
3. Pull Request を送信
```

---

## 📝 ライセンス

MIT License

---

## 📞 お問い合わせ

- 🐛 バグ報告：GitHub Issues
- 💡 提案：GitHub Discussions
- ✉️ その他：(contact info)

---

**VOL.08 / FINAL EDITION · Cebu IT Park 🇵🇭 · 2026**
