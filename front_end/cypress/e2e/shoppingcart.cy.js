describe("Shopping cart", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "http://localhost:9000/api/products", {
        fixture: "products.json"
      }
    );
  });

  it("should be able to see elements on an empty shopping cart page", () => {
    cy.visit("http://localhost:3000/shoppingcart");

    cy.get("[data-cy=empty-shoppingcart]").should("be.visible");
    cy.get("[data-cy=total-products]").should("contain", "0");
    cy.get("[data-cy=items-total").should("contain", "0.00");
    cy.get("[data-cy=items-tax").should("contain", "0.00");
    cy.get("[data-cy=items-shipping-fees").should("contain", "0.00");
    cy.get("[data-cy=total-price").should("contain", "0.00");

    cy.get("[data-cy=continue-button]").should("be.visible");
  });

  it("should be able to add product(s) to the shopping cart", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(2).click();

    cy.visit("http://localhost:3000/shoppingcart");

    cy.get("[data-cy=cart-item]").should("have.length", 2);
    cy.get("[data-cy=product-link]").eq(0).should("contain", "Product 1");
    cy.get("[data-cy=product-link]").eq(1).should("contain", "Product 2");
    cy.get("[data-cy=quantity]").eq(0).should("contain", "2");
    cy.get("[data-cy=quantity]").eq(1).should("contain", "1");

    cy.get("[data-cy=total-products]").should("contain", "3");
    cy.get("[data-cy=summary-item]").eq(0).should("contain", "2x Product 1");
    cy.get("[data-cy=summary-item]").eq(1).should("contain", "1x Product 2");

    cy.get("[data-cy=items-total").should("not.contain", "0.00");
    cy.get("[data-cy=items-tax").should("not.contain", "0.00");

    cy.get("[data-cy=delivery-time]").should("contain", "6 Days");
  });

  it("should be able to remove a product from the shopping cart", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(2).click();

    cy.visit("http://localhost:3000/shoppingcart");

    cy.get("[data-cy=cart-item]").should("have.length", 2);
    cy.get("[data-cy=product-link]").eq(0).should("contain", "Product 1");
    cy.get("[data-cy=product-link]").eq(1).should("contain", "Product 2");

    cy.get("[data-cy=delete-cart-item]").eq(0).click();

    cy.get("[data-cy=cart-item]").should("have.length", 1);

    cy.get("[data-cy=total-products]").should("contain", "1");
    cy.get("[data-cy=summary-item]").eq(0).should("not.contain", "2x Product 1");
    cy.get("[data-cy=summary-item]").eq(0).should("contain", "1x Product 2");
  });

  it("should be able to clear the shopping cart", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(2).click();

    cy.visit("http://localhost:3000/shoppingcart");

    cy.get("[data-cy=cart-item]").should("have.length", 2);
    cy.get("[data-cy=product-link]").eq(0).should("contain", "Product 1");
    cy.get("[data-cy=product-link]").eq(1).should("contain", "Product 2");

    cy.get("[data-cy=clear-cart]").click();

    cy.get("[data-cy=empty-shoppingcart]").should("be.visible");
    cy.get("[data-cy=total-products]").should("contain", "0");
    cy.get("[data-cy=items-total").should("contain", "0.00");
    cy.get("[data-cy=items-tax").should("contain", "0.00");
    cy.get("[data-cy=items-shipping-fees").should("contain", "0.00");
    cy.get("[data-cy=total-price").should("contain", "0.00");
  });

  it("should be able to change the quantity of a product in the shopping cart", () => {
    cy.visit("http://localhost:3000/");

    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(0).click();
    cy.get("[data-cy=product_addCartButton]").eq(2).click();

    cy.visit("http://localhost:3000/shoppingcart");

    cy.get("[data-cy=cart-item]").should("have.length", 2);
    cy.get("[data-cy=product-link]").eq(0).should("contain", "Product 1");
    cy.get("[data-cy=product-link]").eq(1).should("contain", "Product 2");

    cy.get("[data-cy=quantity]").eq(0).should("contain", "2");
    cy.get("[data-cy=quantity]").eq(1).should("contain", "1");

    cy.get("[data-cy=decrement]").eq(0).click();
    cy.get("[data-cy=increment]").eq(1).click();
    cy.get("[data-cy=increment]").eq(1).click();

    cy.get("[data-cy=quantity]").eq(0).should("contain", "1");
    cy.get("[data-cy=quantity]").eq(1).should("contain", "3");

    cy.get("[data-cy=total-products]").should("contain", "4");
    cy.get("[data-cy=summary-item]").eq(0).should("contain", "1x Product 1");
    cy.get("[data-cy=summary-item]").eq(1).should("contain", "3x Product 2");
  });
});