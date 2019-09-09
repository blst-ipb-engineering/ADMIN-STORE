import React, {Component} from 'react';
import './ImageUpload.css';
import Dropzone from 'react-dropzone';
import ReactTooltip from 'react-tooltip'


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

  const previewThumbnail = {
    padding: '10px',
    width: '100%',
    height: '250px',
    display: 'flex',
    alignItems: 'center',
    border: '1px #e2e2e2 solid',
    borderRadius: '5px',
    margin : '20px 0px',
    position:'relative',
    overflow:'hidden'
  }

class ImageUploader extends Component {
    
    handleUploadImage = () => {        
        const cloudName = 'blst';
        const unsignedUploadPreset = 'product';
        const HOST = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        let fd = new FormData()

        fd.append('upload_preset', unsignedUploadPreset);
        fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
        fd.append('file', this.props.filepreview);


        fetch(HOST,{
        body: fd,
        method: 'POST'
        }).then((response) => {
        return response.json()
        }).then((result) => {
        this.setState({ imageURL: result.secure_url, isLoadingUploadKTP: false })
        })
    }
    
    
    render() {             
        const preview = this.props.filepreview.map((file, index)=> (                                  
            <div style={previewThumbnail} key={file.index}>
                <ReactTooltip />
                <div className="delete-icon" data-tip="Hapus" onClick={(event) => this.props.deleted(event,index)}><i className="nc-icon nc-simple-remove"></i></div>
                <div className="thumbnail-inner">
                    <img alt={file.name}
                        src={file.preview}
                        className="img"
                    />
                </div>
            </div>
        ));
            
 
        let uploader = null;    
        if (this.props.filepreview.length < this.props.maxUpload){
            uploader = 
            <Dropzone maxSize={2000000} accept="image/*" onDrop={this.props.onDrop}>
                {({getRootProps, getInputProps,isDragReject, isDragActive}) => {
                                let styles = {...baseStyle}
                                styles = isDragActive ? {...styles, ...activeStyle} : styles
                                styles = isDragReject ? {...styles, ...rejectStyle} : styles

                                return (
                                    <div {...getRootProps()} style={styles}>
                                        <input {...getInputProps()} />
                                        <img src="https://www.bukalapak.com/images/jual_barang/upload-image-v4.png" width="150px" ></img>
                                        <p className="text-desc text-center">
                                            <span>
                                                <i className="nc-icon nc-simple-add" style={{marginRight:'5px'}}></i>
                                                Pilih Gambar Barang <br/>(max 2 MB)
                                            </span>
                                        </p>
                                    </div>
                                )
                            }}
            </Dropzone>;
        }


        return(            
            <div>
            <div className="thumbnail-image">
                {preview}
            </div>
                {uploader}
            </div>
            
        );
    }
}

export default ImageUploader;