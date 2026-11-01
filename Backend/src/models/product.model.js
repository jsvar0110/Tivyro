import mongoose from "mongoose";
import priceSchema from "./price.schema.js"

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    }
    ,
    description: {
        type: String,
        required: true
    }
    ,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
    ,
    gender: {
        type: String,
        enum: ["men", "women"],
        required: true
    }
    ,
    price: {
        type: priceSchema,
        required: true
    }
    ,
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    variants: [
        {

            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema,
            }
        },
    ]

}, { timestamps: true })



export const menProductModel = mongoose.model('menProduct' , productSchema , 'men_products')
export const womenProductModel = mongoose.model('womenProduct' , productSchema , 'women_products')

const models = { men : menProductModel , women : womenProductModel }
export const getProductModel = (gender) => models[gender]