// Module Includes
import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from 'shared/route_restriction.component' 

// Layouts 
import Layout from 'shared/layout';
// Main components
import User from 'features/user/user_page/user_page.component';
import Login from 'features/auth/login_page/login_page.component';
import Register from 'features/auth/login_page/login_page.component';
import Dashboard from 'features/user/register_page/register_page.component';
// Error Pages
import Error_404 from 'features/errors/error_404.component';

 
export default (
    <Layout>
        <Switch>
            <PublicRoute exact path="/login" component={Login} />
            <PublicRoute exact path="/register" component={Register} />

            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/user/:user" component={User} />

            <Route component={Error_404} />
        </Switch>
    </Layout>
);