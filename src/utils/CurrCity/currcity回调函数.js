import axios from 'axios'
// 获取当前定位城市
// 异步处理  回调函数
function getCurrCity(callback) {
  // 先查询本地存储
  let city = localStorage.getItem('hkzf_my')
  if (!city) {
    let myCity = new window.BMap.LocalCity();
    myCity.get(async result => {
      // console.log(result)
      // 根据城市名称查询城市信息
      let res = await axios.get('http://localhost:8080/area/info', {
        params: {
          name: result.name
        }
      })
      // console.log(res)
      const { body } = res.data
      // 存储到本地
      localStorage.setItem('hkzf_my', JSON.stringify(body))
      callback(res.data.body)
    })
  } else {
    // 本地获取
    let cityObj = localStorage.getItem('hkzf_my')
    callback(cityObj) 
  }
}
export { getCurrCity }