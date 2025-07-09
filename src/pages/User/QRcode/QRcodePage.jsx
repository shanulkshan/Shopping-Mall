import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useDarkMode } from '../../../context/DarkModeContext';
import { QrCodeIcon, CameraIcon } from '@heroicons/react/24/outline';

const QRcodePage = (props) => {
  const { isDarkMode } = useDarkMode();
  const [data, setData] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {

    if (show === false) return
    if (show === true) {
      setData('');
    }
  }, [show]);

  console.log("kkk" + data);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <QrCodeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            QR Code Scanner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Scan QR codes to discover amazing promotions</p>
        </div>

        {/* Scanner Container */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {data ? (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <QrCodeIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-800 dark:text-white font-medium mb-2">QR Code Detected!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-all px-4">{data}</p>
                  </div>
                ) : show ? (
                  <Scanner
                    onScan={(detectedCodes) => {
                      if (detectedCodes && detectedCodes.length > 0) {
                        console.log(detectedCodes[0]);
                        setData(detectedCodes[0].rawValue);
                        setShow(false);
                      }
                    }}
                    onError={(error) => {
                      console.info(error);
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <CameraIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Ready to scan QR codes</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {data ? (
                <>
                  <button
                    onClick={() => window.location.reload()}
                    className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <CameraIcon className="w-5 h-5 mr-2" />
                    <span className="relative z-10">Scan Again</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={() => window.location.replace(`${data}`)}
                    className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <QrCodeIcon className="w-5 h-5 mr-2" />
                    <span className="relative z-10">Go to Promotion</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShow(true)}
                  className="group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  <span className="relative z-10">Start Scanning</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRcodePage;

