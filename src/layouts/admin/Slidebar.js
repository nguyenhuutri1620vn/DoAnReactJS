import React from 'react'
import { Link } from 'react-router-dom'


const Slidebar = () => {

    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark co" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <div className="sb-sidenav-menu-heading">CHÍNH</div>
                    <Link className="nav-link" to="/admin/Dashboard">
                        <div className="sb-nav-link-icon "><i className="fas fa-tachometer-alt"></i></div>
                        Dashboard
                    </Link>
                    <div className="sb-sidenav-menu-heading">HÓA ĐƠN</div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#BilldaysLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        Order's day
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="BilldaysLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="admin/Category">Chưa duyệt</Link>
                            <Link className="nav-link" to="layout-sidenav-light.html">Tổng hóa đơn</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#BillTotalLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        Order's total
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="BillTotalLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="#">Chưa duyệt</Link>
                            <Link className="nav-link" to="layout-sidenav-light.html">Tổng hóa đơn</Link>
                        </nav>
                    </div>
                    <div className="sb-sidenav-menu-heading">Product - News</div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#CategoryLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        Category
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="CategoryLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-category">Create</Link>
                            <Link className="nav-link" to="/admin/view-category">Category List</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#ProducerPages" aria-expanded="false" aria-controls="collapsePages">
                        <div className="sb-nav-link-icon"><i className="fas fa-archway"></i></div>
                        Brand
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="ProducerPages" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-producer">Create</Link>
                            <Link className="nav-link" to="/admin/view-producer">Brand List</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#ProductPages" aria-expanded="false" aria-controls="collapsePages">
                        <div className="sb-nav-link-icon"><i className="fab fa-product-hunt"></i></div>
                        Product
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="ProductPages" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-product">Create</Link>
                            <Link className="nav-link" to="/admin/view-product">Product List</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#NewsPages" aria-expanded="false" aria-controls="collapsePages">
                        <div className="sb-nav-link-icon"><i className="fas fa-newspaper"></i></div>
                        News
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="NewsPages" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-news">Create</Link>
                            <Link className="nav-link" to="/admin/view-news">News List</Link>
                        </nav>
                    </div>
                    <div className="sb-sidenav-menu-heading">NGƯỜI DÙNG</div>
                    <Link className="nav-link" to="/admin/view-staff">
                        <div className="sb-nav-link-icon"><i className="fas fa-user-astronaut"></i></div>
                        Staff
                    </Link>
                    <Link className="nav-link" to="/admin/view-users">
                        <div className="sb-nav-link-icon"><i className="fas fa-user-alt"></i></div>
                        Users
                    </Link>
                    <div className="sb-sidenav-menu-heading">GIAO DIỆN</div>
                    <Link className="nav-link" to="/admin/edit-config">
                        <div className="sb-nav-link-icon"><i className="fas fa-info-circle"></i></div>
                        Configuration WEBSITE
                    </Link>
                </div>
            </div>
            <div className="sb-sidenav-footer">
                <div className="small">Logged in as:</div>
                @USER
            </div>
        </nav>
    )
}
export default Slidebar;