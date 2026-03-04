class MenuNavTarjetaCredito{

    constructor(){

        this.contenedorPrincipal = 'ul.ui-tabs-nav';
        this.ventanaGeneral = 'a[href*="idTabGeneral"]';
        this.ventanaMovimientos = 'a[href*="idTabMovimiento"]';
        this.ventanaHistorico = 'a[href*=idTabHistorico]';
        this.ventanaIntereses = 'a[href*="idTabIntereses"]';
        this.ventanaMoras =  'a[href*="idTabMoras"]' ;
        this.ventanaFacturaciones = 'a[href*="idTabSaldosMesAnt"]';
    }

    irVentanaGeneral(){
        cy.get(this.contenedorPrincipal)
            .find(this.ventanaGeneral)
            .click();
    }

    irVentanaMovimientos(){
        cy.get(this.contenedorPrincipal)
            .find(this.ventanaMovimientos)
            .click();
    }

    irVentanaHistoricos(){
        cy.get(this.contenedorPrincipal)
            .find(this.ventanaHistorico)
            .click();
    }

    irVentanaIntereses(){
        cy.get(this.contenedorPrincipal)
            .find(this.ventanaIntereses)
            .click();
    }

    irVentanaMora(){
        cy.get(this.contenedorPrincipal)
            .find(this.ventanaMoras)
            .click();
    }

    irVentanaFacturaciones(){
        cy.get(this.contenedorPrincipal)
            .find(this.ventanaFacturaciones)
            .click();
    }

}

export const menuNavTC = new MenuNavTarjetaCredito();