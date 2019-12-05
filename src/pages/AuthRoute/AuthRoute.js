import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/Token'
// 接受的参数的剩余
const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuth() ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
    }
  />
)
export default AuthRoute