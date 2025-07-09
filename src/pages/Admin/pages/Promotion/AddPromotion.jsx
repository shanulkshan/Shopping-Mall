import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function AddPromotion() {

    const { productId, shopId, shoptype } = useParams();

    const [promotion, setPromotion] = useState({
        itemName: "",
        itemId: "",
        itemImage: "",
        oldPrice: "",
        discountRate: "",
        newPrice: "",
        startDate: "",
        endDate: ""
    });

    const [shop, setShop] = useState({
        shopName: "",
        floorNumber: undefined,
        stallNumber: undefined
    })

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/promotion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    itemName: promotion.itemName,
                    itemImage: promotion.itemImage,
                    oldPrice: promotion.oldPrice,
                    shopName: shop.shopName,
                    stallNumber: shop.stallNumber,
                    floorNumber: shop.floorNumber,
                    discountRate: promotion.discountRate,
                    newPrice: promotion.newPrice,
                    startDate: promotion.startDate,
                    endDate: promotion.endDate
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message);
                return;
            }

            if (res.ok) {
                alert("Promotion Added Successfully");
                setPromotion({
                    itemId: "",
                    itemImage: "",
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
        const getShop = async () => {
            try {
                const res = await fetch(`/api/${shoptype}/${shopId}`);
                const data = await res.json();
                if (res.ok) {
                    setShop({
                        ...shop,
                        shopName: data.name,
                        floorNumber: data.FloorNumber,
                        stallNumber: data.stallNumber,
                    })
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getShop();
    }, [shopId, shoptype])

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await fetch(`/api/product/product/${productId}`);
                const data = await res.json();
                if (res.ok) {
                    setPromotion({
                        ...promotion,
                        itemName: data.title,
                        itemId: data._id,
                        itemImage: data.image,
                        oldPrice: data.price
                    })
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        getProduct();
    }, [productId])

    useEffect(() => {
        setPromotion({
            ...promotion,
            newPrice: `${Number(promotion?.oldPrice) - Number((Number(promotion?.oldPrice) * Number(promotion?.discountRate) / 100))}`
        })
    }, [promotion?.discountRate])

    return (
        <div class="max-w-xl mx-auto bg-white shadow-lg rounded-md p-6">
            <h1 class="text-2xl font-bold mb-4">Add Promotion</h1>
            <form onSubmit={onSubmit}>
                <div class="flex gap-4 mb-4">

                    <div class="flex-1">
                        <label for="shopName" class="block text-gray-700">Shop Name</label>
                        <input
                            type="text"
                            id="shopName"
                            disabled
                            value={shop?.shopName}
                            onChange={(e) => {
                                setShop({ ...shop, shopName: e.target.value });
                            }}
                            name="shopName"
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                            placeholder="Enter shopName"
                        />
                    </div>


                    <div class="flex-1">
                        <label for="stallNumber" class="block text-gray-700">Stall Number</label>
                        <input
                            type="text"
                            id="stallNumber"
                            name="stallNumber"
                            value={shop?.stallNumber}
                            disabled
                            onChange={(e) => {
                                setShop({ ...shop, stallNumber: e.target.value });
                            }}
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                            placeholder="Enter Stall Number"
                        />
                    </div>


                    <div class="flex-1">
                        <label for="floorNumber" class="block text-gray-700">Floor Number</label>
                        <input
                            type="text"
                            id="floorNumber"
                            disabled
                            value={shop?.floorNumber}
                            onChange={(e) => {
                                setShop({ ...shop, floorNumber: e.target.value });
                            }}
                            name="floorNumber"
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                            placeholder=" Floor Number"
                        />
                    </div>
                </div>
                <div class="mb-4">
                    <label for="itemId" class="block text-gray-700">Item Title</label>
                    <input
                        type="text"
                        id="itemName"
                        disabled
                        value={promotion?.itemName}
                        onChange={(e) => {
                            setPromotion({ ...promotion, itemName: e.target.value });
                        }}
                        name="itemName"
                        class="form-input mt-1 block w-full rounded-md border-gray-300"
                        placeholder="Enter Item Name"
                    />
                </div>

                <div class="mb-4">
                    <label for="itemImage" class="block text-gray-700">Item Image</label>
                    <img src={promotion?.itemImage} alt="item" style={{ height: '200px', objectFit: 'cover', marginLeft: '40px' }} />
                </div>

                <div class="flex gap-4 mb-4">

                    <div class="flex-1">
                        <label for="oldPrice" class="block text-gray-700">Current Price</label>
                        <input
                            type="text"
                            id="oldPrice"
                            disabled
                            value={promotion?.oldPrice}
                            onChange={(e) => {
                                setPromotion({ ...promotion, oldPrice: e.target.value });
                            }}
                            name="oldPrice"
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                            placeholder="Enter Current Price"
                        />
                    </div>


                    <div class="flex-1">
                        <label for="discountRate" class="block text-gray-700">Discount Rate (%)</label>
                        <input
                            type="text"
                            id="discountRate"
                            name="discountRate"
                            value={promotion?.discountRate}
                            onChange={(e) => {
                                setPromotion({ ...promotion, discountRate: e.target.value });
                            }}
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                            placeholder="Enter Discount Rate"
                        />
                    </div>


                    <div class="flex-1">
                        <label for="newPrice" class="block text-gray-700">New Price</label>
                        <input
                            type="text"
                            id="newPrice"
                            disabled
                            value={promotion?.newPrice}
                            onChange={(e) => {
                                setPromotion({ ...promotion, newPrice: e.target.value });
                            }}
                            name="newPrice"
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                            placeholder=" New Price"
                        />
                    </div>
                </div>

                <div class="flex gap-4 mb-6">

                    <div class="flex-1">
                        <label for="startDate" class="block text-gray-700">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={promotion?.startDate}
                            onChange={(e) => {
                                setPromotion({ ...promotion, startDate: e.target.value });
                            }}
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                        />
                    </div>


                    <div class="flex-1">
                        <label for="endDate" class="block text-gray-700">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={promotion?.endDate}
                            onChange={(e) => {
                                setPromotion({ ...promotion, endDate: e.target.value });
                            }}
                            class="form-input mt-1 block w-full rounded-md border-gray-300"
                        />
                    </div>
                </div>

                <div class="flex justify-center">
                    <button type="submit" class="px-16 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" >Add Promotion</button>
                </div>
            </form>
            
        </div>

    )
}

export default AddPromotion