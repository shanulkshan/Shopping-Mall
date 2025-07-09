import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDarkMode } from '../../../../context/DarkModeContext';

function EditPromotion() {
    const { isDarkMode } = useDarkMode();
    const { promotionId } = useParams();

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

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/promotion/${promotionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(promotion),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message);
                return;
            }

            if (res.ok) {
                alert("Promotion Edit Successfully");
                setPromotion({
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
                })
                window.location.replace("/admin/promotion-list");
            }
        } catch (error) {
            alert(err);
        }
    };

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

    useEffect(() => {
        setPromotion({
            ...promotion,
            newPrice: `${Number(promotion?.oldPrice) - Number((Number(promotion?.oldPrice) * Number(promotion?.discountRate) / 100))}`
        })
    }, [promotion?.discountRate])

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Edit Promotion
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Update promotion details</p>
                </div>

                {/* Form Container */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300">
                    <form onSubmit={onSubmit} className="p-8 space-y-6">
                        {/* Shop Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Shop Name
                                </label>
                                <input
                                    type="text"
                                    id="shopName"
                                    disabled
                                    value={promotion?.shopName}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, shopName: e.target.value });
                                    }}
                                    name="shopName"
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-not-allowed"
                                    placeholder="Enter shop name"
                                />
                            </div>

                            <div>
                                <label htmlFor="stallNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Stall Number
                                </label>
                                <input
                                    type="text"
                                    id="stallNumber"
                                    name="stallNumber"
                                    disabled
                                    value={promotion?.stallNumber}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, stallNumber: e.target.value });
                                    }}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-not-allowed"
                                    placeholder="Enter stall number"
                                />
                            </div>

                            <div>
                                <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Floor Number
                                </label>
                                <input
                                    type="text"
                                    id="floorNumber"
                                    disabled
                                    value={promotion?.floorNumber}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, floorNumber: e.target.value });
                                    }}
                                    name="floorNumber"
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-not-allowed"
                                    placeholder="Floor number"
                                />
                            </div>
                        </div>

                        {/* Item Information */}
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Item Name
                            </label>
                            <input
                                type="text"
                                id="itemName"
                                disabled
                                value={promotion?.itemName}
                                onChange={(e) => {
                                    setPromotion({ ...promotion, itemName: e.target.value });
                                }}
                                name="itemName"
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-not-allowed"
                                placeholder="Enter item name"
                            />
                        </div>

                        {/* Item Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Item Image
                            </label>
                            <div className="flex justify-center">
                                <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700">
                                    <img 
                                        src={promotion?.itemImage} 
                                        alt="item" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Price (LKR)
                                </label>
                                <input
                                    type="text"
                                    id="oldPrice"
                                    disabled
                                    value={promotion?.oldPrice}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, oldPrice: e.target.value });
                                    }}
                                    name="oldPrice"
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-not-allowed"
                                    placeholder="Enter current price"
                                />
                            </div>

                            <div>
                                <label htmlFor="discountRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount Rate (%)
                                </label>
                                <input
                                    type="number"
                                    id="discountRate"
                                    name="discountRate"
                                    value={promotion?.discountRate}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, discountRate: e.target.value });
                                    }}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter discount rate"
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <div>
                                <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Price (LKR)
                                </label>
                                <input
                                    type="text"
                                    id="newPrice"
                                    disabled
                                    value={promotion?.newPrice}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, newPrice: e.target.value });
                                    }}
                                    name="newPrice"
                                    className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-2xl border border-green-300 dark:border-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-not-allowed font-semibold"
                                    placeholder="New price"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={promotion?.startDate}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, startDate: e.target.value });
                                    }}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={promotion?.endDate}
                                    onChange={(e) => {
                                        setPromotion({ ...promotion, endDate: e.target.value });
                                    }}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button 
                                type="submit" 
                                className="group relative inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                            >
                                <span className="relative z-10">Update Promotion</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditPromotion