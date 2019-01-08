import React, {Component} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Toaster extends Component {
    

    notify = () => {               
        toast.warn(this.props.message, {
            position: toast.POSITION.BOTTOM_LEFT
          });
    };

    render() {        
        if(this.props.isOpen){
            this.notify();
        }

        return (
            <div>                
                <ToastContainer />
            </div>
        )
    }
}

export default Toaster;