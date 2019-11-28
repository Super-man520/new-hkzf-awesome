import React from 'react'
// 导入头部组件
import WithSearchHeader from '../../components/SearchHeader/SearchHeader'
import styles from './houselist.module.scss'
class HouseList extends React.Component {
  render() {
    return (
      <div className={styles.houselist}>
        <div className={styles.hearder}>
          <i className="iconfont icon-back house_back" onClick={() => { this.props.history.go(-1) }}></i>
          <WithSearchHeader translate={styles.translate} iconcolor={styles.iconcolor}></WithSearchHeader>
        </div>
      </div>
    )
  }
}
export default HouseList