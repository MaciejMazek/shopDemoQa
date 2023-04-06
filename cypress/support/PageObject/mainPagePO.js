class MainPagePO {

    openPage() {
        cy.visit('/');
        cy.get('[data-notice-id="1013467fc0b780504faafa9d866c07ac"]')
            .find('.woocommerce-store-notice__dismiss-link')
            .click();
    };

    moveToMyAccount() {
        cy.get('.noo-header.fixed_top.header-3.header-eff')
            .contains("My Account")
            .click();
    };

    moveToMyWishlist() {
        cy.get('.noo-header.fixed_top.header-3.header-eff')
            .contains("My Wishlist")
            .click();
    };

    moveToCheckout() {
        cy.get('.noo-header.fixed_top.header-3.header-eff')
            .contains("Checkout")
            .click();
    };

    moveToMainPage() {
        cy.get('.navbar-logo')
            .click();
    }

    searchValue(searchedValue) {
        cy.get('.noo-search')
            .click();

        cy.get('[type="search"]')
            .type(searchedValue)
            .type('{enter}');
    }

}

export const mainPagePO = new MainPagePO;