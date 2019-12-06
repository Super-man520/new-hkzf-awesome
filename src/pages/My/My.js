import React from 'react'
import { Grid, Modal, Button } from 'antd-mobile'
import BASE_URL from '../../utils/url'
import { API } from '../../utils/API'
import { isAuth, removeToken } from '../../utils/Token'
import styles from './my.module.scss'
import { Link } from 'react-router-dom'
// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  { id: 4, name: '成为房主', iconfont: 'icon-identity' },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]
// 默认头像
const DEFAULT_AVATAR = BASE_URL + 'img/profile/avatar.png'
const alert = Modal.alert
class My extends React.Component {
  state = {
    // 是否登陆
    isLogin: isAuth(),
    // 用户信息
    userInfo: {
      avatar: '',
      nickname: ''
    }
  }
  async componentDidMount() {
    this.getUserInfo()
  }
  // 退出登录
  logout = () => {
    alert('友情提示', '你确定要退出么???', [
      { text: '取消', style: 'default' },
      {
        text: '确认', onPress: async () => {
          // 调用登出接口
          await API.post(`user/logout`)
          // 移除token
          removeToken()
          // 恢复默认状态
          this.setState({
            isLogin: false,
            userInfo: {
              avatar: '',
              nickname: ''
            }
          })
        }
      },
    ])
  }
  // 获取用户信息
  async getUserInfo() {
    // 如果用户未登录 则停止发送ajax
    if (!this.state.isLogin) {
      return
    }
    let res = await API.get('user')
    // console.log(res)
    //状态分两种  登录成功和token失效、
    if (res.data.status === 200) {
      const { avatar, nickname } = res.data.body
      this.setState({
        userInfo: {
          avatar: `http://localhost:8080` + avatar,
          nickname
        }
      })
    } else {
      // token失效或过期的登陆失败
      this.setState({
        isLogin: false
      })
    }
  }
  render() {
    const { history } = this.props
    const { isLogin, userInfo: { avatar, nickname } } = this.state
    return (
      <div className={styles.my}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + 'img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={avatar || DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {isLogin ? (
                <>
                  {/* 登录后展示： */}
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    编辑个人资料
                  <span className={styles.arrow}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                  // 未登录展示：
                  <div className={styles.edit}>
                    <Button
                      type="primary"
                      size="small"
                      inline
                      onClick={() => history.push('/login')}
                    >
                      去登录
                </Button>
                  </div>
                )}

            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + 'img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
export default My