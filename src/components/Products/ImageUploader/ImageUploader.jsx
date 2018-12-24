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
   
    render() {       
        const preview = this.props.filepreview.map((file, index)=> (
            
            <div style={previewThumbnail} key={file.name}>
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
            <Dropzone accept="image/*" onDrop={this.props.onDrop}>
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