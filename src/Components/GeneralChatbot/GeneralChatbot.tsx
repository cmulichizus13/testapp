import { Button, Input, Card } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });


const GeneralChatbot: React.FC = () => {
    const [responseString, setResponseString] = React.useState<string>("");
    const [inputString, setInputString] = React.useState<string>("");

    const createResponse = async (str: string) => {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: str,
        });
        setResponseString(response.text || "AIからの回答がありませんでした。");
    }
    return (
        <div>
            <Link to="/">
                <Button icon={<HomeOutlined />}>ホームに戻る</Button>
            </Link>
            <Card title="AIチャットボット" style={{ width: '100%', marginBottom: '20px' }}>
                <p>AIに質問してみてください。</p>
                <Input placeholder="質問を入力してください。" onChange={(e) => {
                    setInputString(e.target.value)
                }} />
                <Button disabled={inputString === ""} onClick={() => createResponse(inputString)}>質問する</Button>
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <p>{responseString}</p>
                </div>
            </Card>
        </div>
    )
}

export default GeneralChatbot