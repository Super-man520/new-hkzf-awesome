import React from 'react'
import styles from './map.module.scss'
import NavHeader from '../../components/NavHeader/navheader'
console.log(styles)
class Map extends React.Component {
  componentDidMount() {
    // 创建地图实例  map挂载在window
    const BMap = window.BMap
    var map = new BMap.Map("container");
    // 设置中心点
    var point = new BMap.Point(121.618150094325, 31.040657606659842)
    // 地图初始化  缩放比例 展示地图
    map.centerAndZoom(point, 15)
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader className={styles.mt_45}>地图找房</NavHeader>
        {/* 地图容器 */}
        <div id="container"></div>
      </div>
    )
  }
}
export default Map