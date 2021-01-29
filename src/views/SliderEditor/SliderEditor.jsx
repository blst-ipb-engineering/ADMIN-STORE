import React, { Component } from "react";
import SliderFront from "../../components/SliderFront/SliderFront";
import SliderMain from "./SliderMain/SliderMain";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import {
  CreateSlidebar,
  getSlidebar,
  deleteSlidebar,
  updateSlidebar
} from "../../api/index";

import {
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  CardFooter,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  CardHeader,
  CardBody,
  Row,
  Col
} from "reactstrap";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

class SlideEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      main_slider_preview: [],
      main_slider: [],
      static_slider_preview: [],
      static_slider: [],
      add: true,
      addStatic: false,
      addMainSlide: {
        slidebar: null,
        hyperlink: null,
        order: null,
        name: "main"
      },
      editMainSlide: {
        id: null,
        slidebar: null,
        hyperlink: null,
        order: null,
        name: null
      },
      addStaticSlide: {
        slidebar: null,
        hyperlink: null,
        order: null,
        name: "static"
      },
      isUploading: false,
      isLoading: true,
      modalOpen: false,
      deleteSlider: {
        id: null,
        img_url: null
      }
    };

    this.onChangeOrderHandler = this.onChangeOrderHandler.bind(this);
    this.onChangeHyperlinkHandler = this.onChangeHyperlinkHandler.bind(this);
  }

  loadSlidebar = () => {
    const main_slidebar_preview = [];
    const content = { name: "main" };

    getSlidebar(content)
      .then(result => {
        
        const main_slider_preview_2 = [];

        if(result.result.length === 0){
          this.setState({
            main_slider:[],
            main_slider_preview:[]
          })
        }

        result.result.map((value, index) => {

          const file = new File([], value.hyperlink, {
            lastModified: value.updated_at
          });

          main_slidebar_preview.push(
            Object.assign(file, {
              preview: value.slidebar,
              idSlide: value.id,
              dbData: {
                id: value.id,
                slidebar: value.slidebar,
                hyperlink: value.hyperlink,
                order: value.order,
                name: value.name
              }
            })
          );

          main_slider_preview_2.push({
            id: value.id,
            slidebar: value.slidebar,
            hyperlink: value.hyperlink,
            order: value.order,
            name: value.name
          });

          this.setState({
            main_slider: main_slidebar_preview,
            main_slider_preview: main_slider_preview_2,
            add: false
          });          
        });
      })
      .then(() => {

      });

      
  };

  loadSlidebarStatic = () => {
    const static_slidebar_preview = [];
    const content = { name: "static" };
    

    getSlidebar(content)
      .then(result => {
        const static_slider_preview_2 = [];
        
        if(result.result.length === 0){
          this.setState({
            static_slider:[],
            static_slider_preview:[]
          })
        }

        result.result.map((value, index) => {
          
          const file = new File([], value.hyperlink, {
            lastModified: value.updated_at
          });

          static_slidebar_preview.push(
            Object.assign(file, {
              preview: value.slidebar,
              idSlide: value.id,
              dbData: {
                id: value.id,
                slidebar: value.slidebar,
                hyperlink: value.hyperlink,
                order: value.order,
                name: value.name
              }
            })
          );

          static_slider_preview_2.push({
            id: value.id,
            slidebar: value.slidebar,
            hyperlink: value.hyperlink,
            order: value.order,
            name: value.name
          });

          this.setState({
            static_slider: static_slidebar_preview,
            static_slider_preview: static_slider_preview_2,
            add: false
          });

         

        });
      })
      .then(() => {

      });
  };

  componentDidMount() {
    window.scrollTo(0,0);
    this.loadSlidebar();
    this.loadSlidebarStatic();
  }

  // Image Processing
  onDrop = (files, rejectedFiles) => {
    const oldSlide = this.state.main_slider;
    const newSlide = [];

    if (rejectedFiles.length > 0) {
      toast.error(
        rejectedFiles.length +
        " file ditolak karena melebihi ukuran 2MB. Ini akan berdampak pada kecepatan loading yang akan lama jika melebihi dari ukuran tersebut. Kasihan yang pakai koneksi esia hidayah :("
      );
    } else {
      // const array_images = newSlide.concat(
      //   files.map(file =>
      //     Object.assign(file, {
      //       preview: URL.createObjectURL(file)
      //     })
      //   )
      // );

      // const insertToFirstArray = oldSlide.unshift(array_images[0]);

      // Promise.all([insertToFirstArray]).then(() => {

      // });

      this.setState({
        isUploading: true
      });
      // uploading to cloudinary directly
      files.map(file => {
        this.handleUploadImages(file).then((response) => {
          this.setState((prevState) => ({
            ...prevState,
            isUploading: false,
            addMainSlide: {
              ...prevState.addMainSlide,
              slidebar: response.data.secure_url
            }
          }))
        });
      });


    }
  };

  onDropStatic = (files, rejectedFiles) => {
    const oldSlide = this.state.static_slider;
    const newSlide = [];

    if (rejectedFiles.length > 0) {
      toast.error(
        rejectedFiles.length +
        " file ditolak karena melebihi ukuran 2MB. Ini akan berdampak pada kecepatan loading yang akan lama jika melebihi dari ukuran tersebut. Kasihan yang pakai koneksi esia hidayah :("
      );
    } else {

      this.setState({
        isUploading: true
      });
      // uploading to cloudinary directly
      files.map(file => {
        this.handleUploadImages(file).then((response) => {
          this.setState((prevState) => ({
            ...prevState,
            isUploading: false,
            addStaticSlide: {
              ...prevState.addStaticSlide,
              slidebar: response.data.secure_url
            }
          }))
        });
      });


    }
  };



  // This function does the uploading to cloudinary
  handleUploadImages = image => {
    // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()

    // our formdata
    const formData = new FormData();
    formData.append("file", image);
    formData.append("tags", ["slider"]); // Add tags for the images - {Array}
    formData.append("upload_preset", "blst_product"); // Replace the preset name with your own
    formData.append("api_key", "899241999449336"); // Replace API key with your own Cloudinary API key
    formData.append("folder", "slider");
    formData.append("quality", "low");
    formData.append("timestamp", (Date.now() / 1000) | 0);

    // Replace cloudinary upload URL with yours
    return axios
      .post("https://api.cloudinary.com/v1_1/blstipb2020/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
      .then(response => {

        const url_secure = response.data.secure_url;

        return response;
      })
      .catch(err => console.log(err));
  };

  triggerUpdateMainSlide = (event) => {
    event.preventDefault();
    // console.log((this.state.addMainSlide))
    CreateSlidebar(this.state.addMainSlide).then(res => {
      if (res.status === "success") {
        toast.success("Slider Added Successfully");
        this.setState({
          addMainSlide: {
            slidebar: null,
            hyperlink: null,
            order: null,
            name: "main"
          },
          add: false
        });

        this.loadSlidebar();
      } else {
        toast.warning("Error Please Reload");
      }
    });
  };

  triggerUpdateStaticSlide = (event) => {
    event.preventDefault();
    // console.log((this.state.addMainSlide))
    CreateSlidebar(this.state.addStaticSlide).then(res => {
      if (res.status === "success") {
        toast.success("Slider Added Successfully");
        this.setState({
          addStaticSlide: {
            slidebar: null,
            hyperlink: null,
            order: null,
            name: "static"
          },
          addStatic: false
        });

        this.loadSlidebarStatic();
      } else {
        toast.warning("Error Please Reload");
      }
    });
  };

  onAddMainSlider = event => {
    event.preventDefault();
    this.setState({ add: !this.state.add });
  };

  onAddStaticSlider = event => {
    event.preventDefault();
    this.setState({ addStatic: !this.state.addStatic });
  };

  orderEditChange = (event) => {
    const value = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      addMainSlide: {
        ...prevState.addMainSlide,
        order: value
      }
    }))
  }

  orderEditChangeStatoc = (event) => {
    const value = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      addStaticSlide: {
        ...prevState.addStaticSlide,
        order: value
      }
    }))
  }

  HyperlinkEditChange = (event) => {
    const value = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      addMainSlide: {
        ...prevState.addMainSlide,
        hyperlink: value
      }
    }))
  }

  HyperlinkEditChangeStatic = (event) => {
    const value = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      addStaticSlide: {
        ...prevState.addStaticSlide,
        hyperlink: value
      }
    }))
  }

  deleteHandler = (event, id, link) => {
    event.preventDefault()
    this.setState({
      modalOpen: true,
      deleteSlider: {
        id: id,
        img_url: link
      }
    });
    console.log(id)
  }

  hideModal = () => {
    this.setState({
      modalOpen: false
    })
  }

  deleteSliderAction = (event) => {
    event.preventDefault();
    const content = this.state.deleteSlider;

    deleteSlidebar(content).then((res) => {
      if (res.status === "Deleted") {
        this.hideModal();
        const load1 = this.loadSlidebar();
        const load2 = this.loadSlidebarStatic();
        Promise.all([load1,load2]).then(() => {
          toast.success("Slidebar Deleted");
        })

        
      }

    })
  }


  onChangeOrderHandler(event, id, data) {

    event.preventDefault();
    const value = event.target.value;

    this.setState((prevState) => ({
      ...prevState,
      editMainSlide: {
        ...data,
        order: value,
        id: id
      }
    }), () => {
      console.log(this.state.editMainSlide)
      updateSlidebar(this.state.editMainSlide).then(res => {
        console.log(res)
      })
    })
  }

  onChangeHyperlinkHandler(event, id, data) {
    event.preventDefault();
    const value = event.target.value;

    this.setState((prevState) => ({
      ...prevState,
      editMainSlide: {
        ...data,
        hyperlink: value,
        id: id
      }
    }), () => {
      console.log(this.state.editMainSlide)
      updateSlidebar(this.state.editMainSlide).then(res => {
        console.log(res)
      })
    })
  }

  render() {


    let main_slider = (
      <div
        className="main-slider-input"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          className="loading-background"
          style={{ width: "100%", height: "150px" }}
        />
        <div className="main-slider-desc container">
          <div
            className="loading-background"
            style={{ width: "100%", height: "20px", marginBottom: "10px" }}
          />
          <div
            className="loading-background"
            style={{ width: "70%", height: "20px", marginBottom: "10px" }}
          />
          <div
            className="loading-background"
            style={{ width: "70%", height: "20px" }}
          />
        </div>
      </div>
    );

    let static_slider = null;

    if (this.state.main_slider.length !== 0) {
      main_slider = this.state.main_slider.map((value, index) => (
        <SliderMain
          isEditable={true}
          onEditOrder={this.onChangeOrderHandler}
          onEditHyperlink={this.onChangeHyperlinkHandler}
          number={index}
          isUploading={this.state.isUploading}
          sliderFile={value}
          idSlide={value.idSlide}
          preview={value}
          key={index}
          slideData={this.state.main_slider_preview[index]}
          deleteHandlerProp={this.deleteHandler}
        />
      ));
    }
    
    if(this.state.main_slider.length === 0){
      main_slider= <div style={{textAlign:'center'}}>
        <h5>Belum Ada Slider Ditambahkan</h5>
      </div>
    }

    if(this.state.static_slider.length === 0){
      static_slider= <div style={{textAlign:'center'}}>
        <h5>Belum Ada Slider Ditambahkan</h5>
      </div>
    }

    if (this.state.static_slider.length !== 0) {
      static_slider = this.state.static_slider.map((value, index) => (
        <SliderMain
          isEditable={true}
          onEditOrder={this.onChangeOrderHandler}
          onEditHyperlink={this.onChangeHyperlinkHandler}
          number={index}
          isUploading={this.state.isUploading}
          sliderFile={value}
          idSlide={value.idSlide}
          preview={value}
          key={index}
          slideData={this.state.static_slider_preview[index]}
          deleteHandlerProp={this.deleteHandler}
        />
      ));
    }

    return (
      <div className="content">


        <Modal isOpen={this.state.modalOpen} fade={false} toggle={this.hideModal}>
          <ModalHeader>
            Apakah kamu yakin akan Slide ini ?
          </ModalHeader>
          <ModalBody>
            <div>
              <img src={this.state.deleteSlider.img_url} style={{ width: '100%' }} alt="" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.setState({ modalOpen: false })}>No</Button>
            <Button color="success" onClick={this.deleteSliderAction}>Yes</Button>
          </ModalFooter>
        </Modal>


        <h4 style={{background:'grey',color:'white',padding:'5px',textAlign:'center'}}>Preview</h4>
        <SliderFront 
        SliderPreview={this.state.main_slider_preview} 
        StaticSliderPreview={this.state.static_slider_preview}
        />
        <Row>
          <Col md={8} xs={12}>
            <Card className="card-user">
              <CardHeader
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h6>Main Banner</h6>{" "}
                {/* untuk update trigger tambah slide baru */}
                {this.state.addMainSlide.slidebar === null ? (
                  <Button
                    color="primary"
                    onClick={this.onAddMainSlider}
                    size="sm"
                  >
                    Tambah
                  </Button>
                ) : (
                    <Button
                      color="warning"
                      onClick={this.triggerUpdateMainSlide}
                      size="lg"
                    >
                      Update
                  </Button>
                  )}
              </CardHeader>
              <CardBody>
                {this.state.add ? (
                  <SliderMain
                    previewNew={this.state.addMainSlide}

                    isEditable={false}
                    isUploading={this.state.isUploading}
                    onDrop={this.onDrop}
                    orderOnChange={this.orderEditChange}
                    HyperlinkOnChange={this.HyperlinkEditChange}
                  />
                ) : null}

                {main_slider}
              </CardBody>
            </Card>
          </Col>
          <Col md={4} xs={12}>
            <Card className="card-user">
              <CardHeader>
                <h6>Side Banner</h6>
                {this.state.addStaticSlide.slidebar === null ? (
                  <Button
                    color="primary"
                    onClick={this.onAddStaticSlider}
                    size="sm"
                  >
                    Tambah
                  </Button>
                ) : (
                    <Button
                      color="warning"
                      onClick={this.triggerUpdateStaticSlide}
                      size="lg"
                    >
                      Update
                  </Button>
                  )}
              </CardHeader>
              <CardBody>
                {this.state.addStatic ? (
                  <SliderMain
                    previewNew={this.state.addStaticSlide}
                    isEditable={false}
                    isUploading={this.state.isUploading}
                    onDrop={this.onDropStatic}
                    orderOnChange={this.orderEditChangeStatoc}
                    HyperlinkOnChange={this.HyperlinkEditChangeStatic}
                  />
                ) : null}
                {static_slider}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SlideEditor;
