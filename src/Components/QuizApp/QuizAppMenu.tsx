import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import styles from './QuizAppMenu.module.css'
import { Link } from 'react-router-dom';

const QuizAppMenu: React.FC = () => {
    return (
        <div className={styles.container}>
            <Link to="/">
                <Button icon={<HomeOutlined />}>ホームに戻る</Button>
            </Link>
            <h2>クイズに挑戦しましょう！</h2>
            <p>問題を選択してください。</p>
            <div className={styles.buttonGroup}>
                <Link to="/quiz/1">
                    <Button type="primary">問題1</Button>
                </Link>
                <Link to="/quiz/2">
                    <Button type="primary">問題2</Button>
                </Link>
                <Link to="/quiz/3">
                    <Button type="primary">問題3</Button>
                </Link>
            </div>
        </div>
    )
}

export default QuizAppMenu