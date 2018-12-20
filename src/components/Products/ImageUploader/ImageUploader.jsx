import React, {Component} from 'react';
import './ImageUpload.css';

class ImageUploader extends Component {
    render() {
        return(
            <div className="field-upload-image">
                <input type="file" accept="image/x-png, image/png, image/gif, image/jpeg, image/pjpeg, image/bmp, image/x-bmp"></input>
                <img src="https://www.bukalapak.com/images/jual_barang/upload-image-v4.png" width="150px"></img>
                <p className="text-desc">
                    <span>
                        <i className="nc-icon nc-simple-add" style={{marginRight:'5px'}}></i>
                        Pilih Gambar Barang
                    </span>
                </p>
            </div>
        );
    }
}

export default ImageUploader;