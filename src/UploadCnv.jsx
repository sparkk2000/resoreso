
import React, {useState, useRef, useEffect} from 'react';
import Resizer from 'react-image-file-resizer';
import AWS from 'aws-sdk';
import Container from 'react-bootstrap/Container';
import './App.css'


const UploadCnv = () => {

    const myImage = useRef(false);
    const myFile = useRef(false);
    const [source, setSource] = useState();
    const [realsource, setRealSource] = useState();
  
    useEffect(() => {
      AWS.config.update({
        region: "ap-northeast-2",
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'ap-northeast-2:4586c6c4-f443-43e0-a27c-ebb119048187',
          RoleArn: 'arn:aws:iam::605039363803:role/resoUnauthRole'
        }, 
        {region: "ap-northeast-2"}
        )
      });
    }, [])
  
    const resizeFile = (file, ratio) => new Promise(resolve=> {
    
      //
      var reader = new FileReader();
      reader.onload = function(e){
        setRealSource(e.target.result);
        const wdth= myImage.current.naturalWidth*ratio;
        const hght= myImage.current.naturalHeight*ratio;
  
        const mmm = Math.round(Math.max(wdth, hght));
  
        Resizer.imageFileResizer(
          file, 
          mmm, 
          mmm, 
          'JPEG', 
          100, 
          0,
          uri => {
            resolve(uri);
          },
          'base64'
        )
      }
      reader.readAsDataURL(file)
      //findout real width and height of file then resize
  
    });
  
  
    const upload = async(image, ratio, foldername) =>{
  
      const uniquename = foldername;
      let filename = "";
      switch(ratio) {
        case 1.0:
          filename = "640dpi"
          break;
        case 0.75:
          filename = "480dpi"
          break;
        case 0.5:
          filename = "320dpi"
          break;
        case 0.375:
          filename = "240dpi"
          break;
        case 0.25:
          filename = "160dpi"
          break;
        case 0.1875:
          filename = "120dpi"
          break;
        default:
          filename = "error"
      }
     
  
      const dirnfile = encodeURIComponent(uniquename) + "/" + filename + '.jpeg';
  
      const upload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: "resolveresolution",
            Key: dirnfile,
            Body: image
          }
        });
      const promise = await upload.promise();
  
    }
  
    function dataURItoBlob(dataURI, type) {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);
  
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
  
      // write the ArrayBuffer to a blob, and you're done
      var bb = new Blob([ab], { type: type });
      return bb;
    }
  
    const convert = async (event) => {
      try {
          const file = event.target.files[0];
          const dpi = [0.1875, 0.25, 0.375, 0.5, 0.75, 1.0]
          myFile.current.value=""
          await Promise.all(dpi.map(async (ratio) => {
            const image = await resizeFile(file, ratio);
  
            console.log(ratio);
            console.log(image);
            if (ratio === 0.1875){
              setSource(image);
            }
            upload(dataURItoBlob(image, 'image/jpeg'), ratio, "woah");
          }))
          .then(alert("upload complete"))
      } catch(err) {
          console.log(err);
      }
    } 
  
    return (
      <Container className="p-3">
        <div className="content">
          <p className="App-header">
            Resolve resolution
          </p>
          <p className="example">
              Upload an image to convert to 5 different sizes and upload to bucket
            </p>
          <hr className="my-4"></hr>
          <img src={source} alt="img" className="App-logo"/>
          <img src={realsource} ref={myImage} alt="img" className="App-logo" hidden/>
          <input ref={myFile} id="imageFile" name="imageFile" type="file" className="imageFile"  accept="image/*" onChange={convert} /> 
        </div>
      </Container>
    );
  }
  
  export default UploadCnv;
  
  
  