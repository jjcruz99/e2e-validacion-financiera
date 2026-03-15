class FacturacionesPages{

    constructor(){
        this.selectores ={
            tabla:'tbody[id*="idTablaSaldosMesAnt_data"]',
            visualizar: 'button[id*="idAsfVisualizar"]',
            tablaModal:'table[id*="idModalPanelCrasfLiquidados"]',
            filasTabalaModal: "tr.ui-widget-content",
            etiquetaModal: "td.etiqueta",
            numeroModal: "td.numero",
            btnCerrarModal: 'div[id*="modalVisualizarSaldos"] a.ui-dialog-titlebar-close'
        };
        this.dataEncontrada=[];
    }

    limpiartdatos(){
        this.dataEncontrada = [];
        cy.log('🗑 Variable de facturaciones anteriores reiniciada.');
    }



    buscarFacturacion(fechaFacturacion){

        const fecha = fechaFacturacion.slice(0,7);
        cy.log(`Fecha de facturacion a buscar ${fecha}`);

        cy.get(this.selectores.tabla).then( ($tbody) => {

            const filas = $tbody.find('tr');
    
            filas.each( (i,tr) =>{

                const fila = Cypress.$(tr).find('td');
                const fechaActual = fila.eq(0).text().trim().slice(0,7);

                if(fechaActual === fecha){

                    //* Envolver la fila (tr) para usar comandos de Cypress
                    cy.wrap(tr).find(this.selectores.visualizar).click();
                    this.extraerDiferidos();
                    return false;
                }
            });
        });

    }


    extraerDiferidos(){

        cy.get(this.selectores.tablaModal).should('be.visible').then(($tabla) => {
            
            const filas = $tabla.find(this.selectores.filasTabalaModal);

            filas.each( (i,tr) =>{
                 
                const etiqueta = Cypress.$(tr).find(this.selectores.etiquetaModal).text().trim();
                const valor = Cypress.$(tr).find(this.selectores.numeroModal).text().trim();

                if (etiqueta === 'Dif Vencidos VEN' || etiqueta === 'Dif Vencidos AVA'){

                    this.dataEncontrada.push({
                        concepto:etiqueta,
                        valorDiferido:valor
                    });

                    cy.log(`📂 Capturado: ${etiqueta} = ${valor}`);

                    cy.get(this.selectores.btnCerrarModal)
                        .click({ force: true });
                    
                }
            });

        });
    }

}

export const facturacionesPages = new FacturacionesPages();