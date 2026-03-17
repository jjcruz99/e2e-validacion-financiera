import {menuNavTC} from "../pages/menuNavTC";
import {interesesPage} from "../pages/interesesPages";
import {historicoPage} from "../pages/historicoPages";
import { calculadora } from "../../support/utils/calculadoraDeIntereses";

describe('Validacion de intereses provisionales codigo 4', () => {

    
    beforeEach( () => {
        cy.visit(Cypress.env('baseUrl'));
    });

    it('Validar los intereses codigo 4 para una tarjeta con edad de mora alta', () =>{

        cy.iniciarSesion(Cypress.env('user_7'), Cypress.env('pass_7'));

        cy.ingresarATC();

        const BIN = Cypress.env('tarjeta_visa1').slice(0,8);
        const tarjeta = Cypress.env('tarjeta_visa1').slice(8);

        cy.buscarPorProducto(BIN,tarjeta);

        //todo Buscar y guardar el valor del intereses
        menuNavTC.irVentanaIntereses();
        interesesPage.buscarCodigoDeInteres(4);
        cy.then( () => {
            cy.wrap(interesesPage.datosEncontrados).as('intereses')
        });

        //todo Buscar y guardar las ventas que lo generaron
        menuNavTC.irVentanaHistoricos()
        cy.get('@intereses').then((intereses) => {
            historicoPage.buscarTransaccionPorFecha('96',calculadora.restarUnMesFecha(intereses.fecha));
        });
        cy.then( () => {
            cy.wrap(historicoPage.transaccionesEncontradas).as('transacciones');
        });

        //todo Validar valor Web vs calculos
        cy.get('@intereses').then( (intereses) => {

        cy.addTestContext('Valor de los intereses provisionales: ' + intereses.valor);

            cy.get('@transacciones').then ( (transacciones) => {

                calculadora.ecuacionGeneral(transacciones);

                let valorCalculado = calculadora.totalIntreses;
                let valorWeb = calculadora.limpiarDatosNumericos(intereses.valor);
                let diferencia = valorCalculado - valorWeb;

                cy.addTestContext(`Facturacion: ${intereses.fecha} | Valor Web: ${valorWeb} | Calculado: ${valorCalculado} | Dif: ${diferencia}`);

                    cy.log('--- 🧮 VALIDACIÓN COD4 ---');
                    cy.log(`✔ Valor web: ${valorWeb}`);
                    cy.log(`✔ Valor calculado: ${valorCalculado}`);
                    cy.log(`✔ Diferencia: ${diferencia}`);

                expect(valorCalculado, 
                `Comparación Final (Web: ${valorWeb} | Calculado: ${valorCalculado} | Dif: ${diferencia})`
                ).to.be.closeTo(valorWeb, 0.01);

            });
        });

        cy.salirDeTC();

        cy.once('test:after:run', (test) => {
            cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/codigos_intereses/Codigo_4.png`);
        });

    });

});