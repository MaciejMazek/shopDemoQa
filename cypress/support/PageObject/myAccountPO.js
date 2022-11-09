class MyAccount {

    registerAccount({ username = "defaultUsername", email = "default@email.com", password = "Password123!password!@#1", finishRegistration = true }) {


        cy.get('#reg_username')
            .type(username);

        cy.get('#reg_email')
            .type(email);

        cy.get('#reg_password')
            .type(password);

        if (finishRegistration) {
            cy.get('.woocommerce-form-register__submit')
                .click();
        }
    }
}

export const myAccountPO = new MyAccount;