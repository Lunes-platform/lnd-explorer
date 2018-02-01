import React from 'React';
import PropTypes from 'prop-types';
import { Toast } from './components/toast';
import { withSocket } from '../../services/socket';

export class ToastContainerComponent extends React.Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
  };

  state = {
    toasts: [],
  };

  componentDidMount() {
    let { socket } = this.props;
    socket.on('openchannel', this.onOpenChannel);
    socket.on('openchannelerror', this.onOpenChannelError);
    socket.on('closechannel', this.onCloseChannel);
    socket.on('closechannelerror', this.onClock);
  }

  componentWillUnmount() {
    let { socket } = this.props;
    socket.off('openchannel', this.onChannelOpen);
    socket.off('openchannelerror', this.onOpenChannelError);
    socket.off('closechannel', this.onCloseChannel);
    socket.off('closechannelerror', this.onCloseChannelError);
  }

  onOpenChannel = msg => {
    let toast = { type: 'success ' };
    if (msg.update === 'chan_pending') toast.message = 'Open channel has been initialized';
    if (msg.update === 'chan_open') toast.message = 'Channel has been successfully opened';
    this.addToast(toast);
  };

  onOpenChannelError = err => {
    let toast = { type: 'danger', message: 'Failed to open channel with error: ' + err.details };
    this.addToast(toast);
  };

  onCloseChannel = msg => {
    console.log(msg);
    let toast = { type: 'success' };
    if (msg.update === 'close_pending') toast.message = 'Close channel has been initiated';
    if (msg.update === 'chan_close') toast.message = 'Channel has been closed';
    this.addToast(toast);
  };

  onCloseChannelError = err => {
    let toast = { type: 'danger', message: 'Failed to close channel with error: ' + err.details };
    this.addToast(toast);
  };

  addToast = toast => {
    let toasts = this.state.toasts.slice();
    toasts.push(toast);
    this.setState({ toasts });
  };

  removeToast = toast => {
    let toasts = this.state.toasts.slice();
    let index = toasts.findIndex(t => t === toast);
    toasts = toasts.splice(index, 1);
    this.setState({ toasts });
  };

  render() {
    let { toasts } = this.state;
    return (
      <div className="toast-container">
        {toasts.map((toast, i) => (
          <Toast key={'toast-' + i} toast={toast} toastClosed={this.removeToast} />
        ))}
      </div>
    );
  }
}

export const ToastContainer = withSocket(ToastContainerComponent);
