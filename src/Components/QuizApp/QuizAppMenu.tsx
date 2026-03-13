import { Button, Modal } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import styles from './QuizAppMenu.module.css'
import { Link } from 'react-router-dom';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const QuizAppMenu: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const handleModalClose = () => {
        setIsModalOpen(false);
    }
    const text = `

## 概要
---
- クイズに挑戦するアプリです。全10問のクイズに挑戦できます。
- ユーザーは簡単な質問を送信でき、AIがそれに対し、**はい、たぶん部分的にそう、どちらでもない、たぶん違う、いいえの5段階**で回答します。
- ユーザーはAIの回答をもとに、正解を推測していきます。

## 操作方法
---
1. 問題を選択してください。クイズ画面に遷移します。
2. 「質問を入力してください。」のテキストボックスに質問を入力し、送信してください。
3. 回答を確認し、分からなければ更に質問をしてください。
4. 正解が分かったら、「回答する」ボタンを押します。
5. 回答を入力し、回答ボタンを押してください。
6. 正解/不正解が表示されます。不正解の場合は再度回答でき、×ボタン押下でクイズ画面に戻ることができます。
## 複数人で遊ぶ場合のルール(例)
---
- 回答者は順番に、AIに対する質問をすることができます。**全員が3回ずつ質問した時点で、それ以上の質問は無効**となります。
- 正解が分かったら申告し、その場で回答することができます。**回答権は一人につき2回です。**
- 最も早く正解した人の勝利となります。
## 免責事項
---
- AIの回答はあくまで推測であり、必ずしも正確な情報を提供するものではありません。**回答内容に関しては一切責任を負いかねます**ので、ご了承ください。
- 期待する回答が得られない場合、**あなたのプロンプトが原因です**。理不尽なクレームはGoogle GenAIのカスタマーサービスまでお願いします。
- クイズの問題文、正解等の内容は、**実際の人物、団体、地名などとは一切関係ありません**。
`;

    return (
        <div className={styles.container}>
            <Link to="/">
                <Button icon={<HomeOutlined />}>ホームに戻る</Button>
            </Link>
            <h2>クイズに挑戦しましょう！</h2>
            <p>問題を選択してください。</p>
            <div className={styles.buttonGroup}>
                <Button type="dashed" onClick={() => setIsModalOpen(true)} style={{ width: '100%', height: '44px', fontSize: '16px', flexShrink: 0 }}>あそびかた</Button>

                <Link to="/quiz/1">
                    <Button type="primary">問題1</Button>
                </Link>
                <Link to="/quiz/2">
                    <Button type="primary">問題2</Button>
                </Link>
                <Link to="/quiz/3">
                    <Button type="primary">問題3</Button>
                </Link>
                <Link to="/quiz/4">
                    <Button type="primary">問題4</Button>
                </Link>
                <Link to="/quiz/5">
                    <Button type="primary">問題5</Button>
                </Link>
                <Link to="/quiz/6">
                    <Button type="primary">問題6</Button>
                </Link>
                <Link to="/quiz/7">
                    <Button type="primary">問題7</Button>
                </Link>
                <Link to="/quiz/8">
                    <Button type="primary">問題8</Button>
                </Link>
                <Link to="/quiz/9">
                    <Button type="primary">問題9</Button>
                </Link>
                <Link to="/quiz/10">
                    <Button type="primary">問題10</Button>
                </Link>
            </div>
            <Modal
                title="💃あそびかた💃"
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                centered
                width={1000}
            >
                <ReactMarkdown>{text}</ReactMarkdown>
            </Modal>
        </div>
    )
}

export default QuizAppMenu