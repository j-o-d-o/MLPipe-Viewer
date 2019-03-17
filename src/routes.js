// Module Includes
import React from 'react';
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from 'components/routes/privateRoute'; 
import PublicRoute from 'components/routes/publicRoute'; 
import ScrollToTop from 'components/scrollToTop';

// Layouts 
import Layout from 'components/layout';
// Main components
import User from 'components/user';
import Login from 'components/login';
import Register from 'components/register';
import Dashboard from 'components/dashboard';
import Jobs from 'components/jobs';
import JobDetails from 'components/jobDetails';
// Error Pages
import Error404 from 'components/errors/404';


export default (
    <Layout>
        <ScrollToTop>
            <Switch>
                <PublicRoute exact path="/login" component={Login} />
                <PublicRoute exact path="/register" component={Register} />

                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/user/:user" component={User} />
                <PrivateRoute exact path="/job" component={Jobs} />
                <PrivateRoute path="/job/:job" component={JobDetails} />

                <Route component={Error404} />
            </Switch>
        </ScrollToTop>
    </Layout>
);