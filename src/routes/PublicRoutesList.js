import Home from "../components/frontend/Home";
import About from "../components/frontend/About";
import Checkout from "../components/frontend/Checkout";
import Cart from "../components/frontend/Cart";
import News from "../components/frontend/News";
import Login from "../components/frontend/auth/Login";
import Register from "../components/frontend/auth/Register";
import Product from "../components/frontend/Product"
import ViewProductCategory from "../components/frontend/ViewProductCategory";
import ViewProductDetail from "../components/frontend/ViewProductDetail";
import DetailNews from "../components/frontend/DetailNews";



const PublicRoutesList = [

    { path: '/', exact: true, name: 'Home', component: Home },
    { path: '/about', exact: true, name: 'About', component: About },
    { path: '/checkout', exact: true, name: 'Checkout', component: Checkout },
    { path: '/cart', exact: true, name: 'Cart', component: Cart },
    { path: '/news', exact: true, name: 'News', component: News },
    { path: '/login', exact: true, name: 'Login', component: Login },
    { path: '/register', exact: true, name: 'Register', component: Register },
    { path: '/product', exact: true, name: 'Product', component: Product },
    { path: '/category/:slug', exact: true, name: 'ViewProductCategory', component: ViewProductCategory },
    { path: '/category/:category/:product', exact: true, name: 'ViewProductDetail', component: ViewProductDetail },
    { path: '/news/:content', exact: true, name: 'DetailNews', component: DetailNews },

];
export default PublicRoutesList;