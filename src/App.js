import React from 'react'

import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import CityList from './pages/CityList/CityList'
import Map from './pages/Map/Map'
import Login from './pages/Login/Login'
import House from './pages/House/House'
import Details from './pages/Details/Details'
import Registe from './pages/Registe/Registe'
// 引入鉴权路由
import AuthRoute from './pages/AuthRoute/AuthRoute'
import Rent from './pages/Rent/Rent'
import RentAdd from './pages/Rent/Add/Add'
import RentSearch from './pages/Rent/Search/Search'
class App extends React.Component {
  render() {
    return (
      <Router>
        {/* 渲染 Redirect 这个组件,就可以实现重定向 */}
        <Route path="/" exact render={() => <Redirect to="/home" />}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path='/map' component={Map}></Route>
        <Route path='/login' component={Login}></Route>
        <Route path='/house' component={House}></Route>
        <Route path='/details/:id' component={Details}></Route>
        <Route path='/registe' component={Registe}></Route>
        {/* 配置登录后，才能访问的页面 */}
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </Router>
    )
  }
}

export default App;
