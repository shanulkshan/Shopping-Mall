
import React, { useEffect, useState } from "react";
import PromotionCancel from "./PromotionCancel";
import { PrinterIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useDarkMode } from "../../../../context/DarkModeContext";

const PromotionList = () => {
    const { isDarkMode } = useDarkMode();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/promotion/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                alert("Deleted Successfully");
                toggleModal()
                window.location.reload();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }

        return false;
    };

    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const getPromotion = async () => {
            try {
                const res = await fetch(`/api/promotion`);
                const data = await res.json();
                if (res.ok) {
                    setPromotions(data)
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        getPromotion();
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Promotion Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all active promotions</p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                        Item Name
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                        Old Price
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                        Discount (%)
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                        New Price
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                                        End Date
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-gray-700 dark:text-gray-300 font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {promotions.map((data, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                                    >
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                            {data.itemName}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                            LKR {Number(data.oldPrice)?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                {data.discountRate}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-semibold">
                                            LKR {Number(data.newPrice)?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                            {data.startDate}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                            {data.endDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => window.location.replace(`/admin/promotion-view/${data?._id}/list`)}
                                                    className="group relative p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                                                    title="View Promotion"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => window.location.replace(`/admin/promotion-edit/${data?._id}`)}
                                                    className="group relative p-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                                                    title="Edit Promotion"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <PromotionCancel
                                                    isOpen={isModalOpen}
                                                    toggleModal={toggleModal}
                                                    onDetele={() => handleDelete(data?._id)}
                                                />
                                                <button
                                                    onClick={() => window.location.replace(`/admin/promotion-qr-code/${data?._id}`)}
                                                    className="group relative p-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                                                    title="Generate QR Code"
                                                >
                                                    <PrinterIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {promotions.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-12 max-w-md mx-auto">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <PrinterIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                No Promotions Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                There are currently no active promotions to display.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionList;
