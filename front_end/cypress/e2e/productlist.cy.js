describe('ProductList component test', () => {
  it('should show an overview of the products', () => {
    //Database is not yet connected, so this is still useless
    cy.intercept(
      "GET",
      "http://localhost:9000/api/products", {
        fixture: "products.json"
      }
    );

    cy.visit("http://localhost:3000")

    cy.get('[data-cy=product]').should('have.length', 3)

    //test first product
    cy.get('[data-cy=product_name]').eq(0).should('contain', 'Product 1')
    cy.get("[data-cy=product_company]").eq(0).should('contain', 'Company test 1')
    cy.get("[data-cy=product_stock]").eq(0).should('contain', '5')
    cy.get("[data-cy=product_description]").eq(0).should('contain', 'Short Desc 1')
    cy.get("[data-cy=product_price]").eq(0).should('contain', '49.99')
    cy.get("[data-cy=product_image]").eq(0).should("be.visible");
    cy.get("[data-cy=product_addCartButton]").eq(0).should("be.visible");

    //test second product
    cy.get('[data-cy=product_name]').eq(1).should('contain', 'Product 1')
    //test third product
    cy.get('[data-cy=product_name]').eq(2).should('contain', 'Product 2')
  })

  it('should show no products when no match with searchBar', () => {
    cy.intercept(
      "GET",
      "http://localhost:9000/api/products", {
        fixture: "products.json"
      }
    );

    cy.visit("http://localhost:3000")
    cy.get('[data-cy=products_search_input]').type('aabc')
    cy.get('[data-cy=products_search_button]').click()
    cy.get('[data-cy=product]').should('have.length', 0)
  })

  it('should show correct product(s) when match with searchBar', () => {
    cy.intercept(
      "GET",
      "http://localhost:9000/api/products", {
        fixture: "products.json"
      }
    );

    cy.visit("http://localhost:3000")

    cy.get('[data-cy=products_search_input]').type('product 1')
    cy.get('[data-cy=products_search_button]').click()
    cy.get('[data-cy=product]').should('have.length', 2)

    cy.get('[data-cy=product]').eq(0).should('contain', 'Product 1')
    cy.get('[data-cy=product]').eq(1).should('contain', 'Product 1')
  })
})

describe('ProductList Filter test', () => {
  it('should show all products when no filter is being used', () => {
    cy.intercept(
      "GET",
      "http://localhost:9000/api/products", {
        fixture: "products.json"
      }
    );

    cy.visit("http://localhost:3000")

    cy.get('[data-cy=product]').should('have.length', 3)
  })

  describe('Sorting filter tests', () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        "http://localhost:9000/api/products", {
          fixture: "products.json"
        }
      )
    })

    it('should show products in alphabetical order when "A-Z" is selected', () => {
      cy.visit("http://localhost:3000")
      //Bug in Cypress where it doesn't wait for the intercept to finish
      cy.wait(300);

      cy.get('[data-cy=filter-sort]').select('A-Z');
      cy.get('[data-cy=product]').eq(0).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(1).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(2).should('contain', 'Product 2')
    })

    it('should show products in reverse alphabetical order when "Z-A" is selected', () => {
      cy.visit("http://localhost:3000")
      //Bug in Cypress where it doesn't wait for the intercept to finish
      cy.wait(300);

      cy.get('[data-cy=filter-sort]').select('Z-A');
      cy.get('[data-cy=product]').eq(0).should('contain', 'Product 2')
      cy.get('[data-cy=product]').eq(1).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(2).should('contain', 'Product 1')
    })

    it('should show products in ascending order in terms of price when "Lowest first" is selected', () => {
      cy.visit("http://localhost:3000")
      //Bug in Cypress where it doesn't wait for the intercept to finish
      cy.wait(300);

      cy.get('[data-cy=filter-sort]').select('asc');
      cy.get('[data-cy=product]').eq(0).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(1).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(2).should('contain', 'Product 2')
    })

    it('should show products in descending order in terms of price when "Highest first" is selected', () => {
      cy.visit("http://localhost:3000")
      //Bug in Cypress where it doesn't wait for the intercept to finish
      cy.wait(300);

      cy.get('[data-cy=filter-sort]').select('desc');
      cy.get('[data-cy=product]').eq(0).should('contain', 'Product 2')
      cy.get('[data-cy=product]').eq(1).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(2).should('contain', 'Product 1')
    })
  })

  describe('Category filter tests', () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        "http://localhost:9000/api/products", {
          fixture: "products.json"
        }
      );
    })

    it("should show all categories in filter 'categories' when search bar hasn't been used", () => {
      cy.visit("http://localhost:3000")
      cy.get('[data-cy="category_Category test 1"]').should('exist')
      cy.get('[data-cy="category_Category test 2"]').should('exist')
    })

    it("should show the correct categories in filter 'categories' when searchBar has been used", () => {
      cy.visit("http://localhost:3000")
      cy.get('[data-cy=products_search_input]').type('product 1')
      cy.get('[data-cy=products_search_button]').click()

      cy.get('[data-cy="category_Category test 1"]').should('exist')
      cy.get('[data-cy="category_Category test 2"]').should('not.exist')
    })

    it("should show the correct products when a category is selected", () => {
      cy.visit("http://localhost:3000")
      cy.get('[data-cy="category_Category test 1"]').click()

      cy.get('[data-cy=product]').should('have.length', 2)
      cy.get('[data-cy=product]').eq(0).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(1).should('contain', 'Product 1')
      cy.get('[data-cy=product]').eq(0).should('not.contain', 'Product 2')
    })
  })

  describe('Company filter tests', () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        "http://localhost:9000/api/products", {
          fixture: "products.json"
        }
      );
    })

    it("should show all companies in filter 'companies' when search bar hasn't been used", () => {
      cy.visit("http://localhost:3000")
      cy.get('[data-cy="Company test 1"]').should('exist')
      cy.get('[data-cy="Company test 2"]').should('exist')
    })

    it("should show the correct companies in filter 'companies' when searchBar has been used", () => {
      cy.visit("http://localhost:3000")
      cy.get('[data-cy=products_search_input]').type('product 2')
      cy.get('[data-cy=products_search_button]').click()

      cy.get('[data-cy="Company test 1"]').should('not.exist')
      cy.get('[data-cy="Company test 2"]').should('exist')
    })

    it('should show products from company when company filter is selected', () => {
      cy.visit("http://localhost:3000")
      cy.get('[data-cy="Company test 1_checkbox"]').click();

      cy.get('[data-cy=product]').should('have.length', 1)
      cy.get('[data-cy=product]').eq(0).should('contain', 'Product 1')
    })
  })
})