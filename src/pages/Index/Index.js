import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import axios from 'axios'
import './index.scss'
// 导入当前城市
import { getCurrCity } from '../../utils/CurrCity/Currcity'
// 导入头部搜索框
import WithSearchHeader from '../../components/SearchHeader/SearchHeader'
// 导入图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
// 导航列表数据
const navData = [
  { pathname: '/home/houselist', id: 1, text: '整租', navUrl: nav1 },
  { pathname: '/home/houselist', id: 2, text: '合租', navUrl: nav2 },
  { pathname: '/map', id: 3, text: '地图找房', navUrl: nav3 },
  { pathname: '/rent/add', id: 4, text: '去出租', navUrl: nav4 }
]
// 城市选择
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(position => {
//     // position对象表示当前位置信息
//     // 常用： latitude 纬度 / longitude 经度
//     // 知道： accuracy 经纬度的精度 / altitude 海拔高度 / altitudeAccuracy 海拔高度的精度 / heading 设备行进方向 / speed 速度
//     console.log(position)
//   }, function (e) {
//     throw (e.message);
//    }
//   )
// }
class Index extends React.Component {
  state = {
    data: ['1', '2', '3'],
    imgHeight: 176,
    carouselList: [], //轮播图图片
    dotActiveStyle: {
      backgroundColor: '#e92322'  //当前激活的小圆点的样式
    },
    group: [], //租房小组
    news: [],
    currCity: '北京'
  }
  // 轮播图
  carousel() {
    return <div className="header">
      <Carousel autoplay infinite className="carousel" dotActiveStyle={this.state.dotActiveStyle}>
        {this.state.carouselList.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
          >
            <img
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        ))}
      </Carousel>

      <WithSearchHeader></WithSearchHeader>
    </div>
  }
  // 发送ajax  轮播图
  async getCarouselList() {
    let res = await axios.get('http://localhost:8080/home/swiper')
    // console.log(res)
    const { body } = res.data
    // console.log(body)
    // 赋值给轮播图
    this.setState({
      carouselList: body
    })
  }
  async getGroups() {
    let res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    // console.log(res)
    let { body } = res.data
    // console.log(body)
    this.setState({
      group: body
    })
  }
  // 获取信息
  async getNews() {
    let res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: `AREA%7C88cff55c-aaa4-e2e0`
      }
    })
    // console.log(res)
    let { body } = res.data
    // console.log(body)
    this.setState({
      news: body
    })
  }
  async componentDidMount() {
    this.getCarouselList()
    this.getGroups()
    this.getNews()
    // 利用百度地图api获取当前城市
    let currCity = await getCurrCity()
    // console.log(currCity)
    this.setState({
      currCity: currCity.label
    })
  }
  // 导航区域
  navList() {
    return <Flex className="navlist">
      {navData.map(item => (<Flex.Item className="navinfo" key={item.id} onClick={() => {
        this.props.history.push(item.pathname)
      }}>
        <img src={item.navUrl} alt="" />
        <span>{item.text}</span>
      </Flex.Item>))}
    </Flex>
  }
  // 租房小组
  group() {
    let { group } = this.state
    return (
      <Grid data={group} hasLine={false} columnNum={2} renderItem={item => (
        <div>
          <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
          <div style={{ color: '#888', fontSize: '14px', marginTop: '6px' }} className="group-item">
            <span className="group-title">{item.title}</span>
            <span className="group-desc">{item.desc}</span>
          </div>
        </div>
      )} className="group-grid" square={false}>
      </Grid>)
  }
  // 信息
  news() {
    let { news } = this.state
    return (
      news.map(item => (<div key={item.id} className="news">
        <img src={`http://localhost:8080${item.imgSrc}`} alt="" className="news-img" />
        <Flex className="news-title" direction="column" justify="between">
          <h3>{item.title}</h3>
          <Flex className="news-info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>))
    )
  }
  // 异步加载，刚开始加载完成图片没有渲染，所以轮播图未生效
  render() {
    let { carouselList } = this.state
    return (
      <div className="index">
        {/* 轮播图 */}
        {carouselList.length > 0 ? this.carousel() : null}
        {/* 导航区域 */}
        {this.navList()}
        {/* 租房小组 */}
        <Flex className="group">
          <Flex.Item className="group-one">租房小组</Flex.Item>
          <Flex.Item className="group-more">更多</Flex.Item>
        </Flex>
        {this.group()}
        {/* 信息 */}
        <div className="latest">
          <WingBlank>
            <h3 className="latest-info">最新资讯</h3>{this.news()}
          </WingBlank>
        </div>
      </div>
    )
  }
}
export default Index