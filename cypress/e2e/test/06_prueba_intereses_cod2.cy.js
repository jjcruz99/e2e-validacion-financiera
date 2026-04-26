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

            const transacciones = validacionTransacciones ? '@movimientos' : '@historicos'

            calculadora.validarDiferidos(diferidos,transacciones);

        });
        
        //cy.wait(1000);
        cy.salirDeTC();

    });


});