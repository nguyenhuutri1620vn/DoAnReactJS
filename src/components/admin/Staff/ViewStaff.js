import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import Swal from "sweetalert2";
import { Button } from 'react-bootstrap'
import Moment from "react-moment";
import { Link } from "react-router-dom";

function ViewStaff() {
    document.title = 'Danh sách nhân viên';

    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    const staffPerPage = 10;
    const pagesVisited = pageNumber * staffPerPage;

    const pageCount = Math.ceil(staff.length / staffPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        document.title = 'Danh sách nhân viên';

        axios.get(`/api/view-staff`).then(res => {
            if (res.data.status === 200) {
                setStaff(res.data.staff);
                setLoading(false);
            }
        })
    }, [])

    const becomeAdmin = (e, id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "→ → →"
        Swal.fire({
            title: "Xác nhận xóa quyền nhân viên",
            text: "Khi mà đã xóa rồi thì không thể hoàn tác !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Để sau!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Poof! Đã hủy bỏ quyền nhân viên của tài khoản!", {
                    icon: "success",
                });
                axios.put(`/api/isUser/${id}`).then(res => {
                    if (res.data.status === 200) {
                        thisClicked.closest('tr').remove();
                    } else if (res.data.status === 404) {
                        thisClicked.innerText = "→ Khách hàng"
                    }
                })
            } else {
                thisClicked.innerText = "→ Khách hàng"
            }
        })
    }
    var show_paginate = true;

    var display_staff = '';
    if (loading) {
        return <h4>Danh sách nhân viên đang tải, vui lòng đợi...</h4>
    } else {
        if (search !== '') {
            show_paginate = false
            display_staff =
                staff.sort((a, b) => (b.id - a.id)).filter((item) => {
                    if (item.username.toString().toLowerCase().includes(search.toLowerCase())) {
                        return item
                    } else {
                        return null
                    }
                }).map((item) => {
                    return (
                        <tr key={item.id}>
                            <td className='col-3 col-sm-1'>{item.username}</td>
                            <td className='col-3 col-sm-1'>{item.fullname}</td>
                            <td className='col-3 col-sm-1'>{item.email}</td>
                            <td className='col-3 col-sm-1'>{item.phone}</td>
                            <td className='col-3 col-sm-1'><Moment format="DD/MM/YYYY">{item.updated_at}</Moment></td>
                            <td className='text-center'>
                                <Link className="btn btn-warning" to={`/admin/edit-staff/${item.id}`}>Đổi mật khẩu</Link>
                            </td>
                            <td className='text-center'>
                                <Button onClick={(e) => becomeAdmin(e, item.id)} variant="danger">→ Khách hàng</Button>
                            </td>
                        </tr>
                    )
                })
        } else {
            display_staff = staff.slice(pagesVisited, pagesVisited + staffPerPage).filter((item) => {
                if (search === '') {
                    return item;
                } else if (item.username.toString().toLowerCase().includes(search.toLowerCase())) {
                    return item;
                } else {
                    return item;
                }
            }).map((item) => {
                return (
                    <tr key={item.id}>
                        <td className='col-3 col-sm-1'>{item.username}</td>
                        <td className='col-3 col-sm-1'>{item.fullname}</td>
                        <td className='col-3 col-sm-1'>{item.email}</td>
                        <td className='col-3 col-sm-1'>{item.phone}</td>
                        <td className='col-3 col-sm-1'><Moment format="DD/MM/YYYY">{item.updated_at}</Moment></td>
                        <td className='text-center'>
                            <Link className="btn btn-warning" to={`/admin/edit-staff/${item.id}`}>Đổi mật khẩu</Link>
                        </td>
                        <td className='text-center'>
                            <Button onClick={(e) => becomeAdmin(e, item.id)} variant="danger">→ Khách hàng</Button>
                        </td>
                    </tr>
                );
            })
        }
    }

    function show_panigation() {
        if (show_paginate === true) {
            return (
                <ReactPaginate
                    disabledClassName={"pagination__link--disabled"}
                    previousLabel={'←'}
                    nextLabel={'→'}
                    pageCount={pageCount}
                    onPageChange={handleChangPage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"paginationPN"}
                    nextLinkClassName={"paginationPN"}
                    activeClassName={"paginationActive"}
                >
                </ReactPaginate>
            )
        } else {
            return (
                null
            )
        }
    }
    return (
        <div className='container px-4 mt-2'>
            <div className='card'>
                <div className='card-header'>
                    <h4>Danh sách nhân viên
                        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0 float-end">
                            <div className="input-group">
                                <input className="form-control"
                                    type="text" placeholder="Tìm kiếm..."
                                    aria-label="Search for..."
                                    aria-describedby="btnNavbarSearch"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value) }}
                                />
                            </div>
                        </form>
                    </h4>

                </div>
                <div className='card-body'>
                    <table className='table table-hover table-bordered'>
                        <thead className='text-center'>
                            <tr>
                                <th className='col-3 col-sm-1'>Username</th>
                                <th className='col-3 col-sm-1'>Họ và tên</th>
                                <th className='col-3 col-sm-1'>Email</th>
                                <th className='col-3 col-sm-1'>Điện thoại</th>
                                <th className='col-3 col-sm-1'>Ngày nhận việc</th>
                                <th className='col-3 col-sm-1'>Sửa</th>
                                <th className='col-3 col-sm-1'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_staff}
                        </tbody>
                    </table>
                </div>
                {show_panigation()}

            </div>
        </div>
    )
}

export default ViewStaff;