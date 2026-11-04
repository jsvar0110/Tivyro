import axios from 'axios'
import { attachLoadingInterceptors } from '../../Shared/loading/requestTracker.js'
import { API_URL } from '../../../config/api.js'

const cartApiInstance = axios.create({

    baseURL : `${API_URL}/api/cart` ,
    withCredentials : true

})

attachLoadingInterceptors(cartApiInstance)

export const addItem = async ({ productId , variantId }) => { 

    const response = await cartApiInstance.post(`/add/${productId}/${variantId}` , {
        quantity : 1
    })


    return response.data
}

export const getCart = async () => {

    const response = await cartApiInstance.get("/")

     return response.data

}

export const incrementCartItemApi = async ({productId , variantId}) => {


    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data

}

export const decrementCartItemApi = async ({ productId , variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data
}

export const createOrder = async (payload = {}) => {

    const response = await cartApiInstance.post(
        "/payment/create/order",
        payload
    );

    return response.data;
};

export const verifyCartOrder = async({razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
    const response = await cartApiInstance.post("/payment/verify/order" , {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return response.data
}

export const removeCartItemApi = async ({ productId , variantId }) => {
    const response = await cartApiInstance.delete(`/item/${productId}/${variantId}`)
    return response.data
}

export const clearCartApi = async () => {
    const response = await cartApiInstance.delete("/")
    return response.data
}