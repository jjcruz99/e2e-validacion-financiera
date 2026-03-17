
describe('Validar login', () => {

    beforeEach( () => {
        cy.visit(Cypress.env('baseUrl'));
    });

    it('Realizar login exitosamente', () => {
      
        cy.iniciarSesion(Cypress.env('user_12'),Cypress.env('pass_12'));

        cy.contains('TARJETA CRÉDITO')
            .should('be.visible');
        
        cy.screenshot('login/modulo_principal',{ capture:'fullPage'});
        cy.once('test:after:run', (test) => {
        cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/login/modulo_tc.png`);
        });   

        cy.get('div[id="d-exit"]')
            .should('be.visible')
            .contains('SALIR')
            .click();
    });

    it('Validar todos los campos vacios', () => {
        cy.get('input[name="form-logeo:login-username"]').clear();
        cy.get('input[name="form-logeo:login-password"]').clear();
        cy.get('span.ui-button-text.ui-c').contains('Ingresar').click(); 

        //Todo Validar que existan exactamente DOS alertas
        cy.get('.ui-growl-item-container', { timeout: 10000 })//contenedor padre
            .should('have.length', 2) 
            .and('be.visible'); 

        cy.get('.ui-growl-item-container').eq(0)//contendor hijo
            .should('contain.text', 'Nombre de Usuario');

        cy.get('.ui-growl-item-container').eq(1)//contendor hijo
            .should('contain.text', 'Contraseña');

        cy.wait(1500);
        cy.screenshot('login/campos_vacios',{ capture:'fullPage'});    
        cy.once('test:after:run', (test) => {
        cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/login/campos_vacios.png`);
        });   

    });

    it('Validar usuario invalido', () => {
        cy.get('input[name="form-logeo:login-username"]').clear().type(Cypress.env('user_12').slice(0,3));
        cy.get('input[name="form-logeo:login-password"]').clear().type(Cypress.env('pass_12'));
        cy.get('span.ui-button-text.ui-c').contains('Ingresar').click(); 

        
        cy.get('#growl_container', { timeout: 10000 }) 
            .should('have.class', 'ui-growl ui-widget') 
            .and('be.visible'); 

        cy.get('.ui-growl-message')
            .should('contain.text', 'Usuario no encontrado o clave errada');

        cy.wait(1500);
        cy.screenshot('login/usuario_invalido',{ capture:'fullPage'});    
        cy.once('test:after:run', (test) => {
        cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/login/usuario_invalido.png`);
        });   

    });


    it('Validar contrasenna invalida', () => {
        cy.get('input[name="form-logeo:login-username"]').clear().type(Cypress.env('user_12'));
        cy.get('input[name="form-logeo:login-password"]').clear().type(Cypress.env('pass_12').slice(1));
        cy.get('span.ui-button-text.ui-c').contains('Ingresar').click(); 
       
        cy.get('div[id="growl_container"]', { timeout: 10000 }) 
            .should('have.class', 'ui-growl ui-widget') 
            .and('be.visible'); 

        cy.get('div[class="ui-growl-message"')
            .should('contain.text', 'Usuario no encontrado o clave errada');

        cy.wait(1500);
        cy.screenshot('login/usuario_invalido',{ capture:'fullPage'});    
        cy.once('test:after:run', (test) => {
        cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/login/usuario_invalido.png`);
        });   
    });

    it('Realizar login exitosamente e ingreso al modulo de tarjeta de credito', () => {
      
        cy.iniciarSesion(Cypress.env('user_12'),Cypress.env('pass_12'));

        //Validar que TC se visible
        cy.get('div[onclick="openTC();"]').should('be.visible');
        
        cy.ingresarATC();

        cy.screenshot('modulo_tc',{ capture:'fullPage'});

        cy.once('test:after:run', (test) => {
        cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/modulo_tc.png`);
        });

        cy.salirDeTC();

    });


});