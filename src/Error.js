import React from 'react';
 
const Error = () => {
    return (
       <div>
          <p>Error: Page does not exist!</p>
       </div>
    );
}
 
export default Error;











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