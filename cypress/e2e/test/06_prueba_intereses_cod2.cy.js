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

        cy.get('@intereses').then( (interes) => {
            cy.log(`Valor de los intereses encontrados : ${interes.valor} en ${interes.fecha}`);

            menuNavTC.irVentanaFacturaciones();
            facturacionesPage.limpiartdatos();
            facturacionesPage.buscarFacturacion(calculadora.restarUnMesFecha(interes.fecha));
        });

        menuNavTC.irVentanaMovimientos();
        //cy.wait(2000);
        movimientosPage.limpiarMovimientos();
        movimientosPage.obtenerTransacciones();

        cy.then( () => {
            cy.wrap(movimientosPage.datosEncontrados).as('movimientos');
        });

        //* Validar las transacciones en los  historicos  si no las encontro en los movimientos
        let validacionHistoricos = false;
        cy.get('@movimientos').then( (movimientos) => {
            if(movimientos.length === 0){
                menuNavTC.irVentanaHistoricos();
                validacionHistoricos = true;
                historicoPage.limpiarHistorial();
                //cy.wait(2000);
                historicoPage.obtenerTransacciones();    
            }
        });
        cy.then( () => {
            cy.wrap(historicoPage.transaccionesEncontradas).as('historicos');
        });

        cy.get('@historicos').then( (historicos) => {
            cy.log(`Cantidad de datos encontrados ${historicos.length}`);
        });
        
        //cy.wait(1000);
        cy.salirDeTC();

    });


});