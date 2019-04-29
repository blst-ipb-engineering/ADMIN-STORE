import React, { Component } from "react";
import { Card, Button, Modal, ModalHeader, ModalBody, Input, ModalFooter, Table, CardBody, Row, Col } from "reactstrap";
import Products from '../../components/Products/Product';
import { Link } from "react-router-dom";
import './Products.css';
import * as actionCreator from '../../store/action/index';
import { connect } from 'react-redux';
import LoadingProductAdmin from '../../components/UI/LoadingData/ProductList/Loadingdata';
import InfiniteScroll from '../../components/InfinityScroller';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import SpinnerGif from "../../assets/img/spinner-loading.gif";




import icons from "../../variables/icons";
import axios from "axios";

import {
  ProductList,
  ProductDelete,
  CategoryListCompany
} from '../../api/index';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loadingdata: true,
      modal: false,
      delete_product: {
        id: null,
        name: null,
        price: null,
        picture_url: null,
        category_general: null
      },
      page: 1,
      limit: 5,            
      name: null,
      hasMoreItems: true,
      count: null,
      maxPages: null,

      categories: [],
      category_selected: [],
      querysearch: null,
      isFetching:false,

      sortby: [
        {
          id:"name",
          value:"Nama",
          label:"Nama"
        },
        {
          id:"weight",
          value:"Berat",
          label:"Berat"
        },
        {
          id:"promoPrice",
          value:"Harga",
          label:"Harga"
        },
        {
          id:"pages",
          value:"Halaman",
          label:"Halaman"
        },
        {
          id:"stok",
          value:"Ketersediaan",
          label:"Ketersediaan"
        },
        {
          id:"royalti_percent",
          value:"Royalti",
          label:"Royalti"
        }
      ],
      sortbySelect : {
        id:"name",
        value:"Nama",
        label:"Nama"
      },

      order: [
        {
          id:"DESC",
          value:"Terbesar",
          label:"Terbesar"
        },
        {
          id:"ASC",
          value:"Terkecil",
          label:"Terkecil"
        }
      ],
      orderSelect:{
        id:"DESC",
        name:"Terbesar",
        label:"Terbesar"
      },
      typingTimeout:0
    }
  }

  fetchCategories = async () => {
    const contents = {}
    const categories = [];
    await CategoryListCompany(contents).then(res => {    
      res.map((value, key) => {
        categories.push({
          id: value.id,
          value: value.id,
          label: value.name
        });
      });

      this.setState({ categories: categories })
    }).catch(err => console.log(err));
  }

  loadProduct = (page) => {       
    const products = this.state.products;
    const content = {
      page: page ? page : 1,
      limit: this.state.limit,
      sortby: this.state.sortbySelect.id,
      order: this.state.orderSelect.id,
      name: this.state.querysearch,
    }

    ProductList(content).then(res => {
      res.result.map((value, index) => {
        products.push({
          id: value.id,
          name: value.name,
          price: value.base_price,
          picture_url: typeof value.Pictures[0] !== 'undefined' ? value.Pictures[0].url_small : 'https://www.bukalapak.com/images/jual_barang/upload-image-v4.png',
          category_general: value.CategoryGeneral.name,
          stok: value.stok,
          companyId:value.companyId,
          brancId: value.brancId,
          identifier_name:value.identifier_name
        })
      });

      return res
    }).then(res => {    
      this.setState({
        products: products,
        count: res.count,
        maxPages: res.pages,
        loadingdata: false
      }, () => {

      });

      if (content.page == this.state.maxPages) {       
        this.setState({ hasMoreItems: false });
      }
      this.props.setLoading(false)      
    });
  }

  componentWillUnmount() {
    const toaster = {
      isOpenToast: false,
      toastMessage: "",
      toastType: 'success',
    }
    this.props.toggleToaster(toaster)
  }

  componentDidMount() {
    this.loadProduct();    
    this.fetchCategories();

    if (this.props.ui.toaster.isOpenToast) {
      toast.success(this.props.ui.toaster.toastMessage);
    }
  }

  hideModal = () => {
    this.setState({
      modal: !this.state.modal
    })
  }


  deleteHandler = (event, product) => {
    this.setState({
      delete_product: {
        id: product.id,
        name: product.name,
        price: product.price,
        picture_url: product.picture_url,
        category_general: product.category_general
      }
    }, () => {
      this.setState({ modal: true })
    })
  }

  deleteAction = (event, product) => {
    const content = {
      id: product.id
    }
    ProductDelete(content).then((res) => {
      if (res.status === "Deleted") {
        this.hideModal();
        const load1 = this.loadProduct();
        Promise.all([load1]).then(() => {
          console.log("halo")
          toast.success("Product Deleted");
        })
      }

    })
  }

  onSortByHandler = (val) => {
    this.setState({sortbySelect:val,products: [],loadingdata:true}, () => this.loadProduct());
  }

  onOrderHandler = (val) => {
    this.setState({orderSelect:val,products: [],loadingdata:true}, () => this.loadProduct());
  }

  onChangeCategoryHandler = (val) => {
    this.setState({ category_selected: val,products: [],loadingdata:true});
  }

  queryInputChangeHandler = (e) => {
    e.preventDefault();  
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);     
   }
    this.setState({ querysearch: e.target.value, products: [],loadingdata:true,
      typingTimeout: setTimeout(()=> this.loadProduct(), 500)
    });

  }

  render() {     
    let ProductList = null;
    let items = null;
    if (this.state.loadingdata) {
      ProductList = <Table responsive>
        {/* <thead>
          <tr>
            <th></th>
            <th>Product
             <Link to="/dashboard/products/new" style={{ marginLeft: '10px' }} href="http://google.com">
                <Button color="primary" size="sm">
                  <i className="nc-icon nc-simple-add"></i> Add Product
               </Button>
              </Link>
            </th>
            <th>Price <small>Per PCS</small></th>
            <th>Stock </th>
            <th></th>
          </tr>
        </thead> */}
        <tbody>
          <LoadingProductAdmin />
          <LoadingProductAdmin />
          <LoadingProductAdmin />
        </tbody>
      </Table>;
    }

    // kalau barangnya kososng
    if (this.state.products.length === 0 && !this.state.loadingdata && this.state.isFetching == false) {
      ProductList = <div className="product-null-wrapper">
        <div className="image-wrapper">
          <img src="/box.svg" alt="" />
        </div>
        <h2 style={{ marginBottom: '12px' }}>Produk tidak ditemukan</h2>
        <p >Produk kamu muncul di halaman ini. Jika tidak muncul ayo dimunculkan / mulai jualan sekarang!</p>
        <Link to="/dashboard/products/new" style={{ marginLeft: '10px' }} href="http://google.com">
          <Button color="primary" style={{ marginBottom: '90px' }} size="bg">
            <i className="nc-icon nc-simple-add"></i> Add Product
               </Button>
        </Link>
      </div>
    }

    else if (this.state.products.length > 0) {
     items = this.state.products.map((res, key) =>
        <Products
          id={res.id}
          produk={res}
          key={key}
          images={res.picture_url}
          deleteHandler={this.deleteHandler}
        />
      )

      ProductList =
      // <div style={{height:'700px',overflow:'auto'}}>
        <InfiniteScroll
          pageStart={1}          
          hasMore={this.state.hasMoreItems}
          loadMore={this.loadProduct.bind(this)}
          loader={<div className="" key={0} style={{width:'100%',textAlign:'center',fontSize:'24px',marginTop:'20px'}}> <img style={{width:'100px'}} src={SpinnerGif}></img> Loading Please Wait ...</div>}
        >
          {items}
        </InfiniteScroll>
      // </div>
      // <Table responsive>
      //   <thead>
      //     <tr>
      //       <th></th>
      //       <th>Product
      //      <Link to="/dashboard/products/new" style={{ marginLeft: '10px' }} >
      //           <Button color="primary" size="sm">
      //             <i className="nc-icon nc-simple-add"></i> Add Product
      //        </Button>
      //         </Link>
      //       </th>
      //       <th>Price <small>Per PCS</small></th>
      //       <th>Stock </th>
      //       <th></th>
      //     </tr>
      //   </thead>
      //   <tbody style={{ height: "300px", overflow: "auto" }}>

      //   </tbody>
      // </Table>;
    }

    return (

      <div className="content">
        <Modal isOpen={this.state.modal} fade={false} toggle={this.hideModal}>
          <ModalHeader>
            Apakah kamu yakin akan menghapus produk ini ?
          </ModalHeader>
          <ModalBody>
            <div className="products-display-container">
              <div className="box-media">
                <div className="product-pict" style={{ background: `url(${this.state.delete_product.picture_url})` }}></div>
              </div>
              <div className="box-short-desc">
                <a href="#">{this.state.delete_product.name}</a>
                {/* <small>Cetakan ke 2</small> */}
                <div className="ellipsis">{this.state.delete_product.category_general}</div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.setState({ modal: false })}>No</Button>
            <Button color="success" onClick={(event) => this.deleteAction(event, this.state.delete_product)}>Yes</Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col md={12}>
            <div className="otd-header-wrapper">
              <div className="search-input-wrap">
                <Input onChange={(event) => { this.queryInputChangeHandler(event) }} placeholder="Cari Produk, masukkan nama produk"></Input>
              </div>
              
              <div className="count">
                <Select
                  onChange={(val) => this.onSortByHandler(val)}
                  name="sortby"
                  placeholder="Urutkan Berdasarkan"                  
                  // value={this.state.sortbySelect}
                  className="basic-multi-select"
                  options={this.state.sortby}
                />
              </div>
              <div className="count">
                <Select
                  onChange={(val) => this.onOrderHandler(val)}
                  name="order"
                  placeholder="Dari.."                  
                  value={this.state.orderSelect}
                  className="basic-multi-select"
                  options={this.state.order}
                />
              </div>
              {/* <div className="count">
                <Select
                  onChange={(val)=>this.onChangeCategoryHandler(val)}
                  name="categoryGeneral"
                  placeholder="Category"
                  isMulti
                  value={this.state.category_selected}
                  className="basic-multi-select"
                  options={this.state.categories}
                />
              </div> */}
              <div className="date-input-filter">
                <label style={{ padding: '0px 10px' }}><i className="nc-icon nc-tag-content" /></label><span>{this.state.count}</span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="">
              <Link to="/dashboard/products/new" style={{ marginLeft: '10px' }} href="http://google.com">
                <Button color="primary" size="sm">
                  <i className="nc-icon nc-simple-add"></i> Add Product
               </Button>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {/* <Card> */}
            <CardBody>
              {ProductList}
            </CardBody>
            {/* </Card> */}
          </Col>
        </Row>
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.authsd.token !== null,
    authRedirectPath: state.authsd.authRedirectPath,
    ui: state.ui
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actionCreator.authCheckState()),
    onSetAuthRedirectPath: (path) => dispatch(actionCreator.setAuthRedirectPath(path)),
    setLoading: (data) => dispatch(actionCreator.toggleLoading(data)),
    toggleToaster: (payload) => dispatch(actionCreator.toggleToaster(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
