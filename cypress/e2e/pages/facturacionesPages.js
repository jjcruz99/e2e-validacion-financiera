class FacturacionesPages{

    constructor(){
        this.selectores ={
            tabla:'tbody[id*="idTablaSaldosMesAnt_data"]',
            visualizar: 'button[id*="idAsfVisualizar"]'
        };

        this.dataEncontrada=[];
    }

    limpiartdatos(){
        this.dataEncontrada = [];
        cy.log('🗑 Registros de facturaciones anteriores eliminadas.');
    }

    obtenerTotalDiferidos(fechaFacturacion){

        cy.get(this.selectores.tabla).then( ($tbody) => {

            const filas = $tbody.find('tr');
    
            filas.each( (i,tr) =>{

                const fila = Cypress.$(tr).find('td');
                const fechaActual = fila.eq(0).text().trim();

                if(fechaActual === fechaFacturacion){

                    //* Envolver la fila (tr) para usar comandos de Cypress
                    cy.wrap(tr).find(this.selectores.visualizar).click();
                    cy.log(`✅ Clic en visualizar en la facturacion: ${fechaActual}`);
                    return false;
                }
            });
        });

    }

}

export const facturacionesPages = new FacturacionesPages();