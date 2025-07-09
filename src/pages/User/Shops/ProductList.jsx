import { connectStorageEmulator } from "firebase/storage";
import { useEffect, useState } from "react";
{/**import { useSelector } from "react-redux"; */ }
import { Link, useParams } from "react-router-dom";

export default function ProductList() {
  {/**const { currentUser } = useSelector((state) => state.user); */ }


  const [Form, setform] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log("Form", Form)

  {/**const currentuserId = currentUser ? currentUser._id : null; */ }

  const [formId, setformId] = useState("");
  const [filter, setfilter] = useState([]);
  const [query, setQuery] = useState(" ");

  const { productId, shoptype } = useParams();




  useEffect(() => {
    const fetchform = async () => {
      try {
        const res = await fetch(`/api/product/getproduct/${productId}`);
        const data = await res.json();
        console.log("DATA", data);

        if (res.ok) {
          setform(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchform();
  }, [productId])



  //search funtion
  useEffect(() => {
    if (query.trim() === "") {
      // If the query is empty, display all data
      setfilter([...Form]);
    } else {
      // If there's a query, filter the data
      const filteredData = Form.filter(
        (formm) =>
          formm.title && formm.title.toLowerCase().includes(query.toLowerCase())
      );
      setfilter(filteredData);
    }
  }, [query, Form]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/product/deleteC/${formId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setform((prev) => prev.filter((formm) => formm._id !== formId));
        alert("deleted")
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center text-3xl text-gray-700  mt-4 text-[30px] pb-1 font-medium">
        <h1 className="text-gray-600">Product</h1>
      </div>
      <div className="ml-8 mt-7 flex justify-center items-center">
        <form>
          <input
            type="text"
            placeholder="Search... "
            className=" w-[300px] h-10 rounded-lg  border-none bg-slate-50"
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

      </div>


      <div>

        {/** {currentUser?.isInventManger && (
         
        )}*/}


        <>

        </>



        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-4">
            {filter && filter.length > 0 ? (
              <>
                {filter.map((formm) => (
                  <div
                    key={formm._id}
                    className="w-[400px] h-[520px] mt-10 mb-[-120px] rounded-xl border-none bg-white "
                  >
                    <div className="px-6 py-4">
                      <div className="flex justify-center items-center ">
                        <img
                          className="w-56 h-36 rounded-full  object-cover"
                          src={formm.image}
                        />
                      </div>

                      <div className=" border  rounded-3xl mt-6 h-44  bg-white bg-opacity-50 ">
                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">Title:</div>

                          <div className="font-extralight text-md mb-2 max-w-[200px] break-words">
                            {formm.title}
                          </div>
                        </div>
                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">
                            Quntity:
                          </div>

                          <div className=" text-md mb-2 max-w-[100px] font-extralight break-words">
                            {formm.quntity}
                          </div>
                        </div>
                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">
                            Price:
                          </div>

                          <div className=" text-md mb-2 max-w-[100px] font-extralight break-words">
                            ${formm.price}
                          </div>
                        </div>

                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">
                            Dsescription:
                          </div>

                          <div className=" text-md mb-2 max-w-[200px] font-extralight break-words">
                            {formm.desc}
                          </div>
                        </div>




                      </div>

                      {/**  {currentUser?.isInventManger && (
                        
                      )} */}



                      <>
                        <div className="flex justify-center items-center gap-6 mt-6">
                          <Link
                            to={`/updateproduct/${formm._id}`}
                            className="hidden sm:inline    hover:bg-gradient-to-r from-blue-500 to-blue-800  bg-opacity-90 hover:text-white  text-blue-900 font-medium  py-1 px-8 border  rounded-xl cursor-pointer"
                          >
                            Edit
                          </Link>
                          <div>
                            <span
                              onClick={() => {
                                setformId(formm._id);
                                handleDelete();
                              }}
                              className="hidden sm:inline     hover:bg-gradient-to-r from-orange-300 to-orange-500 hover:text-white  bg-opacity-90 text-orange-700 font-medium py-2 px-6 border  rounded-xl cursor-pointer"
                            >
                              Delete
                            </span>
                          </div>
                          <Link
                            to={`/admin/promotion-add/${formm._id}/${productId}/${shoptype}`}
                            className="hidden sm:inline    hover:bg-gradient-to-r from-blue-500 to-blue-800  bg-opacity-90 hover:text-white  text-blue-500 font-medium  py-1 px-8 border  rounded-xl cursor-pointer"
                          >
                            Promotion
                          </Link>
                        </div>
                      </>
                    </div>
                  </div>
                ))}


              </>
            ) : (
              <p>You have no items yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



