import { Project } from '../types';

export const projects: Project[] = [
  {
    id: "personal-1",
    title: "Portfolio",
    description: "Next.jsとTypeScriptで構築した自己紹介用のポートフォリオサイトです。",
    points: [
      "役割ごとにUIを分離し再利用可能な構成を設計",
      "Chart.jsで3分野のスキルをレーダーチャートで可視化",
      "Framer Motionを使い、ページ遷移や要素の表示に対して動的な演出を実装",
    ],
    stacks: {
      frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      backend: [],
      infra: ["Vercel"],
    },
    tags: ["Next.js", "Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    category: "Personal",
    imageUrl: "/images/portfolio/main.png",
    imageUrls: [
      "/images/portfolio/main.png",
      "/images/portfolio/profile.png",
      "/images/portfolio/skills.png",
      "/images/portfolio/projects.png",
      "/images/portfolio/articles.png",
      "/images/portfolio/architecture.png",
    ],
    githubUrl: "https://github.com/ARISA1115/arisa-portfolio"
  },
  {
    id: "personal-2",
    title: "Cyber Academy",
    description: "セキュリティの知識をレベル別に学び、復習と分析で定着させる学習アプリです。",
    points: [
      "分野別キャラクターが学習状況に応じて応援メッセージや復習提案を表示",
      "レベル別演習と復習機能で、段階的にセキュリティ知識を習得 ",
      "学習履歴からスキルレーダーや分析レポートを生成し、得意・苦手分野を可視化",
    ],
    stacks: {
      frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      backend: ["Go", "Echo", "MySQL"],
      infra: ["Docker", "GitHub Actions", "AWS", "Terraform"],
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Go", "Echo", "MySQL", "Docker", "GitHub Actions", "AWS", "Terraform"],
    category: "Personal",
    imageUrl: "/images/cyber-academy/main.png",
    imageUrls: [
      "/images/cyber-academy/main.png",
      // "/images/cyber-academy/tutorial.png",
      "/images/cyber-academy/comminsoon.png",
    ],
    githubUrl: "https://github.com/ARISA1115/Cyber-Academy"
  },
  {
    id: "hackathon-1",
    title: "engine",
    description: "一緒に開発する仲間と出会えるアプリです。",
    points: [
      "チャット作成時にロールを指定してスキル別にメンバーを募集",
      "チーム単位のチャットを実装し役割ごとのやり取りを整理しやすく設計",
      "FlaskとMySQLで認証・募集・チャットを最小構成で統合",
    ],
    stacks: {
      frontend: ["HTML", "CSS", "JavaScript"],
      backend: ["Python", "Flask", "MySQL"],
      infra: ["Docker", "AWS"],
    },
    tags: ["HTML", "CSS", "JavaScript", "Python", "Django", "PostgreSQL", "Docker", "AWS"],
    category: "Hackathon",
    imageUrl: "/images/engine/main.png",
    imageUrls: [
      "/images/engine/main.png",
      "/images/engine/mypage.png",
    ],
    githubUrl: "https://github.com/ARISA1115/engine"
  },
  {
    id: "hackathon-2",
    title: "Fucabo",
    description: "生成AIを活用した専門用語の理解・比較に特化した学習支援アプリです。",
    points: [
      "主画面を維持しつつ補足質問ができる2画面構成",
      "ClaudeとGPTを切り替えて多角的な回答を比較可能に設計",
      "質問履歴をモデル別に保存・管理するAPIとDB構成を構築",
    ],
    stacks: {
      frontend: ["React", "Vite", "Tailwind CSS", "Material UI（MUI）"],
      backend: ["Python", "FastAPI", "MySQL"],
      infra: ["Docker", "AWS"],
    },
    tags: ["React", "Vite", "Tailwind CSS", "Material UI（MUI）", "Python", "FastAPI", "MySQL", "Docker", "AWS"],
    category: "Hackathon",
    imageUrl: "/images/Fucabo/main.png",
    imageUrls: [
      "/images/Fucabo/main.png",
      "/images/Fucabo/top.png",
      "/images/Fucabo/chat.png",
    ],    
    githubUrl: "https://github.com/ARISA1115/Fucabo"
  },
  {
    id: "hackathon-3",
    title: "efFEctive",
    description: "基本情報技術者試験の出題形式に対応した演習アプリです。",
    points: [
      "正答率に応じて問題難易度を自動調整",
      "カテゴリ別の実績に応じてバッジを自動付与",
      "全ユーザーのスコアをランキングで可視化",
    ],
    stacks: {
      frontend: ["HTML", "CSS", "JavaScript"],
      backend: ["Python", "Django", "PostgreSQL"],
      infra: ["Docker", "AWS"],
    },
    tags: ["HTML", "CSS", "JavaScript", "Python", "Django", "PostgreSQL", "Docker", "AWS"],
    category: "Hackathon",
    imageUrl: "/images/efFEctive/main.png",
    imageUrls: [
      "/images/efFEctive/main.png",
      "/images/efFEctive/top.png",
      "/images/efFEctive/mondai.png",
      "/images/efFEctive/answer.png",
      "/images/efFEctive/result.png",
      "/images/efFEctive/progress.png",
      "/images/efFEctive/ranking.png",
    ],    
    githubUrl: "https://github.com/ARISA1115/efFEctive"
  },
  {
    id: "hackathon-4",
    title: "さぶちゃん日記",
    description: "日々の気持ちを整理し、キャラクターの励ましで前向きになれる日記アプリです。",
    points: [
      "FastAPIで入力値を処理してAmazon Bedrock(Claude)に応答生成を依頼",
      "モードと日記内容に応じてがClaudeが返答を生成",
      "Claude への人格スタイル切替を実現するためのプロンプト設計",
    ],
    stacks: {
      frontend: ["Next.js", "TypeScript", "Tailwind CSS"],
      backend: ["Python", "FastAPI", "MySQL"],
      infra: ["Docker", "GitHub Actions", "AWS", "Terraform", "Datadog"],
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "MySQL", "Docker", "GitHub Actions", "AWS", "Terraform", "Datadog"],
    category: "Hackathon",
    imageUrl: "/images/sabuchan-diary/main.png",
    imageUrls: [
      "/images/sabuchan-diary/main.png",
      "/images/sabuchan-diary/top.png",
      "/images/sabuchan-diary/chat-sabuchan.png",
    ],
    githubUrl: "https://github.com/ARISA1115/sabuchan-diary"
  }
];