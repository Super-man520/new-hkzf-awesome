import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile'

import { Link } from 'react-router-dom'
import { API } from '../../utils/API'
import { Toast } from 'antd-mobile'
import { setToken } from '../../utils/Token'

import NavHeader from '../../components/NavHeader/Navheader'

import styles from './login.module.scss'
import { ErrorMessage, withFormik } from 'formik'
import * as Yup from "yup"

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    // console.log(this.props)
    let { handleSubmit, values, handleChange } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                placeholder="请输入账号"
                value={values.username}
                onChange={handleChange}
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            <ErrorMessage
              className={styles.error}
              name="username"
              component="span">
            </ErrorMessage>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
                value={values.password}
                onChange={handleChange}
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            <ErrorMessage
              className={styles.error}
              name="password"
              component="span">
            </ErrorMessage>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
const config = {

  mapPropsToValues: () => ({ username: '', password: '' }),

  // values formik中管理的表单项的值
  // props里面有需要用的路由信息
  handleSubmit: async (values, { props }) => {
    console.log(values, props)
    let { username, password } = values
    let res = await API.post(`/user/login`, { username, password })
    // console.log(res)
    let { status, description, body } = res.data
    if (status === 400) {
      Toast.info(description, 2)
    }
    if (status === 200) {
      // 设置token到本地
      setToken(body.token)
      Toast.info(description, 2)
      // 判断是不是鉴权组件过来的
      let $state = props.location.state
      if ($state) {
        // props.history.replace($state.from.pathname)
      } else {
        // props.history.go(-1)
      }
    }
  },
  // 提供一个任意的正则表达式以匹配该值  
  // string.matches(regex: Regex, message?: string | function): Schema
  // 配合yup实现表单校验的配置项
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号为必填项')
      .matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string()
      .required('密码为必填项')
      .matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),
}
const WithLogin = withFormik(config)(Login)

export default WithLogin
