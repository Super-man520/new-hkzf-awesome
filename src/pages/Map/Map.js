import React from 'react'
import styles from './map.module.scss'
import NavHeader from '../../components/NavHeader/navheader'
import { getCurrCity } from '../../utils/CurrCity/currcity'
import { Toast } from 'antd-mobile';
// import Axios from 'axios'
// 优化axios
// 方案1 设置baseURL
// Axios.defaults.baseURL = 'http://localhost:8080/'
// 方案2 配置API
import { API } from '../../utils/API'
// const API = Axios.create({
//     baseURL: 'http://localhost:8080'
//   })
// console.log(styles)
// 创建地图实例  map挂载在window
const BMap = window.BMap
class Map extends React.Component {
  state = {
    houseList: [],  //房源列表
    isShow: false   //是否显示房源列表
  }
  componentDidMount() {
    this.initMap()
  }
  // 初始化地图
  async initMap() {
    var map = new BMap.Map("container")
    // 为了让封装出来的函数都可以使用map实例,添加到当前组件实例上
    this.map = map
    // 设置中心点
    // var point = new BMap.Point(121.618150094325, 31.040657606659842)
    // 地图初始化  缩放比例 展示地图
    // map.centerAndZoom(point, 15)
    let city = await getCurrCity()
    // console.log(city)
    // 创建地址解析器实例     
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(city.label, async (point) => {
      // point = new BMap.Point(121.618150094325, 31.040657606659842)
      if (point) {
        // map.centerAndZoom(point, 11);
        // 显示小圆点
        // map.addOverlay(new BMap.Marker(point));
        // 添加覆盖物
        this.renderOverlay(city.value, 11, point)
      }
    },
      city.label)
    // 移动地图房源列表隐藏
    // movestart 地图移动开始时触发此事件
    this.map.addEventListener('movestart', () => {
      this.setState({
        isShow: false
      })
    })
  }
  // 创建覆盖物的函数
  async renderOverlay(cityId, zoom, point) {
    this.map.centerAndZoom(point, zoom)
    var top_left_control = new BMap.ScaleControl();// 添加比例尺
    var top_left_navigation = new BMap.NavigationControl();  // 添加默认缩放平移控件
    this.map.addControl(top_left_control)
    this.map.addControl(top_left_navigation)
    // 请求数据之前,显示加载
    Toast.loading('正在加载中...', 0)
    // 获取城市和区的房源数据
    let res = await API.get(`area/map`, {
      params: {
        id: cityId
      }
    })
    Toast.hide()
    // console.log(res)
    // console.log(this.map.getZoom())
    // 获取覆盖物的类型和下一级的缩放等级
    let { type, nextZoom } = this.getTypeandZoom()
    // 调用创建覆盖物的方法
    this.createOverlays(res.data.body, type, nextZoom)
  }
  // 获取当前的覆盖物的类型和下一级的缩放等级
  getTypeandZoom() {
    //  11区的房源  13 镇的房源 15小区的房源
    let nextZoom = 0  //设置初始值缩放等级
    let type = ''
    let currZoom = this.map.getZoom()   //获取当前全景的级别
    if (currZoom === 11) {
      type = 'circle'
      nextZoom = 13
    } else if (currZoom === 13) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
    }

    // 返回结果
    return { type, nextZoom }
  }
  // 创建覆盖物的方法  判断是区镇还是小区
  createOverlays(data, type, zoom) {
    if (type === 'circle') {
      // 调用区镇的覆盖物
      this.createCircle(data, zoom)
    } else {
      // 调用小屋的覆盖物
      this.createRect(data)
    }
  }
  // 创建区和镇的覆盖物
  createCircle(data, zoom) {
    // eslint-disable-next-line array-callback-return
    data.map(item => {
      // 创建中心点
      var point = new BMap.Point(item.coord.longitude, item.coord.latitude)
      var opts = {
        position: point,    // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35)    //设置文本偏移量
      }
      var label = new BMap.Label('', opts);  // 创建文本标注对象
      // 设置覆盖物样式  setStyle(styles: Object)
      label.setStyle({
        fontSize: "12px",
        border: 'none',
        padding: '0px',
        margin: '0px',
        fontFamily: "微软雅黑",
        color: '#fff',
        cursor: 'pointer',
        background: 'transparent'
      });
      // 设置覆盖物文本内容  setContent(content: String)
      label.setContent(`
        <div class="${styles.bubble}">
          <p class="${styles.title}">${item.label}</p>
          <p>${item.count}套</p>
        </div>
      `)
      // 给当前覆盖物注册点击事件 进一步缩放
      label.addEventListener('click', () => {
        setTimeout(() => {
          this.map.clearOverlays() //清除覆盖物 
        }, 0)
        // 进入到下一级缩放  调用创建覆盖物的方法
        this.renderOverlay(item.value, zoom, point)
      })
      // 遮盖物添加到地图
      this.map.addOverlay(label);
    })
  }
  // 创建小区覆盖物
  createRect(data) {
    // eslint-disable-next-line array-callback-return
    data.map(item => {
      let point = new BMap.Point(item.coord.longitude, item.coord.latitude)
      var opts = {
        position: point,    // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35)    //设置文本偏移量
      }
      var label = new BMap.Label('', opts);  // 创建文本标注对象
      // 设置覆盖物样式  setStyle(styles: Object)
      label.setStyle({
        fontSize: "12px",
        border: 'none',
        padding: '0px',
        margin: '0px',
        fontFamily: "微软雅黑",
        color: '#fff',
        cursor: 'pointer',
        background: 'transparent'
      });
      // 设置覆盖物文本内容  setContent(content: String)
      label.setContent(`
        <div class="${styles.rect}">
          <span class="${styles.housename}">${item.label}</span>
          <span>${item.count}套</span>
          <i class="${styles.arrow}"></i>
        </div>
      `)
      // 点击房源弹出房源详情
      label.addEventListener('click', (e) => {
        // console.log(item.value)
        this.getHouseList(item.value)
        // 房源列表显示  点击位置移动到可视区域中心
        // 先拿到鼠标的位置
        // console.log(e)
        let x = e.changedTouches[0].clientX
        let y = e.changedTouches[0].clientY
        // 计算可视区的高度
        let clientHeight = window.innerHeight - 330 - 45
        // 鼠标移动的位置  
        let distanceY = y - clientHeight / 2 - 45
        let distanceX = x - window.innerWidth / 2
        // console.log(distanceY)
        // panBy 地图在水平位置上移动x像素，垂直位置上移动y像素
        this.map.panBy(-distanceX, -distanceY)
      })
      this.map.addOverlay(label);
    })
  }
  // 房源详情
  async getHouseList(cityId) {
    Toast.loading('加载中...请稍后', 0)
    let res = await API.get(`houses`, {
      params: {
        cityId
      }
    })
    Toast.hide()
    // console.log(res)
    let { list } = res.data.body
    this.setState({
      houseList: list,
      isShow: true   //点击时显示房源数据
    })
  }
  // 渲染房屋列表的函数
  renderHouseList() {
    let { houseList } = this.state
    return (
      // eslint-disable-next-line array-callback-return
      houseList.map(item => (
        <div className={styles.houselist} key={item.houseCode}>
          <div className={styles.houseimg}>
            <img src={`http://localhost:8080${item.houseImg}`} alt="" />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.desc}>{item.desc}</div>
            {item.tags.map(item => (
              <span key={item} className={[styles.housetag, styles.housetag1].join(' ')}>{item}</span>
            ))}
            <div className={styles.houseprice}>
              <span>{item.price}</span>元/月
            </div>
          </div>
        </div>
      ))
    )
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader className={styles.mt_45}>地图找房</NavHeader>
        {/* 地图容器 */}
        <div id="container"></div>
        {/* 房源列表 */}
        <div className={styles.house + ' ' + (this.state.isShow ? styles.show : '')}>
          <div className={styles.titlewarp}>
            <div className={styles.housename}>房屋列表</div>
            <div className={styles.housemore} onClick={()=>{
              this.props.history.push('/house/list')
            }}>更多房源</div>
          </div>
          <div className={styles.houseitem}>{this.renderHouseList()}</div>
        </div>
      </div>
    )
  }
}
export default Map