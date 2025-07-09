import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import { app } from "../../../firebase";
  import { useEffect, useState } from "react";
  import { CircularProgressbar } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  import { useNavigate, useParams } from "react-router-dom";
  
  export default function UpdatebookShop() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    console.log(formData);
  
    const { updateId  } = useParams();
    
  
    const navigate = useNavigate();
  
    const handleUpdloadImage = async () => {
      try {
        if (!file) {
          setImageUploadError("Please select an image");
          return;
        }
        setImageUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUploadProgress(null);
              setImageUploadError(null);
              setFormData({ ...formData, image: downloadURL });
            });
          }
        );
      } catch (error) {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
        console.log(error);
      }
    };
  
  
  
  
  
  
  
    useEffect(() => {
      try {
        const fetchForm = async () => {
          const res = await fetch(
            `/api/book/bgetAll?UupdateId=${updateId}`
          );
          const data = await res.json();
          console.log(data)
  
          if (!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            return;
          }
          if (res.ok) {
            const selectedform = data.getbook.find((formm) => formm._id === updateId);
            if (selectedform) {
              setFormData(selectedform);
              console.log(selectedform)
  
            }
          }
        };
        fetchForm();
      } catch (error) {
        console.log(error.message);
      }
    }, [updateId]);
  
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`/api/book/book/${formData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
  
        if (res.ok) {
          setPublishError(null);
          alert("success")
          navigate(`/BookShop`);
        }
      } catch (error) {
        setPublishError("Something went wrong");
      }
    };
  
  
    return (
     
        <div className="">
        <h1 className="text-center text-3xl my-7 ml-10 font-medium">New Shop</h1>
        <div className="flex justify-center items-center">
  
       
        <form className="flex flex-col gap-4 w-[600px]  rounded-lg border-none  bg-gray-50  mb-10 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 ">
            <div className="flex gap-4 items-center justify-between border-none p-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="border border-gray-300  rounded-md py-2 px-4 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                className=" w-40 h-10 font-medium hover:opacity-80 rounded-lg bg-gradient-to-r from-orange-300 to-orange-500  hover:bg-orange-500 te text-white"
                size="sm"
                onClick={handleUpdloadImage}
                disabled={imageUploadProgress}
              >
                {imageUploadProgress ? (
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  "Upload Image"
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center">
          <input
            className=" bg-white border-none rounded-md w-[400px] text-slate-800"
            type="text"
            placeholder="Name"
            required
            id="name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
          />
          </div>
          <div className="flex justify-center items-center gap-4">
            <input
              className="bg-white border-none rounded-md w-48 text-slate-800"
              type="text"
              placeholder="stallNumber"
              required
              id="stallNumber"
              maxLength={4}
              onChange={(e) =>
                setFormData({ ...formData, stallNumber: e.target.value })
              }
              value={formData.stallNumber}
            />
            <input
              className="bg-white border-none rounded-md w-48 text-slate-800"
              type="text"
              placeholder="FloorNumber"
              required
              id="FloorNumber"
              maxLength={2}
              onChange={(e) =>
                setFormData({ ...formData, FloorNumber: e.target.value })
              }
              value={formData.FloorNumber}
            />
          </div>
  
          {imageUploadError && (
            <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center ">
              {imageUploadError}
            </p>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}
  
          <div className="flex gap-4">
            <textarea
              type="text"
              placeholder="Description"
              required
              id="Des"
              maxLength={100}
              className="bg-white border-none rounded-md w-[400px] ml-[100px] text-slate-800 h-48"
              onChange={(e) => setFormData({ ...formData, Des: e.target.value })}
              value={formData.Des}
            />
          </div>
             <div className="flex justify-center items-center mb-11">
             <button
            type="submit"
            className=" w-[200px] font-medium text-white  h-10 bg-gradient-to-r from-blue-500 to-blue-800 hover:opacity-80 hover:text-white rounded-lg"
          >
            Update Shop
          </button>
  
             </div>
          
  
          {publishError && (
            <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center ">
              {publishError}
            </p>
          )}
        </form>
        </div>
      </div>
    );
  }
  
  
