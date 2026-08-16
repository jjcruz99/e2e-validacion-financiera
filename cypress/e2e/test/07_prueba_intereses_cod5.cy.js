import { menuNavTC } from "../pages/menuNavTC";
import { interesesPage } from "../pages/interesesPages";
import { movimientosPage } from "../pages/movimientosPages";
import { facturacionesPage } from "../pages/facturacionesPages";
import { calculadora } from "../../support/utils/calculadoraDeIntereses";

describe('Validacion de los intereses sobre los diferidos pendientes', () =>{

    beforeEach( ()=>{
        cy.visit(Cypress.env("baseUrl"));
    });

    it("Calcular los intereses codigo 5 sobre los saldos pendientes no diferidos", ()=>{

        cy.iniciarSesion(Cypress.env("user_7"), Cypress.env("pass_7"));

        cy.ingresarATC();

        cy.buscarPorProducto(Cypress.env("tarjeta_visa3").slice(0,8), Cypress.env("tarjeta_visa3").slice(8));

        //Todo Obtener los intereses
        menuNavTC.irVentanaIntereses();
        interesesPage.buscarCodigoDeInteres(5);
        cy.then( () => {
            cy.wrap(interesesPage.datosEncontrados).as('intereses');
        });

        //Todo obtener los diferidos facturacion anterior
        cy.get('@intereses').then((intereses) => {
            menuNavTC.irVentanaFacturaciones();
            facturacionesPage.limpiartdatos()
            facturacionesPage.buscarFacturacion(calculadora.restarUnMesFecha(intereses.fecha));
        });
        cy.then( () =>{
            cy.wrap(facturacionesPage.dataEncontrada).as('diferidos');
        });

        //Todo Obtener los datos de las transacciones
        cy.obtenerTransacciones();
        cy.get('@transaccionesFinales').then((transacciones) => {
             expect(transacciones.length).to.be.greaterThan(0);             
        });

        cy.salirDeTC();
    })


})