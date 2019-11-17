import React from 'react'

class Common extends React.Component {
  state = {
    x: 0,
    y: 0
  }
  render() {
    let { x, y } = this.state
    return (
      this.props.children(x, y)
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
class Node1 extends React.Component {
  render() {
    let { x, y } = this.props
    return (
      <h1>x{x}-----y{y}</h1>
    )
  }
}
class Node2 extends React.Component {
  render() {
    let { x, y } = this.props
    return (
      <h1>x{x}-----y{y}</h1>
    )
  }
}
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Common>{(x, y) => (<Node1 x={x} y={y}></Node1>)}</Common>
        <Common>{(x, y) => (<Node2 x={x} y={y}></Node2>)}</Common>
      </div>
    )
  }
}
export default Demo