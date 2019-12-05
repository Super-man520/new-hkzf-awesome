import React from 'react'
import styles from './housePackage.module.scss'
import PropTypes from 'prop-types'
// 所有房屋配置项
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: '衣柜',
    icon: 'icon-wardrobe'
  },
  {
    id: 2,
    name: '洗衣机',
    icon: 'icon-wash'
  },
  {
    id: 3,
    name: '空调',
    icon: 'icon-air'
  },
  {
    id: 4,
    name: '天然气',
    icon: 'icon-gas'
  },
  {
    id: 5,
    name: '冰箱',
    icon: 'icon-ref'
  },
  {
    id: 6,
    name: '暖气',
    icon: 'icon-Heat'
  },
  {
    id: 7,
    name: '电视',
    icon: 'icon-vid'
  },
  {
    id: 8,
    name: '热水器',
    icon: 'icon-heater'
  },
  {
    id: 9,
    name: '宽带',
    icon: 'icon-broadband'
  },
  {
    id: 10,
    name: '沙发',
    icon: 'icon-sofa'
  }
]
/* 
  该组件的两种功能：
  1 根据传入的 list 展示房屋配置列表（房源详情页面）
    <HousePackage list={['衣柜', '洗衣机']} />
  2 从所有配置列表中选择房屋配置（发布房源页面）
    <HousePackage select onSelect={selectedItems => {...}} />
*/
class HousePackage extends React.Component {
  state = {
    // 选中的名称
    selectdNames: []
  }
  // 渲染列表项
  renderItem() {
    const { selectdNames } = this.state
    // 房屋配置
    // select 的值为 true 表示 选择房屋配置；false 表示仅展示房屋列表
    // list 表示要展示的列表项
    // console.log(this.props)
    const { list, select } = this.props
    let data = []
    // let data = HOUSE_PACKAGE.filter((item, index) => item.name = list[index])
    // console.log(data)
    // 如果传了 select 表示：选择 房屋配置
    // 如果没传 select 表示：展示 房屋配置 列表
    if (select) {
      data = HOUSE_PACKAGE
    } else {
      data = HOUSE_PACKAGE.filter(item => list.includes(item.name))
    }
    return (
      data.map(item => {
        // 判断该项是否被选中
        const isSelected = selectdNames.indexOf(item.name) > -1
        return <li key={item.id}
          className={[styles.item, isSelected ? styles.active : ''].join(' ')}
          onClick={select && (() => { this.toggleSelect(item.name) })}
        >
          <p><i className={`iconfont ${item.icon} ${styles.icon}`} /></p>
          {item.name}
        </li>
      })
    )
  }
  // 根据id切换选中状态
  toggleSelect = (name) => {
    // console.log(name)
    const { selectdNames } = this.state
    let newSelectdNames
    // 有就删除,没有就添加
    // debugger
    if (selectdNames.indexOf(name) > -1) {
      newSelectdNames = selectdNames.filter(item => item !== name)
    } else {
      newSelectdNames = [...selectdNames, name]
    }
    // console.log(newSelectdNames)
    // 传递给父组件
    this.props.onSelect(newSelectdNames)
    this.setState({
      selectdNames: newSelectdNames
    })
  }
  render() {
    return (
      <ul className={styles.HousePackage}>{this.renderItem()}</ul>
    )
  }
}
HousePackage.propTypes = {
  list: PropTypes.array.isRequired,
}
// 属性默认值，防止在使用该组件时，不传 onSelect 报错
HousePackage.defaultProps = {
  onSelect: () => { }
}
export default HousePackage