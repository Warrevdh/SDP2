import { useEffect, useState, useMemo, useCallback} from "react";
import FilterProducts from "./filter";
import * as productsApi from "../../api/products";
import "./index.scss";
import { FiSearch } from "react-icons/fi";

import Loader from "../../components/loader";
import Error from "../../components/error";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshProducts = useCallback(async() => {
    try {
      setLoading(true);
      setError(null);
      const products = await productsApi.getAllProducts();
      setProducts(products);      
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return product.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search]);
  return (
    <div className="products">
      <header>
        <h1>CATALOG</h1>
      </header>

      <article>
        <div className="search" id="searchBar">
          <FiSearch onClick={() => setSearch(text)} data-cy="products_search_button" className="search__button"/>
          <input className="search__input" type="search" id="search" placeholder="Search"
            value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(text)}
            data-cy="products_search_input"/>
        </div>
      </article>

      {loading || error ? null : <FilterProducts products={filteredProducts} />}
      <Loader loading={loading} />
      <Error error={error} />
    </div>
  )
}

export default ProductList;