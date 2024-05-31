describe('Notification overview', () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/notifications/company/*", {
      fixture: "notifications.json",
    });

    cy.intercept("PUT", "/api/notifications/*", {});

    cy.intercept("DELETE", "/api/notifications/*", {});

    cy.login();
    cy.get("[data-cy=profile-page-2]").click();
  });

  it("should show the notification overview", () => {
    //cy.wait(1000);

    // cy.get("[data-cy=profile-page-2]").click();

    cy.get("[data-cy=notification]").should("have.length", 3);

    // test first notification
    cy.get("[data-cy=button-delete-notification]").eq(0).should("be.visible");
    cy.get("[data-cy=notification-date]").eq(0).should("exist");
    cy.get("[data-cy=notification-contents]").eq(0).should("contain", "Short description 1");
    cy.get("[data-cy=notification-button-details]").eq(0).should("be.visible");

    // test second notification
    cy.get("[data-cy=notification-contents]").eq(1).should("contain", "Short description 2");

    // test third notification
    cy.get("[data-cy=notification-contents]").eq(2).should("contain", "Short description 3");
  });

  it("should be able to delete a notification", () => {
    cy.get("[data-cy=button-delete-notification]").eq(0).click();
    cy.get("[data-cy=notification]").should("have.length", 2);
  });

  it("should be able to go to the details page", () => {
    cy.get("[data-cy=notification-button-details]").eq(0).click();

    cy.get("[data-cy=back-button]").should("be.visible");
    cy.get("[data-cy=button-delete-notification]").should("be.visible");
    cy.get("[data-cy=notification-date]").should("exist");
    cy.get("[data-cy=notification-contents]").should("contain", "Expanded description 1");
  });

  it("should change the notification status to read", () => {
    cy.get("[data-cy=notification-button-details]").eq(1).click();

    cy.get("[data-cy=back-button]").click();
    cy.get("[data-cy=notification]").eq(1).should("not.have.class", "unread");
  });
});