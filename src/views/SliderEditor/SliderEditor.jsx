import React, { Component } from "react";
import SliderFront from "../../components/SliderFront/SliderFront";
import SliderMain from "./SliderMain/SliderMain";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { CreateSlidebar, getSlidebar } from "../../api/index";

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
      add: false,
      addMainSlide: {
        slidebar: null,
        hyperlink: null,
        order: null,
        name: "main"
      },
      isUploading: false,
      isLoading: true
    };
  }

  loadSlidebar = () => {
    const main_slidebar_preview = [];
    const content = {};

    getSlidebar(content)
      .then(result => {
        result.result.map((value, index) => {
          const file = new File([], value.hyperlink, {
            lastModified: value.updated_at
          });

          main_slidebar_preview.push(
            Object.assign(file, {
              preview: value.slidebar
            })
          );
          this.setState({ main_slider: main_slidebar_preview });

          // main_slidebar_preview.push({
          //   slidebar: value.slidebar,
          //   hyperlink: value.hyperlink,
          //   order: value.order,
          //   name: value.name
          // });
        });
      })
      .then(() => {
        // this.setState({main_slidebar})
      });
  };

  componentDidMount() {
    this.loadSlidebar();
  }

  // Image Processing
  onDrop = (files, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error(
        rejectedFiles.length +
          " file ditolak karena melebihi ukuran 2MB. Ini akan berdampak pada kecepatan loading yang akan lama jika melebihi dari ukuran tersebut. Kasihan yang pakai koneksi esia hidayah :("
      );
    } else {
      const array_images = this.state.main_slider.concat(
        files.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );

      this.setState({
        main_slider: array_images,
        add: false,
        isUploading: true
      });
      // uploading to cloudinary directly
      files.map(file => {
        this.handleUploadImages(file).then(() => {
          //   this.setState({ saveable: true })
          //   this.countFilled();
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
    formData.append("api_key", "387685966233372"); // Replace API key with your own Cloudinary API key
    formData.append("folder", "slider");
    formData.append("quality", "low");
    formData.append("timestamp", (Date.now() / 1000) | 0);

    // Replace cloudinary upload URL with yours
    return axios
      .post("https://api.cloudinary.com/v1_1/blst/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
      .then(response => {
        console.log(response.data);
        const url_secure = response.data.secure_url;

        this.setState({
          addMainSlide: {
            slidebar: response.data.secure_url,
            hyperlink: null,
            order: 1,
            name: "main"
          },
          isUploading: false
        });
      })
      .catch(err => console.log(err));
  };

  triggerUpdateMainSlide = event => {
    event.preventDefault();

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
      } else {
        toast.warning("Error Please Reload");
      }
    });
  };

  onAddMainSlider = event => {
    event.preventDefault();
    this.setState({ add: !this.state.add });
    // })
    // const main_slider=[];
    // const newArrayofImages = this.state.main_slider.concat(main_slider);

    // const pushData = main_slider.push({
    //     image:""
    // })

    // Promise.all([pushData]).then(()=> {
    //     console.log(main_slider);
    //     this.setState({main_slider:newArrayofImages})
    // })
  };

  render() {
    let main_slider = (
      <div className="main-slider-input" style={{display:'flex',flexDirection:'row'}}>
        <div
          className="loading-background"
          style={{ width: "100%", height: "150px" }}
        />
        <div className="main-slider-desc container">
          <div
            className="loading-background"
            style={{ width: "100%", height: "20px", marginBottom:'10px'}}
          />
          <div
            className="loading-background"
            style={{ width: "70%", height: "20px",marginBottom:'10px' }}
          />
          <div
            className="loading-background"
            style={{ width: "70%", height: "20px" }}
          />
        </div>
      </div>
    );

    main_slider = this.state.main_slider.map((value, index) => (
      <SliderMain
        isUploading={this.state.isUploading}
        sliderFile={value}
        preview={value}
        key={index}
      />
    ));

    return (
      <div className="content">
        <h4>Preview</h4>
        <SliderFront />
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
                    size="sm"
                  >
                    Upload
                  </Button>
                )}
              </CardHeader>
              <CardBody>
                {this.state.add ? (
                  <SliderMain
                    isUploading={this.state.isUploading}
                    onDrop={this.onDrop}
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
              </CardHeader>
              <CardBody />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SlideEditor;
