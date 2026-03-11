
# E2E Validación Financiera 📊
Este proyecto contiene una suite de pruebas automatizadas de extremo a extremo (E2E) para la validación de cálculos de intereses financieros en plataformas transaccionales. Utiliza Cypress para asegurar la integridad de la lógica de negocio y la consistencia de los datos presentados en la interfaz web.

# 📁 Estructura del Proyecto
```
aut_validacion_intereses/
├── cypress/
│   ├── e2e/
│   │   ├── pages/   
│   │   │   ├── facturacionesPages.js                
│   │   │   ├── historicoPages.js    
│   │   │   ├── interesesPages.js    
│   │   │   ├── menuNavTC.js         
│   │   │   └── movimientosPages.js  
│   │   │
│   │   └── test/                                 
│   │       ├── 01_prueba_inicial.cy.js
│   │       ├── 02_prueba_login.cy.js
│   │       ├── 03_prueba_consultar_cliente.cy.js
│   │       ├── 04_prueba_interes_cod1.cy.js   
│   │       ├── 05_prueba_intereses_cod4.cy.js 
│   │       └── calculadora.cy.js              
│   │
│   ├── fixtures/
|   |       └── example.json
│   │
│   ├── reports/
│   │   ├── screenshots/ 
│   │   |    ├── 02_prueba_login.cy.js
│   │   |    ├── 03_prueba_consultar_cliente.cy.js
│   │   |    ├── 04_prueba_interes_cod1.cy.js
│   │   |    └── 05_prueba_intereses_cod4.cy.js
│   │   |
│   │   └── index.html  
│   │
│   └── support/
│       ├── commands/               
│       │   ├── auth_commands.js
│       │   ├── customer_commands.js
│       │   └── table_commands.js
│       │
│       ├── utils/                   
│       │     └── calculadoraDeIntereses.js
│       │
│       ├── e2e.js
│       └── index.d.ts.js
|
├── node_modules
├── src
├── .gitignore
├── cypress.config.js                
├── cypress.env.json                 
├── jsconfig.json
├── package.json
└── readme.md
```

# Características Principales
-Validación de Intereses: Automatización de escenarios para códigos de interés específicos (Cod1, Cod4).

-Motor de Cálculo Interno: Incluye una lógica de calculadora para contrastar los valores esperados frente a los mostrados en el aplicativo.

-Navegación Dinámica: Manejo de flujos complejos entre ventanas de históricos, movimientos e intereses.

-Reportes Visuales: Generación automática de evidencias (screenshots) organizadas por caso de prueba.

-Paginación Inteligente: Comandos personalizados para la lectura de tablas con múltiples registros.