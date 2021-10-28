import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

function ViewCategory() {

    document.title = 'Danh sách loại sản phẩm';

    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setloading] = useState(true);
    const [categoryList, setcategoryList] = useState([]);

    const categoryPerPage = 5;
    const pagesVisited = pageNumber * categoryPerPage;

    // const displayCategory = categoryList.slice(pagesVisited, pagesVisited + categoryPerPage)

    useEffect(() => {

        axios.get(`/api/view-category`).then(res => {
            if (res.data.status === 200) {
                setcategoryList(res.data.category);
            }
            setloading(false);
        })
    }, [])


    const deleteCategory = (e, id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Đang xóa..."

        swal({
            title: "Có chắc là muốn xóa chưa?",
            text: "Khi mà đã xóa rồi thì không hoàn tác được đâu đấy!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Poof! Loại sản phẩm đã được xóa!", {
                        icon: "success",

                    });
                    axios.delete(`/api/delete-category/${id}`).then(res => {
                        if (res.data.status === 200) {
                            thisClicked.closest('tr').remove();

                        } else if (res.data.status === 404) {
                            thisClicked.innerText = "Xóa"
                        }
                    })
                } else {
                    swal("Loại sản phẩm đã được an toàn!");
                    thisClicked.innerText = "Xóa"
                }
            });

    }
    var viewcategory_HTMLTABLE = null;
    if (loading) {
        <h3>Đang tải danh sách loại sản phẩm, vui lòng đợi...</h3>
    } else {
        viewcategory_HTMLTABLE =
            categoryList.slice(pagesVisited, pagesVisited + categoryPerPage).filter((item) => {
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
                        <td>{item.slug}</td>
                        <td className='text-center'><img src={`http://localhost:8000/${item.image}` } width="250" height="150" alt={item.name} /></td>
                        <td className='text-center'>{item.status === 1 ? 'Hiện' : 'Ẩn'}</td>
                        <td className='text-center'>
                            <Link to={`edit-category/${item.id}`}><Button variant="warning" >Sửa</Button></Link>
                        </td>

                        <td className='text-center'>
                            <Button variant="danger" onClick={(e) => deleteCategory(e, item.id)}>Xóa</Button>
                        </td>

                    </tr>

                )
            })
    }

    const pageCount = Math.ceil(categoryList.length / categoryPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
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
                                <th className='col-3 col-sm-1'>Slug</th>
                                <th className='col-3 col-sm-3'>Hình ảnh</th>
                                <th className='col-3 col-sm-1'>Trạng thái</th>
                                <th className='col-3 col-sm-1'>Sửa</th>
                                <th className='col-3 col-sm-1'>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewcategory_HTMLTABLE}
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

export default ViewCategory

