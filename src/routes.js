// Module Includes
import React from 'react';
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from 'components/routes/privateRoute'; 
import PublicRoute from 'components/routes/publicRoute'; 

// Layouts 
import Layout from 'components/layout';
// Main components
import Lander from 'components/lander';
import User from 'components/user';
import Login from 'components/auth/login.js';
import Register from 'components/auth/register';
import Dashboard from 'components/dashboard';
// Error Pages
import Error404 from 'components/errors/404';


export default (
    <Layout>
        <Switch>
            <Route exact path="/" component={Lander} />

            <PublicRoute exact path="/login" component={Login} />
            <PublicRoute exact path="/register" component={Register} />

            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/user/:user" component={User} />

            <Route component={Error404} />
        </Switch>
    </Layout>
);