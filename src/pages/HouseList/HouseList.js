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
// 导入virtualized 
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized'
class HouseList extends React.Component {
  state = {
    cityId: '',
    houseList: [], //房源列表
    houseCount: null, //房源总数
    isShow: false //无房源显示的页面
  }
  async componentDidMount() {
    let city = await getCurrCity()
    // console.log(city)
    this.setState({
      cityId: city.value
    })
    // console.log(this.state.cityId)
    // this.cityId = city.value
    // 显示加载动画
    Toast.loading('正在加载中...')
    // 一进入页面获取所欲的房屋信息
    this.getHouseData({})
  }
  // 获取房源信息  根据条件查询
  getHouseData = async (filter) => {
    let { cityId } = this.state
    // 挂载在实例,以便复用
    this.filter = filter
    let res = await API.get(`houses`, {
      params: {
        ...filter,
        cityId,
        start: 1,
        end: 20
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
  // renderHouse = () => {
  //   let { houseList, isShow } = this.state
  //   return isShow ? <NoHouse>暂无房源数据</NoHouse> : <WithListing houseList={houseList}></WithListing>
  // }
  // 长列表渲染内容
  rowRenderer = ({ key, index, style }) => {
    let { houseList } = this.state
    let item = houseList[index]  //拿到房源的每一项
    // console.log(item)
    // 如果快速滚动,list的对应的那一行要渲染,但是可能这个时候数据还没有获取到
    // 所以item拿到的是undefined
    // 解决办法: 有数据就渲染houseItem, 没有就渲染一个正在加载的div
    return item ? (<WithListing key={key} style={style} houseList={houseList}></WithListing>) : (<div key={key} style={style}>
      loading...
    </div>
    )
  }
  // 判断当前行是否要加载
  isRowLoaded = ({ index }) => {
    return !!this.state.houseList[index]  //转换布尔值
  }
  // InfiniteLoader 加载更多数据的函数  返回一个promise对象
  loadMoreRows = ({ startIndex, stopIndex }) => {
    let { cityId } = this.state
    // console.log(cityId)
    return new Promise(async resolve => {
      // 此处发送sjax
      let res = await API.get(`houses`, {
        params: {
          ...this.filter,
          cityId,
          start: startIndex,
          end: stopIndex
        }
      })
      // console.log(res)
      let { houseList } = this.state
      houseList = [...houseList, ...res.data.body.list]
      this.setState({
        houseList
      })
      resolve()
    })
  }
  render() {
    let { houseCount, houseList, isShow } = this.state
    return (
      <div className={styles.houselist}>
        <div className={styles.hearder}>
          <i className="iconfont icon-back house_back" onClick={() => this.props.history.go(-1)}></i>
          <WithSearchHeader translate={styles.translate} iconcolor={styles.iconcolor}></WithSearchHeader>
        </div>
        <Sticky height={40}>
          <Filter getHouseData={this.getHouseData}></Filter>
        </Sticky>
        {/* {this.renderHouse()} */}
        {/* 城市列表展示 */}
        {houseList.length > 0 ? <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={houseCount}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, scrollTop }) => (
                <AutoSizer>
                  {({ width }) => (
                    <List
                      autoHeight
                      ref={registerChild}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      height={height}  //list的高度
                      rowCount={houseCount}  //总共的个数
                      rowHeight={120}  //list的高度
                      rowRenderer={this.rowRenderer}  //每一行要渲染的内容
                      width={width}  //list的宽度
                      onRowsRendered={onRowsRendered}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader> : (isShow && <NoHouse>没有房源展示</NoHouse>)}
      </div>
    )
  }
}
export default HouseList