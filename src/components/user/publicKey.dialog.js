import React from 'react';
import { Button } from '@rmwc/button';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';


class PublicKeyDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            publicKey: "",
            keyName: "",
        };
    }

    componentDidMount() {
        this.props.provider({
            show: (publicKey, keyName) => this.setState({showDialog: true, publicKey, keyName}),
        });
    }
    componentWillUnmount() {
        this.props.provider(null);
    }

    render() {
        return (
            <Dialog
                id="show-public-key-dialog"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <DialogTitle>{this.state.keyName} - Public Key</DialogTitle>
                <DialogContent>
                    <div id="public-key-content">
                        {this.state.publicKey}
                    </div>
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    <Button onClick={() => alert("Not implemented")}>Copy to Clipboard</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default PublicKeyDialog;