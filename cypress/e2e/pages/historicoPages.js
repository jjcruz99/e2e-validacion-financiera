
class HistoricoPages{

    constructor() {
        this.selectores = {
            tabla : 'tbody[id*="CRMOH:idTablaHistorico_data"]'
        };
        this.transaccionesEncontradas = [];

    }

    limpiarHistorial() {
        this.transaccionesEncontradas = [];
        cy.log('🧹 Historial de transacciones reiniciado');
    }
    

    buscarTransaccionPorFecha(transaccion,fecha){
        
        cy.get(this.selectores.tabla).then( ($tbody) => {

            const filas = $tbody.find('tr');
            const anioMes = fecha.slice(0,7);

            filas.each( (i,tr) => {

                const columnaDeLaFila = Cypress.$(tr).find('td');
                const fechaActual = columnaDeLaFila.eq(0).text().trim().slice(0,7);
                const transaccionActual = columnaDeLaFila.eq(1).text().trim();

                    if(fechaActual == anioMes && transaccionActual == transaccion){

                        this.transaccionesEncontradas.push({
                            fila : i,
                            fecha1 : columnaDeLaFila.eq(0).text().trim(),
                            fecha2 : columnaDeLaFila.eq(3).text().trim(),
                            codigoTransaccion : transaccionActual,
                            valorTransaccion : columnaDeLaFila.eq(5).text().trim(),
                            tasaInteres : columnaDeLaFila.eq(6).text().trim(),
                            cuotas : columnaDeLaFila.eq(7).text().trim()
                        });

                    }
            });

            cy.avanzarRegistrostabla('idTablaHistorico').then((validacionAvanzar) => {
                if(validacionAvanzar){
                    this.buscarTransaccionPorFecha(transaccion,fecha);
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
                cy.log(`Transaccion actual: ${transaccion}`);

                if(transaccion === '96' || transaccion === '97') {
                    this.transaccionesEncontradas.push({
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

            cy.avanzarRegistrostabla('idTablaHistorico').then((validacionAvanzar) => {
                if(validacionAvanzar){
                    this.obtenerTransacciones();
                } else {
                    cy.log(`🚫 No existen mas registros para avanzar`);
                }
            });

        });
    }

}

export const historicoPage = new HistoricoPages();
