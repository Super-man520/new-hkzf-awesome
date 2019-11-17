import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/antd-mobile/dist/antd-mobile.min.css'; 
// or 'antd/dist/antd.less'
// 引入字体css
import './assets/fonts/iconfont.css'
import './index.css';
import App from './App';
// import Demo from './components/zujian/jinjie'
// import TabBarExample from './components/footer/index'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
