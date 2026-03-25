
class MovimientosPages{

    constructor() {
        this.selectores = {
            tabla : 'tbody[id*="idTablaMovimiento_data"]',
            paginador:'idTablaMovimiento'      
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

            cy.avanzarRegistrostabla(this.selectores.paginador).then((validacionAvanzar) => {
                if(validacionAvanzar){
                    this.obtenerTransaccionPorFecha(transaccion,fecha);
                } else {
                    cy.log(`🚫 No existen mas registros para avanzar`);
                }
            });
        });
    }
    

    obtenerTransacciones(){
        cy.get(this.selectores.tabla).then( ($tbody) => {
            const filas = $tbody.find('tr');
            
            filas.each((i,tr) => {

                const fila = Cypress.$(tr).find('td');

                const transaccion = fila.eq(1).text().trim();

                if(transaccion === '96' || transaccion === '97') {
                    this.datosEncontrados.push({
                        fila : i,
                        fecha1 : fila.eq(0).text().trim(),
                        fecha2 : fila.eq(3).text().trim(),
                        codigoTransaccion : transaccion,
                        valorTransaccion : fila.eq(5).text().trim(),
                        tasaInteres : fila.eq(6).text().trim(),
                        cuotas : fila.eq(7).text().trim()
                     });
                }
            });

            cy.avanzarRegistrostabla(this.selectores.paginador).then((validacionAvanzar) => {
                if(validacionAvanzar){
                    this.obtenerTransacciones();
                } else {
                    cy.log(`🚫 No existen mas registros para avanzar`);
                }
            });
        });
    }
 
}


export const movimientosPage = new MovimientosPages();