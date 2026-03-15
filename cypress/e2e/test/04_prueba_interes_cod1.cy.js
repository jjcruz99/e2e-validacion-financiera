
import { menuNavTC } from "../pages/menuNavTC";
import { interesesPage } from "../pages/interesesPages";   
import { historicoPage } from "../pages/historicoPages"; 
import { movimientosPages } from "../pages/movimientosPages";
import { calculadora } from '../../support/utils/calculadoraDeIntereses';

describe('Validar calculo de los intereses sobre avances codigo 1 ', () =>{

    beforeEach( () => {
        cy.visit(Cypress.env('baseUrl'));;
    })

    it('Validar los intereses Cod1 para una tarjeta con edad de mora alta', () =>{

        cy.iniciarSesion(Cypress.env('user_7'), Cypress.env('pass_7'));

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

        //* Validar las transacciones en los  movimientos si no las encontro en los historicos
        let validacionMovimientos = false;
        cy.get('@datosTransacciones').then( (historicoTransacciones) => {
            if(historicoTransacciones.length === 0){
                menuNavTC.irVentanaMovimientos();
                cy.get('@interes').then((interes) => {
                    validacionMovimientos = true;
                    movimientosPages.limpiarMovimientos();
                    movimientosPages.obtenerTransaccionesPorFecha('97',interes.fecha);
                });
            }
        });
        cy.then( () => {
            cy.wrap(movimientosPages.datosEncontrados).as('movimientos');
        });


        //todo Validacion de los calculos y el valor web
        cy.get('@interes').then((interes) => {

            const valorWeb = calculadora.limpiarDatosNumericos(interes.valor);
            
            const transaccionesObtenidas = validacionMovimientos ? '@movimientos' : '@datosTransacciones';

            cy.get(transaccionesObtenidas).then((transacciones) => {
                
                calculadora.ecuacionGeneral(transacciones);
                   
                const valorCalculado = calculadora.totalIntreses;
                const diferencia = Math.abs(valorCalculado - valorWeb).toFixed(2);

                cy.addTestContext(`Facturacion: ${interes.fecha} | Valor Web: ${valorWeb} | Calculado: ${valorCalculado} | Dif: ${diferencia}`);

                cy.log('--- 📊 REPORTE DE VALIDACIÓN ---');
                cy.log(`✔ Valor en Web: ${valorWeb}`);
                cy.log(`✔ Valor Calculado: ${valorCalculado}`);
                
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


    it('Validar los intereses Cod1 para una tarjeta', () =>{

        cy.iniciarSesion(Cypress.env("user_7"),Cypress.env("pass_7"));

        cy.ingresarATC();

        const BIN = Cypress.env('tarjeta_visa2').slice(0,8);
        const tarjeta = Cypress.env('tarjeta_visa2').slice(8);

        cy.buscarPorProducto(BIN,tarjeta);

        //todo Buscar el valor del interes cod1 y guardarlo
        menuNavTC.irVentanaIntereses();
        interesesPage.buscarCodigoDeInteres(1);
        cy.then( () => {
            cy.wrap(interesesPage.datosEncontrados).as('interes_web');
        });

        //todo Buscar los avances que generaron los intereses
        menuNavTC.irVentanaHistoricos();

        //* validar movimientos en los histotricos 
        cy.get('@interes_web').then((interes) => {
            historicoPage.limpiarHistorial();
            historicoPage.buscarTransaccionPorFecha('97',interes.fecha);
        });
        cy.then( ()=> {
            cy.wrap(historicoPage.transaccionesEncontradas).as('transaccionesHistoricas');
        });

        //* Validar las transacciones en los  movimientos si no las encontro en los historicos
        let validacionMovimientos = false;
        cy.get('@transaccionesHistoricas').then( (historicoTransacciones) => {
            if(historicoTransacciones.length === 0){
                menuNavTC.irVentanaMovimientos();
                cy.get('@interes_web').then((interes) => {
                    validacionMovimientos = true;
                    movimientosPages.limpiarMovimientos();
                    movimientosPages.obtenerTransaccionesPorFecha('97',interes.fecha);
                });
            }
        });
        cy.then( () => {
            cy.wrap(movimientosPages.datosEncontrados).as('movimientos')
        });

        //Todo Validar los intereses web vs los calculos
        cy.get('@interes_web').then((interes) => {

            const valorWeb = calculadora.limpiarDatosNumericos(interes.valor);
            
            const aliasUsar = validacionMovimientos ? '@movimientos' : '@transaccionesHistoricas';

            cy.get(aliasUsar).then((transacciones) => {
                
                calculadora.ecuacionGeneral(transacciones);
                   
                const valorCalculado = calculadora.totalIntreses;
                const diferencia = Math.abs(valorCalculado - valorWeb).toFixed(2);

                cy.addTestContext(`Facturacion: ${interes.fecha} | Valor Web: ${valorWeb} | Calculado: ${valorCalculado} | Dif: ${diferencia}`);

                cy.log('--- 📊 REPORTE DE VALIDACIÓN ---');
                cy.log(`✔ Valor en Web: ${valorWeb}`);
                cy.log(`✔ Valor Calculado: ${valorCalculado}`);
                
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