class MyAccount {

    defaultUsername = 'testowyUsername';
    defaultEmail = 'testowyMail@test.pl';
    defaultPassword = 'Password123!password!@#1';

    registerAccount(username, email, password) {

        if (username != '') {
            cy.get('#reg_username')
                .type(username);
        }

        if (email != '') {
            cy.get('#reg_email')
                .type(email);
        }

        if (password != '') {
            cy.get('#reg_password')
                .type(password);
        }

        cy.get('.woocommerce-form-register__submit')
            .click();
    }
}

export const myAccountPO = new MyAccount;