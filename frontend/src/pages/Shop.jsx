import React, { useState ,useEffect} from 'react';
import { PRODUCTS } from '../utils/products';
import { SUPPLEMENTS } from '../utils/supplemets';
import { Product } from '../pages/Products';
import '../pages/css/Shop.css';
import { Stack, Pagination } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

const Shop = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  useEffect(() => {
    if (!isAuthenticated) {
      alert("Login first");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSupPage, setCurrentSupPage] = useState(1);
  const itemsPerPage = 3;

  const paginate = (e, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const paginateSup = (e, value) => {
    setCurrentSupPage(value);
    window.scrollTo({ bottom: 10, behavior: 'smooth' });
  };

  const renderItems = (items, page) => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="shop">
      <div className="shopTitle">Equipments</div>
      <div className="products">
        {renderItems(PRODUCTS, currentPage).map((product) => (
          <Product data={product} key={product.id} />
        ))}
      </div>
      <Stack mt="65px" alignItems="center">
        {PRODUCTS.length > itemsPerPage && (
          <Pagination
            color="standard"
            shape="rounded"
            count={Math.ceil(PRODUCTS.length / itemsPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        )}
      </Stack>

      <div className="shopTitle">Supplements</div>
      <div className="products">
        {renderItems(SUPPLEMENTS, currentSupPage).map((product) => (
          <Product data={product} key={product.id} />
        ))}
      </div>
      <Stack mt="100px" alignItems="center">
        {SUPPLEMENTS.length > itemsPerPage && (
          <Pagination
            color="standard"
            shape="rounded"
            count={Math.ceil(SUPPLEMENTS.length / itemsPerPage)}
            page={currentSupPage}
            onChange={paginateSup}
            size="large"
          />
        )}
      </Stack>
    </div>
  );
};

export default Shop;
