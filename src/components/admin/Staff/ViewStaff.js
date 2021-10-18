import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import ReactPaginate from 'react-paginate';
import { Button } from 'react-bootstrap';


function ViewStaff() {
    document.title = 'Staff View';

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
        document.title = 'View staff';

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
        thisClicked.innerText = "Waiting..."

        swal({
            title: "Are you sure?",
            text: "This staff will be become ADMIN",
            icon: "warning",
            buttons: true,
            dangerMode: false,
        })
            .then((willAdmin) => {
                if (willAdmin) {
                    swal("Poof! A staff has been become ADMIN!", {
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
                    swal("staff is safe!");
                    thisClicked.innerText = "→ Staff"
                }
            });

    }

    var display_staff = '';
    if (loading) {
        return <h1>staff view loading...</h1>
    } else {
        display_staff = staff.slice(pagesVisited, pagesVisited + staffPerPage).filter((item) => {
            if (search === '') {
                return item;
            } else if (item.username.toString().toLowerCase().includes(search.toLowerCase())) {
                return item;
            }else {
                return item;
            }
        }).map((item) => {

            return (

                <tr key={item.id}>
                    <td className='col-3 col-sm-1'>{item.id}</td>
                    <td className='col-3 col-sm-1'>{item.username}</td>
                    <td className='col-3 col-sm-2'>{item.fullname}</td>
                    <td className='col-3 col-sm-2'>{item.email}</td>
                    <td className='col-3 col-sm-1'>{item.phone}</td>
                    <td className='col-3 col-sm-2'>{item.address}</td>
                    <td className='text-center'>
                        <Button onClick={(e) => becomeAdmin(e, item.id)} variant="success">→ Staff</Button>
                    </td>
                </tr>
            );
        });
    }


    return (
        <div className='container px-4 mt-2'>
            <div className='card'>
                <div className='card-header'>
                    <h4>staff List
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
                                <th className='col-3 col-sm-1'>Username</th>
                                <th className='col-3 col-sm-2'>Full name</th>
                                <th className='col-3 col-sm-2'>Email</th>
                                <th className='col-3 col-sm-1'>Phone</th>
                                <th className='col-3 col-sm-2'>Address</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_staff}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    previousLabel={'Prev'}
                    nextLabel={'Next'}
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

export default ViewStaff;