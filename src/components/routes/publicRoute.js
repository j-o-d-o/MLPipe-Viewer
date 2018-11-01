import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import * as authUtil from 'utils/auth.util';


const PublicRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
            !authUtil.isLogged() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/dashboard'
                }} />
            )
    )} />
)

export default PublicRoute;