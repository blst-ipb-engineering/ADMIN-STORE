import React, {Component} from 'react';
import './ImageUpload.css';
import Dropzone from 'react-dropzone';

const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
    width: '100%',
    height: '250px',
    borderWidth: 2,
    borderColor: '#bbb',
    borderStyle: 'dashed',
    padding: '20px',
    cursor: 'pointer'
  };
  const activeStyle = {
    borderStyle: 'solid',
    borderColor: '#6c6',
    backgroundColor: '#eee'
  };
  const rejectStyle = {
    borderStyle: 'solid',
    borderColor: '#c66',
    backgroundColor: '#eee'
  };

class ImageUploader extends Component {
    onDrop = (acceptedFiles, rejectedFiles) => {
        console.log((acceptedFiles))
    }


    render() {
        return(
            <Dropzone accept="image/*" onDrop={this.opDrop}>
                {({getRootProps, getInputProps,isDragReject, isDragActive}) => {
                    let styles = {...baseStyle}
                    styles = isDragActive ? {...styles, ...activeStyle} : styles
                    styles = isDragReject ? {...styles, ...rejectStyle} : styles

                    return (
                        <div {...getRootProps()} style={styles}>
                            <input {...getInputProps()} />
                            <img src="https://www.bukalapak.com/images/jual_barang/upload-image-v4.png" width="150px" ></img>
                            <p className="text-desc">
                                <span>
                                    <i className="nc-icon nc-simple-add" style={{marginRight:'5px'}}></i>
                                    Pilih Gambar Barang
                                </span>
                            </p>
                        </div>
                    )
                }}
            </Dropzone>
            // <div className="field-upload-image">
            //     <input type="file" accept="image/x-png, image/png, image/gif, image/jpeg, image/pjpeg, image/bmp, image/x-bmp"></input>
            //     <img src="https://www.bukalapak.com/images/jual_barang/upload-image-v4.png" width="150px"></img>
            //     <p className="text-desc">
            //         <span>
            //             <i className="nc-icon nc-simple-add" style={{marginRight:'5px'}}></i>
            //             Pilih Gambar Barang
            //         </span>
            //     </p>
            // </div>
        );
    }
}

export default ImageUploader;