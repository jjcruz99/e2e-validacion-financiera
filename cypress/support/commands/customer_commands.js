
//Buscar un cliente
Cypress.Commands.add('buscarProductosPorId', (identificacion) => {

    
    cy.contains('h3', 'MODULO DE TARJETA CREDITO').as('header');


    // FUERZA BRUTA DE ARQUITECTURA: 
    cy.get('@header')
        .next('div.ui-panelmenu-content')
        .invoke('removeClass', 'ui-helper-hidden') 
        .invoke('attr', 'style', 'display: block') 
        .should('be.visible')
        .as('panelMenu');

    cy.get('@panelMenu')
        .contains('span', 'MODULO DE CONSULTAS')
        .should('be.visible')
        .click();

    cy.get('@panelMenu')
        .contains('20. CONSULTA POR IDENTIFICACION')
        .click();    

    cy.get('input[id="crmaeConsultaIdentificacion:idIdentificacion"]')
        .clear()
        .type(identificacion);

    cy.get('span[class="ui-button-text ui-c"]')
        .contains('Consultar')
        .should('be.visible')
        .click();

    cy.get('div[id="crmaeConsultaIdentificacion:j_idt58"]', { timeout: 5000 }).should('be.visible');
});


Cypress.Commands.add('buscarPorProducto', (BIN,producto) => {

    cy.contains('h3','MODULO DE TARJETA CREDITO')
        .should('be.visible')
        .click()
        .as('moduloPrincipal'); 

    //Quitar clase que oculta los submenus
    cy.get('@moduloPrincipal')
        .next('div.ui-panelmenu-content')
        .invoke('removeClass', 'ui-helper-hidden')
        .invoke('attr', 'style', 'display: block') 
        .should('be.visible')
        .as('subMenu');

    cy.get('@subMenu',{ timeout: 10000 })
        .contains('span', 'MODULO DE CONSULTAS')
        .should('be.visible')
        .click();

        //cy.wait(1000);

    cy.get('@subMenu',{ timeout : 5000})
        .contains('10. CONSULTA POR PRODUCTO Y CREDITO')
        .should('be.visible')
        .click();

        //cy.wait(1000);

    cy.get('label[id="crmaeConsultaBinTarjeta:idBin_label"]', { timeout : 5000})
        .contains('Seleccione...')
        .should('be.visible')
        .click();

    cy.get('tr.ui-selectonemenu-item')
        .contains('td',BIN)
        .should('be.visible')
        .click();

    cy.get('input[id="crmaeConsultaBinTarjeta:idTarjeta"]').type(producto);

    cy.get('button[id="crmaeConsultaBinTarjeta:search"]', { timeout : 5000})
        .contains('span','Consultar')
        .click();

    cy.contains('General', {timeout : 10000 }).should('be.visible');

});

