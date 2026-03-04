import moment from 'moment';

class CalculadoraDeIntereses {

    constructor() {
        this.totalIntreses = 0;
        this.detallesintereses = [];
    }

    limpiarDatosNumericos(valor) {
        try {
            if (!valor) return 0;
            
            const valorLimpio = valor.replace(/,/g, '');
            return parseFloat(valorLimpio);
        }
        catch (error) {
            console.error(`Error al intentar limpiar dato detalles: ${error}`);
            return 0;
        }
    }

    obtenerDiferenciaDeDias(fecha1, fecha2) {
        try {
            if (fecha1 === '' || fecha2 === '') return 0;
            
            const f1 = moment(fecha1.replace(/\//g, '-'));
            const f2 = moment(fecha2.replace(/\//g, '-'));
            
            return Math.abs(f2.diff(f1, 'days'));
        }
        catch (error) {
            console.error(`Error al calcular la diferencia de dias: ${error}`);
            return 0;
        }
    }

    restarUnMesFecha(fecha){
        try {
            if (!fecha) return '';

            const fechaResultante = moment(fecha.replace(/\//g, '-'))
                .subtract(1, 'months')
                .endOf('month');

            return fechaResultante.format('YYYY/MM/DD');
        } 
        catch (error) {
            console.error(`Error al restar un mes a la fecha ${fecha}: ${error}`);
            return fecha; 
        }
    }

    tasaEnDecimales(tasa) {
        try {
            if (!tasa) return 0;
            let tasaNumerica = parseFloat(tasa);
            return tasaNumerica / 10000;
        }
        catch (error) {
            console.error(`Error al convertir la tasa: ${error}`);
            return 0;
        }
    }


    ecuacionGeneral(transacciones) {
        
        this.totalIntreses = 0;
        this.detallesintereses = []; 

        try {
            if (!transacciones || transacciones.length === 0) return;

            transacciones.forEach((transaccion, i) => {
                let valor = this.limpiarDatosNumericos(transaccion.valorTransaccion);
                let dias = this.obtenerDiferenciaDeDias(transaccion.fecha1, transaccion.fecha2);
                let tasa = this.tasaEnDecimales(transaccion.tasaInteres);

                let calculoIntereses = (valor * tasa * dias) / (100 * 30);

                this.detallesintereses.push({
                    idResultado: i,
                    valorCalculado: calculoIntereses
                });
            });

            // Sumatoria 
            this.totalIntreses = this.detallesintereses.reduce((acc, det) => acc + det.valorCalculado, 0);
            
            this.totalIntreses = parseFloat(this.totalIntreses.toFixed(2));

        }
        catch (error) {
            console.error("Error al realizar los calculos: " + error);
        }
    }
}

export const calculadora = new CalculadoraDeIntereses();