// Module Includes
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from 'components/routes/privateRoute';
import PublicRoute from 'components/routes/publicRoute';
import AdminRoute from 'components/routes/adminRoute';
import ScrollToTop from 'components/scrollToTop';

// Layouts 
import Layout from 'components/layout';
// Main components
import User from 'components/user';
import Login from 'components/login';
import Dashboard from 'components/dashboard';
import Jobs from 'components/jobs';
import JobDetails from 'components/jobDetails';
import AdminPanel from 'components/adminPanel';
// Error Pages
import Error404 from 'components/errors/404';
import Error401 from 'components/errors/401';


export default (
    <Layout>
        <ScrollToTop>
            <Switch>
                <PublicRoute exact path="/login" component={Login} />

                <PrivateRoute exact path="/" component={Jobs} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/user/:user" component={User} />
                <PrivateRoute exact path="/job" component={Jobs} />
                <PrivateRoute path="/job/:job" component={JobDetails} />

                <AdminRoute path="/admin_panel" component={AdminPanel} />

                <Route exact path="/not_authorized" component={Error401} />

                <Route component={Error404} />
            </Switch>
        </ScrollToTop>
    </Layout>
);