import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import swal from "sweetalert";
import ReactPaginate from 'react-paginate';


function ViewProduct() {
    document.title = 'Danh sách sản phẩm';

    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    const productPerPage = 5;
    const pagesVisited = pageNumber * productPerPage;

    const pageCount = Math.ceil(product.length / productPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        axios.get(`/api/view-product`).then(res => {
            if (res.data.status === 200) {
                setProduct(res.data.products);
                setLoading(false);
            }
        });
    }, [])

    const deleteProduct = (e, id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting"

        swal({
            title: "Có chắc là muốn xóa chưa?",
            text: "Khi mà đã xóa rồi thì không hoàn tác được đâu đấy!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Poof! Sản phẩm đã được xóa!", {
                        icon: "success",
                    });
                    axios.delete(`/api/delete-product/${id}`).then(res => {
                        if (res.data.status === 200) {
                            thisClicked.closest('tr').remove();
                        } else if (res.data.status === 404) {
                            thisClicked.innerText = "Xóa"
                        }
                    })
                } else {
                    swal("Sản phẩm vẫn an toàn nhen!");
                    thisClicked.innerText = "Xóa"
                }
            });
    }

    var display_product = '';
    if (loading) {
        return <h4>Đang tải trang danh sách sản phẩm, đợi tí nha...</h4>
    } else {
        display_product = product.slice(pagesVisited, pagesVisited + productPerPage).filter((item) => {
            if (search === '') {
                return item;
            } else if (item.name.toString().toLowerCase().includes(search.toLowerCase())) {
                return item;
            }else {
                return null;
            }
        }).map((item) => {
            return (
                <tr key={item.id}>
                    <td className='text-center'>{item.id}</td>
                    <td>{item.category.name}</td>
                    <td>{item.producer.name}</td>
                    <td>{item.name}</td>
                    <td className='text-center'>{item.original_price}</td>
                    <td className='text-center'>{item.selling_price}</td>
                    <td className='text-center'>{item.number}</td>
                    <td className='text-center'><img src={`http://localhost:8000/${item.image}`} width='100px' alt={item.name} /></td>
                    <td className='text-center'>{item.status === 1 ? "Hiện":"Ẩn"}</td>
                    <td className='text-center'><Link to={`/admin/edit-product/${item.id}`} className='btn btn-warning'>Sửa</Link></td>
                    <td className='text-center'><Button variant="danger" onClick={(e) => deleteProduct(e, item.id)}>Xóa</Button></td>
                </tr>
            );
        });
    }


    return (
        <div className='container px-4 mt-2'>
            <div className='card'>
                <div className='card-header'>
                    <h4>Danh sách sản phẩm
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
                                <th className='col-3 col-sm-1'>Loại sản phẩm</th>
                                <th className='col-3 col-sm-1'>Thương hiệu</th>
                                <th className='col-3 col-sm-2'>Tên sản phẩm</th>
                                <th className='col-3 col-sm-2'>Giá gốc</th>
                                <th className='col-3 col-sm-2'>Giá bán</th>
                                <th className='col-3 col-sm-1'>Số lượng</th>
                                <th className='col-3 col-sm-3'>Hình ảnh</th>
                                <th className='col-3 col-sm-1'>Trạng thái</th>
                                <th className='col-3 col-sm-1'>Sửa</th>
                                <th className='col-3 col-sm-1'>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_product}
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

export default ViewProduct;