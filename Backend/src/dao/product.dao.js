import { menProductModel, womenProductModel } from "../models/product.model.js";

export const findProductById = async (productId, extraFilter = {}) => {
    const filter = { _id: productId, ...extraFilter }
    const [men, women] = await Promise.all([
        menProductModel.findOne(filter),
        womenProductModel.findOne(filter)
    ])
    return men || women
}

export const stockOfVariant = async (productId, variantId) => {

    const product = await findProductById(
        productId,
        {
            "variants._id": variantId

        })

    const stock = product.variants.find(variant => variant._id.toString() === variantId).stock

    return stock

}