import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { Input, InputGroup, Button } from "reactstrap";
import Spinner from "../../../components/Spinner/Spinner";
import { updateSlidebar } from '../../../api/index';

const baseStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "63%",
  height: "145px",
  borderWidth: 2,
  borderColor: "#bbb",
  borderStyle: "dashed",
  cursor: "pointer",
  backgroundSize: "contain"
};
const activeStyle = {
  borderStyle: "solid",
  borderColor: "#6c6",
  backgroundColor: "#eee"
};
const rejectStyle = {
  borderStyle: "solid",
  borderColor: "#c66",
  backgroundColor: "#eee"
};

const previewThumbnail = {
  padding: "10px",
  width: "100%",
  height: "145px",
  display: "flex",
  alignItems: "center",
  border: "1px #e2e2e2 solid",
  borderRadius: "5px",
  margin: "20px 0px",
  position: "relative",
  overflow: "hidden"
};



class SliderMain extends Component {
  

  render() {


    const backgroundImageSlide = this.props.preview
      ? this.props.preview.preview
      : this.props.previewNew.slidebar;

    const backgroundUploaded = {
      background: "url(" + backgroundImageSlide + ")",

    };

    // let halo = !this.props.isEditable ? "this.props.isEditable" : null;
    return (
      <div className={!this.props.isEditable ? "main-slider-wrapper grey-back" : "main-slider-wrapper"} >
        {/* {halo} */}
        {this.props.isUploading && !this.props.isEditable ? (

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "145px",
              overflow: "hidden"
            }}
          >
            <Spinner />
          </div>
        ) : (
            <Dropzone
              maxSize={2000000}
              accept="image/*"
              onDrop={this.props.onDrop}
              multiple={false}
            >
              {({ getRootProps, getInputProps, isDragReject, isDragActive }) => {
                let styles = {
                  ...baseStyle,
                  ...backgroundUploaded,

                };
                styles = isDragActive ? { ...styles, ...activeStyle } : styles;
                styles = isDragReject ? { ...styles, ...rejectStyle } : styles;

                return (
                  <div
                    {...getRootProps()}
                    style={styles}
                    className="main-slider-input"
                  >
                    <input {...getInputProps()} />

                    {this.props.previewNew && this.props.previewNew.slidebar == null ? (
                      <div style={{ textAlign: "center" }}>
                        <img
                          src="https://www.bukalapak.com/images/jual_barang/upload-image-v4.png"
                          width="80px"
                          alt="slider"
                        />
                        <p className=" text-center">
                          <span>
                            <i
                              className="nc-icon nc-simple-add"
                              style={{ marginRight: "5px" }}
                            />
                            Pilih Gambar Slider dengan ukuran 1028 x 380 px <br />
                            (max 2 MB)
                        </span>
                        </p>
                      </div>
                    ) : (
                        ""
                      )}
                  </div>
                );
              }}
            </Dropzone>
          )}

        <div className="main-slider-desc container">
          {this.props.isEditable ?
            (<Button color="danger" onClick={(event) => this.props.deleteHandlerProp(event, this.props.slideData.id, this.props.slideData.slidebar)} size="sm" style={{ position: 'absolute', right: '0', top: '0', zIndex: '100' }}>X</Button>
            ) :
            null

          }
          <p style={{ margin: 0 }}>Order</p>
          <InputGroup>
            {this.props.isEditable ? (
              <Input type="text" placeholder={this.props.slideData.order} onChange={(event)=>this.props.onEditOrder(event,this.props.idSlide,this.props.slideData)} name="order" />
            ) : (
                <Input onChange={this.props.orderOnChange} type="text" name="order" />
              )}
          </InputGroup>
          <p style={{ margin: 0 }}>Hyperlink</p>
          <InputGroup>
            {this.props.isEditable ? (
              <Input type="text" placeholder={this.props.slideData.hyperlink} onChange={(event) => { this.props.onEditHyperlink(event, this.props.idSlide,this.props.slideData) }} name="hyperlink" />
            ) : (
                <Input onChange={this.props.HyperlinkOnChange} type="text" name="hyperlink" />
              )}
          </InputGroup>
        </div>
      </div>
    );
  }
}

export default SliderMain;
