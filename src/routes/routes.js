import Dashboard from "../components/admin/Dashboard";
import Profile from "../components/admin/Profile";

import AddCategory from "../components/admin/Category/AddCategory";
import ViewCategory from "../components/admin/Category/ViewCategory";
import EditCategory from "../components/admin/Category/EditCategory";

import AddProducer from "../components/admin/Producer/AddProducer";
import ViewProducer from "../components/admin/Producer/ViewProducer";
import EditProducer from "../components/admin/Producer/EditProducer";

import AddProduct from "../components/admin/Product/AddProduct";
import ViewProduct from "../components/admin/Product/ViewProduct";
import EditProduct from "../components/admin/Product/EditProduct";


import AddNews from "../components/admin/News/AddNews";
import ViewNews from "../components/admin/News/ViewNews";
import EditNews from "../components/admin/News/EditNews";

import ViewStaff from "../components/admin/Staff/ViewStaff";

import ViewUser from "../components/admin/User/ViewUser";

import EditConfig from "../components/admin/ConfigW/EditConfig";

import OrderView from "../components/admin/Order/OrderView";

const routes = [
    {path: '/admin', exact: true, name: 'Admin'},
    {path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Dashboard},
    {path: '/admin/profile', exact: true, name: 'Profile', component: Profile},

    //category
    {path: '/admin/add-category', exact: true, name: 'AddCategory', component: AddCategory},
    {path: '/admin/view-category', exact: true, name: 'ViewCategory', component: ViewCategory},
    {path: '/admin/edit-category/:id', exact: true, name: 'EditCategory', component: EditCategory},

    //producer
    {path: '/admin/add-producer', exact: true, name: 'AddProducer', component: AddProducer},
    {path: '/admin/view-producer', exact: true, name: 'ViewProducer', component: ViewProducer},
    {path: '/admin/edit-producer/:id', exact: true, name: 'EditProducer', component: EditProducer},

    //product
    {path: '/admin/add-product', exact: true, name:'AddProduct', component: AddProduct},
    {path: '/admin/view-product', exact: true, name:'ViewProduct', component: ViewProduct},
    {path: '/admin/edit-product/:id', exact: true, name:'EditProduct', component: EditProduct},

    //news
    {path: '/admin/add-news', exact: true, name:'AddNews', component: AddNews},
    {path: '/admin/view-news', exact: true, name:'ViewNews', component: ViewNews},
    {path: '/admin/edit-news/:id', exact: true, name:'EditNews', component: EditNews},

    //users
    {path: '/admin/view-users', exact: true, name:'ViewUser', component: ViewUser},
    
    //staff
    {path: '/admin/view-staff', exact: true, name:'ViewStaff', component: ViewStaff},

    //config
    {path: '/admin/edit-config', exact: true, name:'EditConfig', component: EditConfig},

    //order
    {path: '/admin/view-order', exact: true, name:'OrderView', component: OrderView},

];
export default routes;