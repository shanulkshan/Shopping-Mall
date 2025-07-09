import { useEffect, useState } from "react";
{/**import { useSelector } from "react-redux"; */ }
import { Link } from "react-router-dom";

export default function ClothShop() {
  {/**const { currentUser } = useSelector((state) => state.user); */ }


  const [Form, setform] = useState([]);
  const [showMore, setShowMore] = useState(false);

  {/**const currentuserId = currentUser ? currentUser._id : null; */ }
  console.log("arra", Form);
  const [formId, setformId] = useState("");
  const [filter, setfilter] = useState([]);
  const [query, setQuery] = useState(" ");

  useEffect(() => {
    const fetchform = async () => {
      try {
        const res = await fetch(`/api/cloth/CgetAll`);
        const data = await res.json();
        console.log(data);

        if (res.ok) {
          setform(data.getcloth);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchform();
  }, []);

  //search funtion
  useEffect(() => {
    if (query.trim() === "") {
      // If the query is empty, display all data
      setfilter([...Form]);
    } else {
      // If there's a query, filter the data
      const filteredData = Form.filter(
        (formm) =>
          formm.name && formm.name.toLowerCase().includes(query.toLowerCase())
      );
      setfilter(filteredData);
    }
  }, [query, Form]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/cloth/deleteC/${formId}`, {
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
      <div className="flex justify-center items-center text-3xl  mt-4 text-[30px] pb-1 font-medium">
        <h1>Cloth</h1>
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

      <span className=" ml-[1108px]">
        <Link
          to={"/crateclothshop"}
          className="hidden sm:inline   border hover:bg-gradient-to-r from-orange-300 to-orange-500 hover:text-white  text-slate-600 font-medium  py-3 px-6   rounded-3xl cursor-pointer"
        >
          New Shop
        </Link>
        <div></div>
      </span>

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
                    className="w-[400px] h-[520px] mt-10 mb-2 rounded-xl border-none bg-white "
                  >
                    <div className="px-6 py-4">
                      <div className="flex justify-center items-center ">
                        <img
                          className="w-36 h-36 rounded-full  object-cover"
                          src={formm.image}
                        />
                      </div>

                      <div className=" border  rounded-3xl mt-6 h-64  bg-white bg-opacity-50 ">
                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">Name:</div>

                          <div className="font-extralight text-md mb-2 max-w-[200px] break-words">
                            {formm.name}
                          </div>
                        </div>
                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">
                            StallNumber:
                          </div>

                          <div className=" text-md mb-2 max-w-[100px] font-extralight break-words">
                            {formm.stallNumber}
                          </div>
                        </div>
                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">
                            FloorNumber:
                          </div>

                          <div className=" text-md mb-2 max-w-[100px] font-extralight break-words">
                            {formm.FloorNumber}
                          </div>
                        </div>

                        <div className="flex gap-4 ml-4">
                          <div className="font-extralight text-md">
                            Description:
                          </div>

                          <div className="text-gray-700  text-sm mt-2   max-w-[200px] font-extralight break-words">
                            {formm.Des}
                          </div>
                        </div>

                        <div className="flex justify-center items-center mt-20 text-blue-900  text-[18px]  pb-1 font-medium  ">
                          <Link to={`/product/${formm._id}/cloth`}>
                            <button className="hover:text-black" >Product List</button>
                          </Link>
                        </div>
                        <Link to={`/createproduct/${formm._id}`}>
                          <button className="w-10 h-5 font-medium  mb-1 rounded bg-gradient-to-r from-blue-500 to-blue-800 text-white hover:opacity-90" >Add</button>
                        </Link>
                      </div>

                      {/**  {currentUser?.isInventManger && (
                        
                      )} */}



                      <>
                        <div className="flex justify-center items-center gap-6 mt-6">
                          <Link
                            to={`/update-clothshope/${formm._id}`}
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



