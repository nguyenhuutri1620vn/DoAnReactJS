import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'


function ViewNews() {
    document.title = 'Danh sách tin tức';
    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const newsPerPage = 5;
    const pagesVisited = pageNumber * newsPerPage;

    useEffect(() => {
        axios.get(`/api/view-news`).then(res => {
            if (res.data.status === 200) {
                setNews(res.data.news);
                setLoading(false);
            }
        })
    }, [])

    const pageCount = Math.ceil(news.length / newsPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    const deleteNews = (e, id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Đang xóa..."
        Swal.fire({
            title: "Có chắc là muốn xóa chưa?",
            text: "Khi mà đã xóa rồi thì không hoàn tác được đâu đấy!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa !!',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Poof! Loại sản phẩm đã được xóa!", {
                    icon: "success",
                });
                axios.delete(`/api/delete-news/${id}`).then(res => {
                    if (res.data.status === 200) {
                        thisClicked.closest('tr').remove();
                    } else if (res.data.status === 404) {
                        thisClicked.innerText = "Xóa"
                    }
                })
            } else {
                Swal.fire("Tin tức đã được an toàn!");
                thisClicked.innerText = "Xóa"
            }
        })
    }
    var show_paginate = true
    var display_news = '';
    if (loading) {
        return <h4>Đang tải danh sách tin tức, vui lòng đợi....</h4>
    } else {
        if (search !== '') {
            show_paginate = false
            display_news =
                news.sort((a, b) => (b.id - a.id)).filter((item) => {
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
                            <div ><td className="descrip--content">{item.meta_descrip}</td></div>
                            <td className='text-center'><img src={`http://localhost:8000/${item.image}`} alt={item.name} height="150" /></td>
                            <td className="text-center">{item.status === 1 ? "Hiện" : "Ẩn"}</td>
                            <td className='text-center'><Link to={`/admin/edit-news/${item.id}`}><Button variant="warning" >Sửa</Button></Link></td>
                            <td className='text-center'> <Button variant="danger" onClick={(e) => deleteNews(e, item.id)}>Xóa</Button></td>
                        </tr>
                    )
                })
        } else {
            display_news = news.slice(pagesVisited, pagesVisited + newsPerPage).filter((item) => {
                if (search === '') {
                    return item;
                } else if (item.name.toString().toLowerCase().includes(search.toLowerCase())) {
                    return item;
                } else {
                    return null;
                }
            }).map((item) => {
                return (
                    <tr key={item.id}>
                        <td className='text-center'>{item.id}</td>
                        <td>{item.name}</td>
                        <div ><td className="descrip--content">{item.meta_descrip}</td></div>
                        <td className='text-center'><img src={`http://localhost:8000/${item.image}`} alt={item.name} height="150" /></td>
                        <td className="text-center">{item.status === 1 ? "Hiện" : "Ẩn"}</td>
                        <td className='text-center'><Link to={`/admin/edit-news/${item.id}`}><Button variant="warning" >Sửa</Button></Link></td>
                        <td className='text-center'> <Button variant="danger" onClick={(e) => deleteNews(e, item.id)}>Xóa</Button></td>
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
                    <h4>Danh sách tin tức
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
                    <table className='table table-hover table-bordered '>
                        <thead>
                            <tr className='text-center'>
                                <th className='col-3 col-sm-1'>ID</th>
                                <th className='col-3 col-sm-2'>Tên tin tức</th>
                                <th className='col-3 col-sm-3'>Mô tả</th>
                                <th className='col-3 col-sm-3'>Hình ảnh</th>
                                <th className='col-3 col-sm-1'>Trạng thái</th>
                                <th className='col-3 col-sm-1'>Sửa</th>
                                <th className='col-3 col-sm-1'>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_news}
                        </tbody>
                    </table>
                </div>
                {show_panigation()}
            </div>
        </div>
    )
}

export default ViewNews;