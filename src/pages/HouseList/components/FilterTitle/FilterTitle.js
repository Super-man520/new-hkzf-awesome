import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './filtertitle.module.scss'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]
const renderFilterTitle = (props) => {
  // console.log(props)
  const { handleClick, titleSelectedStatus } = props
  return titleList.map(item => (
    <Flex.Item key={item.type} onClick={() => handleClick(item.type)}>
      {/* 选中类名： selected */}
      <span className={[styles.dropdown, titleSelectedStatus[item.type] ? styles.selected : ''].join(' ')}>
        <span>{item.title}</span>
        <i className="iconfont icon-arrow" />
      </span>
    </Flex.Item>
  ))
}
function FilterTitle(props) {
  // console.log(props)
  return (
    <Flex align="center" className={styles.root}>
      {renderFilterTitle(props)}
    </Flex>
  )
}
export default FilterTitle
