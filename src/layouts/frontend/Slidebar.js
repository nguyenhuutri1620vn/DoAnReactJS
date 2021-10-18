import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function Slidebar() {

    const [category, setCategory] = useState([]);
    const [price, setPrice] = useState([]);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState([]);
    const categoryCount = product.length;

    useEffect(() => {
        axios.get(`/api/home`).then(res => {
            setCategory(res.data.category);
            setProduct(res.data.product)
        });
        setLoading(false);
    }, []);

    if (loading) {
        return <div className='loading'><h4>Loading...</h4></div>
    } else {
        var category_HTML = '';
        category_HTML = category.map((item, idx) => {
            var product_count = '';
            let i = 0;
            product.forEach((itemp) => {
                if (itemp.cateID === item.id) {
                    i++;
                    product_count = i;

                }
            })
            return (
                <Link key={idx} to={`/category/${item.slug}`} className='link'><li key={item.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center category">{item.name}<span className="badge badge-primary badge-pill">{product_count}</span></li></Link>
            )
        });
    }

    return (
        <div className='long-filter'>
            <h4>Filter</h4>
            <div className="py-3">
                <h5 className="font-weight-bold">Categories</h5>
                <ul className="list-group">
                    <Link to='/product' className='link'><li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center category">All<span className="badge badge-primary badge-pill">{categoryCount}</span> </li></Link>
                    {category_HTML}
                </ul>
            </div>
            <div className="py-3">
                <h5 className="font-weight-bold">Price</h5>
                <div className="brand">
                    <div className="form-inline d-flex align-items-center py-1"> <label className="tick">Less 200<input type="radio" name='radio' /> <span className="check"></span> </label> </div>
                    <div className="form-inline d-flex align-items-center py-1"> <label className="tick">200 - 500<input type="radio" name='radio' /> <span className="check"></span> </label> </div>
                    <div className="form-inline d-flex align-items-center py-1"> <label className="tick">500 - 1000<input type="radio" name='radio' /> <span className="check"></span> </label> </div>
                    <div className="form-inline d-flex align-items-center py-1"> <label className="tick">1000 - 5000<input type="radio" name='radio' /> <span className="check"></span> </label> </div>
                    <div className="form-inline d-flex align-items-center py-1"> <label className="tick">More 5000<input type="radio" name='radio' /> <span className="check"></span> </label> </div>
                </div>
            </div>

        </div>

    )
}
export default Slidebar;