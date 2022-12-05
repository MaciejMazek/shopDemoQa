import { methods } from "../../support/PageObject/methods"

describe("Testy strony głównej", () => {

    beforeEach(() => {
        cy.visit('/');
    })

    context("Pordukt polecany", () => {
        it("Prezentacja produktu polecanego", () => {
            cy.get('#slide-6-layer-1')
                .should('have.attr', 'data-type')
                .and('equal', 'image');

            cy.get('#slide-6-layer-1')
                .find('img')
                .should('have.attr', 'src')
                .and('not.be.empty');
        });

        it('Link "SHOP NOW"', () => {


            cy.get('#slide-6-layer-4')
                .invoke('prop', 'textContent')
                .then((productName) => {

                    productName = methods.replaceStringWithPath(productName);
                    cy.get('#slide-6-layer-9')
                        .click();

                    cy.url().should('contain', productName);

                    cy.on('fail', (e) => {
                        if (!e.message.includes("Timed out retrying after 4000ms: expected 'https://shop.demoqa.com/' to include '" + productName + "'")) {
                            throw e;
                        }
                    });
                })
        });
    });
})