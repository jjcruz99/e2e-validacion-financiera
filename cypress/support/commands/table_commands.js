Cypress.Commands.add('visualizarProductoPorBIN', (bin) => {
  cy.get('tr.ui-widget-content')
    .contains('td', bin)
    .closest('tr') 
    .find('button[title="Visualizar"]')
    .click();
});


Cypress.Commands.add('avanzarRegistrostabla', (idTabla) => {

    const paginador = {
        // Ahora inyectamos el ID específico en el selector
        contenedorPaginador : `div[id*="${idTabla}_paginator_bottom"]`,
        btnSiguiente : 'a.ui-paginator-next'
    };
    
    return cy.get(paginador.contenedorPaginador).find(paginador.btnSiguiente).then(($btn) => {
      
        if ($btn.hasClass('ui-state-disabled')) {
            cy.log('🚫 Se alcanzaron los ultimos registros');
            return cy.wrap(false);   
        } 
        else {    
            cy.wrap($btn).click({ force: true });            
            cy.log('➡️ Avanzando a la siguiente página...');
            cy.wait(1000); 
            return cy.wrap(true);    
        }
    });
});


 