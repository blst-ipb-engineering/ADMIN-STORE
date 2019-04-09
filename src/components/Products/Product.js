import React, { Component } from 'react';
import './Product.scss';
import { Input, Button, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
import ReactTooltip from 'react-tooltip'
import { Link } from "react-router-dom";


class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {
            idProduct: this.props.produk.id,
            price: this.formatuang(this.props.produk.price),
            errorInput: false,
            savable: true
        }
    }

    formatuang(amount) {
        // deletecomma
        let comadel = amount.toString().replace(/\,/g, '');
        let price = comadel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        return price;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.price !== this.formatuang(this.props.produk.price)) {
            this.setState({ price: this.formatuang(nextProps.produk.price) })
        }
    }

    onChangeHandler = (event) => {
        // validasi input tidak boleh huruf
        let values = event.target.value.toString().replace(/\,/g, '');
        let isNum = /^\d+$/.test(values);

        if (!isNum) {
            this.setState({ errorInput: true, savable: false });
        } else {
            this.setState({ errorInput: false, savable: true });
        }

        let price = this.formatuang(event.target.value);
        this.setState({ price: price })
    }



    cancelHandler = (event) => {
        event.preventDefault();
        this.setState({
            price: this.formatuang(this.props.produk.price),
            errorInput: false
        })
    }

    render() {

        // Validation Error
        let errorNotif = null;
        if (this.state.errorInput) {
            errorNotif = <div className="errorInput">Input yang anda masukkan salah, masukkan angka mas</div>
        }

        // Save Button
        let savebutton = null;
        if (this.state.price !== this.formatuang(this.props.produk.price) && this.state.savable) {
            savebutton = <div ><button style={{ cursor: 'pointer' }}>Save</button>  <a style={{ cursor: 'pointer', fontSize: '9pt' }} onClick={this.cancelHandler}>Cancel</a> </div>;
        }

        return (
            <div className="product-list-admin-wrapper">
                {/* Check */}
                <div className="checkbox">

                </div>
                {/* Product */}
                <div className="product-list-display-wrapper">
                    <div className="box-media">
                        <div className="product-pict" style={{ background: `url(${this.props.images})` }}></div>
                        {/* <img className="img-frame" src="https://www.most.co.id/tradingv2/Image/ShowImage/40?useDefault=False" alt={this.props.produk.name}></img> */}
                    </div>
                    
                        <div className="box-short-desc">
                            <Link to={`/dashboard/products/${this.props.produk.id}/edit`}>
                                <a href={`/dashboard/products/${this.props.produk.id}/edit`} target="_blank">{this.props.produk.name}</a>
                            </Link>
                            {/* <small>Cetakan ke 2</small> */}
                            <div className="ellipsis">{this.props.produk.category_general}</div>
                        </div>
                    
                </div>
                {/* Price    */}

                <div className="change-price-wrapper" style={{ verticalAlign: 'top' }}>
                    <form onSubmit={this.onSubmitHandler}>
                        {errorNotif}
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>Rp</InputGroupText>
                            </InputGroupAddon>
                            {/* <InputMask value={this.props.produk.price} mask="999,999"></InputMask> */}
                            <Input
                                onChange={this.onChangeHandler}
                                type="text"
                                name="price"
                                value={this.state.price}
                                id={this.props.produk.id}
                            ></Input>
                        </InputGroup>
                        {savebutton}
                    </form>
                </div>
                {/* Stock */}
                <div className="stock-info-wrapper" style={{ verticalAlign: 'top', textAlign: 'center' }}>
                    <small>Tersedia</small>
                    <h5>{this.props.produk.stock}</h5>
                </div>
                {/* Edit Publish */}
                <div className="icon-manage-product-wrapper" style={{ verticalAlign: 'top' }}>
                    <ul className="icon-manage-product">
                        <li>
                            <Link to={`/dashboard/products/${this.props.produk.id}/edit`}>
                                <a href="http://localhost:3000/product/edit" data-tip="Ubah">
                                    <i className="nc-icon nc-ruler-pencil" />
                                </a>
                            </Link>
                            <ReactTooltip />
                        </li>
                        <li>
                            <Link to={`/dashboard/products/${this.props.produk.id}/duplicate`}>
                                <a href="http://localhost:3000/product/edit" data-tip="Duplikat">
                                    <i className="nc-icon nc-single-copy-04" />
                                </a>
                            </Link>
                        </li>
                        <li>
                            <a style={{ cursor: "pointer" }} onClick={(event) => this.props.deleteHandler(event, this.props.produk)} data-tip="Hapus">
                                <i className="nc-icon nc-simple-remove" />
                            </a>
                        </li>

                    </ul>
                </div>
            </div>
        )
    }

};

export default Products;
