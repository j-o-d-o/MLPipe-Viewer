import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import * as authUtil from 'utils/auth.util';


const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
            authUtil.isLogged() && authUtil.isAdmin() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/not_authorized',
                    state: { from: props.location }
                }} />
            )
    )} />
)

export default AdminRoute;