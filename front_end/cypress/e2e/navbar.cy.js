describe("Navbar", () => {
  it("should be able to use the delaware logo", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=navbar]").within(() => {
      cy.get("[data-cy=navbar-logo]").click();
      cy.on("url:changed", (newUrl) => {
        expect(newUrl).to.equal("https://www.delaware.pro/en-be");
      });
    });
  });

  it("should be able to use the products link", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=navbar]").within(() => {
      cy.get("[data-cy=navbar-links]").within(() => {
        cy.get("[data-cy=navbar-link-products]").click();
        cy.on("url:changed", (newUrl) => {
          expect(newUrl).to.equal("http://localhost:3000/");
        });
      });
    });
  });

  it("should be able to use the user link", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=navbar]").within(() => {
      cy.get("[data-cy=navbar-links]").within(() => {
        cy.get("[data-cy=navbar-link-user]").click();
        cy.on("url:changed", (newUrl) => {
          expect(newUrl).to.equal("http://localhost:3000/profile");
        });
      });
    });
  });

  it("should be able to use the cart link", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=navbar]").within(() => {
      cy.get("[data-cy=navbar-links]").within(() => {
        cy.get("[data-cy=navbar-link-cart]").click();
        cy.on("url:changed", (newUrl) => {
          expect(newUrl).to.equal("http://localhost:3000/shoppingcart");
        });
      });
    });
  });
});