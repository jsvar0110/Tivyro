import axios from "axios";

const productApiInstance = axios.create({

    baseURL: "/api/products",
    withCredentials: true,

})

export async function createProduct(formData) {

    const response = await productApiInstance.post('/', formData)

    return response.data
}


export async function getSellerProducts() {

    const response = await productApiInstance.get("/seller")

    return response.data

}

export async function getAllProducts() {

    const response = await productApiInstance.get('/')

    return response.data

}

export async function getProductById(productId) {

    const response = await productApiInstance.get(`/detail/${productId}`)
    return response.data
}

export async function addProductVariant(productId, newProductVariant) {

    console.log(newProductVariant)

    const formData = new FormData()

    newProductVariant.images.forEach((img) => {
        formData.append(`images`, img.file)
    })

    formData.append("stock", newProductVariant.stock)
    
    formData.append("priceAmount", newProductVariant.price?.amount ?? newProductVariant.price) /* Safely handles both {amount, currency} object and raw number formats */
    
    formData.append("priceCurrency", newProductVariant.price?.currency ?? "INR") /* Sends selected currency to backend instead of assuming INR always */
    
    formData.append("attributes", JSON.stringify(newProductVariant.attributes)) /* Formdata can only hold strings and files as values , It cant store Js objects or it wil give [object Object] */


    const response = await productApiInstance.post(`/${productId}/variants`, formData)

    return response.data
}