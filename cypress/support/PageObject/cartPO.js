class CartPO {
    addToCart(productName, color, size, quantity) {
        cy.contains(productName)
            .click({ force: true });

        let colorSelector;
        let sizeSelector;

        cy.get('body')
            .then((body) => {
                if (body.find('#color').length) {
                    return colorSelector = '#color';
                }
                return colorSelector = '#pa_color'
            })
            .then(() => {
                cy.get(colorSelector)
                    .select(color);
            })

        cy.get('body')
            .then((body) => {
                if (body.find('#size').length) {
                    return sizeSelector = '#size';
                }
                return sizeSelector = '#pa_size'
            })
            .then(() => {
                cy.get(sizeSelector)
                    .select(size);
            })


        if (quantity > 1) {
            cy.get('.noo-quantity-attr')
                .find('input')
                .clear()
                .type(quantity);
        }

        cy.get('.single_add_to_cart_button')
            .click();
    };
}

export const cartPO = new CartPO;