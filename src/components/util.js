import Swal from "sweetalert2";
import axios from "axios";

export const sortPrice = (e, type, setAsc, setDes) => {
    e.preventDefault()
    switch (type) {
        case 'default':
            setAsc(false)
            setDes(false)
            break;
        case 'asc':
            setAsc(true)
            setDes(false)
            break;
        case 'des':
            setAsc(false)
            setDes(true)
            break;
        default:
            break;
    }
}

export const sortTime = (e, type, setNewest, setAsc, setDes) => {
    e.preventDefault()
    switch (type) {
        case 'newest':
            setNewest(true)
            setAsc(false)
            setDes(false)
            break;
        case 'oldest':
            setNewest(false)
            setAsc(false)
            setDes(false)
            break;
        default:
            break;
    }
}

export const submitAddtoCart = (e, item, quantity, setQuantity, history) => {
    e.preventDefault();
    setQuantity(1);
    const data = {
        productID: item.id,
        quantity: quantity,
    }
    axios.post(`/api/add-to-cart`, data).then(res => {
        if (res.data.status === 201) {
            Swal.fire("Thêm giỏ hàng thành công", res.data.message, "success");
        } else if (res.data.status === 409) {
            Swal.fire("Thông báo", res.data.message, "warning");
        } else if (res.data.status === 401) {
            Swal.fire("Có lỗi", res.data.message, "error");
            history.push('/login');
        } else if (res.data.status === 404) {
            Swal.fire("Thông báo", res.data.message, "warning");
        }
    });
}

export function Sort(a, b, asc, des, newest) {
    if (asc === true && des === false) {
        return a.selling_price - b.selling_price
    } else if (des === true && asc === false) {
        return b.selling_price - a.selling_price
    } else if (newest === true && des === false && asc === false) {
        return b.id - a.id
    } else if (newest === false && des === false && asc === false) {
        return a.id - b.id
    }
}