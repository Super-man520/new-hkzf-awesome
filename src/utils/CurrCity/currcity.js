// import axios from 'axios'
import {API} from '../API'
// 获取当前定位城市
// 异步处理  回调函数
function getCurrCity() {
  // 先查询本地存储
  let city = localStorage.getItem('hkzf_my')
  if (!city) {
    return new Promise(resolve => {
      let myCity = new window.BMap.LocalCity();
      myCity.get(async result => {
        // console.log(result)
        // 根据城市名称查询城市信息
        let res = await API.get('area/info', {
          params: {
            name: result.name
          }
        })
        // console.log(res)
        const { body } = res.data
        // 存储到本地
        localStorage.setItem('hkzf_my', JSON.stringify(body))
        resolve(res.data.body)
      })
    })
  } else {
    // 本地获取
    let cityObj = JSON.parse(city)
    // return new Promise(reslove => reslove(cityObj))
    return Promise.resolve(cityObj)
  }
}
export { getCurrCity }