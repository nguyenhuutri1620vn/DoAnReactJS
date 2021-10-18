import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Navbar from './Navbar';
import Footer from './Footer';

import PublicRoutesList from '../../routes/PublicRoutesList'

import '../../assets/frontend/css/styles.css';
// import '../../assets/frontend/js/scripts.js';

const FrontendLayout = () => {
    return (
        <div className='sb-nav-fixed'>

            <Navbar />
            <div id="layoutSidenav_content" className="main-chingu">
                <main>
                    <Switch>
                        {PublicRoutesList.map((route, idx) => {
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
                    </Switch>
                </main>

            </div>
            <Footer />
        </div>
    )
}

export default FrontendLayout;