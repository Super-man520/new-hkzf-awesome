import React from 'react'
// 导入当前城市
import { getCurrCity } from '../../utils/CurrCity/currcity'
import './searchheader.scss'
import { withRouter } from 'react-router-dom'
class SearchHeader extends React.Component {
  state = {
    currCity: ''
  }
  async componentDidMount() {
    let res = await getCurrCity()
    // console.log(res)
    this.setState({
      currCity: res.label
    })
  }
  render() {
    let { history, translate, iconcolor } = this.props
    return (
      <div className={`header-nav ${translate}`}>
        <div className="header-more">
          <div className="city" onClick={() => {
            history.push('/citylist')
          }}>
            <span>{this.state.currCity}</span>
            <i className="iconfont icon-arrow"></i>
          </div>
          <div className="search">
            <i className="iconfont icon-seach"></i>
            <span>请输入小区地址</span>
          </div>
        </div>
        <div className="map" onClick={() => history.push('/map')}>
          <i className={["iconfont icon-map",iconcolor].join(' ')}></i>
        </div>
      </div>
    )
  }
}
let WithSearchHeader = withRouter(SearchHeader)
export default WithSearchHeader