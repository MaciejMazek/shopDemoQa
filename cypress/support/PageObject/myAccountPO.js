import userData from "../../fixtures/userData.json"

class MyAccount {

    data = userData;

    registerAccount({ username = "defaultUsername1", email = "default1@email.com", password = "Password123!password!@#1", finishRegistration = true }) {

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

    logIntoAccount({ username = this.data.username, email = this.data.email, password = this.data.password,
        useEmail = false, finishLogin = true, isRememberMe = false }) {

        if (useEmail) {
            cy.get("#username").type(email)
        } else {
            cy.get("#username").type(username)
        }

        cy.get('#password')
            .type(password);

        if (isRememberMe) {
            cy.get('#rememberme')
                .check();
        }

        if (finishLogin) {
            cy.get('#customer_login')
                .find('.woocommerce-form-login__submit')
                .click();
        }
    }
}

export const myAccountPO = new MyAccount;