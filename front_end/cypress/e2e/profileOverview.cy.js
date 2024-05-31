describe("Profile Overview", () => {
  describe("Use login form", () => {
    it("should be able to use the profile overview link", () => {
      cy.visit("http://localhost:3000");
      cy.get("[data-cy=navbar]").within(() => {
        cy.get("[data-cy=navbar-links]").within(() => {
          cy.get("[data-cy=navbar-link-user]").click();
        });
      });
    });

    it("should be able to view the sign in form", () => {
      cy.visit("http://localhost:3000/profile");

      cy.get("[data-cy=login-email]").should("be.visible");
      cy.get("[data-cy=login-password]").should("be.visible");
    });

    it("should be able to use the sign in form and log in", () => {
      cy.login();

      cy.get("[data-cy=account-page-overview]").should("be.visible");
    });
    it("use false email login", () => {
      cy.visit("http://localhost:3000/profile");

      cy.get("[data-cy=profile-overview]").within(() => {
        cy.get("[data-cy=profile-overview-content]").within(() => {
          cy.get("[data-cy=login-email]").type("test.subject");
          cy.get("[data-cy=login-password]").type("test1234");
          cy.get("[data-cy=login-submit]").click();

          cy.get('[class*="invalid"]').should("be.visible");
        });
      });
    });

    it("use false password login", () => {
      cy.visit("http://localhost:3000/profile");

      cy.get("[data-cy=profile-overview]").within(() => {
        cy.get("[data-cy=profile-overview-content]").within(() => {
          cy.get("[data-cy=login-email]").type(Cypress.env("userEmail"));
          cy.get("[data-cy=login-password]").type("test123");
          cy.get("[data-cy=login-submit]").click();

          cy.get('[class*="login__container__form__error"]').should("contain", "Incorrect email or password");
        });
      });
    });
  });

  describe("Profile overview page", () => {
    beforeEach(() => {
      cy.login();
    });

    it("should be able to view the profile overview page", () => {
      cy.get("[data-cy=account-page-overview]").should("be.visible");

      cy.get("[data-cy=profile-firstname]").should("have.value", Cypress.env("firstName"));
      cy.get("[data-cy=profile-lastname]").should("have.value", Cypress.env("lastName"));
      cy.get("[data-cy=profile-email]").should("have.value", Cypress.env("userEmail"));
      cy.get("[data-cy=profile-street]").should("have.value", Cypress.env("street"));
      cy.get("[data-cy=profile-addressNumber]").should("have.value", Cypress.env("adressNumber"));
      cy.get("[data-cy=profile-city]").should("have.value", Cypress.env("city"));
      cy.get("[data-cy=profile-postalCode]").should("have.value", Cypress.env("zipCode"));
      cy.get("[data-cy=profile-telNumber]").should("have.value", Cypress.env("telephone"));

    });
  });
});