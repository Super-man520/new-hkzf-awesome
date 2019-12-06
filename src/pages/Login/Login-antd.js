import React from 'react'
import { NavBar, Toast, WingBlank, List, InputItem, Button, WhiteSpace } from 'antd-mobile'
import { API } from '../../utils/API'
import styles from './login.module.scss'
// 导入token
import { setToken } from '../../utils/Token'
import { Link } from 'react-router-dom'

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }
  formRef = React.createRef()
  handleChange1 = (value) => {
    // console.log(value)
    this.setState({
      username: value,
    })
  }
  handleChange2 = (value) => {
    // console.log(value)
    this.setState({
      password: value,
    })
  }
  onSubmit = async () => {
    // console.log(this.props)
    let { username, password } = this.state
    let res = await API.post(`/user/login`, { username, password })
    // console.log(res)
    let { status, description, body } = res.data
    if (status === 400) {
      Toast.info(description, 2)
    }
    if (status === 200) {
      setToken(body.token)
      Toast.info(description, 2)
      // 判断是不是鉴权组件过来的
      let $state = this.props.location.state
      if ($state) {
        this.props.history.replace($state.from.pathname)
      } else {
        this.props.history.go(-1)
      }
    }
  }
  render() {
    let { username, password } = this.state
    return (
      <div className={styles.login}>
        <NavBar
          icon={<i className="iconfont icon-back" />}
          mode="light"
          onLeftClick={() => this.props.history.go(-1)}
        >账号登陆</NavBar>
        {/* 登陆表单 */}
        <WingBlank>
          <form action="" ref={this.formRef}>
            <List renderHeader={() => '用户名'}>
              <InputItem
                onChange={this.handleChange1}
                value={username}
                name="username"
                clear
                placeholder="please enter username"
              >username</InputItem>
            </List>
            <List renderHeader={() => '密 码'}>
              <InputItem
                onChange={this.handleChange2}
                value={password}
                name="password"
                type="password"
                clear
                placeholder="please enter password"
              >password</InputItem>
            </List>
            <WhiteSpace size="lg" />
            <Button className={styles.btnColor} activeStyle={false} onClick={this.onSubmit}>登录</Button>
          </form>
        </WingBlank>
        <Link to="/registe" className={styles.color}>还没有账号,去注册~</Link>
      </div>
    )
  }
}
export default Login