const getToken = () => localStorage.getItem('token_my')
const setToken = (token) => localStorage.setItem('token_my', token)
const removeToken = () => localStorage.removeItem('token_my')

// 是否登录  转换为布尔值
const isAuth = () => !!getToken()

export { getToken, setToken, removeToken, isAuth }