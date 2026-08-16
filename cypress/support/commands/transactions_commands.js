import {menuNavTC} from "../../e2e/pages/menuNavTC";
import {historicoPage} from  "../../e2e/pages/historicoPages";
import {movimientosPage} from "../../e2e/pages/movimientosPages";

Cypress.Commands.add('obtenerTransacciones', () => {

    cy.log('Estoy desde el commands obtener transacciones');

    //Todo buscar las transacciones
    menuNavTC.irVentanaMovimientos();
    movimientosPage.limpiarMovimientos();
    movimientosPage.obtenerTransacciones();

    cy.then( () => {
        cy.wrap(movimientosPage.datosEncontrados).as('movimientos');
    });

    //Todo Validar las transacciones en los  historicos  si no las encontro en los movimientos
    let validacionTransacciones = true;
    cy.get('@movimientos').then( (movimientos) => {
        if(movimientos.length === 0){
            menuNavTC.irVentanaHistoricos();
            validacionTransacciones = false;
            historicoPage.limpiarHistorial();
            historicoPage.obtenerTransacciones();    
        }
    });
    cy.then( () => {
        cy.wrap(historicoPage.transaccionesEncontradas).as('historicos');
    });

    cy.get('@movimientos').then( (movimientos) => { 

        cy.get('@historicos').then( (historicos) => { 

            const transacciones = validacionTransacciones ? movimientos : historicos;

            
            cy.wrap(transacciones).then((totalTransacciones) => { 

                cy.log(`💡 Total de transacciones encontradas: ${totalTransacciones.length}`);

                 totalTransacciones.forEach((transaccion, index) => {
                     cy.log(`Transacción ${index + 1}: Código ${transaccion.codigoTransaccion} - Valor ${transaccion.valorTransaccion}`);
                });

                cy.wrap(totalTransacciones).as('transaccionesFinales');
            });
        
        });

    });



})