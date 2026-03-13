import { Button, Input, Card, Modal } from 'antd'
import { AndroidOutlined, HomeOutlined } from '@ant-design/icons'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });
const QUIZ_BASE_PROMPT = "# 命令\nあなたはクイズのヒントを出すエンジンです。以下の制約に従って、ユーザーが入力した質問に対する回答を数字のみで出力してください。\n {quiz_prompt}\n# 制約\n- 回答は、以下の**必ず回答定義に対応する数字のみを出力して下さい。**- 答えは○○ですか。など直接答えが判明するような質問に対しては、6(わからない)を出力してください。\n# 回答定義\n1. そう\n2. たぶん部分的にそう\n3. どちらでもない\n4. 多分違う、そうでもない\n5. いいえ\n6. わからない\n# ユーザー入力\n{content}"

interface responseList {
    id: number;
    description: string;
}

const responseList: responseList[] = [
    {
        id: 0,
        description: "早く質問すればいいのに．．．"
    },
    {
        id: 1,
        description: "はい"
    },
    {
        id: 2,
        description: "たぶん部分的にそう"
    },
    {
        id: 3,
        description: "どちらでもない"
    },
    {
        id: 4,
        description: "多分違う、そうでもない"
    },
    {
        id: 5,
        description: "いいえ"
    },
    {
        id: 6,
        description: "わからない"
    },
    {
        id: 7,
        description: "考え中です..."
    }
]

interface QuizQuestion {
    id: number;
    prompt: string;  // AIに渡す説明/質問
    correctAnswer: string[];  // 正解
}

interface ChatHistory {
    question: string;
    response: string;
}

// 問題IDから環境変数を取得してクイズデータを構築
const getQuizData = (id: number): QuizQuestion => {
    const prompt = import.meta.env[`VITE_QUIZ_PROMPT_${id}`] || '';
    const answers = import.meta.env[`VITE_QUIZ_ANSWER_${id}`] || '';

    return {
        id,
        prompt,
        correctAnswer: answers.split(',').map((a: string) => a.trim())
    };
};


const QuizApp: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const quizId = parseInt(id || "1", 10);
    const currentQuiz = getQuizData(quizId);

    const [responseString, setResponseString] = React.useState<string>("0");
    const [inputString, setInputString] = React.useState<string>("");
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [answerInput, setAnswerInput] = React.useState<string>("");
    const [answerResult, setAnswerResult] = React.useState<string>("");
    const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([]);

    // responseStringが更新されたときに履歴を更新
    React.useEffect(() => {
        if (responseString !== "0" && responseString !== "7" && chatHistory.length > 0) {
            const updatedHistory = [...chatHistory];
            updatedHistory[updatedHistory.length - 1].response = responseList.find((r) => r.id === parseInt(responseString))?.description || responseString;
            setChatHistory(updatedHistory);
        }
    }, [responseString]);

    const createResponse = async (str: string) => {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: str,
        });
        const responseText = response.text || "AIからの回答がありませんでした。";
        setResponseString(responseText);
    }

    const onSubmit = () => {
        // 回答を待っている間は「考え中です...」を表示
        setResponseString("7");
        // ユーザーの質問とクイズのプロンプトを組み合わせてAIに渡す
        const promptToSend = QUIZ_BASE_PROMPT.replace("{quiz_prompt}", currentQuiz?.prompt || "").replace("{content}", inputString);
        createResponse(promptToSend);
        // 履歴に追加（AIの回答を得た後に追加されるので、ここでは質問のみ記録）
        setChatHistory([...chatHistory, { question: inputString, response: "考え中です..." }]);
        setInputString("");
    }

    const handleAnswerSubmit = () => {
        // 入力値と正解を比較
        const isCorrect = currentQuiz.correctAnswer.some(
            answer => answer.toLowerCase() === answerInput.toLowerCase()
        );

        if (isCorrect) {
            setAnswerResult("✓ 正解です！");
        } else {
            setAnswerResult("✗ 不正解です。");
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setAnswerInput("");
        setAnswerResult("");
    }

    if (!currentQuiz.prompt) {
        return (
            <div>
                <Link to="/">
                    <Button icon={<HomeOutlined />}>ホームに戻る</Button>
                </Link>
                <Card style={{ width: '100%', marginBottom: '20px' }}>
                    <p>クイズが見つかりません。環境変数を確認してください。</p>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <Link to="/">
                <Button icon={<HomeOutlined />}>ホームに戻る</Button>
            </Link>
            <Link to="/quiz">
                <Button type="primary">クイズメニューに戻る</Button>
            </Link>
            <p style={{ marginTop: '20px', marginBottom: '20px' }}>これは、逆ア〇ネータークイズです。
                なんだろう...はいかいいえで答えられる質問投げてもらってもいいっすか？正解がわかったら、「回答する」ボタンから回答してください！</p>
            
            {/* メインコンテンツと履歴パネルの親コンテナ */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', height: 'calc(100vh - 250px)' }}>
                {/* 左側：メインコンテンツ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Card style={{ width: '100%', marginBottom: '20px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <AndroidOutlined style={{ fontSize: '100px', marginTop: '2px', flexShrink: 0 }} />
                            <div style={{
                                padding: '12px 14px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '12px',
                                position: 'relative',
                                flex: 1,
                                marginTop: '2px',
                            }}>
                                <div style={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: '10px solid transparent',
                                    borderRight: 0,
                                    borderTop: '10px solid #f0f0f0',
                                    position: 'absolute',
                                    left: '-10px',
                                    top: '8px',
                                }}></div>
                                <p style={{ margin: 0 , fontSize: '24px', fontWeight: 'bold' }}>
                                    {responseList.find((r) => r.id === parseInt(responseString))?.description || "生成AIの回答が想定外です。"}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card style={{ width: '100%', marginBottom: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <p style={{ marginBottom: '12px' }}>質問を送信して、答えにたどり着きましょう！</p>
                        <Input 
                            placeholder="質問を入力してください。" 
                            value={inputString} 
                            onChange={(e) => {
                                setInputString(e.target.value)
                            }}
                            onPressEnter={onSubmit}
                            style={{ marginBottom: '12px' }}
                        />
                        <Button disabled={inputString === ""} onClick={onSubmit} style={{ marginBottom: '12px' }}>質問する</Button>
                    </Card>
                    <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ width: '100%', height: '44px', fontSize: '16px', flexShrink: 0 }}>回答する</Button>
                </div>

                {/* 右側：質問・回答履歴パネル */}
                <div style={{ width: '300px', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Card 
                        title="質問・回答履歴" 
                        bodyStyle={{
                            padding: '12px',
                            flex: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
                    >
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            paddingRight: '8px'
                        }}>
                            {chatHistory.length === 0 ? (
                                <p style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>まだ履歴がありません</p>
                            ) : (
                                <div>
                                    {chatHistory.map((item, index) => (
                                        <div key={index} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
                                            <p style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px', color: '#666' }}>Q. {index + 1}</p>
                                            <p style={{ fontSize: '12px', marginBottom: '8px', wordBreak: 'break-word' }}>{item.question}</p>
                                            <p style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px', color: '#666' }}>A.</p>
                                            <p style={{ fontSize: '12px', color: '#1890ff', wordBreak: 'break-word' }}>{item.response}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                title="答えを入力してください"
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                centered
            >
                <div style={{ marginBottom: '20px' }}>
                    <Input
                        placeholder="答えを入力"
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        onPressEnter={handleAnswerSubmit}
                    />
                </div>
                <div style={{ marginBottom: '20px', minHeight: '30px', textAlign: 'center' }}>
                    {answerResult && (
                        <p style={{
                            fontWeight: 'bold',
                            color: answerResult.startsWith('✓') ? '#52c41a' : '#ff4d4f'
                        }}>
                            {answerResult}
                        </p>
                    )}
                </div>
                {!answerResult ? (
                    <Button
                        type="primary"
                        onClick={handleAnswerSubmit}
                        disabled={answerInput === ""}
                        style={{ width: '100%' }}
                    >
                        回答
                    </Button>
                ) : answerResult.startsWith('✓') ? (
                    <Link to="/quiz">
                        <Button type="primary" style={{ width: '100%' }}>クイズメニューに戻る</Button>
                    </Link>
                ) : (
                    <Button
                        onClick={() => {
                            setAnswerInput("");
                            setAnswerResult("");
                        }}
                        style={{ width: '100%' }}
                    >
                        もう一度答える
                    </Button>
                )}
            </Modal>
        </div>
    )
}

export default QuizApp