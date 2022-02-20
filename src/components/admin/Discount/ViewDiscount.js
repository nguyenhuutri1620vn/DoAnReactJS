import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function ViewDiscount() {
    document.title = 'Danh sách mã giảm giá';

    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [discountList, setDiscountList] = useState([]);
    const [loading, setloading] = useState(true);
    const discountPerPage = 10;
    const pagesVisited = pageNumber * discountPerPage;

    const pageCount = Math.ceil(discountList.length / discountPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {

        axios.get(`/api/view-discounts`).then(res => {
            if (res.data.status === 200) {
                setDiscountList(res.data.discount);
            }
            setloading(false);
        })
    }, [])

    const deleteDiscount = (e, id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Đang xóa..."
        Swal.fire({
            title: "Bạn muốn xóa loại sản phẩm?",
            text: "Khi mà đã xóa rồi thì không hoàn tác được!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy!'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.delete(`/api/delete-discount/${id}`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire("Poof! Loại sản phẩm đã được xóa!", {
                            icon: "success",
                        });
                        thisClicked.innerText = "Đã xóa..."
                    } else if (res.data.status === 404) {
                        thisClicked.innerText = "Xóa"
                    }
                })
            } else {
                thisClicked.innerText = "Xóa"
            }
        })
    }
    
    var viewdiscount_HTMLTABLE = null
    if (loading) {
        <h3>Đang tải danh sách loại sản phẩm, vui lòng đợi...</h3>
    } else {
        if (search !== '') {
            viewdiscount_HTMLTABLE =
                discountList.filter((item) => {
                    if (item.name.toString().toLowerCase().includes(search.toLowerCase())) {
                        return item
                    } else {
                        return null
                    }
                }).map((item) => {
                    return (
                        <tr key={item.id}>
                            <td className='text-center'>{item.id}</td>
                            <td>{item.name}</td>
                            <td className='text-center'>{item.percent}%</td>
                            <td className='text-center'>{item.status === 1 ? 'Hiện' : 'Ẩn'}</td>
                            <td className='text-center'>
                                <Link to={`edit-category/${item.id}`}><Button variant="warning" >Sửa</Button></Link>
                            </td>
                            <td className='text-center'>
                                <Button variant="danger" onClick={(e) => deleteDiscount(e, item.id)}>Xóa</Button>
                            </td>

                        </tr>

                    )
                })
        } else {
            viewdiscount_HTMLTABLE =
            discountList.slice(pagesVisited, pagesVisited + discountPerPage).map((item) => {
                    return (
                        <tr key={item.id}>
                            <td className='text-center'>{item.id}</td>
                            <td>{item.name}</td>
                            <td className='text-center'>{item.percent}%</td>
                            <td className='text-center'>{item.status === 1 ? 'Hiện' : 'Ẩn'}</td>
                            <td className='text-center'>
                                <Link to={`edit-discount/${item.id}`}><Button variant="warning" >Sửa</Button></Link>
                            </td>
                            <td className='text-center'>
                                <Button variant="danger" onClick={(e) => deleteDiscount(e, item.id)}>Xóa</Button>
                            </td>

                        </tr>

                    )
                })
        }
    }

    return (
        <div className='container mt-2'>
        <div className='card'>
            <div className='card-header'>
                <h4>Danh sách loại sản phẩm
                    <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0 float-end">
                        <div className="input-group">
                            <input className="form-control"
                                type="text" placeholder="Tìm kiếm..."
                                aria-label="Tìm kiếm..."
                                aria-describedby="btnNavbarSearch"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                        </div>
                    </form>
                </h4>

            </div>
            <div className='card-body'>

                <table className='table table-bordered table-hover'>
                    <thead className='text-center'>
                        <tr>
                            <th className='col-3 col-sm-1'>ID</th>
                            <th className='col-3 col-sm-1'>Tên</th>
                            <th className='col-3 col-sm-1'>Phần trăm giảm giá</th>
                            <th className='col-3 col-sm-1'>Trạng thái</th>
                            <th className='col-3 col-sm-1'>Sửa</th>
                            <th className='col-3 col-sm-1'>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewdiscount_HTMLTABLE}
                    </tbody>
                </table>
            </div>
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
        </div>

    </div>
    )
}
export default ViewDiscount