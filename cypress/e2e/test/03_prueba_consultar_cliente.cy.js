/// <reference types="cypress" />
describe("Buscar una tarjeta especifica", ()=>{

    beforeEach ( ()=>{
        cy.visit(Cypress.env('baseUrl'));
    });

    it("Consultar datos de una tarjeta por identificación", ()=>{

        cy.iniciarSesion(Cypress.env('user_12'),Cypress.env('pass_12'));
        
        //Todo Validar que el modulo de trajeta de credito se visible
        cy.get('div[onclick="openTC();"]').should('be.visible');
        
        cy.ingresarATC();

        cy.buscarProductosPorId(Cypress.env('identificacion1'));

        cy.visualizarProductoPorBIN("44818600");
        
        cy.salirDeTC();

    });

    it("Consultar datos de una tarjeta por numero de TC", ()=>{

        cy.iniciarSesion(Cypress.env('user_7'),Cypress.env('pass_7'));
        cy.get('div[onclick="openTC();"]').should('be.visible');
        
        cy.ingresarATC();

        const bin =  Cypress.env('tarjeta_visa1').slice(0,8);
        const producto = Cypress.env('tarjeta_visa1').slice(8);
        cy.log(`Datos para la busqueda : ${bin}  y ${producto}`);
        cy.buscarPorProducto(bin,producto);

        cy.salirDeTC();
    });

});