import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Navbar from './Navbar';
import Slidebar from './Slidebar';
import Footer from './Footer';
import routes from '../../routes/routes'

import '../../assets/admin/css/styles.css';
import '../../assets/admin/js/scripts.js';

const MasterPage = () => {
    return (
        <div className='sb-nav-fixed'>
            <Navbar />
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <Slidebar />
                </div>
                <div id="layoutSidenav_content">
                    <main>
                        <Switch>
                            {routes.map((route, idx) => {
                                return (
                                    route.component && (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={(props) => (
                                                <route.component
                                                    {...props}
                                                />
                                            )}
                                        />
                                    )
                                )
                            })}
                            <Redirect from="/admin" to='/admin/dashboard' />
                        </Switch>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default MasterPage;