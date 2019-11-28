import React from 'react'
import { NavBar } from 'antd-mobile'
// 校验children字段是否存在
import PropTypes from 'prop-types'

// 只有被路由包裹的组件才能使用props.history对象  因此需要使用withRouter
import { withRouter } from 'react-router-dom'
class NavHeader extends React.Component {
  render() {
    // console.log(this.props)
    const { className, children, history } = this.props
    return (
      <NavBar
        className={['headNav', className].join(' ')}
        icon={<i className="iconfont icon-back" />}
        mode="light"
        onLeftClick={() => history.go(-1)}
      >{children}</NavBar>
    )
  }
}
// PropTypes 属性后面加上 `isRequired` 确保这个 prop 没有被提供时，会打印警告信息
// 校验children字段
NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}
let WithNavHeader = withRouter(NavHeader)
export default WithNavHeader