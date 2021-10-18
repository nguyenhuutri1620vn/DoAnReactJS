import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

function ViewCategory() {

    document.title = 'View Category';

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
                    swal("Poof! Category has been deleted!", {
                        icon: "success",

                    });
                    axios.delete(`/api/delete-category/${id}`).then(res => {
                        if (res.data.status === 200) {
                            thisClicked.closest('tr').remove();

                        } else if (res.data.status === 404) {
                            thisClicked.innerText = "Delete"
                        }
                    })
                } else {
                    swal("Category file is safe!");
                    thisClicked.innerText = "Delete"
                }
            });

    }
    var viewcategory_HTMLTABLE = null;
    if (loading) {
        <h3>Loading category...</h3>
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
                        <td className='text-center'><img src={`http://localhost:8000/${item.image}`} width='400px' alt={item.name} /></td>
                        <td className='text-center'>{item.status === 1 ? 'Shown' : 'Hidden'}</td>
                        <td className='text-center'>
                            <Link to={`edit-category/${item.id}`}><Button variant="warning" >Edit</Button></Link>
                        </td>

                        <td className='text-center'>
                            <Button variant="danger" onClick={(e) => deleteCategory(e, item.id)}>Delete</Button>
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
                    <h4>Category List
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

                    <table className='table table-bordered table-hover'>
                        <thead className='text-center'>
                            <tr>
                                <th className='col-3 col-sm-1'>ID</th>
                                <th className='col-3 col-sm-1'>Name</th>
                                <th className='col-3 col-sm-1'>Slug</th>
                                <th className='col-3 col-sm-3'>Image</th>
                                <th className='col-3 col-sm-1'>Status</th>
                                <th className='col-3 col-sm-1'>Edit</th>
                                <th className='col-3 col-sm-1'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewcategory_HTMLTABLE}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    previousLabel={'Prev'}
                    nextLabel={'Next'}
                    pageCount={pageCount}
                    onPageChange={handleChangPage}
                    containerClassName={"paginasqtionBttns"}
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

export default ViewCategory

