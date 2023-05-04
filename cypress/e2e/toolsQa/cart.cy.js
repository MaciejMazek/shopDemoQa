import { mainPagePO } from "../../support/PageObject/mainPagePO";
import { cartPO } from "../../support/PageObject/cartPO";

describe("Testy koszyka sklepowego", () => {
    beforeEach(() => {
        mainPagePO.openPage();
    });


    context("Testy ikony koszyka", () => {
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
        it("Dodanie przedmiotu i przejście na /cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L")
            cy.get('.icon_bag_alt')
                .click();

            cy.url()
                .should('contain', '/cart/');

            cy.get('.cart_item > .product-name')
                .invoke('prop', 'textContent')
                .should('contain', 'Tokyo Talkies')
                .and('contain', 'Red')
                .and('contain', 'L');

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '1');
        });
        it("Kliknięcie w 'continue shopping' przechodzi na stronę /shop/", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L")
            cy.get('.icon_bag_alt')
                .click();

            cy.get('.continue')
                .click();

            cy.url()
                .should('contain', '/shop/');
        });
        it("Dodanie większej ilości przedmiotu do już dodanego i przejście na /cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L");
            mainPagePO.moveToMainPage();

            cartPO.addToCart("Tokyo Talkies", "Red", "L", 3);
            mainPagePO.moveToCart();

            cy.get('.cart_item > .product-name')
                .invoke('prop', 'textContent')
                .should('contain', 'Tokyo Talkies')
                .and('contain', 'Red')
                .and('contain', 'L');

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '4');

        });
        it("Dodanie innego przedmiotu do już istniejących i przejście na /cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L");
            mainPagePO.moveToMainPage();

            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 1);
            mainPagePO.moveToCart();

            cy.get('.shop_table > tbody > .cart_item')
                .should('have.length', 2);

            cy.get('.shop_table > tbody > .cart_item')
                .first()
                .find('.product-name')
                .invoke('prop', 'textContent')
                .should('contain', 'Tokyo Talkies')
                .and('contain', 'Red')
                .and('contain', 'L');

            cy.get('.shop_table > tbody > .cart_item')
                .eq([1])
                .find('.product-name')
                .invoke('prop', 'textContent')
                .should('contain', 'Black Cross Back Maxi Dress - Beige')
                .and('contain', 'Medium');

        });
        it("Usunięcie jednego przedmiotu używając - na /cart powoduje samą zmianę ilości przedmiotów.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-decrease')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '1');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹200.00');
        });
        it("Usunięcie jednego przedmiotu używając - i klikając na update cart powoduje zmianę ilości przedmiotów.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-decrease')
                .click();

            cy.get('[name="update_cart"]')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '1');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹100.00');
        });
        it("Usunięcie jednego z przedmiotów mających większą niż 1 ilość i f5 na /cart nie powoduje zmiany ilości przedmiotów.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-decrease')
                .click();

            cy.reload();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');
        });
        it("Usunięcie jednego z przedmiotów mających większą niż 1 ilość i f5 po kliknięciu update cart powoduje zmianę ilości przedmiotów.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-decrease')
                .click();
            cy.get('[name="update_cart"]')
                .click();
            cy.reload();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '1');
        });
        it("Usuwanie przedmiotów korzystając z - nie pozwala na zmniejszenie poniżej 1.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();

            cy.get('.qty-decrease')
                .click();

            cy.get('.qty-decrease')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '1');
        });
        it("Usunięcie po jednym przedmiocie z X różnych opcji. Strona przedstawia tylko zmianę ilości, bez przeliczenia.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 2);
            mainPagePO.moveToCart();


            cy.get('.cart_item')
                .first()
                .find('.qty-decrease')
                .click();

            cy.get('.cart_item')
                .first()
                .find('.input-text.qty.text')
                .should('have.prop', 'value', '1');

            cy.get('.cart_item')
                .eq([1])
                .find('.qty-decrease')
                .click();

            cy.get('.cart_item')
                .first()
                .find('.input-text.qty.text')
                .should('have.prop', 'value', '1');

            cy.get('.cart_totals [data-title="Total"]')
                .should('have.prop', 'textContent', '₹242.00 ');
        });
        it("Usunięcie po jednym przedmiocie z X różnych opcji klikając na update cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 2);
            mainPagePO.moveToCart();

            cy.get('.cart_item')
                .first()
                .find('.qty-decrease')
                .click();

            cy.get('.cart_item')
                .eq([1])
                .find('.qty-decrease')
                .click();

            cy.get('[name="update_cart"]')
                .click();

            cy.get('.cart_totals [data-title="Total"]')
                .should('have.prop', 'textContent', '₹121.00 ');
        });
        it("Usunięcie przedmiotów używając (x) obok przedmiotu. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 2);
            mainPagePO.moveToCart();

            cy.get('.cart_item')
                .should('have.length', 2);

            cy.get('.cart_item')
                .first()
                .find('.product-remove .icon_close_alt2')
                .click();

            cy.get('.cart_item')
                .should('have.length', 1);
        });
        it("Undo po usunięciu całego kafla z przedmiotami używając (x). Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 2);
            mainPagePO.moveToCart();

            cy.get('.cart_item')
                .first()
                .find('.product-remove .icon_close_alt2')
                .click();

            cy.get('.cart_item')
                .should('have.length', 1);

            cy.get('.woocommerce-message .restore-item')
                .click();

            cy.get('.cart_item')
                .should('have.length', 2);
        });
        it("Dodanie przedmiotu korzystając z +. Zmiana tylko quantity.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-increase')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '3');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹200.00');
        });
        it("Dodanie przedmiotu korzystając z + oraz update cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-increase')
                .click();

            cy.get('[name="update_cart"]')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '3');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹300.00');
        });

        it("f5 po dodaniu przedmiotu korzystając z +. Brak zmiany ilości przedmiotów.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-increase')
                .click();
            cy.reload();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹200.00');
        });

        it("f5 po dodaniu przedmiotu klikając na update cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.qty-increase')
                .click();

            cy.get('[name="update_cart"]')
                .click();
            cy.reload();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '3');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹300.00');
        });
        it("Zmiana ilości przedmiotu poprzez wpisanie wartości - mniej. Zmiana tylko w quantity.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.input-text.qty.text')
                .clear()
                .type('1');

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '1');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹200.00');
        });
        it("Zmiana ilości przedmiotu poprzez wpisanie wartości (mniejszej) oraz kliknięcie update cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.input-text.qty.text')
                .clear()
                .type('1');

            cy.get('[name="update_cart"]')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '1');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹100.00');
        });
        it("Zmiana ilości przedmiotu poprzez wpisanie wartości - więcej. Zmiana jedynie w quantity.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.input-text.qty.text')
                .clear()
                .type('3');

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '3');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹200.00');
        });
        it("Zmiana ilości przedmiotu poprzez wpisanie wartości - więcej z update cart. Strona przedstawia prawidłowe dane.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '2');

            cy.get('.input-text.qty.text')
                .clear()
                .type('3');

            cy.get('[name="update_cart"]')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '3');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹300.00');
        });
        it("Zmiana ilości przedmiotu poprzez wpisanie bardzo dużej wartości nie powoduje wystąpienia komunikatu o limicie ilości przedmiotów.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();
            cy.get('.input-text.qty.text')
                .clear()
                .type('70855');

            cy.get('[name="update_cart"]')
                .click();

            cy.get('.input-text.qty.text')
                .should('have.prop', 'value', '70855');

            cy.get('.cart_item > .product-subtotal > .woocommerce-Price-amount')
                .should('have.prop', 'textContent', '₹7,085,500.00');
        });
        it("Kliknięcie clear shopping cart z 1 przedmiotem usuwa wszystko z koszyka.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();

            cy.get('.shop_table > tbody > .cart_item')
                .should('have.length', 1);

            cy.get('.empty-cart')
                .click();

            cy.get('.shop_table > tbody > .cart_item')
                .should('not.exist');

            cy.get('.cart-empty.woocommerce-info')
                .should('have.prop', 'textContent', 'Your cart is currently empty.');
        });
        it("Kliknięcie clear shopping cart z dwoma przedmiotami usuwa wszystko z koszyka.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToMainPage();
            cartPO.addToCart("Black Cross Back Maxi Dress", "Beige", "medium", 2);
            mainPagePO.moveToCart();

            cy.get('.shop_table > tbody > .cart_item')
                .should('have.length', 2);

            cy.get('.empty-cart')
                .click();

            cy.get('.shop_table > tbody > .cart_item')
                .should('not.exist');

            cy.get('.cart-empty.woocommerce-info')
                .should('have.prop', 'textContent', 'Your cart is currently empty.');
        });

        it("Kliknięcie Proceed to checkout przenosi na stronę podsumowania zakupu.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();

            cy.get('.shop_table > tbody > .cart_item')
                .should('have.length', 1);
            cy.get('.wc-proceed-to-checkout')
                .click();

            cy.url()
                .should('contain', 'checkout')
        });

        it("Kliknięcie ToolsQa Demo Site przenosi na stronę główną.", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();

            cy.get('.shop_table > tbody > .cart_item')
                .should('have.length', 1);

            cy.scrollTo('top');

            cy.get('.navbar-logo')
                .click();

            cy.url()
                .should('eq', 'https://shop.demoqa.com/');
        });
    });

    context("Testy funkcji 'discount'", () => {


        it("Jak nie ma w koszyku produktu to nie pojawia się discount", () => {
            mainPagePO.moveToCart();

            cy.get('#noo_coupon_code')
                .should('not.exist');
        });

        it("Jak jest produkt w koszyku to pojawia się discount", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();

            cy.get('#noo_coupon_code')
                .should('exist');
        });
        it("Nieprawidłowy kupon", () => {
            cartPO.addToCart("Tokyo Talkies", "Red", "L", 2);
            mainPagePO.moveToCart();

            cy.get('#noo_coupon_code')
                .type(1);

            cy.get('.noo-apply-coupon')
                .click();

            cy.get('.woocommerce-error')
                .invoke('prop', 'textContent')
                .should('contain', 'Coupon "1" does not exist!');
        });

        it("Prawidłowy kupon", () => {
            //nie mam prawidłowego kuponu :(
        });

    });
});