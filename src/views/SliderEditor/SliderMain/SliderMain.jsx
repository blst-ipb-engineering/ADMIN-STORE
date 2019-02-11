import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { Input, InputGroup } from "reactstrap";
import Spinner from '../../../components/Spinner/Spinner';

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
  cursor: "pointer"
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
      : undefined;

    const backgroundUploaded = {
      background: "url(" + backgroundImageSlide + ")",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    };

    return (
      <div className="main-slider-wrapper">
        {this.props.isUploading ? 
        (
        <div style={{position:'relative',width:'100%',height:'100px',overflow:'hidden'}}>
            <Spinner/>
        </div>
        
        ) :
            (
                <Dropzone
          maxSize={2000000}
          accept="image/*"
          onDrop={this.props.onDrop}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragReject, isDragActive }) => {
            let styles = { ...baseStyle, ...backgroundUploaded };
            styles = isDragActive ? { ...styles, ...activeStyle } : styles;
            styles = isDragReject ? { ...styles, ...rejectStyle } : styles;

            return (
              <div
                {...getRootProps()}
                style={styles}
                className="main-slider-input"
              >
                <input {...getInputProps()} />

                {!this.props.preview ? (
                  <div style={{textAlign:'center'}}>
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
                        Pilih Gambar Barang 1028 x 380 px <br />
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

            )    
        }
        
        

        <div className="main-slider-desc container">
          <p style={{ margin: 0 }}>Order</p>
          <InputGroup>
            <Input type="text" name="order" />
          </InputGroup>
          <p style={{ margin: 0 }}>Hyperlink</p>
          <InputGroup>
            <Input type="text" name="hyperlink" />
          </InputGroup>
        </div>
      </div>
    );
  }
}

export default SliderMain;
