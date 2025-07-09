import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDarkMode } from '../../../../context/DarkModeContext';

function ViewPromotion() {
    const { isDarkMode } = useDarkMode();
    const { promotionId, location } = useParams();

    const [promotion, setPromotion] = useState({
        _id: "",
        itemName: "",
        itemId: "",
        itemImage: "",
        shopName: "",
        stallNumber: undefined,
        floorNumber: undefined,
        oldPrice: "",
        discountRate: "",
        newPrice: "",
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        const getPromotion = async () => {
            try {
                const res = await fetch(`/api/promotion/${promotionId}`);
                const data = await res.json();
                if (res.ok) {
                    setPromotion(data)
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        getPromotion();
    }, [promotionId])

    const handleBack = () => {
        if (location === 'list') {
            window.location.replace("/admin/promotion-list");
        }
        else {
            window.location.replace("/qr-scan");
        }
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Promotion Details
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">View promotion information</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:shadow-3xl">
                    {/* Shop Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">{promotion?.shopName}</h3>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                            Floor {promotion?.floorNumber} • Stall {promotion?.stallNumber}
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Item Image */}
                        <div className="mb-6">
                            <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                <img
                                    src={promotion?.itemImage}
                                    alt="item"
                                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>

                        {/* Item Name */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                {promotion?.itemName}
                            </h2>
                            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-lg font-semibold">
                                {promotion?.discountRate}% OFF
                            </div>
                        </div>

                        {/* Price Information */}
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Original Price</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-white">
                                    LKR {Number(promotion.oldPrice)?.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-4 text-center border border-blue-200 dark:border-blue-700/50">
                                <p className="text-blue-600 dark:text-blue-400 text-sm mb-1">Sale Price</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    LKR {Number(promotion.newPrice)?.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Date Information */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="text-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Start Date</p>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    {promotion.startDate}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">End Date</p>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    {promotion.endDate}
                                </p>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="flex justify-center">
                            <button 
                                onClick={() => { handleBack() }} 
                                className="group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                            >
                                <span className="relative z-10">Back</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPromotion