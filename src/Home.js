import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import Resizer from 'react-image-file-resizer';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';


const LinkCnv = () => {

    const myImage = useRef(false);
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
  
  
    const upload = async(image, ratio, filename) =>{
  
      let dpi = "";
      switch(ratio) {
        case 1.0:
            dpi = "640dpi"
          break;
        case 0.75:
            dpi = "480dpi"
          break;
        case 0.5:
            dpi = "320dpi"
          break;
        case 0.375:
            dpi = "240dpi"
          break;
        case 0.25:
            dpi = "160dpi"
          break;
        case 0.1875:
            dpi = "120dpi"
          break;
        default:
            dpi = "error"
      }
     
  
      const dirnfile = encodeURIComponent(filename) + '.jpeg@'+ dpi;
  
      const upload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: "resolveresolution",
            Key: dirnfile,
            Body: image
          }
        });
      const promise = await upload.promise();
  
    }
  
    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);
      const type = atob(dataURI.split(',')[0].split(';')[0].split(':')[1]);
    
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
  
    const convert = async (event) =>{
        try {
            const file = event.target.files[0];

            let fileReader = new FileReader();
            fileReader.onload = () => {
                const urlary = fileReader.result.split(",");
                urlary.forEach(currenturl => {
                    setRealSource(currenturl);
                    restFx(myImage.current.src);
                })
            };
            fileReader.readAsText(file);
  
        const restFx = async (awsfile) => {
            const nameary = awsfile.split('/');
            const filename = nameary[nameary.length-1];
            fetch(awsfile)
            .then((response) => {
                return response.blob()
            })
            .then( async (blob) =>{
                const dpi = [0.1875, 0.25, 0.375, 0.5, 0.75, 1.0]
                let imgary = []
                await Promise.all(dpi.map(async (ratio) => {
                    const image = await resizeFile(blob, ratio);
                    console.log(ratio);
                    console.log(image);
                    if (ratio === 0.1875){
                        setSource(image);
                    }
                    upload( dataURItoBlob(image), ratio, filename )
                }))
            });
            }

      } catch(err) {
          console.log(err);
      }
    }


    // const convert = async (event) => {
    //     var s3 = new AWS.S3();
    //     try {
    //         const file = event.target.files[0];

    //         let fileReader = new FileReader();
    //         fileReader.onload = () => {
    //             const urlary = fileReader.result.split(",");
    //             const curenturl = urlary[0];
    //             const bucket = urlary[0].split('//')[1].split('/')[0];
    //             const key = urlary[0].split('//')[1].split('/')[1] + '/' + urlary[0].split('//')[1].split('/')[2];
    //             s3.getObject({
    //                 Bucket: bucket,
    //                 Key: key
    //             }, 
    //             function (errtxt, file) {
    //                 if (errtxt) {
    //                     console.Log("lireFic", "ERR " + errtxt);
    //                 } 
    //                 else {
    //                     console.log('lecture OK');
    //                     // imageTest.src = "data:image/png;base64," + encode(file.Body);
    //                     const things = "data:image/png;base64," + encode(file.Body)
    //                     const thing = dataURItoBlob(things, 'image/jpeg')
    //                     restFx(thing);
    //                 }
    //             });

    //         };
    //         fileReader.readAsText(file);

        // const restFx = async (awsfile) => {
        //   const dpi = [0.1875, 0.25, 0.375, 0.5, 0.75, 1.0]
        //   let imgary = []
        //   await Promise.all(dpi.map(async (ratio) => {
        //     const image = await resizeFile(awsfile, ratio);
  
        //     console.log(ratio);
        //     console.log(image);
        //     if (ratio === 0.1875){
        //       setSource(image);
        //     }
        //     upload(dataURItoBlob(image, 'image/jpeg'), ratio, "woah")
        //   }))
        // }

    //     const encode = (data) => {
    //         var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    //         return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
    //     }
          
  
    //   } catch(err) {
    //       console.log(err);
    //   }
    // } 
  
    return (
      <div >
        <header className="App-header">
          <p className="App">
            Upload a Text file with links to the s3 bucket images.
          </p>
          <p className="App">
            Ex) https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png, https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
          </p>
          <img src={realsource} ref={myImage} alt="img" className="App-logo" hidden/>
          <img src={source} alt="img" className="App-logo"/>
          <input id="textFile" name="textFile" type="file" className="textFile" onChange={convert} /> 
        </header>
      </div>
    );
  }
  
  export default LinkCnv;
  
  
  