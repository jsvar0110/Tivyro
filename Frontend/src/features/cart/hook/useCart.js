import { addItem , getCart , incrementCartItemApi , decrementCartItemApi , createOrder , verifyCartOrder , removeCartItemApi , clearCartApi } from "../service/cart.api";
import { useDispatch } from "react-redux"
import { setCart, incrementCartItem } from "../state/cart.slice";


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })

        return data
    }


    async function handleGetCart() {

        const data = await getCart()

        console.log(data)
        dispatch(setCart(data.cart))

    }

    async function handleIncrementCartItem({ productId, variantId }) {

        await incrementCartItemApi({ productId, variantId })
        await handleGetCart()

    }

    async function handleDecrementCartItem({ productId, variantId }) {

        await decrementCartItemApi({ productId, variantId })
        await handleGetCart()

    }

    async function handleCreateCartOrder() {
        const data = await createOrder()
        return data.order
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {

        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success

    }


    async function handleRemoveCartItem({ productId, variantId }) {
        await removeCartItemApi({ productId, variantId })
        await handleGetCart()
    }

    async function handleClearCart() {
        await clearCartApi()
        await handleGetCart()
    }



    return { handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleCreateCartOrder, handleVerifyCartOrder, handleRemoveCartItem, handleClearCart }
}