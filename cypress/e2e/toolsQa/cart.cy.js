import { mainPagePO } from "../../support/PageObject/mainPagePO";
import { cartPO } from "../../support/PageObject/cartPO";

describe("Testy koszyka sklepowego", () => {
    beforeEach(() => {
        mainPagePO.openPage();
    });


    context.only("Testy ikony koszyka", () => {
        it("Kliknięcie na ikonkę koszyka w pustym cart prznosi do pustego koszyka", () => {
            cy.get('.icon_bag_alt')
                .click();

            cy.url()
                .should('contain', '/cart/');

            cy.get('.cart_item')
                .should('not.exist');
        });

        it("Kliknięcie na tekst koszyka w pustyn cart przenosi do pustego koszyka", () => {
            cy.get('.cart-name-and-total')
                .click();

            cy.url()
                .should('contain', '/cart/');

            cy.get('.cart_item')
                .should('not.exist');
        });

        it("Dodanie przedmiotu do cart pokazuje jeden przedmiot i prawidłową cenę na ikonce", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L")
            cy.get('.woocommerce-message')
                .invoke('prop', 'textContent')
                .should('contain', '“Tokyo Talkies” has been added to your cart');

            cy.get('.cart-count')
                .should('have.prop', 'textContent', '1');

            cy.get('.woocommerce-Price-amount')
                .invoke('prop', 'textContent')
                .should('contain', '100');
        });

        it("Kliknięcie w ikonkę cart z przedmiotem przenosi na stonę koszyka z przedmiotem", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L")
            cy.get('.woocommerce-message')
                .invoke('prop', 'textContent')
                .should('contain', '“Tokyo Talkies” has been added to your cart');

            mainPagePO.moveToCart();

            cy.url()
                .should('contain', '/cart/');

            cy.get('.cart_item')
                .should('exist');
        });

        it("Przy dodaniu kilku przedmiotów naraz, ikonka prawidłowo wskazuje ilość i cenę", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 1);

            cy.intercept('admin-ajax.php').as('pageLoad');

            cy.wait('@pageLoad');
            cy.get('.single_add_to_cart_button')
                .click();

            cy.wait('@pageLoad');
            cy.get('.single_add_to_cart_button')
                .click();

            cy.wait('@pageLoad');
            cy.get('.single_add_to_cart_button')
                .click();
        });

        it("Przy dodaniu wielu nowych przedmiotów do koszyka zawierającego ten przedmiot, ikonka prawidłowo wskazuje ilość i cenę", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 1);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 1);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 1);

            cy.get('.cart-count')
                .should('have.prop', 'textContent', '3');

            cy.get('.woocommerce-Price-amount')
                .invoke('prop', 'textContent')
                .should('contain', '300');

        });

        it("Przy dodaniu wielu przedmiotu x do koszyka z przedmiotami y, ikonka prawidłowo wskazuje ilość i cenę", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 1);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("red satin round neck backless maxi dress", "Mauve", "small", 1);

            cy.get('.cart-count')
                .should('have.prop', 'textContent', '4');

            cy.get('.woocommerce-Price-amount')
                .invoke('prop', 'textContent')
                .should('contain', '288');
        });

        it("Możliwość dodania wielu przedmiotów korzystając z pola do wpisywania", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 3);

            cy.get('.cart-count')
                .should('have.prop', 'textContent', '3');

            cy.get('.woocommerce-Price-amount')
                .invoke('prop', 'textContent')
                .should('contain', '300');
        });

        it("Odświeżenie strony głównej mając przedmioty w koszyku nie usuwa przedmiotów z ikonki koszyka", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 3);
            cy.reload();

            cy.get('.cart-count')
                .should('have.prop', 'textContent', '3');

            cy.get('.woocommerce-Price-amount')
                .invoke('prop', 'textContent')
                .should('contain', '300');

            // Na stronie występuje błąd - odświeżenie podwaja ilość produktu w koszyku
            cy.on('fail', (e) => {

                if (e.message != "Timed out retrying after 4000ms: expected '<span.cart-count>' to have property 'textContent' with the value '3', but the value was '6'") {
                    throw e;
                }
            })
        });

        it("Przy usunięciu i dodaniu innego przedmiotu, ikonka prawidłowo wskazuje ilość i cenę", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 1);
            //cy.scrollTo('top');
            mainPagePO.moveToCart();
            cy.get('#post-6')
                .contains('Tokyo Talkies')
                .parents('.cart_item')
                .find('.product-remove > .icon_close_alt2')
                .click();
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 1);

            cy.get('.cart-count')
                .should('have.prop', 'textContent', '1');

            cy.get('.woocommerce-Price-amount')
                .invoke('prop', 'textContent')
                .should('contain', '21');

        });

        it("Kliknięcie na 'add to cart' bez wybrania koloru oraz rozmiaru z combo nie daje efektu", () => {
            cy.contains("Black Cross Back Maxi Dress")
                .click();

            cy.get('.single_add_to_cart_button')
                .click();

            cy.on('window:alert', (m) => {
                expect(m).to.contains('Please select some product options before adding this product to your cart.')
            });
        });

        it("Kliknięcie na 'add to cart' z jednym z dwóch combo wybranych nie daje efektu", () => {
            cy.contains("Black Cross Back Maxi Dress")
                .click();

            cy.get('#pa_color')
                .select('Beige');

            cy.get('.single_add_to_cart_button')
                .click();

            cy.on('window:alert', (m) => {
                expect(m).to.contains('Please select some product options before adding this product to your cart.')
            });
        });
    });

    context("Testy strony /cart", () => {
        it("Dodanie przedmiotu i przejście na /cart", () => {

        });
        it("Kliknięcie w 'return to shop", () => {

        });
        it("Dodanie większej ilości przedmiotu do już dodanego i przejście na /cart", () => {

        });
        it("Dodanie innego przedmiotu do już istniejących i przejście na /cart", () => {

        });
        it("Usunięcie jednego przedmiotu używając - na /cart", () => {

        });
        it("Usunięcie jednego przedmiotu używając klikając na update cart", () => {

        });
        it("Usunięcie jednego z przedmiotów mających większą niż 1 ilość i f5 na /cart", () => {

        });
        it("Usunięcie jednego z przedmiotów mających większą niż 1 ilość i f5 na /cart - klikając na update cart", () => {

        });
        it("Usunięcie wszystkich przedmiotów używając - na /cart", () => {

        });
        it("Usunięcie po jednym przedmiocie z X różnych opcji", () => {

        });
        it("Usunięcie po jednym przedmiocie z X różnych opcji klikając na update cart", () => {

        });
        it("Usunięcie przedmiotów używając (x) obok przedmiotu", () => {

        });
        it("Undo po usunięciu całego kafla z przedmiotami używając (x)", () => {

        });
        it("Dodanie przedmiotu korzystając z +", () => {

        });
        it("Dodanie przedmiotu klikając na update cart", () => {

        });

        it("f5 po dodaniu przedmiotu korzystając z +", () => {

        });

        it("f5 po dodaniu przedmiotu klikając na update cart", () => {

        });
        it("Zmiana ilości przedmiotu poprzez wpisanie wartości - mniej", () => {

        });
        it("Zmiana ilości przedmiotu poprzez update cart", () => {

        });
        it("Zmiana ilości przedmiotu poprzez wpisanie wartości - więcej", () => {

        });
        it("Zmiana ilości przedmiotu poprzez wpisanie wartości - więcej z update cart", () => {

        });
        it("Zmiana ilości przedmiotu poprzez wpisanie bardzo dużej wartości", () => {

        });
        it("Zmiana ilości przedmiotu poprzez wpisanie bardzo dużej wartości - update cart", () => {

        });
        it("Kliknięcie clear shopping cart z 1 przedmiotem", () => {

        });
        it("Kliknięcie clear shopping cart z dwoma przedmiotami", () => {

        });

        it("Kliknięcie Continue shopping", () => {

        });

        it("Kliknięcie Proceed to checkout", () => {

        });

        it("Kliknięcie ToolsQa Demo Site", () => {

        });
    });

    context("Testy funkcji 'discount'", () => {
        it("Nieprawidłowy kupon", () => {

        });

        it("Prawidłowy kupon", () => {

        });

        it("Jak nie ma w koszyku produktu to nie pojawia się discount", () => {

        });

        it("Jak jest produkt w koszyku to pojawia się discount", () => {

        });
    });
});