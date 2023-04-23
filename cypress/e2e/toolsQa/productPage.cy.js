import { mainPagePO } from "../../support/PageObject/mainPagePO";

describe("Strona z produktem", () => {

    beforeEach(() => {
        mainPagePO.openPage();
    });



    context("Top bar", () => {

        beforeEach(() => {
            mainPagePO.moveToProduct("Tokyo Talkies");
        });


        it('Występowanie tytułu produktu', () => {
            cy.get('.page-title')
                .should('exist');
        });

        it('Nazwa produktu w top barze jest zgodna z nazwą na kaflu z produktem', () => {
            cy.get('.page-title')
                .invoke('prop', 'textContent')
                .then((value) => {
                    cy.get('.product_title.entry-title')
                        .invoke('prop', 'textContent')
                        .should('eq', value);
                })
        });

        it('Występowanie drzewka nawigacji', () => {
            cy.get('.noo-page-breadcrumb')
                .should('exist');
        });

        it('Prawidłowe działanie drzewa nawigacji - strony nadrzędne', () => {
            cy.get('.noo-page-breadcrumb')
                .contains('Dress')
                .click();

            cy.url()
                .should('contain', '/product-category/dress/');

            mainPagePO.moveToProduct("Tokyo Talkies");

            cy.get('.noo-page-breadcrumb')
                .contains('Products')
                .click();

            cy.url()
                .should('contain', '/shop/');
        });

        it('Prawidłowe działanie drzewa nawigacji - strona główna', () => {
            cy.get('.noo-page-breadcrumb')
                .contains('ToolsQA Demo Site')
                .click();

            cy.url()
                .should('eq', 'https://shop.demoqa.com/');
        });
    });

    context("Testy sekcji produktu", () => {

        beforeEach(() => {
            mainPagePO.moveToProduct("Black Cross Back Maxi Dress");
        });


        it('Występowanie zdjęcia produktu', () => {
            cy.get('.noo-woo-images__image')
                .should('have.attr', 'src', 'https://shop.demoqa.com/wp-content/uploads/2019/04/black-cross-back-maxi-dress-1-600x869.jpg');
        });

        it('Możliwość przewijania zdjęcia strzałką w prawo', () => {
            cy.get('.ion-ios-arrow-forward')
                .click();

            cy.get('.noo-woo-images')
                .find('[data-index="1"]')
                .should('have.class', 'noo-woo-images__slide--active');

            //zabieg konieczny do usunięcia focusu ze strzałki, przez który ponowne kliknięcie nie dawało efektu. Tu klikamy w zwykły textContent nie będący aktywnym elementem.
            cy.contains('SKU: ').click();

            cy.get('.ion-ios-arrow-forward')
                .click();

            cy.get('.noo-woo-images')
                .find('[data-index="2"]')
                .should('have.class', 'noo-woo-images__slide--active');
        });

        it('Możliwość przewijania zdjęcia strzałką w lewo', () => {
            cy.get('.ion-ios-arrow-back')
                .click();

            cy.get('.noo-woo-images')
                .find('[data-index="4"]')
                .should('have.class', 'noo-woo-images__slide--active');

            cy.contains('SKU: ').click();

            cy.get('.ion-ios-arrow-back')
                .click();

            cy.get('.noo-woo-images')
                .find('[data-index="3"]')
                .should('have.class', 'noo-woo-images__slide--active');
        });

        it('Możliwość zmiany wyświetlanego zdjęcia kliknięciem w miniaturę', () => {
            cy.get('.noo-woo-thumbnails-wrap--vertical')
                .find('[data-index="3"]')
                .click();

            cy.get('.noo-woo-images')
                .find('[data-index="3"]')
                .should('have.class', 'noo-woo-images__slide--active');
        });

        it('Występowanie szczegółowych informacji', () => {
            cy.get('.product_meta')
                .should('exist');

            cy.get('.product_meta')
                .find('.sku')
                .should('exist');

            cy.get('.product_meta')
                .find('.posted_in')
                .should('exist');

            cy.get('.product_meta')
                .find('.tagged_as')
                .should('exist');
        });

        it('Możliwość wyboru z comboboxa różnych wersji kolorystycznych', () => {
            cy.get('#pa_color')
                .select('beige')
                .then(() => {
                    cy.get('#pa_color')
                        .invoke('prop', 'value')
                        .should('eq', 'beige')
                });

            cy.get('#pa_color')
                .select('black')
                .then(() => {
                    cy.get('#pa_color')
                        .invoke('prop', 'value')
                        .should('eq', 'black')
                })
        });

        it('Możliwość wyboru z comboboxa różnych wersji rozmiarowych', () => {
            cy.get('#pa_size')
                .select('large')
                .then(() => {
                    cy.get('#pa_size')
                        .invoke('prop', 'value')
                        .should('eq', 'large')
                });

            cy.get('#pa_size')
                .select('medium')
                .then(() => {
                    cy.get('#pa_size')
                        .invoke('prop', 'value')
                        .should('eq', 'medium')
                });

            cy.get('#pa_size')
                .select('small')
                .then(() => {
                    cy.get('#pa_size')
                        .invoke('prop', 'value')
                        .should('eq', 'small')
                });
        });

        it('Kliknięcie przycisku "clear" czyści wyboru comboboxów', () => {
            cy.get('#pa_color')
                .select('beige')
                .then(() => {
                    cy.get('#pa_color')
                        .invoke('prop', 'value')
                        .should('eq', 'beige');
                });

            cy.get('#pa_size')
                .select('large')
                .then(() => {
                    cy.get('#pa_size')
                        .invoke('prop', 'value')
                        .should('eq', 'large');
                });

            cy.get('.reset_variations')
                .click()
                .then(() => {
                    cy.get('#pa_color')
                        .invoke('prop', 'value')
                        .should('be.empty');

                    cy.get('#pa_size')
                        .invoke('prop', 'value')
                        .should('be.empty');
                });
        });

        it('Możliwość dodania do wishlist', () => {
            cy.get('.summary.entry-summary')
                .find('.add_to_wishlist.single_add_to_wishlist')
                .click();

            cy.get('#yith-wcwl-message')
                .should('have.prop', 'textContent', 'Product added!');

            cy.scrollTo('top');

            cy.get('.noo-header.fixed_top.header-2')
                .contains('My Wishlist')
                .click();


            cy.get('.wishlist-empty')
                .should('not.exist');
        });

        it('Możliwość wywołania opcji "compare"', () => {
            cy.get('.summary.entry-summary')
                .find('.compare')
                .click();

            cy.get('iframe')
                .should('exist');
        });

        it('Możliwość wybrania "share on facebook"', () => {
            cy.get('[title="Share on Facebook"]')
                .invoke('attr', 'onclick', 'document.cookie = "cypressTest=passed"')
                .click();

            cy.getCookie('cypressTest')
                .its('value')
                .should('eq', 'passed');
        });

        it('Możliwość wybrania "share on twitter"', () => {
            cy.get('[title="Share on Twitter"]')
                .invoke('attr', 'onclick', 'document.cookie = "cypressTest=passed"')
                .click();

            cy.getCookie('cypressTest')
                .its('value')
                .should('eq', 'passed');
        });

        it('Możliwość wybrania "share on google"', () => {
            cy.get('[title="Share on Google+"]')
                .invoke('attr', 'onclick', 'document.cookie = "cypressTest=passed"')
                .click();

            cy.getCookie('cypressTest')
                .its('value')
                .should('eq', 'passed');
        });

        it('Możliwość wybrania "share on pinterest"', () => {
            cy.get('[title="Share on Pinterest"]')
                .invoke('attr', 'onclick', 'document.cookie = "cypressTest=passed"')
                .click();

            cy.getCookie('cypressTest')
                .its('value')
                .should('eq', 'passed');
        });
    });

    context("Additional information", () => {

        beforeEach(() => {
            mainPagePO.moveToProduct("Tokyo Talkies");
            cy.contains('Additional information')
                .click();
        });

        it('Możliwe opcje kolorystyczne podane są zgodnie z ich występowaniem w comboboxie', () => {

            cy.get('#color')
                .find('option')
                .each((el, i) => {

                    let elementValue;

                    elementValue = el.text()

                    if (i != 0) {
                        cy.get('.woocommerce-product-attributes-item__value')
                            .children()
                            .first()
                            .should('contain', elementValue);
                    }


                })
        });

        it('Możliwe opcje rozmiarów podane są zgodnie z ich występowaniem w comboboxie', () => {

            cy.get('#size')
                .find('option')
                .each((el, i) => {

                    let elementValue;

                    elementValue = el.text()

                    if (i != 0) {
                        cy.get('.woocommerce-product-attributes-item__value')
                            .children()
                            .eq([1])
                            .should('contain', elementValue);
                    }


                })
        });
    });

    context("Related products", () => {

        beforeEach(() => {
            mainPagePO.moveToProduct("Tokyo Talkies");
        });
        it('Sekcja "Related products" zawiera osiem pozycji', () => {
            cy.get('.products.noo-row')
                .children()
                .should('have.length', 8);
        });

        it('Możliwość przejścia na produkt z sekcji "Related products"', () => {
            cy.get('.related.products')
                .contains('red satin round neck backless maxi dress')
                .click();

            cy.url()
                .should('contain', '/product/red-satin-round-neck-backless-maxi-dress/');
        });

        it('Po przejściu na produkt z "Related products", przeglądarkowe "wstecz" wraca na stronę produktu który był wyświetlony', () => {
            cy.get('.related.products')
                .contains('red satin round neck backless maxi dress')
                .click();

            cy.url()
                .should('contain', '/product/red-satin-round-neck-backless-maxi-dress/');

            cy.go('back');

            cy.url()
                .should('contain', '/product/tokyo-talkies/');
        });

        it('Możliwość dodania produktu z "Related products" do wishlist', () => {
            cy.get('.related.products')
                .find('.product_cat-maxi-dresses')
                .first()
                .find('.add_to_wishlist ')
                .click();

            cy.get('#yith-wcwl-message')
                .should('have.prop', 'textContent', 'Product added!');

            cy.scrollTo('top');

            cy.get('.noo-header.fixed_top.header-2')
                .contains('My Wishlist')
                .click();


            cy.get('.wishlist-empty')
                .should('not.exist');
        });

        it('Możliwość dodania produktu z "Related products" do porównywarki', () => {
            cy.get('.related.products')
                .find('.product_cat-maxi-dresses')
                .first()
                .find('.compare')
                .click();

            cy.get('iframe')
                .should('exist');

        });

        it('Możliwość przybliżenia produktu z "Related products"', () => {

            cy.get('.related.products')
                .find('.product_cat-maxi-dresses')
                .first()
                .find('.noo-quick-view')
                .click();

            cy.get('.quick-view-wrap')
                .should('exist');
        });

        it('Możliwość przewinięcia zdjęcia produktu z "Related products"', () => {
            cy.get('.related.products')
                .find('.product_cat-maxi-dresses')
                .first()
                .find('.owl-pagination')
                .children()
                .eq([1])
                .click();

            cy.get('.related.products')
                .find('.product_cat-maxi-dresses')
                .first()
                .find('.owl-wrapper')
                .children()
                .then((yieldedArr) => {
                    cy.wrap(yieldedArr)
                        .eq([0])
                        .should('not.have.class', 'active');

                    cy.wrap(yieldedArr)
                        .eq([1])
                        .should('have.class', 'active');

                    cy.wrap(yieldedArr)
                        .eq([2])
                        .should('not.have.class', 'active');
                })
        });

        it('Kliknięcie na typ produktu z "Related products" przenosi do wyszukiwania rodzaju', () => {
            cy.get('.related.products')
                .find('.product_cat-maxi-dresses')
                .first()
                .find('.posted_in')
                .click();

            cy.url()
                .should('contain', '/product-category/dress/');
        });
    });
});