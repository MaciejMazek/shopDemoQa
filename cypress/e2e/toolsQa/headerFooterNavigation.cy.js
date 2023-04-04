import { mainPagePO } from "../../support/PageObject/mainPagePO";

describe('Testy headera, footera i nawigacji', () => {

    beforeEach(() => {
        mainPagePO.openPage();
    })

    it('Prawidłowy link do maila oraz numeru telefonu w headerze ', () => {
        cy.get('#noo-site')
            .find('.noo-topbar-left')
            .find('a')
            .each((link) => {
                cy.wrap(link)
                    .invoke('prop', 'href')
                    .should('be.oneOf', ['tel:+(099)999-9999', 'mailto:nomail@toolsqa.com'])
            });
    });

    it('Możliwość przejścia na moją listę życzeń', () => {
        mainPagePO.moveToMyWishlist();
        cy.url()
            .should('contain', 'wishlist');
    });

    it('Możliwość przejścia na moje konto', () => {
        mainPagePO.moveToMyAccount();
        cy.url()
            .should('contain', 'my-account');
    });

    it('Możliwość przejścia do kasy', () => {
        mainPagePO.moveToCheckout();
        cy.url()
            .should('contain', 'cart');
    });

    it('Możliwość powrotu na stronę główną klikając logo', () => {
        mainPagePO.moveToCheckout();
        mainPagePO.moveToMainPage();
        cy.url().should('be.oneOf', ['https://shop.demoqa.com', 'https://shop.demoqa.com/']);
    });

    it('Prawidłowe zachowanie na przeglądarkową nawigację wstecz', () => {
        mainPagePO.moveToCheckout();
        cy.go('back');
        cy.url().should('be.oneOf', ['https://shop.demoqa.com', 'https://shop.demoqa.com/']);
    });

    it('Prawidłowe zachowanie na przeglądarkową nawigację wprzód', () => {
        mainPagePO.moveToCheckout();
        cy.go('back');
        cy.go('forward');
        cy.url()
            .should('contain', 'cart');
    });

    it('Możliwość powrotu na górę strony dzięki strzałce w górę', () => {
        cy.scrollTo('bottom');
        cy.get('.go-to-top')
            .click();
        cy.window()
            .its('scrollY').
            should('equal', 0);
    });

    it('Navbar na stronie głównej - search scrolluje razem ze stroną', () => {
        cy.scrollTo('bottom');
        cy.get('.navbar-wrapper')
            .find('.noo-search')
            .should('have.css', 'display', 'block');
    });

    it('Navbar na stronie głównej - cart scrolluje razem ze stroną', () => {
        cy.scrollTo('bottom');
        cy.get('.navbar-wrapper')
            .find('.noo-cart-simple')
            .should('have.css', 'display', 'block');
    });

    it('Navbar na stronie głównej - logo scrolluje razem ze stroną', () => {
        cy.scrollTo('bottom');
        cy.get('.navbar-wrapper')
            .find('.navbar-logo')
            .find('.custom-logo-link')
            .should('have.css', 'display', 'block');
    });

    it('Navbar poza stroną główną - search znika po zeskrolowaniu', () => {
        mainPagePO.moveToCheckout();
        cy.scrollTo('bottom');
        cy.get('.navbar-wrapper')
            .find('.noo-search')
            .should('have.css', 'display', 'none');
    });

    it('Navbar poza stroną główną - cart znika po zeskrolowaniu', () => {
        mainPagePO.moveToCheckout();
        cy.scrollTo('bottom');
        cy.get('.navbar-wrapper')
            .find('.noo-cart-simple')
            .should('have.css', 'display', 'none');
    });

    it('Navbar poza stroną główną - logo zostaje po zeskrolowaniu', () => {
        mainPagePO.moveToCheckout();
        cy.scrollTo('bottom');
        cy.get('.navbar-wrapper')
            .find('.navbar-logo')
            .find('.custom-logo-link')
            .should('have.css', 'display', 'block');
    });
})