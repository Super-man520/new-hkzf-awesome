import React from 'react'
import styles from './details.module.scss'
// 导入头部组件
import WithNavHeader from '../../components/NavHeader/Navheader'
import { Carousel, Flex, Modal, Toast } from 'antd-mobile'
// 导入API
import { API } from '../../utils/API'
// 导入是否登录
import { isAuth } from '../../utils/Token'
// 导入BASE_URL
import BASE_URL from '../../utils/url'
// 导入房屋logo
import HousePackage from '../../components/HousePackage/HousePackage'
// 猜你喜欢
import WithListing from '../../components/Listings/Listings'
// 猜你喜欢数据
const recommendHouses = [
  {
    houseCode: 1,
    houseImg: '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房', '近地铁'],
  },
  {
    houseCode: 2,
    houseImg: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁', '双气', '学区房']
  },
  {
    houseCode: 3,
    houseImg: '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖', '朝阳', '大阳台']
  }
]
const BMap = window.BMap
const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}
class Details extends React.Component {
  state = {
    imgHeight: 240,
    // 房屋图片
    slides: [],
    // 标题
    title: '',
    // 标签
    tags: [],
    // 租金
    price: 0,
    // 房型
    roomType: '',
    // 房屋面积
    size: 89,
    // 装修类型
    renovation: '精装',
    // 朝向
    oriented: [],
    // 楼层
    floor: '',
    // 小区名称
    community: '',
    // 地理位置
    coord: {
      latitude: '',
      longitude: ''
    },
    // 房屋配套
    supporting: [],
    // 房屋标识
    houseCode: '',
    // 房屋描述
    description: '',
    // 是否收藏
    isFavorite: false
  }
  async componentDidMount() {
    // console.log(this.props.match)
    this.getDetalisList()
    // 一进入页面检查是否收藏
    this.checkFavorite()
  }
  async checkFavorite() {
    let { id } = this.props.match.params
    if (!isAuth) {
      return
    }
    // 已登录  判断是否收藏
    let res = await API.get(`user/favorites/${id}`)
    // console.log(res)
    let { status, body } = res.data
    if (status === 200) {
      this.setState({
        isFavorite: body.isFavorite
      })
    }
  }
  // 发送ajax
  async getDetalisList() {
    let res = await API.get(`houses/${this.props.match.params.id}`)
    // console.log(res)
    let { body, description, status } = res.data
    if (status === 400) {
      Toast.info(description, 2)
      return
    }
    this.setState({
      slides: body.houseImg,
      title: body.title,
      tags: body.tags,
      price: body.price,
      roomType: body.roomType,
      size: body.size,
      renovation: '精装',
      oriented: body.oriented,
      floor: body.floor,
      community: body.community,
      coord: body.coord,
      supporting: body.supporting,
      houseCode: body.houseCode,
      description: body.description
    })
    // 渲染地图
    let { coord, community } = this.state
    // console.log(latitude, longitude, community)
    this.renderMap(coord, community)
  }
  // 轮播图
  renderSwipers() {
    let {
      imgHeight,
      slides
    } = this.state
    return <>
      <Carousel
        className="swiper"
        autoplay
        infinite
        dotActiveStyle={{ backgroundColor: '#e92322' }}
      >
        {slides.map(val => (
          <a
            key={val}
            href="http://www.alipay.com"
            style={{ display: 'inline-block', width: '100%', }}
          >
            <img
              src={`http://localhost:8080${val}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top', height: `${imgHeight}px` }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        ))}
      </Carousel>
    </>
  }
  // 渲染地图
  async renderMap(coord, community) {
    let { latitude, longitude } = coord
    var map = new BMap.Map("map");
    var point = new BMap.Point(longitude, latitude);
    map.centerAndZoom(point, 17);
    var opts = {
      position: point,    // 指定文本标注所在的地理位置
      offset: new BMap.Size(0, -30)    //设置文本偏移量
    }
    var label = new BMap.Label("", opts);  // 创建文本标注对象
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    label.setStyle(labelStyle);
    map.addOverlay(label);
  }
  // 房屋标签
  renderTags() {
    let { tags } = this.state
    return (tags.map((item, index) => {
      // 如果标签数量超过三个,后面标签的样式都是tag3
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = `tag${index + 1}`
      }
      return (<span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
        {item}
      </span>)
    }))
  }
  // 消息弹框
  confirm() {
    const alert = Modal.alert
    let { location, history } = this.props
    // console.log(location)
    return (
      alert('温馨提示', '你收藏了么???赶快登陆去吧', [
        { text: '取消' },
        {
          text: '去登陆', onPress: () => history.replace('/login', {
            from: location
          })
        },
      ])
    )
  }
  // 是否收藏
  handleFavorite = async () => {
    let { match } = this.props
    let { isFavorite } = this.state
    let { id } = match.params
    // 获取id
    // console.log(this.props)
    // console.log(id)

    if (!isAuth()) {
      this.confirm()
      return
    }
    // 发送ajax判断有无收藏  已收藏则取消  未收藏则收藏
    if (!isFavorite) {
      let res = await API.post(`user/favorites/${id}`)
      // console.log(res)
      const { status, description } = res.data
      this.setState({
        isFavorite: true
      })
      if (status === 200) {
        Toast.success(description, 1)
      } else {
        Toast.info('失败', 1)
      }
    } else {
      // 未收藏
      let res = await API.delete(`user/favorites/${id}`)
      // console.log(res)
      const { status, description } = res.data
      this.setState({
        isFavorite: false
      })
      if (status === 200) {
        Toast.info(description, 1)
      } else {
        Toast.info('失败', 1)
      }
    }
  }
  // 房屋详情
  renderHouseContent() {
    let { title,
      price,
      roomType,
      size,
      renovation,
      oriented,
      floor, } = this.state
    return (
      <>
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>{title}</h3>
          <Flex className={styles.tags}>
            <Flex.Item>{this.renderTags()}</Flex.Item>
          </Flex>
          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>


          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                {renovation}
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </>
    )
  }
  render() {
    let { community, slides, supporting, description, isFavorite } = this.state
    return (
      <div className={styles.details}>
        <WithNavHeader
          className={styles.navheader} rightContent={<i className='iconfont icon-share' />}>
          {community||'暂无标题'}
        </WithNavHeader>
        {/* 轮播图 */}
        {slides.length > 0 ? this.renderSwipers() : null}
        {/* 房屋详情 */}
        {this.renderHouseContent()}
        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>
        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {supporting.length === 0 ? (
            <div className={styles.titleEmpty}>暂无数据</div>
          ) : (
              <HousePackage list={supporting} />
            )}
        </div>
        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + 'img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 猜你喜欢 */}
        <div className={styles.recommend}>
          <div className={[styles.houseTitle, styles.favorite].join(' ')}>
            <span>猜你喜欢</span>
          </div>
          <WithListing houseList={recommendHouses}></WithListing>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handleFavorite}>
            <img
              src={
                BASE_URL + (isFavorite ? 'img/star.png' : 'img/unstar.png')
              }
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>
              {isFavorite ? '已收藏' : '收藏'}
            </span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
export default Details