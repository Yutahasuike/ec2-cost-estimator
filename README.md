# EC2 Cost Estimator (Amplify Gen 2 + Vite + React + TypeScript)

日本語UIの EC2 コスト見積もりアプリです。Amplify Gen 2 の「コードファースト」構成で、
`amplify/` 配下にバックエンド（API Gateway + Lambda）を定義しています。

## 使い方（GitHub → Amplify Hosting）
1. このテンプレートの内容をリポジトリに追加して commit/push。
2. AWS コンソール → Amplify → Host web app → GitHub 連携で対象リポジトリ/ブランチを選択。
3. 自動ビルド＆デプロイが走り、公開URLが発行されます。
   - バックエンド（Lambda / API）は Amplify が `amplify/` を読み取ってプロビジョニングします。
   - `amplify_outputs.json` が生成され、フロントエンドが API エンドポイントを自動参照します。

### ローカル開発について
- `npm i` → `npm run dev` でフロントは起動しますが、`amplify_outputs.json` が無いため API は未接続です。
  （Amplify Hosting へデプロイすると自動生成され、接続されます）

### フォルダ構成
```
amplify/
  backend.ts                # API ルーティング定義（/ec2cost → Lambda）
  functions/cost-api/
    handler.ts              # コスト計算 + 為替（USD→JPY）
    resource.ts             # Lambda 定義
src/
  App.tsx                   # 日本語UI + API呼び出し（fetch）
  main.tsx
```

### 注意
- 価格表は簡易（ハードコード）です。必要に応じて AWS Price List API 連携等に拡張してください。
- CORS はデモ目的で `*` 許可にしています。本番はオリジンを絞ることを推奨します。
