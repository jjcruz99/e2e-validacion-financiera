
import { menuNavTC } from "../pages/menuNavTC";
import { interesesPage } from "../pages/interesesPages";   
import { historicoPage } from "../pages/historicoPages"; 
import { calculadora } from '../../support/utils/calculadoraDeIntereses';

describe('Validar calculo de los intereses sobre avances codigo 1 ', () =>{

    beforeEach( () => {
        cy.visit(Cypress.env('baseUrl'));;
    })

    it('Validar los intereses Cod1 para una tarjeta con edad de mora alta', () =>{

        cy.iniciarSesion(Cypress.env('user_admin'), Cypress.env('pass_admin'));

        cy.ingresarATC();

        const BIN = Cypress.env('tarjeta_visa1').slice(0,8);
        const tarjeta = Cypress.env('tarjeta_visa1').slice(8);

        cy.buscarPorProducto(BIN,tarjeta);


        //todo Obtener el valor del codigo de interes y guardarlo
        menuNavTC.irVentanaIntereses();
        interesesPage.buscarCodigoDeInteres(1);
        
        cy.then(() => {
            cy.wrap(interesesPage.datosEncontrados).as('interes');
        });


        //Todo Obtener los datos de los avances y guardarlos
        menuNavTC.irVentanaHistoricos();
        cy.get('@interes').then((interes) => {
            historicoPage.buscarTransaccionPorFecha('97', interes.fecha);
        });        
        cy.then( () => {
            cy.wrap(historicoPage.transaccionesEncontradas).as('datosTransacciones');
        });


        //todo Validacion de los calculos y el valor web
        cy.get('@interes').then((interes) => {

        cy.addTestContext('Valor de los intereses sobre Avances: ' + interes.valor);
             
            cy.get('@datosTransacciones').then((transacciones) => {

                calculadora.ecuacionGeneral(transacciones);
                const valorCalculado = calculadora.totalIntreses;
                const valorWeb = calculadora.limpiarDatosNumericos(interes.valor);
                const diferencia = Math.abs(valorCalculado - valorWeb).toFixed(4);

                cy.addTestContext(`Valor de los calculos intereses sobre Avances: ${valorCalculado}`);

                    cy.log('--- 📊 REPORTE DE VALIDACIÓN ---');
                    cy.log(`✔ Valor en Web: ${valorWeb}`);
                    cy.log(`✔ Valor Calculado: ${valorCalculado}`);
                    cy.log(`✔ Diferencia: ${diferencia}`);
        
                    expect(valorCalculado, 
                        `Comparación Final (Web: ${valorWeb} | Calculado: ${valorCalculado} | Dif: ${diferencia})`
                    ).to.be.closeTo(valorWeb, 0.01);
                
            });
        });


        cy.salirDeTC();

        cy.once('test:after:run', (test) => {
            cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/codigos_intereses/Codigo_1.png`);
        });

        });

});