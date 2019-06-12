import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';

import * as authUtil from 'utils/auth.util';
import * as authActions from 'redux/actions/auth';

import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from '@rmwc/top-app-bar';
import {
    Drawer,
    DrawerHeader,
    DrawerContent,
    DrawerTitle,
} from '@rmwc/drawer';
import {
    List,
    ListItem,
} from '@rmwc/list';
import { Fab } from '@rmwc/fab';
import { Button } from '@rmwc/button';


class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sideMenuOpen: false
        };
    }

    render() {
        const isLogged = authUtil.isLogged();
        const isAdmin = authUtil.isAdmin();
        let loggedUser = {};
        let TopAppBarSectionContent;
        let SideMenuContent;
        if(isLogged){
            loggedUser = authUtil.getUser();
            TopAppBarSectionContent = (
                <TopAppBarSection alignEnd>
                    {/*
                    <Button className="nav-button">
                        <NavLink exact to="/dashboard" activeClassName="active-route">Dashboard</NavLink>
                    </Button>
                    */}
                    <Button className="nav-button">
                        <NavLink to="/job" activeClassName="active-route">Jobs</NavLink>
                    </Button>
                    <Button className="nav-button">
                        <NavLink exact to={"/user/" + loggedUser._id} activeClassName="active-route">Profile</NavLink>
                    </Button>
                    { isAdmin && 
                        <Button className="nav-button">
                            <NavLink exact to="/admin_panel" activeClassName="active-route">Admin Panel</NavLink>
                        </Button>
                    }
                </TopAppBarSection>
            )

            SideMenuContent = (
                <List>
                    {/* 
                    <ListItem>
                        <NavLink exact to="/dashboard" activeClassName="active-route"
                            onClick={() => this.setState({sideMenuOpen: false})}>Dashboard</NavLink>
                    </ListItem>
                    */}
                    <ListItem>
                        <NavLink exact to="/job" activeClassName="active-route"
                            onClick={() => this.setState({sideMenuOpen: false})}>Jobs</NavLink>
                    </ListItem>
                    <ListItem>
                        <NavLink exact to={"/user/" + loggedUser._id} activeClassName="active-route"
                            onClick={() => this.setState({sideMenuOpen: false})}>Profile</NavLink>
                    </ListItem>
                    { isAdmin && 
                        <ListItem>
                            <NavLink exact to="/admin_panel" activeClassName="active-route"
                                onClick={() => this.setState({sideMenuOpen: false})}>Admin Panel</NavLink>
                        </ListItem>
                    }
                </List>
            );
        }
        else {
            TopAppBarSectionContent = (
                <TopAppBarSection alignEnd>
                    <Button className="nav-button">
                        <NavLink exact to="/login" activeClassName="active-route">Login</NavLink>
                    </Button>
                </TopAppBarSection>
            );

            SideMenuContent = (
                <List>
                    <ListItem>
                        <NavLink exact to="/login" activeClassName="active-route"
                            onClick={() => this.setState({sideMenuOpen: false})}>Login</NavLink>
                    </ListItem>
                </List>
            );
        }

        return (
            <TopAppBar>
                <LoadingBar style={{backgroundColor: "#424242"}} progressIncrease={13} />
                <TopAppBarRow>
                    <TopAppBarSection alignStart>
                        <TopAppBarTitle>
                            <NavLink id="logo" style={{"textDecoration": "none", "color": "white"}} exact to="/">
                                <img src="../images/icon.svg" alt="icon" />
                            </NavLink>
                            <Fab id="menu-icon" onClick={() => this.setState({sideMenuOpen: true})} icon="menu" />
                        </TopAppBarTitle>
                    </TopAppBarSection>
                    {TopAppBarSectionContent}
                </TopAppBarRow>


                <Drawer
                    modal
                    id="drawer"
                    open={this.state.sideMenuOpen}
                    onClose={() => this.setState({sideMenuOpen: false})}
                >
                <DrawerHeader id="drawer-header">
                    <DrawerTitle id="drawer-title">MLPipe</DrawerTitle>
                </DrawerHeader>
                <DrawerContent id="drawer-content">
                    {SideMenuContent}
                </DrawerContent>
                </Drawer>
            </TopAppBar>
        );
        
    }
}


const mapDispatchToProps = {authActions}

// { pure: false } needed for NavLink to update the activeClassName
export default withRouter(connect(null, mapDispatchToProps, null, { pure: false })(Header))