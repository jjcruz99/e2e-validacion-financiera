Cypress.Commands.add('visualizarProductoPorBIN', (bin) => {
  cy.get('tr.ui-widget-content')
    .contains('td', bin)
    .closest('tr') // Una alternativa a .parent() más segura
    .find('button[title="Visualizar"]')
    .click();
});

Cypress.Commands.add('avanzarRegistrostabla', ()  => {

  const  paginador = {
      nextBtn: 'a[aria-label="Next Page"]',
      nextIcon: 'span',
      nextCon: 'N'
  }

  return cy.get(paginador.nextBtn).then(($btn) => {
    
    if (!$btn.hasClass('ui-state-disabled')) {
        // acciones asíncronas
        cy.wrap($btn)
          .contains(paginador.nextIcon,paginador.nextCon)
          .click();
          
        cy.log('Avanzamos a la siguiente página');

        
        return cy.wrap(true); 
    } else {
        cy.log('El botón está desactivado, fin de la tabla');

        return cy.wrap(false); 
    }
  });

});


 