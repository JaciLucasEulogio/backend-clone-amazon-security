# Sistema de Control de Accesos - Backend

Este es el backend de un sistema de control de accesos que permite a los usuarios registrarse, iniciar sesión, y manejar la autenticación de dos factores (2FA). Además, permite la habilitación y deshabilitación de la 2FA.

## URL del Backend Desplegado

El backend está desplegado en [Render](https://backend-clone-amazon-security.onrender.com).

## Flujo de Uso

A continuación se describe el flujo que los desarrolladores frontend deben implementar para interactuar con el backend:

### 1. **Registro de nuevo usuario**
- **Método:** `POST`
- **URL:** `https://backend-clone-amazon-security.onrender.com/api/auth/register`
- **Descripción:** Permite registrar un nuevo usuario.
- **Cuerpo (Body):**
    ```json
    {
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "password": "miContraseñaSegura123"
    }
    ```
- **Respuesta esperada:**
    ```json
    {
      "msg": "Usuario registrado. Verifica tu correo electrónico."
    }
    ```

### 2. **Verificación de correo electrónico**
- **Método:** `POST`
- **URL:** `https://backend-clone-amazon-security.onrender.com/api/auth/verify-email`
- **Descripción:** Verifica el correo electrónico del usuario mediante el código enviado al correo.
- **Cuerpo (Body):**
    ```json
    {
      "email": "juan.perez@example.com",
      "code": "123456"
    }
    ```
- **Respuesta esperada:**
    ```json
    {
      "msg": "Correo verificado"
    }
    ```

### 3. **Inicio de sesión (Login)**
- **Método:** `POST`
- **URL:** `https://backend-clone-amazon-security.onrender.com/api/auth/login`
- **Descripción:** Inicia sesión con las credenciales del usuario.
- **Cuerpo (Body):**
    ```json
    {
      "email": "juan.perez@example.com",
      "password": "miContraseñaSegura123"
    }
    ```
- **Respuesta esperada:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 4. **Verificación de 2FA**
- **Método:** `POST`
- **URL:** `https://backend-clone-amazon-security.onrender.com/api/auth/verify-2fa`
- **Descripción:** Verifica el código 2FA enviado al correo del usuario.
- **Cuerpo (Body):**
    ```json
    {
      "email": "juan.perez@example.com",
      "code": "abcd12"
    }
    ```
- **Respuesta esperada:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 5. **Habilitar 2FA**
- **Método:** `POST`
- **URL:** `https://backend-clone-amazon-security.onrender.com/api/auth/enable-2fa`
- **Descripción:** Habilita la autenticación de dos factores para el usuario.
- **Cuerpo (Body):**
    ```json
    {
      "email": "juan.perez@example.com"
    }
    ```
- **Respuesta esperada:**
    ```json
    {
      "msg": "2FA habilitado. Un código fue enviado a tu correo."
    }
    ```

### 6. **Deshabilitar 2FA**
- **Método:** `POST`
- **URL:** `https://backend-clone-amazon-security.onrender.com/api/auth/disable-2fa`
- **Descripción:** Deshabilita la autenticación de dos factores para el usuario.
- **Cuerpo (Body):**
    ```json
    {
      "email": "juan.perez@example.com"
    }
    ```
- **Respuesta esperada:**
    ```json
    {
      "msg": "2FA deshabilitado"
    }
    ```

### 7. **Actualizar datos de usuario**
- **Método:** `PUT`
- **URL:** `https://backend-clone-amazon-security.onrender.com/api/auth/update`
- **Descripción:** Permite al usuario modificar su nombre, correo, y número de teléfono.
- **Cuerpo (Body):**
    ```json
    {
      "name": "Juan Pérez Actualizado",
      "email": "juan.perez@example.com",
      "phoneNumber": "123456789"
    }
    ```
- **Respuesta esperada:**
    ```json
    {
      "msg": "Datos actualizados"
    }
    ```

---

## Cómo probar las funcionalidades en **Postman**

### Paso 1: Configura Postman

1. Abre **Postman** y crea una nueva colección o usa una existente.
2. Configura las rutas anteriores en Postman según las descripciones proporcionadas.

### Paso 2: Probar las rutas

1. **Registro de nuevo usuario**: Haz una solicitud `POST` a la ruta `/api/auth/register` con los datos de usuario.
2. **Verificación de correo electrónico**: Después de registrar el usuario, verifica el correo enviando un `POST` a `/api/auth/verify-email` con el código de verificación.
3. **Login**: Luego de verificar el correo, inicia sesión enviando una solicitud `POST` a `/api/auth/login` con las credenciales del usuario.
4. **Verificación de 2FA**: Si 2FA está habilitado, prueba la verificación de 2FA enviando una solicitud `POST` a `/api/auth/verify-2fa`.
5. **Habilitar 2FA**: Puedes habilitar la 2FA enviando una solicitud `POST` a `/api/auth/enable-2fa`.
6. **Deshabilitar 2FA**: Si deseas deshabilitar la 2FA, usa la ruta `/api/auth/disable-2fa`.
7. **Actualizar datos de usuario**: Finalmente, puedes actualizar los datos del usuario con una solicitud `PUT` a `/api/auth/update`.

---

## Configuración de MongoDB Atlas

1. **Crea una cuenta en MongoDB Atlas**: Si aún no lo has hecho, ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta.
2. **Crea un clúster**: Una vez dentro de Atlas, crea un nuevo clúster (elige la opción gratuita).
3. **Conecta tu aplicación**: Luego de crear el clúster, haz clic en el botón "Connect" y selecciona "Connect your application". Copia la cadena de conexión y pégala en tu archivo `.env` en el campo `MONGO_URI`.

   Ejemplo de la cadena de conexión:
   ```env
   MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
