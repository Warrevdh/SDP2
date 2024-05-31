import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Product from "./product";
import "./index.scss";

import {FiChevronDown} from "react-icons/fi";

const FilterProducts = ({products}) => {
  const [filters, setFilters] = useState({
      sort : "ascAZ",
      category: null,
      companies: [],
      price: [0, 0]
  });

  const filteredProducts = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    // Filter products on category, company and price
    // Change this so every product gets passed only once
    const newProducts = products
      .filter((product) => {
        //Filter on category
        if (filters.category !== null) {
          return product.Category.categoryName === filters.category;
        }
        return true;
      })
      .filter((product) => {
        //Filter on company
        if (filters.companies.length > 0) {
          return filters.companies.includes(product.fromCompany);
        }
        return true;
      })
      .filter((product) => {
        //Filter on price
        return product.prices[1].price >= filters.price[0] && product.prices[1].price <= filters.price[1];
    });

    return newProducts.sort((a, b) => {
      //Sorting
      if (filters.sort === "asc") {
        return a.prices[1].price - b.prices[1].price;
      } else if (filters.sort === "desc") {
        return b.prices[1].price - a.prices[1].price;
      } else if (filters.sort === "ascAZ") {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      } else if (filters.sort === "descZA") {
        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      } else {
        return 0;
      }
    });
  }, [products, filters]);


  const filteredCategories = useMemo(() => {
    const categories = products.map((product) => {
      return product.Category.categoryName;
    });
    return [...new Set(categories)];
  }, [products]);


  const filteredCompanies = useMemo(() => {
    const companies = products.map((product) => {
      return product.fromCompany;
    });

    return [...new Set(companies)];
  }, [products]);


  const maxPrice = useMemo(() => {
    if (products.length === 0) {
      return 0;
    } else {
      const mPrice = Math.max(...products.map((product) => {
        return product.prices[1].price;
      }));
      return Math.ceil(mPrice / 10) * 10;
    }
  }, [products]);

  const handleSort = useCallback((e) => {
    // Change sort in filters
    setFilters({...filters, sort: e.target.value});
  }, [filters]);

  const handleCategory = useCallback((e) => {
    // Change category in filters
    setFilters({...filters, category: e.target.getAttribute("value")});
  }, [filters]);

  const handleCheckBox = useCallback((e) => {
    // Add or remove company from filters if checked or unchecked
    if (e.target.checked) {
      setFilters({...filters, companies: [...filters.companies, e.target.name]});
    } else {
      setFilters({...filters, companies: filters.companies.filter((company) => {
        return company !== e.target.name;
      })});
    }
  }, [filters]);


  const handlePriceSlider = useCallback((e) => {
    // Change price range in filters
    if (e.target.name === "minPrice") {
      setFilters({...filters, price: [e.target.value, filters.price[1]]});
    } else {
      setFilters({...filters, price: [filters.price[0], e.target.value]});
    }
  }, [filters]);


  useEffect(() => {
    //Reset filters when search bar has been used
    setFilters({
      sort : "",
      category: null,
      companies: [],
      price: [0, maxPrice]
  });
  }, [products, maxPrice]);
  return (
    <div className="product-filter grid">
      <aside>
        <div className="navbar-expand-sm navbar-light" >
          <div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
              Filters <FiChevronDown />
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbar">
            <div className="filter__sort" data-cy="">
              <label className="filter__sort__label" htmlFor="sort">Sort on</label>
              <select 
                className="filter__sort__dropdown"
                name="sort"
                id="sort"
                onChange={handleSort}
                data-cy="filter-sort"
                value={filters.sort}>
                  <option value="ascAZ" data-cy="A-Z">A-Z</option>
                  <option value="descZA" data-cy="Z-A">Z-A</option>
                  <option value="asc" data-cy="L-H">Lowest first</option>
                  <option value="desc" data-cy="H-L">Highest first</option>
              </select>
            </div>

            <div className="filter__category" data-cy="">
              <label className="filter__category__label" htmlFor="category">Category</label>
              <ul>
                <li className="filter__category__name">
                  <label onClick={handleCategory} value={null}>
                    All Categories
                  </label>
                </li>
                
                {filteredCategories.map((category) => {
                  return (
                      <li key={category} data-cy={category} className="filter__category__name">
                        <label onClick={handleCategory} value={category} data-cy={"category_" + category}>
                          {category}
                        </label>
                      </li>
                  )})}
              </ul>
            </div>

            <div className="filter__container grid">
              <div className="navbar_nav filter__container__company" id="filterOnCompany" data-cy="filter_on_company">
                <label className="filter__container__company__label" htmlFor="Company">Company</label>
                {filteredCompanies.map((company) => {
                  return (
                    <div className="filter__container__company__option" key={company} data-cy={company}>
                      <input type="checkbox" name={company}
                        onChange={handleCheckBox} checked={filters.companies.includes(company)}
                        data-cy={company + "_checkbox"}/>
                      <label htmlFor={company} data-cy={"company_" + company}>{company}</label>
                    </div>
                  )})}
              </div>

            <div className="filter__container__price" id="filterOnPrice" data-cy="filter_on_price">
              <label className="filter__container__price__label" htmlFor="price">Price</label>
              <h4 data-cy="filter-price-range"><span>Price range:</span> €{filters.price[0]} - €{filters.price[1]}</h4>
              <p>Min.</p>
              <p className="filter__container__price__range">
                <input type="range" name="minPrice" id="price"
                  min={0}
                  max={filters.price[1]}
                  value={filters.price[0]}
                  step={10}
                  onChange={handlePriceSlider}
                  data-cy="price_filter_minimum"/>
              </p>

              <p>Max.</p>
              <p className="filter__container__price__range">
                <input type="range" name="maxPrice" id="price"
                  min={filters.price[0]}
                  max={maxPrice}
                  value={filters.price[1]}
                  step={10}
                  onChange={handlePriceSlider}
                  data-cy="price_filter_maximum"/>
              </p>
            </div>
            
            </div>
              <p className="amount-results">Results: <span>{filteredProducts.length}</span></p>
            </div>
        </div>
      </aside>
      
      <article>
        <div className="results" id="filteredProducts" data-cy="products_filtered">
          <div className="container">
            {filteredProducts.map((product) => {
              return <Product key={product.productId} product={product} />;
            })}
          </div>
        
        </div>
      </article>
    </div>
  )
}

export default memo(FilterProducts);