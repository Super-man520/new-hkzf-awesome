import React from 'react'
import { TabBar } from 'antd-mobile';
// 导入路由
import { Route } from 'react-router-dom'
// 导入组件
import Index from '../Index/Index'
import HouseList from '../HouseList/HouseList'
import News from '../News/News'
import My from '../My/My'
import './home.scss'

const TabBarList = [
  { id: 1, title: '首页', pathname: '/home', icon: 'icon-ind' },
  { id: 2, title: '找房', pathname: '/home/houselist', icon: 'icon-findHouse' },
  { id: 3, title: '咨询', pathname: '/home/news', icon: 'icon-infom' },
  { id: 4, title: '我的', pathname: '/home/my', icon: 'icon-my' }

]
class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname //需要和路径匹配  route包裹的都可以拿到location
  }
  // 组件列表
  tabBarList() {
    return TabBarList.map(item => <TabBar.Item
      title={item.title}
      key="item.id"
      icon={<i className={`iconfont ${item.icon}`}></i>}
      selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
      selected={this.state.selectedTab === item.pathname}
      onPress={() => {
        // console.log(this.props.location)
        this.props.history.push(item.pathname)
        this.setState({
          selectedTab: item.pathname
        })
      }}
    >
    </TabBar.Item>)
  }
  render() {
    return (
      <div className="home">
        <Route path="/home" exact component={Index}></Route>
        <Route path="/home/houselist" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/my" component={My}></Route>
        {/* 底部状态栏 */}
        <TabBar unselectedTintColor="#949494" tintColor="rgb(33, 185, 122)" barTintColor="white" >
          {this.tabBarList()}
        </TabBar>
      </div>
    );
  }
  // 问题:在首页点击导航,跳转到houselist. 对应的tabbar不高亮的问题
  // 原因: 点击导航进入houselist, houselist组件只是重新渲染,不执行创建阶段的钩子函数. 所以selectedTab的值和当前展示路由不一致
  //  解决: 在componentDidUpdate中,修改selectedTab的值
  componentDidUpdate(prevProps, prevState) {
    // console.log(prevProps)
    // console.log(this.props)
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
}
export default Home