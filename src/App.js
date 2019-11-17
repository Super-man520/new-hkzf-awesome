import React from 'react'
// import {PosOne, PosTwo} from './components/zujian/higer'
// class App extends React.Component {
//   render() {
//     return(
//       <div>
//         <PosOne></PosOne>
//         <PosTwo></PosTwo>
//       </div>
//     )
//   }
// }
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import CityList from './pages/CityList/CityList'
import Map from './pages/Map/Map'
import Login from './pages/Login/Login'
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
      </Router>
    )
  }
}

export default App;
