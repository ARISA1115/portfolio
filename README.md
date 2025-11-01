# Portfolio Site

個人ポートフォリオサイト。<br>レスポンシブデザインに対応し、プロジェクト実績や技術記事、スキルセットを効果的に紹介します。

## 技術スタック

<p align="left" style="display: flex; align-items: center; gap: 8px;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" height="42" alt="Next.js Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="42" alt="React Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="42" alt="TypeScript Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" height="40" alt="Tailwind CSS Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-plain.svg" height="40" alt="Chart.js Logo" style="vertical-align: middle;" />
</p>

| Framework | Language   | Styling              | Visualization | External API      |
|-----------|------------|----------------------|---------------|-------------------|
| Next.js 15 | TypeScript | Tailwind CSS + PostCSS | Chart.js      | Qiita / Zenn (予定) |

## 概要

技術力とプロジェクト実績を視覚的に伝えるポートフォリオサイトです。<br>レスポンシブ対応により、デスクトップからモバイルまで最適な閲覧体験を提供します。

### 主要機能

- レスポンシブナビゲーション（ハンバーガーメニュー → 右側スライドメニュー）
- プロジェクト一覧とモーダル詳細表示（レスポンシブグリッドレイアウト）
- スキルセットのレーダーチャート可視化
- 技術記事の一覧・フィルタリング・検索
- 背景アニメーション（星とジオメトリック要素）

## セットアップ

### 必要な環境

- Node.js 20.x 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/ARISA1115/portfolio.git
cd portfolio

# 依存パッケージをインストール
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで`http://localhost:3000` にアクセスし、アプリが正常に動作することを確認してください。

### ビルド

```bash
npm run build
npm run start
```

### Lintチェック

```bash
npm run lint
```

## ディレクトリ構成

```
portfolio/
├── public/
│   └── images/              # プロジェクト画像・アイコン
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # 全体レイアウト
│   │   ├── page.tsx         # ホームページ
│   │   ├── profile/         # プロフィールページ
│   │   ├── projects/        # プロジェクト一覧ページ
│   │   └── articles/        # 記事一覧ページ
│   ├── components/
│   │   ├── Navigation.tsx           # トップナビゲーション
│   │   ├── MobileSideMenu.tsx       # モバイルサイドメニュー
│   │   ├── GlobalMobileOverlay.tsx  # 全画面オーバーレイ
│   │   ├── ProjectDetailCard.tsx    # プロジェクト詳細カード
│   │   ├── charts/
│   │   │   └── SkillRadarChart.tsx  # スキルレーダーチャート
│   │   ├── common/
│   │   │   ├── ConditionalScrollButton.tsx
│   │   │   └── ModalPortal.tsx
│   │   ├── icons/
│   │   │   └── Xicon.tsx
│   │   └── ui/
│   │       ├── Footer.tsx
│   │       ├── Pagination.tsx
│   │       ├── ScrollToggleButton.tsx
│   │       ├── Slideshow.tsx        # 画像スライドショー
│   │       └── StarField.tsx        # 背景アニメーション
│   ├── data/
│   │   ├── articles.ts      # 記事データ
│   │   ├── projects.ts      # プロジェクトデータ
│   │   └── skills.ts        # スキルデータ
│   ├── types/
│   │   └── index.ts         # 型定義
│   └── utils/
│       └── getTagColor.ts   # タグ色ユーティリティ
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.cjs
├── tailwind.config.ts
└── tsconfig.json
```

## コーディング設計のポイント

### コンポーネント設計

- 責務の明確な分離（Navigation / MobileSideMenu / GlobalOverlay）
- Props駆動の再利用可能なコンポーネント
- イベント駆動の状態管理（カスタムイベント + bodyクラス）

### レスポンシブ対応

- モバイルファースト設計
- Tailwindのブレークポイント活用（sm / md / lg）
- 条件付きレンダリングによる最適なUI切り替え

### z-index階層管理

```
z-9999: MobileSideMenu（最前面）
z-9998: Navigation内の操作要素（ロゴ・ボタン）
z-9997: GlobalMobileOverlay（全画面オーバーレイ）
z-[9996]: Navigation背景
z-10: メインコンテンツ
z-負: 背景要素（StarField）
```

### パフォーマンス最適化

- Next.js Imageコンポーネントで画像最適化
- `object-contain`で画像アスペクト比保持
- 動的インポートとコード分割（モーダル等）

### 型安全性

- TypeScriptによる厳密な型定義
- propsとstateの型チェック
- カスタムイベントの型安全な管理

## 開発方針・設計思想

### ユーザー体験優先

- 直感的なナビゲーション
- スムーズなアニメーション（300ms transition）
- 視認性の高いUIデザイン

### 保守性重視

- コンポーネントの単一責任原則
- データとUIの分離（data/ ディレクトリ）
- 一貫したコーディングスタイル

### デザイン統一

- 背景色の完全統一（bg-slate-900）
- 境界線の太さと色の統一（2px solid rgba(59, 130, 246, 0.4)）
- グラデーション効果の一貫性

### アクセシビリティ

- Escapeキーでのメニュー・モーダルクローズ
- aria-label属性の適切な使用
- キーボード操作対応

## 今後の拡張予定

### 機能追加

- Qiita API とZenn (RSS) から記事を自動取得する
- お問い合わせフォーム

### パフォーマンス改善

- 画像の遅延読み込み（Lazy Loading）
- Service Workerによるオフライン対応
- リソースのキャッシュ戦略最適化

### SEO最適化

- メタタグの動的生成
- サイトマップの自動生成
- 構造化データの実装

### テスト・品質向上

- ユニットテストの導入（Jest / Testing Library）
- E2Eテストの導入（Playwright）
- CI/CDパイプラインの構築

## ライセンス

This project is private and not licensed for public use.
