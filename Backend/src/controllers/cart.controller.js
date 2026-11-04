import cartModel from "../models/cart.model.js";
import { stockOfVariant, findProductById } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";


export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params
    const { quantity = 1 } = req.body

    const product = await findProductById(
        productId,
        { "variants._id": variantId }
    )

    if (!product) {

        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }


    const stock = await stockOfVariant(productId, variantId)

    const cart = (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }))


    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

    if (isProductAlreadyInCart) {

        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity
        if (quantityInCart + quantity > stock) {

            return res.status(400).json({
                message: `Only ${stock} items left in stock . and you already have ${quantityInCart} items in your cart`,
                success: false
            })

        }

        await cartModel.findByIdAndUpdate(
            { user: req.user._id, 'items.product': productId, 'items.variant': variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )


        return res.status(200).json({
            message: "Item added to cart successfully",
            success: true
        })
    }



    if (quantity > stock) {

        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })

    }


    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.price
    })


    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })
}

export const getCart = async (req, res) => {

    const user = req.user

    let cart = await getCartDetails(user._id)

    if (!cart) {

        cart = (await cartModel.findOne({ user: user._id })) || (await cartModel.create({ user: user._id }))
    }


    return res.status(200).json({
        message: "Cart retrieved successfully",
        success: true,
        cart
    })

}

export const incrementCartItemQuantity = async (req, res) => {


    const { productId, variantId } = req.params

    const product = await findProductById(
        productId,
        { "variants._id": variantId }
    )

    if (!product) {

        return res.status(404).json({
            message: "Product or variant not found ",
            status: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {

        return res.status(404).json({
            message: "Cart not found",
            status: false
        })

    }

    const stock = await stockOfVariant(productId, variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0


    if (itemQuantityInCart + 1 > stock) {

        return res.status(400).json({
            message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
            status: false
        })

    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, items: { $elemMatch: { product: productId, variant: variantId } } },
        { $inc: { "items.$.quantity": 1 } },
        { new: true }
    )

    return res.status(200).json({
        message: "Cart item incremented successfully",
        status: true
    })
}



export const decrementCartItemQuantity = async (req, res) => {

    const { productId, variantId } = req.params

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({ message: "Cart not found", status: false })
    }

    const item = cart.items.find(i => i.product.toString() === productId && i.variant?.toString() === variantId)

    if (!item) {
        return res.status(404).json({ message: "Item not found in cart", status: false })
    }

    if (item.quantity <= 1) {
        return res.status(400).json({ message: "Quantity can't go below 1. Remove the item instead.", status: false })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, items: { $elemMatch: { product: productId, variant: variantId } } },
        { $inc: { "items.$.quantity": -1 } },
        { new: true }
    )

    return res.status(200).json({ message: "Cart item decremented successfully", status: true })
}


export const createOrderController = async (req, res) => {
    try {
        const { productId, variantId, quantity = 1 } = req.body || {};

        let amount;
        let currency;
        let orderItems;

        // =====================================
        // CASE 1: BUY NOW — SINGLE PRODUCT
        // =====================================

        const isBuyNow =
            productId !== undefined || variantId !== undefined;

        if (isBuyNow) {

            // Validate the incoming product details
            if (
                !mongoose.isValidObjectId(productId) ||
                !mongoose.isValidObjectId(variantId) ||
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product, variant or quantity"
                });
            }

            // Fetch product from MongoDB
            const product = await findProductById(
                productId,
                { "variants._id": variantId }
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product or variant not found"
                });
            }

            // Find the selected variant
            const variant = product.variants.find(
                item => item._id.toString() === variantId
            );

            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: "Selected variant not found"
                });
            }

            // Check available stock
            if ((variant.stock ?? 0) < quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock"
                });
            }

            // Get price from variant, or product if variant has no price
            const selectedPrice =
                variant.price?.amount != null
                    ? variant.price
                    : product.price;

            amount = selectedPrice.amount * quantity;
            currency = selectedPrice.currency || "INR";

            if (!Number.isFinite(amount) || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product price"
                });
            }

            // Create payment item for only this product
            orderItems = [
                {
                    title: product.title,
                    productId: product._id,
                    variantId: variant._id,
                    quantity,

                    images: variant.images?.length
                        ? variant.images
                        : product.images,

                    description: product.description,

                    price: {
                        amount: selectedPrice.amount,
                        currency
                    }
                }
            ];

        } else {

            // =====================================
            // CASE 2: EXISTING CART CHECKOUT
            // =====================================

            const cart = await getCartDetails(req.user._id);

            if (!cart || !cart.items?.length) {
                return res.status(400).json({
                    success: false,
                    message: "Cart is empty"
                });
            }

            amount = cart.totalPrice;
            currency = cart.currency || "INR";

            orderItems = cart.items.map(item => {
                const variant = item.product.variants;

                const itemPrice =
                    variant?.price?.amount != null
                        ? variant.price
                        : item.product.price;

                return {
                    title: item.product.title,
                    productId: item.product._id,
                    variantId: item.variant,
                    quantity: item.quantity,

                    images: variant?.images?.length
                        ? variant.images
                        : item.product.images,

                    description: item.product.description,

                    price: {
                        amount: itemPrice.amount,
                        currency: itemPrice.currency || currency
                    }
                };
            });
        }

        // =====================================
        // COMMON RAZORPAY ORDER CREATION
        // =====================================

        const order = await createOrder({
            amount,
            currency
        });

        // Save payment information in MongoDB
        await paymentModel.create({
            user: req.user._id,

            razorpay: {
                orderId: order.id
            },

            price: {
                amount,
                currency
            },

            orderItems
        });

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order
        });

    } catch (error) {
        console.error("Order creation failed:", error);

        return res.status(500).json({
            success: false,
            message: "Could not create order"
        });
    }
};




export const verifyOrderController = async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        user: req.user._id,
        status: "pending"
    })

    if (!payment) {
        return res.status(400).json({
            message: "Payment not found ",
            success: false
        })
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,

    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)


    if (!isPaymentValid) {
        return res.status(400).json({
            message: "Payment Verification failed",
            success: false
        })
    }

    payment.status = "paid"

    payment.razorpay.paymentId = razorpay_payment_id,
        payment.razorpay.signature = razorpay_signature

    await payment.save()

    return res.status(200).json({
        message: "Payment verified successfully",
        success: true
    })
}



export const removeCartItem = async (req, res) => {

    const { productId, variantId } = req.params

    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: {
                items: {
                    product: new mongoose.Types.ObjectId(productId),
                    variant: new mongoose.Types.ObjectId(variantId)
                }
            }
        },
        { new: true }
    )

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Item removed from cart",
        success: true
    })
}


export const clearCart = async (req, res) => {

    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } },
        { new: true }
    )

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Cart cleared successfully",
        success: true
    })
}