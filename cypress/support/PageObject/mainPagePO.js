class MainPagePO {
    openPage() {
        cy.visit('/');
        cy.get('[data-notice-id="1013467fc0b780504faafa9d866c07ac"]')
            .find('.woocommerce-store-notice__dismiss-link')
            .click();
    }

    moveToMyAccount() {
        cy.get('.noo-header.fixed_top.header-3.header-eff')
            .contains("My Account")
            .click();
    }



















}

export const mainPagePO = new MainPagePO;