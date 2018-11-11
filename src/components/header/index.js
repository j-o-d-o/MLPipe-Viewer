import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingBar from 'react-redux-loading-bar';

import * as authUtil from 'utils/auth.util';
import * as authActions from 'components/auth/actions';

import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from '@rmwc/top-app-bar';
import { Button } from '@rmwc/button';


function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch),
    };
}
class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.logout = this.logout.bind(this);
    }

    logout(e) {
        this.props.actions.logout();
        window.location.href = "/";
    }

    render() {
        const isLogged = authUtil.isLogged();
        let loggedUser = {};
        if(isLogged){
            loggedUser = authUtil.getUser();
        }
        return (
            <TopAppBar>
                <LoadingBar id="loading-bar" progressIncrease={13} />
                <TopAppBarRow>
                    <TopAppBarSection alignStart>
                        <TopAppBarTitle>
                            <NavLink style={{"textDecoration": "none", "color": "white"}} exact to="/">MLPipe</NavLink>
                        </TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection alignEnd>
                        <Button className="nav-button" theme="on-primary">
                            <NavLink exact to="/register" activeClassName="active-route">Register</NavLink>
                        </Button>
                        <Button className="nav-button">
                            <NavLink exact to="/login" activeClassName="active-route">Login</NavLink>
                        </Button>
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
        );
        
    }
}

// { pure: false } needed for NavLink to update the activeClassName
export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Header)