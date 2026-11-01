import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {

    let cart = (await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },

        { $unwind: { path: '$items' } },
        { $lookup: { from: 'men_products', localField: 'items.product', foreignField: '_id', as: 'menMatch' } },
        { $lookup: { from: 'women_products', localField: 'items.product', foreignField: '_id', as: 'womenMatch' } },
        
        {
            $addFields: {
                'items.product': {
                    $first: {
                        $concatArrays: ['$menMatch', '$womenMatch']
                    }
                }
            }
        },
        
        { $project: { menMatch: 0, womenMatch: 0 } },
        { $unwind: { path: '$items.product' } },
        {
            $unwind: { path: '$items.product.variants' }
        },
        {
            $match: {
                $expr: {
                    $eq: [
                        '$items.variant',
                        '$items.product.variants._id'
                    ]
                }
            }
        },
        {
            $addFields: {
                itemPrice: {
                    price: {
                        $multiply: [
                            '$items.quantity',
                            '$items.product.variants.price.amount'
                        ]
                    },
                    currency:
                        '$items.product.variants.price.currency'
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice.price' },
                currency: {
                    $first: '$itemPrice.currency'
                },
                items: { $push: '$items' }
            }
        }
    ]))[0]

    return cart
}