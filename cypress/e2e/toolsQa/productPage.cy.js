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
                .should('have.attr', 'src', 'https://shop.demoqa.com/wp-content/uploads/2016/05/Tokyo-Talkies-Women-Black-Printed-Maxi-Dress-1-600x800.jpg');
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

        });

        it('Możliwość wyboru z comboboxa różnych wersji kolorystycznych', () => {

        });

        it('Możliwość wyboru z comboboxa różnych wersji rozmiarowych', () => {

        });

        it('Kliknięcie przycisku "clear" czyści wyboru comboboxów', () => {

        });

        it('Możliwość dodania do wishlist', () => {

        });

        it('Możliwość wywołania opcji "compare"', () => {

        });

        it('Możliwość wybrania "share on facebook"', () => {

        });

        it('Możliwość wybrania "share on twitter"', () => {

        });

        it('Możliwość wybrania "share on google"', () => {

        });

        it('Możliwość wybrania "share on pinterest"', () => {

        });
    });

    context("Additional information", () => {
        it('Możliwe opcje kolorystyczne podane są zgodnie z ich występowaniem w comboboxie', () => {

        });

        it('Możliwe opcje rozmiarów podane są zgodnie z ich występowaniem w comboboxie', () => {

        });
    });

    context("Related products", () => {
        it('Sekcja "Related products" zawiera osiem pozycji', () => {

        });

        it('Sekcja "Related products" jest rozłożona w dwóch rzędach', () => {

        });

        it('Możliwość przejścia na produkt z sekcji "Related products"', () => {

        });

        it('Po przejściu na produkt z "Related products", przeglądarkowe "wstecz" wraca na stronę produktu który był wyświetlony', () => {

        });

        it('Możliwość dodania produktu z "Related products" do wishlist', () => {

        });

        it('Możliwość dodania produktu z "Related products" do porównywarki', () => {

        });

        it('Możliwość przybliżenia produktu z "Related products"', () => {

        });

        it('Możliwość przewinięcia zdjęcia produktu z "Related products"', () => {

        });

        it('Możliwość przewinięcia zdjęcia produktu z "Related products" wykorzystując kropkę pod zdjęciem', () => {

        });

        it('Kliknięcie na typ produktu z "Related products" przenosi do wyszukiwania rodzaju', () => {

        });
    });
});