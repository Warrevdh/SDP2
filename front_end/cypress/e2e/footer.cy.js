describe("Footer", () => {
  it("should be able to use the footer  Terms of use link", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=footer]").within(() => {
      cy.get("[data-cy=footer-links]").within(() => {
        cy.get("[data-cy=footer-link-terms]").click();
        cy.on("url:changed", (newUrl) => {
          expect(newUrl).to.equal(
            "https://www.delaware.pro/en-be/legal/terms-of-use"
          );
        });
      });
    });
  });
  it("should be able to use the footer  Privacy Policy link", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=footer]").within(() => {
      cy.get("[data-cy=footer-links]").within(() => {
        cy.get("[data-cy=footer-link-privacy]").click();
        cy.on("url:changed", (newUrl) => {
          expect(newUrl).to.equal("https://www.delaware.pro/en-be/legal/privacy");
        });
      });
    });
  });
  it("should be able to use the footer  Cookie Policy link", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=footer]").within(() => {
      cy.get("[data-cy=footer-links]").within(() => {
        cy.get("[data-cy=footer-link-cookie]").click();
        cy.on("url:changed", (newUrl) => {
          expect(newUrl).to.equal(
            "https://www.delaware.pro/en-be/legal/cookie-policy"
          );
        });
      });
    });
  });
  it("should be able to use the footer Disclosure link", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=footer]").within(() => {
      cy.get("[data-cy=footer-links]").within(() => {
        cy.get("[data-cy=footer-link-disclosure]").click();
        cy.on("url:changed", (newUrl) => {
          expect(newUrl).to.equal(
            "https://www.delaware.pro/en-be/legal/responsible-disclosure"
          );
        });
      });
    });
  });
});