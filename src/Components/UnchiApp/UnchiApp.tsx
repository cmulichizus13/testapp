import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import React from 'react'
import { Link } from 'react-router-dom'

const UnchiApp: React.FC = () => {
  return (
    <div>
      <Link to="/">
        <Button icon={<HomeOutlined />}>ホームに戻る</Button>
      </Link>
      <p style={{ fontSize: '150px', fontWeight: 'bold', color: 'red' }}>💩</p>
      <p>ほかのアプリを使ってください。</p>
    </div>
  )
}

export default UnchiApp