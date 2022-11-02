import { mainPagePO } from "../../support/PageObject/mainPagePO";
import { myAccountPO } from "../../support/PageObject/myAccountPO";
import { methods } from '../../support/PageObject/methods'

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

        myAccountPO.registerAccount('', '', '');
        // cy.get('.woocommerce-form-register__submit')
        //     .click();

        cy.get('#primary')
            .should('contain', 'Please provide a valid email address.');
    })

    it('Rejestracja bez wpisania username', () => {
        myAccountPO.registerAccount('', 'test@test2.pl', myAccountPO.defaultPassword);
        cy.get('#primary')
            .should('contain', 'Please enter a valid account username.');
    });

    it('Rejestracja bez wpisania hasła', () => {
        myAccountPO.registerAccount(myAccountPO.defaultUsername, myAccountPO.defaultEmail, '');
        cy.get('#primary')
            .should('contain', 'Please enter an account password.');
    });

    it('Rejestracja bez wpisania emaila', () => {
        myAccountPO.registerAccount(myAccountPO.defaultUsername, '', myAccountPO.defaultPassword);
        cy.get('#primary')
            .should('contain', 'Please provide a valid email address.');
    });

    it('Rejestracja z niepoprawnym emailem - bez małpy', () => {
        myAccountPO.registerAccount(myAccountPO.defaultUsername, 'testowankoMałpaa.pl', myAccountPO.defaultPassword);

        cy.get('#reg_email')
            .invoke('prop', 'validity')
            .its('typeMismatch')
            .should('eq', true);

        cy.get('#reg_email')
            .invoke('prop', 'validity')
            .its('valid')
            .should('eq', false);

    })
});