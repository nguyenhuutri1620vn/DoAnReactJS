import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';
import Moment from "react-moment";

function ViewUser() {
    document.title = 'Danh sách khách hàng';

    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(true);

    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;

    const pageCount = Math.ceil(users.length / usersPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        axios.get(`/api/view-users`).then(res => {
            if (res.data.status === 200) {
                setUser(res.data.users);
                setLoading(false);
            }
        })
    }, [])

    const becomeAdmin = (e, id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "→ → →"

        Swal.fire({
            title: "Có chắc là muốn cấp quyền nhân viên chưa?",
            text: "Hãy cân nhân trước khi đồng ý!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Để sau!'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Yeh! Khách hàng đã trở thành nhân viên!", {
                        icon: "success",
                    });
                    axios.put(`/api/isAdmin/${id}`).then(res => {
                        if (res.data.status === 200) {
                            thisClicked.closest('tr').remove();
                        } else if (res.data.status === 404) {
                            thisClicked.innerText = "→ → →"
                        }
                    })
                } else {
                    thisClicked.innerText = "→ Nhân viên"
                }
            });
    }

    var display_users = '';
    if (loading) {
        return <h4>Đang tải danh sách khách hàng, vui lòng đợi...</h4>
    } else {
        display_users = users.slice(pagesVisited, pagesVisited + usersPerPage).filter((item) => {
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
                    <td className='col-3 col-sm-1 text-center'>{item.id}</td>
                    <td className='col-3 col-sm-1'>{item.username}</td>
                    <td className='col-3 col-sm-1'>{item.fullname}</td>
                    <td className='col-3 col-sm-1'>{item.email}</td>
                    <td className='col-3 col-sm-1'>{item.phone}</td>
                    <td className='col-3 col-sm-1'><Moment format="DD/MM/YYYY">{item.created_at}</Moment></td>
                    <td className='text-center'>
                        <button onClick={(e) => becomeAdmin(e, item.id)} className="btn btn-success">→ Nhân viên</button>
                    </td>
                </tr>
            );
        });
    }


    return (
        <div className='container px-4 mt-2'>
            <div className='card'>
                <div className='card-header'>
                    <h4>Danh sách khách hàng
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
                                <th>ID</th>
                                <th className='col-3 col-sm-1'>Username</th>
                                <th className='col-3 col-sm-1'>Họ và tên</th>
                                <th className='col-3 col-sm-1'>Email</th>
                                <th className='col-3 col-sm-1'>Số điện thoại</th>
                                <th className='col-3 col-sm-1'>Ngày tạo</th>
                                <th className='col-3 col-sm-1'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_users}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    previousLabel={'←'}
                    nextLabel={'→'}
                    pageCount={pageCount}
                    onPageChange={handleChangPage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisable"}
                    activeClassName={"paginationActive"}
                >
                </ReactPaginate>
            </div>
        </div>
    )
}

export default ViewUser;