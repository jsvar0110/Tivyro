import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice ({
    name : "product" ,
    initialState : {

        sellerProducts : [] ,
        products : [] ,
        currentProduct : null

    } ,
    reducers : {

        setSellerProducts : (state , action) =>{
            state.sellerProducts = action.payload
        } ,
        setProducts : (state , action) => {
            state.products = action.payload
        } 
        ,
        setCurrentProduct : (state , action) => {
            state.currentProduct = action.payload
        }

    }
})


export const {setSellerProducts , setProducts , setCurrentProduct} = productSlice.actions 

export default productSlice.reducer