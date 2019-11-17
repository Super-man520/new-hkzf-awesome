import React from 'react'
function withComponent(HigerComponent) {
  class Common extends React.Component {
    state = {
      x: 0,
      y: 0
    }
    render() {
      let { x, y } = this.state
      return (
        <HigerComponent x={x} y={y}></HigerComponent>
      )
    }
    componentDidMount() {
      document.addEventListener('mousemove', this.handleMove)
    }
    handleMove = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY
      })
    }
  }
  return Common
}
class Posone extends React.Component {
  render() {
    let { x, y } = this.props
    return (
      <h1>x的坐标是{x}-----y的坐标是{y}</h1>
    )
  }
}
class Postwo extends React.Component {
  render() {
    let { x, y } = this.props
    return (
      <h1>x的坐标是{x}-----y的坐标是{y}</h1>
    )
  }
}
let PosOne = withComponent(Posone)
let PosTwo = withComponent(Postwo)
export { PosOne, PosTwo }