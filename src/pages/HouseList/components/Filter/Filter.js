import React, { Component } from 'react'
// 导入动画
import { Spring } from 'react-spring/renderprops'

import FilterTitle from '../FilterTitle/FilterTitle'
import FilterPicker from '../FilterPicker/FilterPicker'
import FilterMore from '../FilterMore/FilterMore'

import styles from './filter.module.scss'
import { API } from '../../../../utils/API'

// 控制filtertitle中tile高亮状态的对象
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

// 存储title中菜单选中的值的对象
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

class Filter extends Component {
  state = {
    openType: '', //点击记录当前点击的哪一个title
    titleSelectedStatus,
    filterData: {},  //筛选条件数据
    selectedValues  //筛选条件的选中值
  }
  async componentDidMount() {
    let cityId = JSON.parse(localStorage.getItem('hkzf_my')).value
    // console.log(cityId)
    let res = await API.get(`houses/condition`, {
      params: {
        id: cityId
      }
    })
    // console.log(res)
    this.setState({
      filterData: res.data.body
    })
  }
  // 点击title的事件处理函数
  onTitleClick = (type) => {
    // console.log(type)
    // 点击谁谁高亮
    let { titleSelectedStatus, selectedValues } = this.state
    // 设置titleSelectedStatus的值  复杂数据类型不直接修改数据
    let newTitleSelectedStatus = { ...titleSelectedStatus }
    // console.log(newTitleSelectedStatus)
    // 依次遍历选中状态
    // 判断当前的openType和key是否一致,一致则高亮
    Object.keys(newTitleSelectedStatus).forEach(key => {
      if (type === key) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'area' && selectedValues[key].length === 3) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedValues[key][0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedValues[key][0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedValues[key].length > 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    })
  }
  // 遮罩层
  renderMask = () => {
    const { openType } = this.state
    //如果点击的是area, mode, price 中任何一个,就展示,否则隐藏
    let isFadeIn =
      openType === 'area' || openType === 'mode' || openType === 'price'

    return (<Spring
      from={{ opacity: 0 }}
      to={{ opacity: isFadeIn ? 1 : 0 }}>
      {props => <div style={props} className={styles.mask} onClick={this.onCancel}></div>}
    </Spring>)
  }
  // 点击遮罩层关闭filterPicker
  onCancel = () => {
    // 高亮
    let { titleSelectedStatus, selectedValues } = this.state
    let newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(newTitleSelectedStatus).forEach(key => {
      //判断当前的openType 和 key 是否相同,如果相同,直接高亮
      if (key === 'area' && selectedValues[key].length === 3) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedValues[key][0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedValues[key][0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedValues[key].length > 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: ''
    })
  }
  // FilterPicker选中后的回调函数   组件自带
  onSave = (value) => {
    // console.log(value)
    // console.log(value.length, value[0])
    let { selectedValues, openType, titleSelectedStatus } = this.state
    let newSelectedValues = {
      ...selectedValues, //展开原来的所有属性
      [openType]: value // 修改最新的数据
    }

    // 把titleSelectedStatus获取到,创建一个新的
    let newTitleSelectedStatus = {
      ...titleSelectedStatus
    }

    Object.keys(newTitleSelectedStatus).forEach(key => {
      //判断当前的openType 和 key 是否相同,如果相同,直接高亮
      if (key === 'area' && newSelectedValues[key].length === 3) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && newSelectedValues[key][0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && newSelectedValues[key][0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && newSelectedValues[key].length > 0) {
        newTitleSelectedStatus[key] = true
      } else if (value.length === 2 && value[0] === 'subway') {
        newTitleSelectedStatus['area'] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState({
      openType: '',
      selectedValues: newSelectedValues,
      titleSelectedStatus: newTitleSelectedStatus
    }, () => {
      this.setFilter()
    })
  }
  // 用于封装筛选条件的到的房屋信息
  setFilter = () => {
    // console.log(this.props)
    let { getHouseData } = this.props
    // 获取筛选条件的值
    let { selectedValues } = this.state
    // 封装需要筛选调价的数据
    let filter = {}
    console.log(selectedValues)
    // mode --> rentType
    filter.rentType = selectedValues['mode'][0]
    // price --> price
    filter.price = selectedValues['price'][0]
    // more --> more 变成一个逗号隔开的字符串
    filter.more = selectedValues['more'].join(',')
    // filter的area和subway二选一
    // 取决于selectedValues的area下标为0的值
    let key = selectedValues['area'][0]
    // console.log(key)
    //判断selectedValues的area的长度  
    /** 
     * 如果第二项是null 则返回
     * 如果第三项是null 则返回下标为1的值
     * 如果第三项不是null 则返回下标为2的值 
     */
    if (selectedValues['area'].length === 2) {
      filter[key] = 'null'
    } else {
      if (selectedValues['area'][2] === 'null') {
        filter[key] = selectedValues['area'][1]
      } else {
        filter[key] = selectedValues['area'][2]
      }
    }
    getHouseData(filter)
  }

  // FilterPicker组件学渲染
  renderFilterPicker = () => {
    // 给picker传数据
    let { openType, selectedValues, filterData: { area, subway, rentType, price } } = this.state
    // 根据不同的类型选择不同的数据
    let data = []
    let cols = null //默认显示几行数据
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        data = rentType
        cols = 1
        break;
      case 'price':
        data = price
        cols = 1
        break;
      default:
        break;
    }
    //如果点击的是area, mode, price 中任何一个,就展示,否则隐藏
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return (
        <FilterPicker
          key={openType}
          data={data}
          cols={cols}
          openType={openType}
          onCancel={this.onCancel}
          onSave={this.onSave}
          defaultValue={selectedValues[openType]}
        />
      )
    }
    return null
  }
  // filterMore组件渲染
  renderFilterMore = () => {
    let { openType, filterData: { roomType, oriented, floor, characteristic } } = this.state
    return (
      <FilterMore
        openType={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        defaultValue={selectedValues['more']}
        roomType={roomType}
        oriented={oriented}
        floor={floor}
        characteristic={characteristic}
      />
    )
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle handleClick={this.onTitleClick}
            titleSelectedStatus={titleSelectedStatus} />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
export default Filter
