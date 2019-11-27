import React from 'react'
import { NavBar, Toast } from 'antd-mobile'
// 导入当前城市
import { getCurrCity } from '../../utils/CurrCity/currcity'
// 导入顶部导航栏
import NavHeader from '../../components/NavHeader/navheader'
import './citylist.scss'
import axios from 'axios'
import { API } from '../../utils/API'
// 导入列表
import { List, AutoSizer } from 'react-virtualized'
// 定义标题和城市的高度
const TITLE_HEIGHT = 45  //列表的高度
const CITY_TITLE = 36  //标题高度
const CITY_NAME = 50  //内容高度
const ACTIVE_CITY = ['北京', '上海', '深圳', '广州']
// 城市数据的处理格式
function formatcityData(data) {
  let citylist = {}
  data.forEach(item => {
    // 获取每一个城市的首字母
    let first = item.short.charAt(0)
    // console.log(first)
    // 如果有，直接往该分类中push数据 变量要用[]包裹   k in obj 判断值是否在对象中
    //  if (first in citylist)
    if (citylist[first]) {
      citylist[first].push(item)
    } else {
      citylist[first] = [item]
    }
  })
  // 城市下标 并排序
  const cityIndex = Object.keys(citylist).sort()
  // console.log(citylist)
  return { citylist, cityIndex }
}
// 格式转换 数组中的字符
function formatletter(letter) {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}
// 格式化右侧字母列表
function formatArrletter(letter) {
  switch (letter) {
    case 'hot':
      return '热'
    default:
      return letter.toUpperCase()
  }
}

// Render your list
class CityList extends React.Component {
  state = {
    citylist: {},  //城市对象
    cityIndex: [],  //城市首字母下标
    selectedLetter: 0   //设置开始的滚动行
  }
  // 创建实例  获取react-virtualized的实例
  listRef = React.createRef()
  // 获取城市列表信息
  async getCityList() {
    let city = await API.get('area/city', {
      params: {
        level: 1
      }
    })
    const { body } = city.data
    // console.log(body)
    // 获取到城市列表之后进行数据格式化
    let { citylist, cityIndex } = formatcityData(body)
    // 获取热门城市
    const hotcity = await API.get('area/hot')
    // 把热门城市信息,添加到citylist中
    citylist['hot'] = hotcity.data.body
    // hot属性添加到数组中
    cityIndex.unshift('hot')
    // 获取当前城市
    let currcity = await getCurrCity()
    console.log(currcity)
    // 往列表和数组中添加#
    citylist['#'] = [currcity]
    cityIndex.unshift('#')
    // 设置数据
    this.setState({
      citylist,
      cityIndex
    })
  }
  async componentDidMount() {
    await this.getCityList()
    // 调用 measureAllRows
    // 由于react-virtualized这个包,是用于视口渲染的长列表组件
    // 导致不会一次性把所有的行都渲染出来,从而使我们让列表滚动的时候,
    // 滚动的位置会有误差. 所有我们要调用list组件提供的方法measureAllRows,来提前测量整个列表的高度. 但是要注意,要测试高度,必须得现有数据才行
    // console.log(this.listRef.current)
    this.listRef.current.measureAllRows()
  }
  changeCity = (city) => {
    console.log(city)
    // 判断点击是否是当前城市
  }
  // 定义每一行的高度
  cityHeight = ({ index }) => {
    // console.log(index)
    // 先获取下标  获取对应的字符  找到对应的数组
    let { citylist, cityIndex } = this.state
    let letter = cityIndex[index]
    let list = citylist[letter]
    // 算出高度
    let result = CITY_TITLE + CITY_NAME * list.length
    // console.log(result)
    return result
  }
  // 页面滚动
  RowsRendered = ({ startIndex, stopIndex }) => {
    // console.log(this.listRef)
    console.log(startIndex, stopIndex)

    //给selectedLetter赋值 startIndex

    //注意: 由于列表中每一行数据高度不同,有时候,滚动页面,但是并不需要修改selectedletter的值. 所以加一个判断,提高性能
    if (this.state.selectedLetter === startIndex) return
    this.setState({
      selectedLetter: startIndex
    })
  }
  // List组件中要调用的函数
  rowRenderer = ({ key, index, style }) => {
    let { citylist, cityIndex } = this.state
    console.log(key)
    console.log(style)

    // 城市名称的渲染 要根据citylist中字符对应的数组的长度渲染
    // 1. 首先渲染的是哪个字符信息
    let letter = cityIndex[index]
    // 2. 接下来获取到citylist中对应的那个数组
    let list = citylist[letter]
    return (
      <div key={key} style={style} className='city'>
        <div className='title'>{formatletter(letter)}</div>
        {list.map(item => (
          <div
            key={item.value}
            className='name'
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  render() {
    let { citylist, cityIndex, selectedLetter } = this.state
    return (
      <div className='citylist'>
        {/* 顶部导航栏 */}
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {({ width, height }) => (
            // 注意: 如果要获取到第三方组件的实例对象,可以通过ref
            <List
              // 控制滚动行的对齐方式: 默认值是auto.
              // auto : 尽可能少的滚动,让对应行完全展示即可
              // start: 滚动行和列表顶部对齐
              // end: 滚动行和列表底部对齐
              // center: 滚动行在列表中间
              scrollToAlignment='start'
              ref={this.listRef}
              width={width} // 列表整体宽度
              height={height - TITLE_HEIGHT} // 列表整体高度
              rowCount={cityIndex.length} // 有多少条数据
              //  rowHeight 可以传一个数字,也可以传函数
              //({ index: number }): number
              rowHeight={this.cityHeight} // 每一行的高度
              rowRenderer={this.rowRenderer}
              // 这个属性的值,是一个回调函数.这个回调函数在行被重新渲染的时候调用. list组件调用这个函数,并且会把相应的一些信息,传入到这个函数中
              // overscanstartindex: 预加载的开始行的下标值
              // overscanstopindex: 预加载的结束行的下标志
              // startindex: 在视口中看到的第一行的数据的下标
              // stopindex: 在视口中蛋刀的最后一行的数据的下标
              // 这些属性的值都是数字
              // viod是js中一个关键字,表示没有返回值
              // ({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void
              onRowsRendered={this.RowsRendered}
            />
          )}
        </AutoSizer>
        {/* 右侧城市列表数据： */}
        <ul className='city-index'>
          {cityIndex.map((item, index) => (
            <li
              key={item}
              className='city-index-item'
              onClick={() => {
                this.listRef.current.scrollToRow(index)
                this.setState({
                  selectedLetter: index
                })
              }}
            >
              {/* 高亮类名： index-active */}
              <span className={index === selectedLetter ? 'index-active' : ''}>
                {formatArrletter(item)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
export default CityList