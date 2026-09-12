
function ImagePreview({ image}) {

    if(!image){
        return(
            <div className="image-preview">
                <p>No image selected</p>
            </div>
        );
    }

    return(
        <div className="image-preview">
            <h3>Image Preview</h3>
            <img src={URL.createObjectURL(image)} 
            alt="Vehicle Preview"
            width="350"
            />
        </div>
        
    );


}

export default ImagePreview;