import React from 'react'
// import { NavBar } from 'antd-mobile'
// 导入当前城市
import { getCurrCity } from '../../utils/CurrCity/currcity'
// 导入顶部导航栏
import NavHeader from '../../components/NavHeader/navheader'
import './citylist.scss'
import axios from 'axios';
// 城市数据的处理格式
const cityData = (list) => {
  let cityObj = {}
  list.forEach(item => {
    // 获取每一个城市的首字母
    let first = item.short.charAt(0)
    // console.log(first)
    // 如果有，直接往该分类中push数据 变量要用[]包裹   k in obj 判断值是否在对象中
    //  if (first in cityObj)
    if (cityObj[first]) {
      cityObj[first].push(item)
    } else {
      cityObj[first] = [item]
    }
  })
  // 城市下标 并排序
  const cityIndex = Object.keys(cityObj).sort()
  // console.log(cityObj)
  return { cityObj, cityIndex }
}
class CityList extends React.Component {
  state = {
    cityList: [],
    cityObj: {},  //城市对象
    cityIndex: [],  //城市首字母下标
    hotCity: []
  }
  // 获取城市列表信息
  async getCityList() {
    let res = await axios.get('http://localhost:8080/area/city', {
      params: {
        level: 1
      }
    })
    const { body } = res.data
    // console.log(body)
    const { cityObj, cityIndex } = cityData(body)
    // 设置数据
    this.setState({
      cityList: body,
      cityObj,
      cityIndex
    })
    // console.log(this.state.cityObj)
    // console.log(this.state.cityIndex)
  }
  // 获取热门城市
  async getHotCity() {
    const res = await axios.get('http://localhost:8080/area/hot')
    const { body } = res.data
    this.setState({
      hotCity: body
    })
    // console.log(this.state.hotCity)
  }
  async componentDidMount() {
    this.getCityList()
    this.getHotCity()
    let res = await getCurrCity()
    console.log(res)
  }
  render() {
    return (
      <div>
        <NavHeader>城市选择</NavHeader>
      </div>
    )
  }
}
export default CityList