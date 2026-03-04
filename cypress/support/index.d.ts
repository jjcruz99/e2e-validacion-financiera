
import './commands/auth_commands';
import './commands/customer_commands';
import './commands/table_commands';

declare global {
  namespace Cypress {
    interface Chainable {


      /**
       * Inicia sesion y muestra el menu principal.
       * @example cy.iniciarSesion('user2','password123')
       */
      iniciarSesion(user: string,password: string):Chainable<Element>;

        /**
       * Ingresa al modulo de compensacion en la mismma ventana.
       * @example cy.ingresarATC()
       */
      ingresarATC():Chainable<Element>;

        /**
       * Salir del modulo de tarjeta de credito.
       * @example salirDeTC()
       */
      salirDeTC():Chainable<Element>;

        /**
       * Buscar los productos asociados a un numero de identificacion
       * @example buscarProductosPorId('120000589')
       */
      buscarProductosPorId(identificacion):Chainable<Element>;

        /**
       * Busca un BIN en la tabla de productos "despues de realizar la busqueda por CC" y hace clic en el botón Visualizar.
       * @example cy.visualizarProductoPorBIN('44818500')
       */
      visualizarProductoPorBIN(bin: string): Chainable<Element>;

        /**
       * Hace clic en el boton siguiente de las tablas intreses,historicos.
       * @example cy.avanzarRegistrostabla();
       */
      avanzarRegistrostabla(): Chainable<Element>;     

        /**
       * Busca la tarjeta por BIN y numero de la tarjeta en claro.
       * @example cy.buscarPorProducto('44818500','50128822')
       */
      buscarPorProducto(bin: string,producto:string): Chainable<Element>;

      /**
       * Abre un módulo del menú de PrimeFaces manejando el estado oculto.
       */
      clickMenuSeguro(texto: string): Chainable<Element>;
    }
  }
}