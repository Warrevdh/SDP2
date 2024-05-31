//testen voor de productpagina

describe('Product page', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/products', {
            fixture: 'products.json',
        });
        cy.intercept('GET', '/api/products/1', {
            fixture: 'product.json',
        });
    });

    it('should show the product page with its elements', () => {
        cy.visit("http://localhost:3000/productPage/1");

        cy.get("[data-cy=product-image]").should("exist");
        cy.get("[data-cy=product-name]").should("contain", "Product Name");
        cy.get("[data-cy=product-company]").should("contain", "Test company");
        cy.get("[data-cy=product-stock]").should("contain", "10");
        cy.get("[data-cy=product-longDesc]").should("contain", "Expanded test description");
        cy.get("[data-cy=product-delivery]").should("contain", "10 Days");
        cy.get("[data-cy=product-price]").should("contain", "349.99");
        cy.get("[data-cy=button-addToCart]").should("exist");
    });

    it('should show an error for no product on the product page', () => {
        cy.visit("http://localhost:3000/productPage/999");
        cy.get("[data-cy=error]").should('contain', 'An error occured');
    });

    it('should add the product to the cart', () => {
        cy.visit("http://localhost:3000/productPage/1");

        expect(localStorage.getItem('cartItems')).to.be.null;
        cy.get("[data-cy=button-addToCart]").click();
        cy.get(localStorage.getItem('cartItems')).should("not.be.empty");
    });
});