import { myAccountPO } from "../../support/PageObject/myAccountPO";
import { mainPagePO } from "../../support/PageObject/mainPagePO";

describe("Testy logowania do shop.demoqa", () => {

    let data;

    before(() => {
        cy.fixture("userData").then((fixtureData) => {
            data = fixtureData;
        })
    });

    beforeEach(() => {
        mainPagePO.openPage();
        mainPagePO.moveToMyAccount();

    });

    it('Happy path logowania używając loginu', () => {
        myAccountPO.logIntoAccount({});
        cy.get('#post-8')
            .should('contain', 'Hello Polly Dallton (not Polly Dallton? Log out)');
    });

    it('Happy path logowania używając maila', () => {
        myAccountPO.logIntoAccount({ useEmail: true });
        cy.get('#post-8')
            .should('contain', 'Hello Polly Dallton (not Polly Dallton? Log out)');
    });

    it('Brak wpisania danych', () => {
        myAccountPO.logIntoAccount({ username: "{esc}", password: "{esc}" });
        cy.get('#post-8')
            .find('.woocommerce-error')
            .should('contain', 'Error: Username is required.');
    });

    it('Wpisanie tylko loginu', () => {
        myAccountPO.logIntoAccount({ password: "{esc}" })
        cy.get('#post-8')
            .find('.woocommerce-error')
            .should('contain', 'Error: The password field is empty.');
    });

    it('Wpisanie tylko emaila', () => {
        myAccountPO.logIntoAccount({ useEmail: true, password: "{esc}" });
        cy.get('#post-8')
            .find('.woocommerce-error')
            .should('contain', 'Error: The password field is empty.');
    });

    it('Wpisanie tylko hasła', () => {
        myAccountPO.logIntoAccount({ username: "{esc}" });
        cy.get('#post-8')
            .find('.woocommerce-error')
            .should('contain', 'Error: Username is required.');
    });

    it('Zły login', () => {
        myAccountPO.logIntoAccount({ username: "testWrongUsername" });
        cy.get('#post-8')
            .find('.woocommerce-error')
            .should('contain', 'ERROR: The username or password you entered is incorrect. Lost your password?');
    });

    it('Złe hasło', () => {
        myAccountPO.logIntoAccount({ password: "testData" });
        cy.get('#post-8')
            .find('.woocommerce-error')
            .should('contain', 'ERROR: The username or password you entered is incorrect. Lost your password?');
    });

    it('Odświeżenie strony po wpisaniu danych - dane usera pozostają wpisane', () => {

        cy.on('fail', (e) => {
            if (e.message != 'Timed out retrying after 4000ms: expected \'<input#username.woocommerce-Input.woocommerce-Input--text.input-text>\' to contain value \'Polly Dallton\', but the value was \'\'') {
                throw e;
            }
        })

        myAccountPO.logIntoAccount({ finishLogin: false });
        cy.reload();
        cy.get('#username')
            .should('contain', data.username);
    });

    it('Możliwość zaznaczenia checkboxa \'REMEMBER ME\'', () => {
        myAccountPO.logIntoAccount({ isRememberMe: true, finishLogin: false });
        cy.get("#rememberme")
            .should('be.checked');
    });

    it('Możliwość odznaczenia checkboxa \'REMEMBER ME\'', () => {
        myAccountPO.logIntoAccount({ isRememberMe: true, finishLogin: false });
        cy.get('#rememberme')
            .uncheck()
            .should('not.be.checked');
    });

    it('Przeniesienie na odzyskiwanie hasła', () => {
        myAccountPO.logIntoAccount({ finishLogin: false });
        cy.get('.woocommerce-LostPassword.lost_password')
            .contains('Lost your password?')
            .click();

        cy.url().should('contain.value', 'lost-password');
    });

    it('Odzyskiwanie hasła', () => {
        cy.get('.woocommerce-LostPassword.lost_password')
            .contains('Lost your password?')
            .click();

        cy.get('#user_login')
            .type(data.username);

        cy.get('#post-8')
            .find('.woocommerce-Button.button.wp-element-button')
            .click();

        cy.get('#post-8')
            .should('contain', 'Password reset email has been sent.');
    });

    it.only('Działanie zapamiętania logowania', () => {

        cy.on('fail', (e) => {
            if (e.message != 'Timed out retrying after 4000ms: expected \'<input#username.woocommerce-Input.woocommerce-Input--text.input-text>\' to contain value \'Polly Dallton\', but the value was \'\'') {
                throw e;
            }
        })

        myAccountPO.logIntoAccount({ isRememberMe: true });

        cy.get('#post-8')
            .find('.woocommerce-MyAccount-navigation')
            .contains('Logout')
            .click();

        cy.get('#username')
            .should('contain.value', data.username);

    });
})