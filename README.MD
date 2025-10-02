# Prueba Técnica - Aplicación de Gestión de Leads

Esta es una aplicación full-stack para la gestión de leads, programas y seguimientos en una institución educativa. El frontend está construido con React y TypeScript, mientras que el backend utiliza Node.js con Express y TypeScript. La aplicación permite crear, editar, eliminar y visualizar leads, asi como la visualizacion de programas y actividades de seguimiento.

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Formik, Zustand
- **Backend**: Node.js, Express, TypeScript, MongoDB

## Requisitos Previos

- Node.js 18 con Express
- React
- MongoDB

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd prueba-kuepa
```

### 2. Configurar el Backend

```bash
cd back
npm install
npm run dev
```

### 3. Configurar el Frontend

```bash
cd  front
npm install
npm run dev
```

### 4. Ejecutar los Seeders (Indispensables)

Los seeders son **cruciales** para el funcionamiento correcto de la aplicación, ya que poblan la base de datos con datos iniciales esenciales. Debes ejecutarlos en el orden especificado antes de usar la aplicación.

```bash
cd back
npm run cli -- --seeder initSeeder -f
npm run cli -- --seeder programSeeder -f
npm run cli -- --seeder trackingSeeder -f
```

- **initSeeder**: Llena la información de usuarios para autenticación. Crea usuarios administradores o iniciales necesarios para acceder al sistema.
- **programSeeder**: Llena los programas ofrecidos por la institución. Incluye datos como nombres y descripciones
- **trackingSeeder**: Llena las actividades de seguimiento. Define las tareas o interacciones que se pueden realizar con los leads, como llamadas, emails o reuniones.

**Nota**: Ejecutar estos seeders es **indispensable** para que la aplicación funcione correctamente. Sin ellos, no podrás autenticarte, ver programas o ver seguimientos.


## Licencia

Este proyecto es para fines de prueba técnica. No tiene licencia específica.
