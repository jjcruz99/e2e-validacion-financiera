
Cypress.Commands.add("iniciarSesion", (user,password) =>{
        cy.get('input[name="form-logeo:login-username"]').type(user);
        cy.get('input[name="form-logeo:login-password"]').clear().type(password);
        cy.get('span[class="ui-button-text ui-c"]').click();
        cy.contains('TARJETA CRÉDITO')
                .should('be.visible');
});

Cypress.Commands.add("ingresarATC", () => {

        // Evitar nueva pestaña: convierte window.open en navegación en la misma
        cy.window().then(win => {
        cy.stub(win, 'open')
            .as('winOpen')
            .callsFake((url) => { win.location.assign(url) });
        });

        //Ingresar a TC
        cy.get('div[onclick="openTC();"]').click();

        // Valida que estoy a la página esperada
        cy.location('pathname').should('include', '/AdminWeb/templates/indexBody.jsf');
        // Verifica que se intentó abrir
        cy.get('@winOpen').should('have.been.called');
});

Cypress.Commands.add("salirDeTC", () =>{
                //Salir de la sesion
        cy.get('#j_idt28 > div.ui-inputswitch-on.ui-state-active > span')
                .click();
});
