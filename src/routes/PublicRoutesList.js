import Home from "../components/frontend/Home";
import Profile from "../components/frontend/Profile";
import ChangePassword from "../components/frontend/ChangePassword";
import OrderHistory from "../components/frontend/OrderHistory";
import Checkout from "../components/frontend/Checkout";
import Cart from "../components/frontend/Cart";
import News from "../components/frontend/News";
import Login from "../components/frontend/auth/Login";
import Register from "../components/frontend/auth/Register";
import Product from "../components/frontend/Product"
import ViewProductCategory from "../components/frontend/ViewProductCategory";
import ViewProductDetail from "../components/frontend/ViewProductDetail";
import DetailNews from "../components/frontend/DetailNews";
import OrderDetail from "../components/frontend/OrderDetail";
import Search from "../components/frontend/Search";
import ProductFeatured from "../components/frontend/ProductFeatured";
import ProductPopular from "../components/frontend/ProductPopular";
import Thanks from "../components/frontend/Thanks";

const PublicRoutesList = [

    { path: '/', exact: true, name: 'Home', component: Home },
    { path: '/profile', exact: true, name: 'Profile', component: Profile },
    { path: '/change-password', exact: true, name: 'ChangePassword', component: ChangePassword },
    { path: '/order-history', exact: true, name: 'OrderHistory', component: OrderHistory },
    { path: '/order-detail/:id', exact: true, name: 'OrderDetail', component: OrderDetail },
    { path: '/checkout', exact: true, name: 'Checkout', component: Checkout },
    { path: '/cart', exact: true, name: 'Cart', component: Cart },
    { path: '/news', exact: true, name: 'News', component: News },
    { path: '/login', exact: true, name: 'Login', component: Login },
    { path: '/register', exact: true, name: 'Register', component: Register },
    { path: '/product', exact: true, name: 'Product', component: Product },
    { path: '/category/:slug', exact: true, name: 'ViewProductCategory', component: ViewProductCategory },
    { path: '/category/:category/:product', exact: true, name: 'ViewProductDetail', component: ViewProductDetail },
    { path: '/news/:content', exact: true, name: 'DetailNews', component: DetailNews },
    { path: '/product/:name', exact: true, name: 'Search', component: Search },
    { path: '/product-featured', exact: true, name: 'ProductFeatured', component: ProductFeatured },
    { path: '/product-popular', exact: true, name: 'ProductPopular', component: ProductPopular},
    { path: '/thank-you', exact: true, name: 'Thanks', component: Thanks},

];
export default PublicRoutesList;