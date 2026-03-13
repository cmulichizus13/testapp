import { Button } from 'antd'
import styles from './TestAppMenu.module.css'
import { Link } from 'react-router-dom';

const TestAppMenu: React.FC = () => {
    return (
        <div className={styles.container}>
            <h2>🚀クソアプリ置き場🚀</h2>
            <p>一応、Reactで書いています</p>
            <div className={styles.buttonGroup}>
                <Link to="/warikan">
                    <Button type="primary">割勘アプリ</Button>
                </Link>
                {/* chatbotブランチでは有効にする */}
                <Link to="/chatbot">
                    <Button type="primary">チャットボット</Button>
                </Link>
                <Link to="/quiz">
                    <Button type="primary">クイズアプリ</Button>
                </Link>
                <Link to="/unchi">
                    <Button type="primary">ツールアプリ</Button>
                </Link>
            </div>
        </div>
    )
}

export default TestAppMenu