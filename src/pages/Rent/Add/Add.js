import React from 'react'
// 导入头部组件
import WithNavHeader from '../../../components/NavHeader/Navheader'
import { API } from '../../../utils/API'
import { isAuth } from '../../../utils/Token'
import HousePackage from '../../../components/HousePackage/HousePackage'
import styles from './add.module.scss'
// 导入antd
import { Flex, List, InputItem, Picker, ImagePicker, TextareaItem, Modal, Toast } from 'antd-mobile'
const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]
class Add extends React.Component {

  constructor(props) {
    super(props)
    // console.log(props)
    const { state } = props.location
    // 小区的名称和id
    const community = {
      name: '',
      id: ''
    }
    // 从小区名称搜索框传回来的数据
    if (state) {
      community.name = state.name
      community.id = state.id
    }
    this.state = {
      // 临时图片地址
      tempSlides: [],
      // 小区名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }
  // 获取房屋配置数据
  handleSupporting = (value) => {
    // console.log(value)
    this.setState({
      supporting: value.join('|')
    })
  }
  // 获取表单数据
  getValue = (name, value) => {
    // console.log(name, value)
    this.setState({
      [name]: value
    })
  }
  // 点击跳转
  onCancel = () => {
    // console.log(123)
    alert('友情提示', '要放弃百万机会么?', [
      { text: '再想想' },
      {
        text: '是的', onPress: () => {
          this.props.history.go(-1)
        }
      }
    ])
  }
  // 房屋图像
  handleHouseImg = (file, type, index) => {
    console.log(file, type, index)
    this.setState({
      tempSlides: file
    })
  }
  // 发布房源
  addHouse = async () => {
    let {
      tempSlides,
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community,
      houseImg
    } = this.state
    // 判断有无登录
    if (!isAuth) {
      Toast.info('还没有登陆,登录才能发布',1)
      return
    }
    // 上传房屋图片
    if (tempSlides.length > 0) {
      // 已经有上传的图片了
      // xhr2.0新特性 xhr FormData
      let formData = new FormData()
      tempSlides.forEach(item => {
        // console.log(item.file)
        formData.append('file', item.file)
      })
      // console.log(formData.getAll('file'))
      let res = await API.post(`/houses/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      // console.log(res)
      let houseImg = res.data.body.join('|')
      this.setState({
        houseImg
      })
    }
    // 发布房源
    let result = await API.post(`user/houses`, {
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community: community.id,
      houseImg
    })
    console.log(result)
    if (result.data.status === 400) {
      alert('友情提示', '你还没有登录,登录才能发布', [
        { text: '不想登录' },
        {
          text: '去登陆', onPress: () => {
            this.props.history.replace('/login', {
              from: this.props.location
            })
          }
        }
      ])
    } else if (result.data.status === 200) {
      Toast.info('添加成功', 1)
      this.props.history.replace('/rent')
    }
  }
  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = this.state
    return (
      <div className={styles.rentadd}>
        <WithNavHeader onLeftClick={this.onCancel}>发布租房</WithNavHeader>


        {/* 房源信息 */}
        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          {/* 相当于 form 表单的 input 元素 */}
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            onChange={val => this.getValue('price', val)}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={val => this.getValue('size', val)}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            cols={1}
            onChange={val => this.getValue('roomType', val[0])}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
            onChange={val => this.getValue('floor', val[0])}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
            onChange={val => this.getValue('oriented', val[0])}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        {/* 房屋标题 */}
        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={val => this.getValue('title', val)}
          />
        </List>

        {/* 房屋图像 */}
        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            onChange={this.handleHouseImg}
            multiple={true}
            className={styles.imgpicker}
          />
        </List>

        {/* 房屋配置 */}
        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackage select onSelect={this.handleSupporting} list={[]} />
        </List>

        {/* 房屋描述 */}
        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            value={description}
            onChange={val => this.getValue('description', val)}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
export default Add