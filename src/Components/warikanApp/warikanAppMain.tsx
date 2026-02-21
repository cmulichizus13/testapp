import React, { useState } from 'react'
import { Button, Input, Form, Card } from 'antd'
import { HomeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './warikanAppMain.module.css'
import { Link } from 'react-router-dom'

// Constants
const BALANCE_THRESHOLD = 0.01
const INITIAL_USERS_COUNT = 3
const ANIMATION_DELAY = 50

// Types
interface UserData {
    name: string
    amount: number
}

interface UserBalance {
    name: string
    balance: number
}

interface SettlementResult {
    from: string
    to: string
    amount: number
}

interface FormData {
    users: UserData[]
}

// Utility Functions
const toHalfWidth = (str: string): string => {
    const trimmedStr = str.trim()
    return trimmedStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
}

const normalizeUsers = (users: UserData[]): UserData[] => {
    return users.map((user, index) => ({
        name: user.name?.trim() || `ユーザー${index + 1}`,
        amount: parseInt(String(user.amount ?? 0)) || 0
    }))
}

const calculateBalances = (users: UserData[]): UserBalance[] => {
    const totalAmount = users.reduce((sum, user) => sum + user.amount, 0)
    const averageAmount = totalAmount / users.length

    return users.map(user => ({
        name: user.name,
        balance: user.amount - averageAmount
    }))
}

const generateSettlements = (balances: UserBalance[]): SettlementResult[] => {
    const settlements: SettlementResult[] = []
    const payers = balances
        .filter(b => b.balance > BALANCE_THRESHOLD)
        .sort((a, b) => b.balance - a.balance)
    const receivers = balances
        .filter(b => b.balance < -BALANCE_THRESHOLD)
        .sort((a, b) => a.balance - b.balance)

    let payerIdx = 0
    let receiverIdx = 0

    while (payerIdx < payers.length && receiverIdx < receivers.length) {
        const payer = payers[payerIdx]
        const receiver = receivers[receiverIdx]

        const amount = Math.min(payer.balance, Math.abs(receiver.balance))
        settlements.push({
            from: receiver.name,
            to: payer.name,
            amount: Math.round(amount)
        })

        payer.balance -= amount
        receiver.balance += amount

        if (payer.balance < BALANCE_THRESHOLD) payerIdx++
        if (receiver.balance > -BALANCE_THRESHOLD) receiverIdx++
    }

    return settlements
}

// Component
const WarikanAppMain: React.FC = () => {
    const [form] = Form.useForm()
    const [results, setResults] = useState<SettlementResult[]>([])
    const [showResult, setShowResult] = useState(false)

    const handleCalculateSettlement = (data: FormData) => {
        const normalizedUsers = normalizeUsers(data.users)

        const totalAmount = normalizedUsers.reduce((sum, user) => sum + user.amount, 0)
        if (totalAmount === 0) {
            alert('0円を超える金額を入力してください')
            return
        }

        const balances = calculateBalances(normalizedUsers)
        const settlements = generateSettlements(balances)

        setShowResult(false)
        setTimeout(() => {
            setResults(settlements)
            setShowResult(true)
        }, ANIMATION_DELAY)
    }

    const createInitialValues = () => ({
        users: Array(INITIAL_USERS_COUNT)
            .fill(null)
            .map(() => ({ name: '', amount: '' }))
    })

    return (
        <div className={styles.container}>
            <Link to="/">
                <Button icon={<HomeOutlined />}>ホームに戻る</Button>
            </Link>
            <h2>割勘アプリ</h2>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCalculateSettlement}
                    initialValues={createInitialValues()}
                >
                    <Form.List name="users">
                        {(fields, { add, remove }) => (
                            <div>
                                {fields.map((field, index) => (
                                    <div key={field.key} className={styles.userRow}>
                                        <div className={styles.fieldColumn}>
                                            <div className={styles.fieldLabel}>
                                                {index === 0 && '名前'}
                                            </div>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'name']}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Input placeholder={`ユーザー${index + 1}`} />
                                            </Form.Item>
                                        </div>
                                        <div className={styles.fieldColumn}>
                                            <div className={styles.fieldLabel}>
                                                {index === 0 && '金額'}
                                            </div>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'amount']}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Input
                                                    placeholder="0"
                                                    type="number"
                                                    onChange={(e) => {
                                                        e.target.value = toHalfWidth(e.target.value)
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                        <span className={styles.unitText}>円</span>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => remove(field.name)}
                                            className={styles.deleteButton}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    className={styles.addButton}
                                >
                                    ユーザーを追加
                                </Button>
                            </div>
                        )}
                    </Form.List>

                    <Form.Item className={styles.submitButton}>
                        <Button type="primary" htmlType="submit" block>
                            計算する
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {showResult && results.length > 0 && (
                <div className={styles.resultSection}>
                    <h3>清算内容</h3>
                    <div className={styles.resultShow}>
                        {results.map((settlement, index) => (
                            <div key={index} className={styles.resultItem}>
                                <strong>{settlement.from}</strong> が <strong>{settlement.to}</strong> に{' '}
                                <strong>{settlement.amount}円</strong> 渡す
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {showResult && results.length === 0 && (
                <div className={`${styles.resultShow} ${styles.resultEmpty}`}>
                    清算の必要はありません
                </div>
            )}
        </div>
    )
}

export default WarikanAppMain