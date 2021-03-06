import React from 'react'
import { NavBar } from 'antd-mobile'
// 校验children字段是否存在
import PropTypes from 'prop-types'

// 只有被路由包裹的组件才能使用props.history对象  因此需要使用withRouter
import { withRouter } from 'react-router-dom'
class NavHeader extends React.Component {
  render() {
    // console.log(this.props)
    const { className, rightContent, onLeftClick, children } = this.props

    return (
      <NavBar rightContent={rightContent}
        className={['headNav', className].join(' ')}
        icon={<i className="iconfont icon-back" />}
        mode="light"
        onLeftClick={onLeftClick || this.handleClick}
      >{children}</NavBar>
    )
  }
  handleClick = () => {
    this.props.history.go(-1)
  }
}
// 设置默认属性
NavHeader.defaultProps = {
  children: '好好啊好000'
}
// PropTypes 属性后面加上 `isRequired` 确保这个 prop 没有被提供时，会打印警告信息
// 校验children字段
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
}
let WithNavHeader = withRouter(NavHeader)
export default WithNavHeader