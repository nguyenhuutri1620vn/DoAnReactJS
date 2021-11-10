import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Swal from "sweetalert2";
import { useHistory } from "react-router";
import axios from "axios";
import { BsCartCheckFill, BsSearch } from 'react-icons/bs';
import logo from '../../assets/frontend/image/logo.png';

import '../../assets/frontend/css/styles.css';
function Navbar() {

  const history = useHistory();
  const [user, setUser] = useState([]);
  const [category, setCategory] = useState([]);
  const [producer, setProducer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState();

  const searchInput = (e) => {
    e.persist();
    setSearch([e.target.value])
  }

  useEffect(() => {
    axios.get(`/api/home`).then(res => {
      if (res.data.status === 200) {
        setCategory(res.data.category);
        setProducer(res.data.producer);
      }
    });

    axios.get(`/api/getUser_w`).then(res => {
      if (res.data.status === 200) {
        setUser(res.data.user);
      } else if (res.data.status === 401) {
        history.push('/login');
        Swal.fire('Thông báo', res.data.message, 'error');
      }
      setLoading(false);

    })
  }, [history])

  if (loading === false) {
    var item_category = '';
    item_category = category.map((item) => {
      return (
        <li key={item.id} className='cate-item'><Link className="dropdown-item " to={`/category/${item.slug}`}>{item.name}</Link></li>
      )
    });
    var item_brand = '';
    item_brand = producer.map((item) => {
      return (
        <li key={item.id}><Link className="dropdown-item col-sm" to={`/brand/${item.slug}`}>{item.name}</Link></li>
      )
    })
  }


  const logoutSubmit = (e) => {
    e.preventDefault();

    axios.post(`/api/logout`).then(res => {
      if (res.data.status === 200) {

        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_name')

        Swal.fire('Success', res.data.message, 'success')

        history.push('/');
      }
    });
  }

  var AuthButtons = '';
  if (!localStorage.getItem('auth_token')) {
    AuthButtons = (
      <div>
        <Link className="link-top" to="/register">Đăng ký</Link>
        <Link className="link-top-last" to="/login">Đăng nhập</Link>
      </div>
    )
  } else {
    AuthButtons = (
      <div>
        <Link to={`/profile`} className='link-top-last'>Xin chào, {user.fullname}</Link>
        <button className="btn btn-danger btn-sm" type='submit' onClick={logoutSubmit}>
          <span className='textNav'>Đăng xuất</span>
        </button>
      </div>
    )
  }
  return (
    <div className='chingu-top chingu-top-sticky'>
      <div className='navbar-wrapper container-wrapper'>
        <div className='container navbar'>
          <div className='flex v-center'>
            <Link to='/sellingarea' className='link-top'>Khu giao dịch</Link>
            <Link to='/product' className='link-top'>Sản phẩm</Link>
            <div className='nav-item dropdown'>
              <Link to="#" className='link-top ' data-bs-toggle="dropdown">Loại sản phẩm</Link>
              <ul className="dropdown-menu sub_menu">
                {item_category}
              </ul>
            </div>
            <div to='#' className='nav-item dropdown'>
              <Link to="#" className='link-top' data-bs-toggle="dropdown">Thương hiệu</Link>
              <ul className="dropdown-menu ">
                {item_brand}
              </ul>
            </div>
            <Link to='/news' className='link-top-last'>Tin tức</Link>
          </div>
          <div className='navbar__spacer'></div>
          <div className='navbar__links'>
            {AuthButtons}
          </div>
        </div>
      </div>
      <div className='container-wrapper header-with-search-wrapper'>
        <div className='container header-with-search navbar'>
          <Link to='/' className='logo me-5 '><img src={logo} className='logo-image' alt="Logo" /></Link>
          <div className='header-with-search__search-section'>
            <div className='chingu-searchbar chingu-searchbar--focus'>
              <div className='chingu-searchbar__main'>
                <form className='chingu-searchbar-input' id="myform">
                  <input type='text' className='chingu-searchbar-input__input' placeholder='Nhập sản phẩm cần tìm...' value={search} name='search' onChange={searchInput} />
                </form>
              </div>
              <Link className='link-product' to={`/product/${search}`}><button type='submit' form='myform' className='btn btn-dark btn--s btn--inline py-1'><BsSearch /></button></Link>
            </div>
          </div>
          <div className='header-with-search__cart-wrapper'>
            <Link className='logo' to="/cart"><h1><BsCartCheckFill /></h1></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Navbar