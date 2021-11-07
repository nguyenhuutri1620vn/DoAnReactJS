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
                        Thống kê
                    </Link>
                    <div className="sb-sidenav-menu-heading">HÓA ĐƠN</div>
                    <Link className="nav-link" to="/admin/view-order">
                        <div className="sb-nav-link-icon"><i className="fas fa-file-invoice"></i></div>
                        Đơn hàng
                    </Link>
                    <div className="sb-sidenav-menu-heading">Sản phẩm - Tin tức</div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#CategoryLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        Loại sản phẩm
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="CategoryLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-category">Tạo</Link>
                            <Link className="nav-link" to="/admin/view-category">Danh sách</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#ProducerPages" aria-expanded="false" aria-controls="collapsePages">
                        <div className="sb-nav-link-icon"><i className="fas fa-archway"></i></div>
                        Thương hiệu
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="ProducerPages" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-producer">Tạo</Link>
                            <Link className="nav-link" to="/admin/view-producer">Danh sách</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#ProductPages" aria-expanded="false" aria-controls="collapsePages">
                        <div className="sb-nav-link-icon"><i className="fab fa-product-hunt"></i></div>
                        Sản phẩm
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="ProductPages" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-product">Tạo</Link>
                            <Link className="nav-link" to="/admin/view-product">Danh sách</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#NewsPages" aria-expanded="false" aria-controls="collapsePages">
                        <div className="sb-nav-link-icon"><i className="fas fa-newspaper"></i></div>
                        Tin tức
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="NewsPages" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/add-news">Tạo</Link>
                            <Link className="nav-link" to="/admin/view-news">Danh sách</Link>
                        </nav>
                    </div>
                    <div className="sb-sidenav-menu-heading">NGƯỜI DÙNG</div>
                    <Link className="nav-link" to="/admin/view-staff">
                        <div className="sb-nav-link-icon"><i className="fas fa-user-astronaut"></i></div>
                        Nhân viên
                    </Link>
                    <Link className="nav-link" to="/admin/view-users">
                        <div className="sb-nav-link-icon"><i className="fas fa-user-alt"></i></div>
                        Khách hàng
                    </Link>
                    <div className="sb-sidenav-menu-heading">GIAO DIỆN</div>
                    <Link className="nav-link" to="/admin/edit-config">
                        <div className="sb-nav-link-icon"><i className="fas fa-info-circle"></i></div>
                        Cấu hình WEBSITE
                    </Link>
                </div>
            </div>
        </nav>
    )
}
export default Slidebar;