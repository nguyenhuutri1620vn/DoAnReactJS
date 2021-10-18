import React from 'react'
import { Link } from 'react-router-dom'


const Footer = () => {
    return (
        <div className="container-fluid px-4">
            <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; Your Website 2021</div>
                <div>
                    <Link to="#">Privacy Policy</Link>
                    &middot;
                    <Link to="#">Terms &amp; Conditions</Link>
                </div>
            </div>
        </div>
    )
}
export default Footer;