import { mainPagePO } from "../../support/PageObject/mainPagePO";


describe("Testy funkcjonalności wyszukiwania", () => {
    beforeEach(() => {
        mainPagePO.openPage();
    })

    context("Podstawowe testy", () => {
        it('Na stronie głównej można znaleźć pole z wyszukiwarką', () => {
            cy.get('.noo-search')
                .should('exist');
        });

        it('Kliknięcie w pole wyszukiwarki przybliża pole i umiejscawia je na środku ekranu', () => {
            cy.get('.noo-search')
                .click();

            cy.get('.search-header')
                .should('have.attr', 'style', 'display: block;')
        });

        it('Po kliknięciu w pole wyszukiwarki i kliknięciu poza nie, widok wraca do ekranu gównego', () => {
            cy.get('.noo-search')
                .click();

            cy.get('.remove-form')
                .click({ force: true });

            cy.get('.search-header')
                .should('have.attr', 'style', 'display: none;')
        });

        it('Możliwość wpisania tekstu do pola wyszukiwarki', () => {
            cy.get('.noo-search')
                .click();

            cy.get('.form-control')
                .type('Test value')
                .then(() => {
                    cy.get('.form-control')
                        .should('have.prop', 'value', 'Test value');
                });



        });

        it('Wpisanie tekstu i uruchomienie wyszukiwania klawiszem "enter"', () => {
            cy.get('.noo-search')
                .click()

            cy.get('[type="search"]')
                .type('Test value')
                .type('{enter}');

            cy.get('.search-header')
                .should('have.css', 'display', 'none')

        });

        it('Wpisanie losowego ciągu znaków i uruchomienie wyszukiwania', () => {
            cy.get('.noo-search')
                .click()

            cy.get('[type="search"]')
                .type('Test value')
                .type('{enter}');

            cy.get('.woocommerce-info.woocommerce-no-products-found')
                .invoke('prop', 'textContent')
                .should('eq', 'No products were found matching your selection.')
        });

        it('Wyszukanie kolejnego produktu po skutecznym wyszukaniu pierwszego', () => {
            cy.get('.noo-search')
                .click()

            cy.get('[type="search"]')
                .type('Dress')
                .type('{enter}');

            cy.get('.product')
                .should('exist');

            cy.get('.noo-search')
                .click()

            cy.get('[type="search"]')
                .type('T-shirt')
                .type('{enter}');

            cy.get('.product')
                .should('exist');
        });
    })
})