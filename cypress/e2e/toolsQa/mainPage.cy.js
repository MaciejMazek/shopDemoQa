import { methods } from "../../support/PageObject/methods"
import { mainPagePO } from "../../support/PageObject/mainPagePO";

describe("Testy strony głównej", () => {

    beforeEach(() => {
        mainPagePO.openPage();
    })

    context("Produkt polecany", () => {
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

    context("Sekcja z ofertami", () => {
        it('Przedstawia wyróżnioną ofertę po lewej oraz trzy niewyróżnione po prawej w pierwszym panelu', () => {
            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.wpb_column')
                .as('offerSection')
                .first()
                .should('contain', 'wo- men’s trends')

            cy.get('@offerSection')
                .eq(1)
                .should('contain', 'For ladies')

            cy.get('@offerSection')
                .find('.noo-product-item')
                .should('have.length', 3)
        });

        it('Przedstawia wyróżnioną ofertę po lewej oraz trzy niewyróżnione po prawej w pierwszym panelu', () => {
            cy.contains('real men’s fashion')
                .parents('.noo-container-fluid')
                .find('.wpb_column')
                .as('offerSection')
                .first()
                .should('contain', 'For ladies')

            cy.get('@offerSection')
                .find('.noo-product-item')
                .should('have.length', 3)

            cy.get('@offerSection')
                .eq(1)
                .should('contain', 'real men’s fashion')
        });

        it('Kliknięcie na wyróżnionej ofercie w pierwszym panelu na przycisk \'Show now\' przenosi usera na listę ofert', () => {
            cy.on('fail', (e) => {
                if (e.message != 'Timed out retrying after 4000ms: Expected to find element: `.products noo-row`, but never found it.') {
                    throw e;
                }
            });

            cy.contains('wo- men’s trends')
                .parent()
                .contains('SHOW NOW')
                .click({ force: true });

            cy.get('.products noo-row')
                .should('exist');
        });

        it('Kliknięcie na wyróżnionej ofercie w drugim panelu na przycisk \'Show now\' przenosi usera na listę ofert', () => {
            cy.on('fail', (e) => {
                if (e.message != 'Timed out retrying after 4000ms: Expected to find element: `.products noo-row`, but never found it.') {
                    throw e;
                }
            });

            cy.contains('real men’s fashion')
                .parent()
                .contains('SHOW NOW')
                .click({ force: true });

            cy.get('.products noo-row')
                .should('exist');
        });

        it('Kliknięcie na zdjęcie niewyróżnionej oferty przenosi na stronę oferty', () => {
            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.noo-thumbnail-product.hover-device')
                .click({ force: true });

            cy.url()
                .should('contain', '/product/');
        });

        it('Kliknięcie na tytuł niewyróżnionej oferty przenosi na stronę oferty', () => {
            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('h3')
                .click();

            cy.url()
                .should('contain', '/product/');
        });

        it('Najechanie na niewyróżnioną ofertę pokazuje dodatkowe opcje', () => {
            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.noo-product-inner.noo-product-inner2')
                .should('exist');
        });

        it('Kliknięcie na symbol trzech kropek niewyróżnionej oferty przenosi na stronę oferty', () => {
            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.add_to_cart_button')
                .click({ force: true });

            cy.url()
                .should('contain', '/product/')
        });

        it('Kliknięcie na symbol strzałek niewyróżnionej oferty otwiera porównywarkę', () => {
            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.compare')
                .click({ force: true });

            cy.get('.yith_woocompare_colorbox')
                .should('exist');
        });

        it('Kliknięcie na symbol serca niewyróżnionej oferty dodaje ofertę do wishlist', () => {
            cy.intercept('https://shop.demoqa.com/wp-admin/admin-ajax.php').as('request');


            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.single_add_to_wishlist')
                .click({ force: true });

            cy.wait('@request');
            mainPagePO.moveToMyWishlist();

            cy.get('.wishlist-empty')
                .should('not.exist');
        });

        it('Ponowne kliknięcie na symbol serca niewyróżnionej oferty przenosi na stronę wishlist', () => {
            cy.intercept('https://shop.demoqa.com/wp-admin/admin-ajax.php').as('request');

            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.single_add_to_wishlist')
                .click({ force: true });

            cy.wait('@request');

            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.yith-wcwl-wishlistaddedbrowse > a')
                .click({ force: true });

            cy.url()
                .should('contain', '/wishlist/');
        });

        it('Kliknięcie na symbol lupki niewyróżnionej oferty otwiera popup ze szczegółami oferty', () => {
            cy.contains('wo- men’s trends')
                .parents('.noo-container-fluid')
                .find('.noo-product-item')
                .eq([0])
                .find('.noo-quick-view')
                .click({ force: true });

            cy.get('.quick-view-wrap')
                .should('exist');
        });

    })



    context("Sekcja Fashion News", () => {
        it('Na stronie głównej występują cztery artykuły', () => {
            cy.get('.noo-shblog-content')
                .find('.noo-shblog-item')
                .should('have.length', 4);
        });

        it('Kliknięcie na obrazek przenosi na stronę z artykułem', () => {
            cy.get('.noo-shblog-content')
                .find('.noo-shblog-item')
                .eq(2)
                .find('.noo-shblog-thumbnail')
                .click();

            cy.url()
                .should('include', 'freshen-the-bed-in-a-beautiful-way');
        });

        it('Kliknięcie na tytuł przenosi na stronę z artykułem', () => {
            cy.get('.noo-shblog-content')
                .contains('Freshen The Bed in a Beautiful Way')
                .click();

            cy.url()
                .should('include', 'freshen-the-bed-in-a-beautiful-way');

        });

        it('Kliknięcie na autora przenosi na listę artykułów danego autora', () => {
            cy.get('.noo-shblog-content')
                .find('.noo-shblog-item')
                .eq(2)
                .find('.url.fn.n')
                .click();

            cy.url()
                .should('include', 'author/lsharm/');
        });

        it('Kliknięcie na komentarze przenosi na artykuł pokazując komentarze', () => {

            cy.get('.noo-shblog-content')
                .find('.noo-shblog-item')
                .eq(2)
                .find('.comments-link')
                .find('a')
                .click();

            cy.url()
                .should('include', '#respond');
        });

        it('Kliknięcie na "view all blog" pokazuje stronę z blogami', () => {
            //baboleiro - tutaj powinno przenieść na widocznie niezaimplementowaną stronę, zamiast tego leci na str gł

            cy.get('.noo_sh_blog_wraper')
                .find('.custom_link')
                .click();

            cy.url()
                .should('contain', '/blogs/');

            cy.on('fail', (e) => {
                if (e.message != "Timed out retrying after 4000ms: expected 'https://shop.demoqa.com/#' to include '/blogs/'") {
                    throw e;
                }

            })

        });
    })
})