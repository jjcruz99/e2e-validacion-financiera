
class MovimientosPages{

    constructor() {
        this.selectores = {
            tabla : 'tbody[id*="idTablaMovimiento_data"]'      
        };
        this.datosEncontrados = [];
    }

    limpiarMovimientos(){
        this.datosEncontrados = [];
        cy.log('🧹 Movimientos de transacciones reiniciado');
    }

    obtenerTransaccionPorFecha(transaccion,fecha){
        cy.get(this.selectores.tabla).then( ($tbody) =>{
            
            const filas = $tbody.find('tr');
            const fechaAnioMes = fecha.slice(0,7);

            filas.each( (i,tr)=>{
                const fila = Cypress.$(tr).find('td');
                const fechaActual = fila.eq(0).text().trim().slice(0,7);
                const transaccionActual = fila.eq(1).text().trim();

                    if(fechaActual == fechaAnioMes && transaccionActual == transaccion){

                        this.datosEncontrados.push({
                            fila : i,
                            fecha1 : fila.eq(0).text().trim(),
                            fecha2 : fila.eq(3).text().trim(),
                            codigoTransaccion : transaccionActual,
                            valorTransaccion : fila.eq(5).text().trim(),
                            tasaInteres : fila.eq(6).text().trim(),
                            cuotas : fila.eq(7).text().trim()
                        });
                    }
            });

            cy.avanzarRegistrostabla().then( (validacionAvanzar) => {

                if(validacionAvanzar){
                    this.obtenerTransaccionesPorFecha(transaccion,fecha);
                }
                else{
                    cy.log(`🚫 No existen mas registros para avanzar`);
                }
            });
        });

    }

    obtenerTransacciones(transaccionesABuscar){
        cy.log(transaccionesABuscar)
    }

}

export const movimientosPage = new MovimientosPages();