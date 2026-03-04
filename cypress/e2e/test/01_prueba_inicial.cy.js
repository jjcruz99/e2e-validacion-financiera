describe("Prueba de configuracion", () =>{

    it('Visitar pagina de inicio', () => {
        cy.visit(Cypress.env('baseUrl'));

        // verificar
        cy.contains('div','CENTRO DE ACCESO').should('be.visible');
        
    });
});