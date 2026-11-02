import express from "express" 
import {authenticateUser} from "../middlewares/auth.middleware.js"
import { validateAddToCart ,validateIncrementCartItemQuantity } from "../validator/cart.validator.js"
import { addToCart, createOrderController ,  getCart, incrementCartItemQuantity , decrementCartItemQuantity , verifyOrderController , removeCartItem , clearCart } from "../controllers/cart.controller.js"

const router = express.Router()


/**

* @route POST /cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add to cart
 * @argument variantId - ID of the product variant to add to cart (optional)
 * @argument quantity - Quantity of the product to add to cart (optional, default is 1)
 
**/


router.post("/add/:productId/:variantId" , authenticateUser, validateAddToCart , addToCart)


/** 
 * @route GET /api/cart
 * @desc Get the user's cart
 * @access Private
**/ 

router.get('/' , authenticateUser , getCart)


/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increment item quantity in cart by one
 * @desc decrement item quantity in cart by one
 * @access Private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 **/

router.patch("/quantity/increment/:productId/:variantId" , authenticateUser , validateIncrementCartItemQuantity , incrementCartItemQuantity)


router.patch("/quantity/decrement/:productId/:variantId" , authenticateUser , validateIncrementCartItemQuantity , decrementCartItemQuantity)

/**
 * @route POST /api/cart/payment/create/order
 */

router.post("/payment/create/order", authenticateUser , createOrderController)

router.post("/payment/verify/order" , authenticateUser , verifyOrderController)


/**
 * @route DELETE /api/cart/item/:productId/:variantId
 * @desc Remove one item from the cart
 * @access Private
 */
router.delete("/item/:productId/:variantId" , authenticateUser , validateIncrementCartItemQuantity , removeCartItem)

/**
 * @route DELETE /api/cart
 * @desc Remove every item from the cart
 * @access Private
 */
router.delete("/" , authenticateUser , clearCart)

export default router