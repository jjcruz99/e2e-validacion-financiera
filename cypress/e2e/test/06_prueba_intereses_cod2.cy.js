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

        movimientosPage.obtenerTransacciones(['97','96']);
        
        cy.wait(1000);
        cy.salirDeTC();

    });


});