import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDarkMode } from '../../../../context/DarkModeContext'
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

function ViewQRCode() {
    const { isDarkMode } = useDarkMode();
    const [url, setUrl] = useState('')
    const [qrCode, setQrCode] = useState('')

    const { id } = useParams()

    const generateQrCode = () => {
        QRCode.toDataURL(url, {
            width: 800,
            margin: 2,
            color: {
                dark: isDarkMode ? '#ffffff' : '#000000',
                light: isDarkMode ? '#1f2937' : '#ffffff'
            }
        }, (err, url) => {
            if (err) return console.log(err)

            console.log(url)
            setQrCode(url)
        })
    }

    useEffect(() => {
        if (id) {
            setUrl(`http://localhost:5173/admin/promotion-view/${id}/qr`)
        }
    }, [id])

    useEffect(() => {
        if (url) {
            generateQrCode()
        }
    }, [url, isDarkMode])


    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                        <QrCodeIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Promotion QR Code
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Generate and download QR code for promotion</p>
                </div>

                {/* QR Code Card */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300">
                    <div className="p-8">
                        {qrCode ? (
                            <div className="text-center">
                                {/* QR Code Display */}
                                <div className="inline-block p-6 bg-white dark:bg-gray-100 rounded-2xl shadow-lg mb-6">
                                    <img 
                                        src={qrCode} 
                                        alt="Promotion QR Code"
                                        className="max-w-full h-auto rounded-lg"
                                    />
                                </div>
                                
                                {/* URL Display */}
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">QR Code URL:</p>
                                    <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                                        {url}
                                    </p>
                                </div>

                                {/* Download Button */}
                                <a 
                                    href={qrCode} 
                                    download="PromotionQRCode.png"
                                    className="group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                                    <span className="relative z-10">Download QR Code</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Generating QR Code...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewQRCode