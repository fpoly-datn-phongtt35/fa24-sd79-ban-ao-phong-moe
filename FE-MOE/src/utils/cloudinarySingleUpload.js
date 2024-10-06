import axios from "axios";

export const uploadSingleImage = async (config, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cloud_name", config.cloud_name);
  formData.append("upload_preset", config.upload_preset);
  console.log(config);
  
  return await axios
    .post(
      `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/upload`,
      formData
    )
    .then((response) => response.data.url);
};
