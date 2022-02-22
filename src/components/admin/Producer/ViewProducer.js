import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import Swal from "sweetalert2";

function ViewProducer() {
    document.title = 'Danh sách thương hiệu';

    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setloading] = useState(true);
    const [producerList, setproducerList] = useState([]);

    const producerPerPage = 10;
    const pagesVisited = pageNumber * producerPerPage;

    useEffect(() => {
        axios.get(`/api/view-producer`).then(res => {
            if (res.data.status === 200) {
                setproducerList(res.data.producer)
            }
            setloading(false);
        })
    }, [])

    const deleteProducer = (e, id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Đang xóa..."

        Swal.fire({
            title: "Xác nhận xóa thương hiệu?",
            text: "Khi mà đã xóa rồi thì không hoàn tác được!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/delete-producer/${id}`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire(
                            'Poof! Thương hiệu đã được xóa!',
                            '',
                            'success'
                        )
                        thisClicked.closest('tr').remove();
                        // history.push(`admin/view-producer`);
                    } else if (res.data.status === 404) {
                        thisClicked.innerText = "Đã xóa..."
                    }
                })
            } else {
                thisClicked.innerText = "Xóa"
            }
        })
    }
    var show_paginate = true
    var viewproducer_HTMLTABLE = null;
    if (loading) {
        <h3>Đang tải trang danh sách thương hiệu, vui lòng đợi...</h3>
    } else {
        
        if (search !== '') {
            show_paginate = false
            viewproducer_HTMLTABLE =
                producerList.filter((item) => {
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
                            <td>{item.slug}</td>
                            <td className="text-center">{item.status === 1 ? 'Hiện' : 'Ẩn'}</td>
                            <td className='text-center'>
                                <Link to={`edit-producer/${item.id}`} className='btn btn-warning btn-sm py-2 px-3' >Sửa</Link>
                            </td>
                            <td className='text-center'>
                                <Button variant="danger" onClick={(e) => deleteProducer(e, item.id)}>Xóa</Button>
                            </td>
                        </tr>
                    )
                })
        } else {
            viewproducer_HTMLTABLE =
                producerList.slice(pagesVisited, pagesVisited + producerPerPage).map((item) => {
                    return (
                        <tr key={item.id}>
                            <td className='text-center'>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.slug}</td>
                            <td className="text-center">{item.status === 1 ? 'Hiện' : 'Ẩn'}</td>
                            <td className='text-center'>
                                <Link to={`edit-producer/${item.id}`} className='btn btn-warning btn-sm py-2 px-3'>Sửa</Link>
                            </td>
                            <td className='text-center'>
                                <Button variant="danger" onClick={(e) => deleteProducer(e, item.id)}>Xóa</Button>
                            </td>
                        </tr>
                    )
                })
        }
    }
    const pageCount = Math.ceil(producerList.length / producerPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }
    function show_panigation (){
        if (show_paginate === true){
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
        }else {
            return (
                null
             )
        }
    }
    return (
        <div className='container px-4 mt-2'>
            <div className='card'>
                <div className='card-header'>
                    <h4>Danh sách thương hiệu
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
                    <table className='table table-bordered table-hover'>
                        <thead className='text-center'>
                            <tr>
                                <th className='col-3 col-sm-1'>ID</th>
                                <th className='col-3 col-sm-1'>Tên thương hiệu</th>
                                <th className='col-3 col-sm-1'>Slug</th>
                                <th className='col-3 col-sm-1'>Trạng thái</th>
                                <th className='col-3 col-sm-1'>Chỉnh sửa</th>
                                <th className='col-3 col-sm-1'>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewproducer_HTMLTABLE}
                        </tbody>
                    </table>
                </div>
                {show_panigation()}
            </div>
        </div>
    )
}

export default ViewProducer

