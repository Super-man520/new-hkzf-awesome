import React from 'react'

import { API } from '../../../utils/API'

import styles from './search.module.scss'

import { SearchBar } from 'antd-mobile'
import NoHouse from '../../NoHouse/NoHouse'
// 获取当前城市
let currCity = JSON.parse(localStorage.getItem('hkzf_my'))
// console.log(currCity)
class Search extends React.Component {
  // 设置一个定时器
  timeId = null
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: [],
    isShow: true
  }
  // 关键字搜索
  handleSearchTxt = (value) => {
    // console.log(value)
    this.setState({
      searchTxt: value
    }, () => {
      // 发送ajax关键字查询
      if (this.state.searchTxt.trim().length === 0) {
        this.setState({
          tipsList: []
        })
        return
      }
      // 防抖  防止每输入一个字请求一次  多次输入合并一次执行
      clearTimeout(this.timeId)
      this.timeId = setTimeout(async () => {
        let res = await API.get(`area/community`, {
          params: {
            name: value,
            id: currCity.value
          }
        })
        // console.log(res)
        this.setState({
          tipsList: res.data.body
        }, () => {
          if (this.state.tipsList.length === 0) {
            this.setState({
              isShow: false
            })
          } else {
            this.setState({
              isShow: true
            })
          }
        })
      }, 600);
    })
  }
  // 传递小区结果
  onTipsClick = (item) => {
    // console.log(item)
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community
    })
  }
  // 搜索结果渲染
  renderTips() {
    const { tipsList } = this.state
    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => this.onTipsClick(item)}
      >
        {item.communityName}
      </li>
    ))
  }
  render() {
    const { searchTxt, isShow } = this.state
    const { history } = this.props
    return (
      <div className={styles.search}>
        <SearchBar placeholder="请输入搜索关键字" maxLength={8} value={searchTxt}
          onChange={this.handleSearchTxt}
          onCancel={() => history.replace('/rent/add')}
        />
        {/* 搜索提示列表 */}
        {isShow ? <ul className={styles.tips}>{this.renderTips()}</ul> : <NoHouse>暂无数据</NoHouse>}
      </div>
    )
  }
}
export default Search