import React from 'react'
import WithNavHeader from '../../components/NavHeader/Navheader'
import styles from './registe.module.scss'
import { Flex, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { Link } from 'react-router-dom'
class Registe extends React.Component {
  render() {
    return (
      <div className={styles.registe}>
        <WithNavHeader>注册</WithNavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <form action="">
            <div className={styles.formItem}>
              <label className={styles.label}>用户名:</label>
              <input type="text" className={styles.input} placeholder="请输入用户名" />
            </div>
            <div className={styles.formItem}>
              <label className={styles.label}>密 码:</label>
              <input type="text" className={styles.input} placeholder="请输入密码" />
            </div>
            <div className={styles.formItem}>
              <label className={styles.label}>重复密码:</label>
              <input type="text" className={styles.input} placeholder="再次输入密码" />
            </div>
            <WhiteSpace size="xs" />
            <Button className={styles.btnColor} activeStyle={false} onClick={this.onSubmit}>注册</Button>
          </form>
          <Flex justify="between" className={styles.fontcolor}>
            <Link to="/home">点我回首页</Link>
            <Link to="/login">已有帐号,去登录</Link>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
export default Registe