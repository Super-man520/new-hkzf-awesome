import React, { Component } from 'react'
import styles from './sticky.module.scss'
class Sticky extends Component {
  placeholderRef = React.createRef()
  contentRef = React.createRef()

  // 监听页面滚动行为
  onScroll = () => {
    // console.log(this.placeholderRef.current)
    // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
    // rect 是一个具有四个属性left、top、right、bottom的DOMRect对象
    let { top } = this.placeholderRef.current.getBoundingClientRect()
    // console.log(top)
    if (top <= 0) {
      this.placeholderRef.current.style.height = this.props.height + 'px'
      this.contentRef.current.classList.add(styles.fixed)
    } else {
      // 恢复正常
      this.placeholderRef.current.style.height = 0
      this.contentRef.current.classList.remove(styles.fixed)
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }
  // sticky父盒子固定高度,子盒子的高度不影响布局
  render() {
    return (
      <div className={styles.sticky}>
        <div className='placeholder' ref={this.placeholderRef}></div>
        <div className='content' ref={this.contentRef}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
export default Sticky