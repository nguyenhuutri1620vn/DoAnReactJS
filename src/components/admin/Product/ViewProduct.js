import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import swal from "sweetalert";
import ReactPaginate from 'react-paginate';


function ViewProduct() {
    document.title = 'View Product';

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
        document.title = 'View Product';

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
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Poof! Product has been deleted!", {
                        icon: "success",
                    });
                    axios.delete(`/api/delete-product/${id}`).then(res => {
                        if (res.data.status === 200) {
                            thisClicked.closest('tr').remove();
                        } else if (res.data.status === 404) {
                            thisClicked.innerText = "Delete"
                        }
                    })
                } else {
                    swal("Product file is safe!");
                    thisClicked.innerText = "Delete"
                }
            });
    }

    var display_product = '';
    if (loading) {
        return <h4>Product loading....</h4>
    } else {
        display_product = product.slice(pagesVisited, pagesVisited + productPerPage).filter((item) => {
            if (search === '') {
                return item;
            } else if (item.name.toString().toLowerCase().includes(search.toLowerCase())) {
                return item;
            }else {
                return item;
            }
        }).map((item) => {
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.category.name}</td>
                    <td>{item.producer.name}</td>
                    <td>{item.name}</td>
                    <td className='text-center'>{item.original_price}</td>
                    <td className='text-center'>{item.selling_price}</td>
                    <td className='text-center'>{item.number}</td>
                    <td className='text-center'><img src={`http://localhost:8000/${item.image}`} width='100px' alt={item.name} /></td>
                    <td className='text-center'>{item.status === 1 ? "shown":"hiden"}</td>
                    <td className='text-center'><Link to={`/admin/edit-product/${item.id}`} className='btn btn-warning'>Edit</Link></td>
                    <td className='text-center'><Button variant="danger" onClick={(e) => deleteProduct(e, item.id)}>Delete</Button></td>
                </tr>
            );
        });
    }


    return (
        <div className='container px-4 mt-2'>
            <div className='card'>
                <div className='card-header'>
                    <h4>Product List
                        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0 float-end">
                            <div className="input-group">
                                <input className="form-control"
                                    type="text" placeholder="Search for..."
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
                                <th className='col-3 col-sm-1'>Category name</th>
                                <th className='col-3 col-sm-1'>Producer name</th>
                                <th className='col-3 col-sm-2'>Name</th>
                                <th className='col-3 col-sm-2'>Original price</th>
                                <th className='col-3 col-sm-2'>Selling price</th>
                                <th className='col-3 col-sm-1'>Quantity</th>
                                <th className='col-3 col-sm-3'>Image</th>
                                <th className='col-3 col-sm-1'>Status</th>
                                <th className='col-3 col-sm-1'>Edit</th>
                                <th className='col-3 col-sm-1'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_product}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    disabledClassName={"pagination__link--disabled"}
                    previousLabel={'←Prev'}
                    nextLabel={'Next→'}
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