import axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import MasterPage from "./layouts/admin/MasterPage";

function AdminPrivateRoute({ ...rest }) {

    const [Authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory()

    useEffect(() => {
        axios.get(`/api/checkingAuthenticated`).then(res => {
            if (res.status === 200) {
                setAuthenticated(true);
            }
            setLoading(false);
        });

        return () => {
            setAuthenticated(false);
        }
    }, []);

    axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
        if (err.response.status === 401) {
            Swal.Fire('Chưa xác thực', err.response.data.message, 'warning');
            history.push('/');
        }
        return Promise.reject(err);
    });

    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (error.response.status === 403) //access denied
        {
            Swal.fire('z', error.response.data.message, 'warning');
            history.push('/403')
        } else if (error.response.status === 404) //page not found
        {
            Swal.fire('404', 'Không tìm thấy trang', 'warning');
            history.push('/404')
        }
        return Promise.reject(error)
    }
    );


    if (loading) {

        return <h4>Đang tải dữ liệu...</h4>
    }

    return (
        <Route {...rest}
            render={({ props, location }) =>
                Authenticated ?
                    (<MasterPage {...props} />) :
                    (<Redirect to={{ pathname: '/login', state: { from: location } }} />)
            } />
    );
}
export default AdminPrivateRoute