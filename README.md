# LIME Repostería — Despliegue en Firebase + GitHub

Esta carpeta contiene la app completa (un solo archivo `index.html`) más los
archivos de configuración para publicarla en Firebase Hosting, con los datos
del negocio guardados en Firestore y el panel protegido con Firebase
Authentication.

Sigue estos pasos **en orden**. Tardan entre 20 y 30 minutos la primera vez.

---

## 1. Crear el proyecto en Firebase

1. Ve a **https://console.firebase.google.com** e inicia sesión con la cuenta
   de Google que quieras usar para el negocio.
2. Haz clic en **"Agregar proyecto"** (o "Crear un proyecto").
3. Ponle un nombre, por ejemplo `lime-reposteria`. Firebase le agregará un
   sufijo único automáticamente (ej. `lime-reposteria-a1b2c`) — ese será tu
   **ID de proyecto**, apúntalo.
4. Puedes desactivar Google Analytics si no lo vas a usar (no es necesario
   para esta app).
5. Espera a que termine de crearse el proyecto.

## 2. Activar Authentication (para el login del panel)

1. En el menú lateral del proyecto, entra a **Build → Authentication**.
2. Haz clic en **"Comenzar"** / **"Get started"**.
3. En la pestaña **"Sign-in method"**, elige **"Correo electrónico/contraseña"**
   (Email/Password) y actívalo. Guarda.
4. Ve a la pestaña **"Users"** (Usuarios) y haz clic en **"Agregar usuario"**.
   Pon tu correo y una contraseña — este será el usuario con el que entrarás
   al panel de administración. **No hay pantalla de registro dentro de la
   app a propósito**, por seguridad: los usuarios solo se crean aquí, en la
   consola de Firebase.

## 3. Activar Firestore (la base de datos)

1. En el menú lateral, entra a **Build → Firestore Database**.
2. Haz clic en **"Crear base de datos"**.
3. Elige **modo de producción** (no modo de prueba — nuestras reglas de
   seguridad, que vienen en `firestore.rules`, ya están listas para esto).
4. Elige la ubicación del servidor más cercana a ti (por ejemplo
   `us-central` o `southamerica-east1`; para México, `us-central1` suele ir
   bien). **Esto no se puede cambiar después**, pero cualquiera de las
   opciones cercanas funciona bien.

## 4. Registrar la app web y obtener tu configuración

1. En la página principal del proyecto (ícono de engrane →
   **Configuración del proyecto**, o el ícono `</>` en la vista general),
   haz clic en **"Agregar app"** y elige el ícono **Web (`</>`)**.
2. Ponle un apodo, por ejemplo `panel-web`. **No** actives Firebase Hosting
   en este paso todavía (lo haremos por línea de comandos más abajo).
3. Firebase te va a mostrar un bloque de código con algo así:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "lime-reposteria-a1b2c.firebaseapp.com",
     projectId: "lime-reposteria-a1b2c",
     storageBucket: "lime-reposteria-a1b2c.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

4. **Copia esos valores.** Abre `index.html` en tu editor, busca (cerca del
   inicio del segundo bloque `<script>`) esta sección:

   ```js
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_PROYECTO.firebaseapp.com",
     projectId: "TU_PROYECTO",
     storageBucket: "TU_PROYECTO.appspot.com",
     messagingSenderId: "TU_SENDER_ID",
     appId: "TU_APP_ID"
   };
   ```

   Y reemplázala con tus valores reales del paso anterior. Guarda el archivo.

## 5. Subir el código a GitHub

Desde una terminal, dentro de esta carpeta:

```bash
git init
git add .
git commit -m "LIME Repostería - versión inicial con Firebase"
```

Luego, en GitHub (github.com), crea un repositorio nuevo **vacío** (sin
README, sin .gitignore — ya tenemos uno) llamado por ejemplo
`lime-reposteria`. GitHub te va a mostrar los comandos para conectarlo;
serán parecidos a:

```bash
git remote add origin https://github.com/TU_USUARIO/lime-reposteria.git
git branch -M main
git push -u origin main
```

## 6. Instalar Firebase CLI y desplegar

Necesitas tener **Node.js** instalado en tu computadora
(https://nodejs.org, versión LTS). Luego, en la terminal:

```bash
npm install -g firebase-tools
firebase login
```

Esto abre el navegador para que inicies sesión con la misma cuenta de
Google que usaste en el paso 1.

Dentro de esta carpeta (donde está `index.html`, `firebase.json`, etc.):

```bash
firebase use --add
```

Te va a pedir elegir tu proyecto de la lista (el que creaste en el paso 1)
y ponerle un alias — puedes escribir `default`.

Ahora publica las reglas de Firestore:

```bash
firebase deploy --only firestore:rules
```

Y publica la app:

```bash
firebase deploy --only hosting
```

Al terminar, la terminal te va a mostrar una URL parecida a:

```
https://lime-reposteria-a1b2c.web.app
```

**Esa es tu app en vivo.** Ábrela, inicia sesión con el usuario que creaste
en el paso 2, y deberías ver el panel funcionando con datos en tiempo real.

## 7. El link para tus clientes

Dentro del panel, ve a **"Formulario de pedido"**. Ahí verás (y podrás
copiar) un link parecido a:

```
https://lime-reposteria-a1b2c.web.app/?modo=cliente
```

Ese es el que le compartes a tus clientes por WhatsApp o redes sociales.
Ellos solo ven el formulario — no tienen forma de llegar al panel de
administración desde ahí. Cada pedido que envíen aparece automáticamente
en tu sección **"Solicitudes"**, sin importar desde qué celular lo hayan
mandado.

## 8. Actualizaciones futuras

Cada vez que quieras subir un cambio (por ejemplo, si yo te doy una nueva
versión de `index.html`):

```bash
git add .
git commit -m "Descripción del cambio"
git push
firebase deploy --only hosting
```

---

## Notas importantes

- **Backups:** aunque los datos ya viven en la nube, sigue existiendo el
  botón "Exportar respaldo" en Ajustes — úsalo de vez en cuando como copia
  de seguridad adicional.
- **Fotos:** las fotos de recetas, pedidos y solicitudes se guardan como
  parte del documento en Firestore (comprimidas). Cada documento en
  Firestore tiene un límite de 1 MB; con la compresión que aplica la app
  esto es holgado para fotos normales de celular, pero evita subir fotos
  gigantes sin comprimir por otras vías.
- **Costo:** Firebase tiene una capa gratuita (Spark) generosa para este
  tamaño de negocio (lecturas/escrituras diarias limitadas pero amplias).
  Si el negocio crece mucho, revisa los precios en
  https://firebase.google.com/pricing — probablemente sigas dentro del
  rango gratuito por bastante tiempo.
- **Un solo usuario admin por ahora:** si más adelante quieres que alguien
  más de tu equipo tenga su propio acceso, créale su usuario en
  Authentication → Users, igual que el tuyo.
