import React from 'react'
import NoHouse from '../NoHouse/NoHouse'
import { Link } from 'react-router-dom'
import { API } from '../../utils/API'
import styles from './rent.module.scss'
import WithNavHeader from '../../components/NavHeader/Navheader'
import WithListing from '../../components/Listings/Listings'
class Rent extends React.Component {
  state = {
    // 出租房屋的列表
    list: []
  }
  async componentDidMount() {
    this.getHouseList()
  }
  async getHouseList() {
    let res = await API.get(`user/houses`)
    // console.log(res)
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        list: body
      })
    } else {
      const { history, location } = this.props
      history.replace('/login', {
        from: location
      })
    }
  }
  // 房屋列表渲染
  renderRentList() {
    const { list } = this.state
    if (list.length === 0) {
      return (<NoHouse>你还没有房源
      <Link to="/rect/add" style={{ color: '#888' }}>
          去发布房源吧~
      </Link>
      </NoHouse>)
    }
    return <WithListing houseList={list}></WithListing>
  }
  render() {
    return (
      <div className={styles.rent}>
        <WithNavHeader>房屋管理</WithNavHeader>
        {this.renderRentList()}
      </div>
    )
  }
}
export default Rent