import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter/FilterFooter'


export default class FilterPicker extends Component {
  state = {
    // 一打开filterpicker就将父组件的defaultValue赋值给value  数据回显
    value: this.props.defaultValue
  }
  // picker的监听函数
  handleChange = (value) => {
    // console.log(value)
    this.setState({
      value
    })
  }
  render() {
    // console.log(this.props)
    let { value } = this.state
    let { onCancel, onSave, cols, data } = this.props
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={value} cols={cols} onChange={this.handleChange} />

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCancel} onOk={() => onSave(value)} />
      </>
    )
  }
  // 点击title,更新openType,每次都更新组件
  // 解决方法2: 让filterpicker重新创建  --实现方法: 给filter的picker组件加一个key={openType}
  // componentDidUpdate(prevProps, prevState) {
  //   // console.log(prevProps)
  //   let { defaultValue, openType } = this.props
  //   // console.log(openType)
  //   if (openType !== prevProps.openType) {
  //     this.setState({
  //       value: defaultValue  //组件更新时,重新赋值
  //     })
  //   }
  // }
}
