import { addItem , getItems , incrementCartItemApi } from "../service/cart.api";
import {useDispatch} from "react-redux"
import { addItem as addItemToCart, setItems  , incrementCartItem} from "../state/cart.slice";

export const useCart = () =>{

    const dispatch = useDispatch()

    async function handleAddItem({productId , variantId}) {
        const data = await addItem({productId , variantId})

        return data
    }


    async function handleGetCart() {
        
        const data = await getItems ()

        dispatch(setItems(data.cart.items))

    }

    async function handleIncrementCartItem({productId , variantId}) {

        const data = await incrementCartItemApi({productId  , variantId})
        dispatch(incrementCartItem({productId , variantId}))


    }



    return {handleAddItem , handleGetCart , handleIncrementCartItem}
}