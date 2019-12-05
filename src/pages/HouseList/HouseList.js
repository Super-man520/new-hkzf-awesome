import React from 'react'
// 导入头部组件
import WithSearchHeader from '../../components/SearchHeader/SearchHeader'
import styles from './houselist.module.scss'
import Filter from './components/Filter/Filter'
import { getCurrCity } from '../../utils/CurrCity/Currcity'
import { API } from '../../utils/API'
import { Toast } from 'antd-mobile'
import WithListing from '../../components/Listings/Listings'
import NoHouse from '../NoHouse/NoHouse'
import Sticky from '../../components/Sticky/Sticky'
class HouseList extends React.Component {
  state = {
    cityId: '',
    houseList: [], //房源列表
    houseCount: null, //房源总数
    isShow: false //无房源显示的页面
  }
  async componentDidMount() {
    // 显示加载动画
    Toast.loading('正在加载中...')
    // 一进入页面获取所欲的房屋信息
    this.getHouseData({})
    let city = await getCurrCity()
    // console.log(city)
    this.setState({
      cityId: city.value
    })
  }
  // 获取房源信息  根据条件查询
  getHouseData = async (filter) => {
    let { cityId } = this.state
    let res = await API.get(`houses`, {
      params: {
        ...filter,
        cityId,
        start: 1,
        end: 30
      }
    })
    // console.log(res)
    const { body: { list, count }, status } = res.data
    if (status === 200) {
      Toast.hide()
      if (count === 0) {
        this.setState({
          houseList: list,
          houseCount: count,
          isShow: true
        })
      } else {
        Toast.info(`共找到${count}套房源`, 1)
        this.setState({
          houseList: list,
          houseCount: count,
          isShow: false
        })
      }
    } else {
      Toast.fail('获取失败', 1)
    }
  }
  // 渲染房屋
  renderHouse = () => {
    let { houseList, isShow } = this.state
    return isShow ? <NoHouse>暂无房源数据</NoHouse> : <WithListing houseList={houseList}></WithListing>
  }
  render() {
    return (
      <div className={styles.houselist}>
        <div className={styles.hearder}>
          <i className="iconfont icon-back house_back" onClick={() => this.props.history.go(-1)}></i>
          <WithSearchHeader translate={styles.translate} iconcolor={styles.iconcolor}></WithSearchHeader>
        </div>
        <Sticky height={40}>
          <Filter getHouseData={this.getHouseData}></Filter>
        </Sticky>
        {this.renderHouse()}
      </div>
    )
  }
}
export default HouseList