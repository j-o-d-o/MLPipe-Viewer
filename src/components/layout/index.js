import React from 'react';


class Layout extends React.Component {
    render(){
        return(
            <section id="layout_root">
                Layout thingy
                {this.props.children}
            </section>
        ); 
    }
}

export default Layout