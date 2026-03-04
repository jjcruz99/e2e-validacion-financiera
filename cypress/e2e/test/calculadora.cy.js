import { calculadora } from '../../support/utils/calculadoraDeIntereses';

describe('Pruebas Unitarias - Calculadora de Intereses', () => {
    
    it('Debería calcular correctamente la ecuación general para una transacción', () => {
        const mockTransacciones = [
            {
                valorTransaccion: "100,000.00",
                fecha1: "2025/10/24",
                fecha2: "2025/10/31",
                tasaInteres: "18400"
            }
        ];

        calculadora.ecuacionGeneral(mockTransacciones);

        // El resultado no sea NaN y sea mayor a 0
        expect(calculadora.totalIntreses).to.be.greaterThan(0);
        cy.log(`Total calculado: ${calculadora.totalIntreses}`);
    });

    it('Debería retornar 0 si no hay transacciones', () => {
        calculadora.totalIntreses = 0; // Reset
        calculadora.ecuacionGeneral([]);
        expect(calculadora.totalIntreses).to.eq(0);
    });
});