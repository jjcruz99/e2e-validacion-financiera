
class InteresesPages {

    constructor() {
        this.selectores = {
            // Usamos el selector parcial para evitar errores con los ":"
            tabla: 'tbody[id*="idTablaInteres_data"]',
            paginador: {
                nextBtn: 'a[aria-label="Next Page"]',
                nextIcon: 'span',
                nextCon: 'N'
            }
        };
        this.datosEncontrados = null;
    }


    buscarCodigoDeInteres(codigoEspecifico) {
    
        cy.get(this.selectores.tabla).then(($tbody) => {
            
            let encontrado = false;
            const filas = $tbody.find('tr');

            // 2. Recorrer filas
            filas.each((i, tr) => {
                const celdas = Cypress.$(tr).find('td');
                
                const codigoActual = celdas.eq(1).text().trim();

  
                    if (codigoActual == codigoEspecifico) {
                        encontrado = true;
                        this.datosEncontrados = {
                            fecha: celdas.eq(0).text().trim(),
                            codigo: codigoActual,
                            valor: celdas.eq(3).text().trim()
                        };
                        cy.screenshot(`codigos_intereses/Codigo_${codigoEspecifico}`,{ capture:'fullPage'});
                        return false; 
                    }
            });

            
            if (encontrado) {
                cy.wrap(this.datosEncontrados);
            } else {
                
                cy.avanzarRegistrostabla().then((pudoAvanzar) => {
                    if (pudoAvanzar) {
                        this.buscarCodigoDeInteres(codigoEspecifico);
                    } else {
                        throw new Error(`❌ El código ${codigoEspecifico} no se encontró en la tabla.`);
                    }
                });
            }
    });
}

}

export const interesesPage = new InteresesPages();