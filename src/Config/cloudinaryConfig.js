import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPDF = (file)=> {
    return new Promise((resolve, reject) => {
        console.log(file,'yeah we got in the cloudinary configuration')
      const uploaodStream = cloudinary.uploader.upload_stream(
        {
          folder: "Pdf_uploads",
          resource_type: "raw",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
              console.log(error)
            return reject(
              new Error("Cloudinary PDF Upload failed" + error.message)
            );
          }
          if (result) {
            console.log(result,'this is the result we got in uploadPDF')
            const {secure_url, public_id} = result
            console.log(secure_url, public_id,'-=-=-=-==-=-=--=-=-=-=-=-=-')
            return resolve({secure_url,public_id});
          }
        }
      );
      uploaodStream.end(file.buffer);
    });
  }

export default uploadPDF