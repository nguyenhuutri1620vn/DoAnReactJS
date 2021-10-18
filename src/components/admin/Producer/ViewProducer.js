import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

function ViewProducer() {
    document.title = 'View Producer';

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
                    swal("Poof! Producer has been deleted!", {
                        icon: "success",

                    });
                    axios.delete(`/api/delete-producer/${id}`).then(res => {
                        if (res.data.status === 200) {
                            thisClicked.closest('tr').remove();
                            // history.push(`admin/view-producer`);
                        } else if (res.data.status === 404) {
                            thisClicked.innerText = "Delete"
                        }
                    })
                } else {
                    swal("Producer file is safe!");
                    thisClicked.innerText = "Delete"
                }
            });

    }

    var viewproducer_HTMLTABLE = null;
    if (loading) {
        <h3>Loading producer...</h3>
    } else {
        viewproducer_HTMLTABLE =
            producerList.slice(pagesVisited, pagesVisited + producerPerPage).filter((item) => {
                if (search === '') {
                    return item;
                } else if (item.name.toString().toLowerCase().includes(search.toLowerCase())) {
                    return item;
                } else {
                    return item;
                }
            }).map((item) => {
                return (
                    <tr key={item.id}>
                        <td className='text-center'>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.slug}</td>
                        <td>{item.status === 1 ? 'Shown' : 'Hidden'}</td>
                        <td className='text-center'>
                            <Link to={`edit-producer/${item.id}`} className='btn btn-warning btn-sm' >Edit</Link>
                        </td>
                        <td className='text-center'>
                            <Button variant="danger" onClick={(e) => deleteProducer(e, item.id)}>Delete</Button>
                        </td>

                    </tr>
                )
            })
    }
    const pageCount = Math.ceil(producerList.length / producerPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }
    return (
        <div className='container px-4'>
            <div className='card'>
                <div className='card-header'>
                    <h4>Brand List
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
                                <th className='col-3 col-sm-2'>Name</th>
                                <th className='col-3 col-sm-2'>Slug</th>
                                <th className='col-3 col-sm-1'>Status</th>
                                <th className='col-3 col-sm-1'>Edit</th>
                                <th className='col-3 col-sm-1'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewproducer_HTMLTABLE}
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

export default ViewProducer

