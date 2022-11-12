import { mainPagePO } from "../../support/PageObject/mainPagePO";
import { myAccountPO } from "../../support/PageObject/myAccountPO";

beforeEach(() => {
    mainPagePO.openPage();
    mainPagePO.moveToMyAccount();
})


describe('Testy funkcjonalności rejestracji', () => {

    //test jest skipnięty ze względu na to, że nie chcę zasypywać bazy danych nowymi rejestracjami za każdym razem, kiedy chcę puścić testy.
    it.skip('Rejestracja z prawidłowymi danymi', () => {

        let username = methods.makeid(7);

        myAccountPO.registerAccount(username, myAccountPO.defaultEmail, myAccountPO.defaultPassword);

        cy.get('#noo-site')
            .find('.entry-content')
            .should('contain.text', 'Hello ' + username)
    })

    it('Rejestracja bez wpisania danych', () => {

        myAccountPO.registerAccount({ username: '{esc}', email: '{esc}', password: '{esc}' });

        cy.get('#primary')
            .should('contain', 'Please provide a valid email address.');
    })

    it('Rejestracja bez wpisania username', () => {
        myAccountPO.registerAccount({ username: '{esc}' });
        cy.get('#primary')
            .should('contain', 'Please enter a valid account username.');
    });

    it('Rejestracja bez wpisania hasła', () => {
        myAccountPO.registerAccount({ password: '{esc}' });
        cy.get('#primary')
            .should('contain', 'Please enter an account password.');
    });

    it('Rejestracja bez wpisania emaila', () => {
        myAccountPO.registerAccount({ email: '{esc}' });
        cy.get('#primary')
            .should('contain', 'Please provide a valid email address.');
    });

    it('Rejestracja z niepoprawnym emailem - bez małpy', () => {
        myAccountPO.registerAccount({ email: 'testowankoMałpaa.pl' });

        cy.get('#reg_email')
            .invoke('prop', 'validity')
            .its('typeMismatch')
            .should('eq', true);

        cy.get('#reg_email')
            .invoke('prop', 'validity')
            .its('valid')
            .should('eq', false);

        cy.get('#reg_email')
            .invoke('prop', 'validationMessage')
            .should('contain', 'Uwzględnij znak „@” w adresie e-mail. W adresie „testowankoMałpaa.pl” brakuje znaku „@”.');

    })

    it('Rejestracja z bardzo słabym hasłem', () => {
        myAccountPO.registerAccount({ password: 'a', finishRegistration: false });

        cy.get('.woocommerce-password-strength')
            .should('contain', 'Very weak - Please enter a stronger password.');
    })

    it('Rejestracja ze słabym hasłem', () => {
        myAccountPO.registerAccount({ password: 'asda', finishRegistration: false });

        cy.get('.woocommerce-password-strength')
            .should('contain', 'Weak - Please enter a stronger password.');
    })

    it('Rejestracja ze średnim hasłem', () => {
        myAccountPO.registerAccount({ password: 'asd!@#qwe', finishRegistration: false });

        cy.get('.woocommerce-password-strength')
            .should('contain', 'Medium');
    })

    it('Rejestracja z silnym hasłem', () => {
        myAccountPO.registerAccount({ password: 'asd!@#qweZXC', finishRegistration: false });

        cy.get('.woocommerce-password-strength')
            .should('contain', 'Strong');
    })

    it('Reload po wpisaniu danych - username', () => {

        cy.on('fail', (e) => {
            if (e.message !== "Timed out retrying after 4000ms: expected '<input#reg_username.woocommerce-Input.woocommerce-Input--text.input-text>' to contain 'defaultUsername'") {
                throw e;
            }
        })

        myAccountPO.registerAccount({ finishRegistration: false, email: "{esc}", password: "{esc}" });

        cy.reload();
        //brak dokumentacji, natomiast spodziewanym zachowaniem byłoby zachowanie wartości w komponentach.

        cy.get('#reg_username')
            .should('contain', 'defaultUsername');
    })

    it('Reload po wpisaniu danych - email', () => {

        cy.on('fail', (e) => {
            if (e.message !== "Timed out retrying after 4000ms: expected '<input#reg_email.woocommerce-Input.woocommerce-Input--text.input-text>' to contain 'default@email.com'") {
                throw e;
            }
        })

        myAccountPO.registerAccount({ finishRegistration: false, username: "{esc}", password: "{esc}" });

        cy.reload();
        //brak dokumentacji, natomiast spodziewanym zachowaniem byłoby zachowanie wartości w komponentach.

        cy.get('#reg_email')
            .should('contain', 'default@email.com');
    })

    it('Reload po wpisaniu danych - password', () => {

        cy.on('fail', (e) => {
            if (e.message !== "Timed out retrying after 4000ms: expected '<input#reg_password.woocommerce-Input.woocommerce-Input--text.input-text>' to contain 'Password123!password!@#1'") {
                throw e;
            }
        })

        myAccountPO.registerAccount({ finishRegistration: false, email: "{esc}", username: "{esc}" });

        cy.reload();
        //brak dokumentacji, natomiast spodziewanym zachowaniem byłoby zachowanie wartości w komponentach.

        cy.get('#reg_password')
            .should('contain', 'Password123!password!@#1');
    })
});