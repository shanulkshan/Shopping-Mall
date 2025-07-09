
import React from "react";
import Button from "../../../../components/Button/Button";
import {
  ArchiveBoxArrowDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../../../../context/DarkModeContext";

const PromotionCancel = ({ isOpen, toggleModal, onDetele }) => {
  const { isDarkMode } = useDarkMode();
  const [showModal, setShowModal] = React.useState(false);

  const handleSubmit = (e) => {
    const output = onDetele();
    setShowModal(output);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group relative p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        title="Delete Promotion"
      >
        <ArchiveBoxArrowDownIcon className="w-4 h-4" />
      </button>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto md:w-4/12">
              {/* Modal content */}
              <div className="border-0 rounded-3xl shadow-2xl relative flex flex-col w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl outline-none focus:outline-none border border-white/20 dark:border-gray-700/30">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-3xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Delete Promotion
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm w-8 h-8 inline-flex justify-center items-center transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                
                {/* Body */}
                <div className="relative p-8 flex-auto">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <ArchiveBoxArrowDownIcon className="w-8 h-8 text-red-500 dark:text-red-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Are you sure you want to delete this promotion? This action cannot be undone.
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="group relative inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSubmit}
                      className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10">Delete</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 dark:from-red-700 dark:to-pink-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black backdrop-blur-sm"></div>
        </>
      ) : null}
    </>
  );
};

export default PromotionCancel;
