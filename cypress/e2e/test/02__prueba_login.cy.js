
describe('Validar login', () => {

    beforeEach( () => {
        cy.visit(Cypress.env('baseUrl'));
    });

    it('Realizar login exitosamente e ingreso al modulo de compensacion', () => {

        
        cy.iniciarSesion(Cypress.env('user_12'),Cypress.env('pass_12'));


        //Validar que TC se visible
        cy.get('div[onclick="openTC();"]').should('be.visible');
        
        cy.ingresarATC();

        cy.salirDeTC();

    });

});