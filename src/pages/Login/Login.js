import React from 'react'
import { NavBar } from 'antd-mobile';

class Login extends React.Component {
  render() {
    return (
      <div>
        <div>
          <NavBar
            icon={<i className="iconfont icon-back" />}
            mode="light"
            onLeftClick={() => this.props.history.go(-1)}
          >账号登陆</NavBar>
        </div>
      </div>
    )
  }
}
export default Login