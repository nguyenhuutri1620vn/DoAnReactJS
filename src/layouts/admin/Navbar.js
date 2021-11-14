import axios from 'axios';
import React from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { useHistory } from "react-router";

const Navbar = () => {

    const history = useHistory();
    const logoutSubmit = (e) => {
        e.preventDefault();
        axios.post(`/api/logout`).then(res => {
            if (res.data.status === 200) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_name')
                Swal.fire('Success', res.data.message, 'success')
                history.push('/');
            }
        });
    }

    return (
         <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ms-3" to="/admin/dashboard">CHINGUMUSIC</Link>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
            <ul className="ms-auto me-md-3 my-2">
                <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></Link>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><button className="dropdown-item" onClick={logoutSubmit}>Đăng xuất</button></li>
                    </ul>
                </li>
            </ul>
        </nav>

    )
}

export default Navbar;