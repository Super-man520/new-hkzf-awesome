import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter/FilterFooter'

import styles from './filtermore.module.scss'
// 导入动画
import { Spring } from 'react-spring/renderprops'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }
  // 渲染标签
  renderFilters(list) {
    let { selectedValues } = this.state
    // 判断list是否为空
    if (!list) return
    // 高亮类名： styles.tagActive
    return list.map(item => (
      <span
        key={item.value}
        className={
          styles.tag +
          ' ' +
          (selectedValues.indexOf(item.value) > -1 ? styles.tagActive : '')
        }
        onClick={() => this.onTagClick(item.value)}
      >
        {item.label}
      </span>
    ))
  }
  // 标签的点击事件
  onTagClick = (value) => {
    // console.log(value)
    // 判断selectedValues是否包含value 有则取消  没有就添加
    let { selectedValues } = this.state
    let newSelectedValues
    if (selectedValues.indexOf(value) > -1) {
      newSelectedValues = selectedValues.filter(item => item !== value)
    } else {
      newSelectedValues = [...selectedValues, value]
    }
    this.setState({
      selectedValues: newSelectedValues
    })
  }
  // 清除已选择的
  clearSelected = () => {
    this.setState({
      selectedValues: []
    })
  }
  // 确定事件的处理函数
  // onOk = () => {
  //   // console.log(this.props)
  //   // 向父组件filter传值
  //   this.props.onSave(this.state.selectedValues)
  // }

  render() {
    // console.log(this.props)
    let { openType, onCancel, onSave, roomType, oriented, floor, characteristic } = this.props
    let isFadeIn = openType === 'more'
    // console.log(isFadeIn)
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <Spring from={{ opacity: 0 }} to={{ opacity: isFadeIn ? 1 : 0 }}>
          {props => {
            if (props.opacity === 0) return null
            return (
              <div style={props} className={styles.mask} onClick={onCancel} />
            )
          }}
        </Spring>

        {/* 条件内容  位置由外到内  100%-0%*/}
        <Spring from={{ transform: 'translate(100%,0px)' }}
          to={{ transform: isFadeIn ? 'translate(0px,0px)' : 'translate(100%,0px)' }}>
          {props => {
            return (
              <>
                <div className={styles.tags} style={props}>
                  <dl className={styles.dl}>
                    <dt className={styles.dt}>户型</dt>
                    <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

                    <dt className={styles.dt}>朝向</dt>
                    <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

                    <dt className={styles.dt}>楼层</dt>
                    <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

                    <dt className={styles.dt}>房屋亮点</dt>
                    <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
                  </dl>
                </div>
                {/* 底部按钮 */}
                <FilterFooter
                  className={styles.footer}
                  style={props}
                  cancelText={'清除'}
                  onCancel={this.clearSelected}
                  onOk={() => onSave(this.state.selectedValues)}
                // onOk={this.onOk}
                />
              </>
            )
          }}
        </Spring>
      </div>
    )
  }
}
