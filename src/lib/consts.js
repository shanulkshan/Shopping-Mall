import axios from "axios";

export const API_URL = "http://localhost:8080";
export const IMAGE_BUCKET_URL = "http://localhost:8080/images";

export const NO_IMAGE_URL = "/images/no-image.jpg";


// const response = await fetch(`${API_URL}/jobApplication`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(newVar),
// });

// const response1 = await fetch(`${API_URL}/jobApplication`);
// const data = await response.json();


// if (formData.image) {
//     formDataToSend.append('image', formData.image);
// }

export const postMultipartData = async (endpoint, data) => {
    try {
      const response = await axios.post(API_URL+endpoint, data, {
        headers: {
          // Authorization: `Bearer ${LoginAuthToken()}`,
          "content-type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };