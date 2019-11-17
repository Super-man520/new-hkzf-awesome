import React from 'react'
import { NavBar } from 'antd-mobile';
import './citylist.scss'
class CityList extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <NavBar
          icon={<i className="iconfont icon-back" />}
          mode="light"
          onLeftClick={() => this.props.history.go(-1)}
        >城市列表</NavBar>
      </div>
    )
  }
}
export default CityList