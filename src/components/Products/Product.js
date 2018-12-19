import React, {Component} from 'react';
import './Product.css';
import { Input,Button, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';

class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {
            idProduct: this.props.produk.id,
            price: this.formatuang(this.props.produk.price),
            errorInput: false
        }
    }

    formatuang(amount) {
        // deletecomma
        let comadel = amount.toString().replace(/\,/g,'');        
        let price = comadel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
		return price;
    }
    
    onChangeHandler= (event) => { 
        // validasi input tidak boleh huruf
        let values = event.target.value.toString().replace(/\,/g,'');
        let isNum = /^\d+$/.test(values);
        
        if(!isNum) {
            this.setState({errorInput:true});
        }else {
            this.setState({errorInput:false});
        }

        let price = this.formatuang(event.target.value);    
        this.setState({price:price})        
    }

    componentDidMount() {
        
    }

    cancelHandler = (event) => {
        event.preventDefault();
        this.setState({
            price:this.formatuang(this.props.produk.price)
        })
    }


    render() {

        // Validation Error
        let errorNotif = null;
        if(this.state.errorInput){
            errorNotif = <div className="errorInput">Input yang anda masukkan salah, masukkan angka mas</div>
        }

        // Save Button
        let savebutton = null; 
        if(this.state.price !== this.formatuang(this.props.produk.price)){
            savebutton = <div ><button style={{cursor:'pointer'}}>Save</button>  <a style={{cursor:'pointer', fontSize:'9pt'}} onClick={this.cancelHandler}>Cancel</a> </div> ;
        }

        return (
            <tr>
        {/* Check */}
        <td>

        </td>
        {/* Product */}
        <td>
            <div className="products-display-container">
                <div className="box-media">
                    <div className="loading-pict"></div>
                    {/* <img className="img-frame" src="https://www.most.co.id/tradingv2/Image/ShowImage/40?useDefault=False" alt={this.props.produk.name}></img> */}
                </div>
                <div className="box-short-desc">
                    <a href="http://google.com" target="_blank">{this.props.produk.name}</a>
                    <small>Cetakan ke 2</small>
                    <div className="ellipsis">Makanan & Minuman - Minuman - Teh</div> 
                </div>                
            </div>
        </td>   
        {/* Price    */}
        <td>
            <form onSubmit={this.onSubmitHandler}>
                {errorNotif}
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>Rp</InputGroupText>
                    </InputGroupAddon>
                    {/* <InputMask value={this.props.produk.price} mask="999,999"></InputMask> */}
                    <Input
                    onChange = {this.onChangeHandler}
                    type="text"                    
                    name="price"    
                    value={this.state.price}                
                    id ={this.props.produk.id}
                    ></Input>
                </InputGroup>                   
                {savebutton}               
            </form>
        </td>
        {/* Stock */}
        <td>

        </td>
        {/* Edit Publish */}
        <td>

        </td>
    </tr>
        )
    }
    
};

export default Products;
