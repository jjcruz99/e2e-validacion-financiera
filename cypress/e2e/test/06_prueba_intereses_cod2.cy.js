import {menuNavTC} from "../pages/menuNavTC";
import {interesesPage} from "../pages/interesesPages";
import {historicoPage} from "../pages/historicoPages";
import {movimientosPage} from "../pages/movimientosPages"
import { facturacionesPage } from "../pages/facturacionesPages";
import { calculadora } from "../../support/utils/calculadoraDeIntereses";

describe("Validacion de los intereses codigo 2 sobre los diferidos", ()=>{

    beforeEach( () => {
        cy.visit(Cypress.env('baseUrl'));
    });

    it('Validar los intereses sobre los diferidos para una tarjeta en mora', () => {

        cy.iniciarSesion(Cypress.env('user_7') , Cypress.env('pass_7'));

        cy.ingresarATC();

        const BIN = Cypress.env('tarjeta_visa3').slice(0,8);
        const tarjeta = Cypress.env('tarjeta_visa3').slice(8);

        cy.buscarPorProducto(BIN,tarjeta);

        menuNavTC.irVentanaIntereses();
        interesesPage.buscarCodigoDeInteres(2);
        cy.then( () => {
            cy.wrap(interesesPage.datosEncontrados).as('intereses');
        });

        //Todo obtener los diferidos en una facturacion especifica
        cy.get('@intereses').then( (interes) => {
            cy.log(`Valor de los intereses encontrados : ${interes.valor} en ${interes.fecha}`);

            menuNavTC.irVentanaFacturaciones();
            facturacionesPage.limpiartdatos();
            facturacionesPage.buscarFacturacion(calculadora.restarUnMesFecha(interes.fecha));
        });

        cy.then( () =>{
            cy.wrap(facturacionesPage.dataEncontrada).as('diferidos')
        });

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

        //Todo validar los diferidos segun las transacciones
        
        cy.get('@diferidos').then( (diferidos) => {

            const transacciones = validacionTransacciones ? '@movimientos' : '@historicos';

                cy.get(transacciones).then((totalTransacciones) => {

                    calculadora.validarDiferidos(totalTransacciones);
                    const valorWebVentas = calculadora.limpiarDatosNumericos( diferidos[0].valorDiferido );
                    const valorWebAvances = calculadora.limpiarDatosNumericos( diferidos[1].valorDiferido );

                    expect(valorWebVentas, `Web: ${valorWebVentas} | Calculado: ${calculadora.totalDifVentas}`)
                    .to.be.closeTo(calculadora.totalDifVentas, 0.01);

                    expect(valorWebAvances, `Web: ${valorWebAvances} | Calculado: ${calculadora.totalDifAvances}`)
                    .to.be.closeTo(calculadora.totalDifAvances, 0.01);

                    cy.get('@intereses').then((intereses) =>{

                        cy.addTestContext('Valor de los intereses codigo 2: ' + intereses.valor);

                        calculadora.reestructurarTransacciones(totalTransacciones, diferidos[0].fechaFacturacion, '2025/02/15');

                        cy.log(calculadora.transaccionesModificadas.length);
                        calculadora.ecuacionGeneral(calculadora.transaccionesModificadas);
                        const cod2 = calculadora.limpiarDatosNumericos(intereses.valor);
                        const interesesCalculados = calculadora.totalIntreses;
                        let diferencia = interesesCalculados - cod2;

                        cy.log(`Intereses calculados ${interesesCalculados}`);

                        cy.addTestContext(`Facturacion: ${intereses.fecha} | Valor Web: ${intereses.valor} | Calculado: ${interesesCalculados} | Dif: ${diferencia}`);

                        expect(interesesCalculados, `Comparación Final (Web: ${cod2} | Calculado: ${interesesCalculados} | Dif: ${diferencia.toFixed(2)})`)
                        .to.be.closeTo(cod2, 0.02);

                    });
                });

        }); 
        
        cy.salirDeTC();

        cy.once('test:after:run', (test) => {
            cy.addTestContext( { test }, `screenshots/${Cypress.spec.name}/codigos_intereses/Codigo_2.png`);
        });

    });


});