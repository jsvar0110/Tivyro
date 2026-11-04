import { createBrowserRouter } from "react-router"
import Register from "../features/auth/pages/Register.jsx"
import Login from "../features/auth/pages/Login.jsx"
import CreateProduct from "../features/products/pages/CreateProducts.jsx"
import Dashboard from "../features/products/pages/Dashboard.jsx"
import Protected from "../features/auth/components/Protected.jsx"
import Home from '../features/products/pages/Home.jsx'
import ProductDetails from "../features/products/pages/ProductDetails.jsx"
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx"
import Cart from "../features/cart/pages/Cart.jsx"
import Applayout from "./AppLayout.jsx"
import OrderSuccess from "../features/cart/pages/OrderSuccess.jsx"
import GenderCollection from "../features/products/pages/GenderCollection.jsx"
import GuestOnly from "../features/auth/components/GuestOnly.jsx"
import SearchResults from "../features/products/pages/SearchResults.jsx"

export const routes = createBrowserRouter([
    {
        path: '/register',
        element: <GuestOnly><Register /></GuestOnly>
    }
    ,
    {
        path: '/login',
        element: <GuestOnly><Login /></GuestOnly>
    },

    {
        element: <Applayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/search',
                element: <SearchResults />
            },
            { path: '/men', element: <GenderCollection gender="men" /> },
            { path: '/women', element: <GenderCollection gender="women" /> },
            {
                path: '/product/:productId',
                element: <ProductDetails />
            },
            {
                path: '/cart',
                element: <Protected> <Cart /> </Protected>
            },
            {
                path: '/order-success',
                element: (
                    <Protected>
                        <OrderSuccess />
                    </Protected>
                )
            },


            {
                path: '/seller',
                children: [
                    {
                        path: "/seller/create-product",
                        element: <Protected role="seller">
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "/seller/dashboard",
                        element: <Protected role="seller">
                            <Dashboard />
                        </Protected>
                    },
                    {
                        path: "/seller/product/:productId",
                        element: <Protected role="seller">
                            <SellerProductDetails />
                        </Protected>
                    }
                ]

            }
        ]
    }

])
