# Guía de Despliegue en Netlify para TempAr

Sigue estos pasos para llevar **TempAr** a producción gratis usando Netlify.

## Paso 1: Preparar el Repositorio (GitHub)

Netlify necesita acceder a tu código. Lo más fácil es subirlo a GitHub.

1.  Ve a [GitHub.com](https://github.com) y crea un **Nuevo Repositorio** (o "New Repository").
2.  Llámalo `temp-ar` (o como prefieras).
3.  Déjalo Público o Privado.
4.  **No** inicialices con README, .gitignore ni License (ya tenemos el código local).
5.  Crea el repositorio.

## Paso 2: Subir tu código local

Abre tu terminal en la carpeta del proyecto (`conecta-trabajo`) y ejecuta:

```bash
# 1. Asegurar que todos los cambios están guardados
git add .
git commit -m "TempAr: App lista para deploy"

# 2. Renombrar rama a main (estándar actual)
git branch -M main

# 3. Conectar con tu nuevo repo de GitHub
# REEMPLAZA 'TU_USUARIO' con tu nombre de usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/temp-ar.git

# 4. Subir el código
git push -u origin main
```

## Paso 3: Conectar Netlify

1.  Ve a [Netlify.com](https://www.netlify.com/) e inicia sesión (puedes usar tu cuenta de GitHub).
2.  Haz clic en **"Add new site"** > **"Import an existing project"**.
3.  Selecciona **GitHub**.
4.  Autoriza a Netlify si te lo pide.
5.  Busca y selecciona tu repositorio `temp-ar`.

## Paso 4: Configuración de Build (Automática)

Netlify detectará automáticamente que es un proyecto **Next.js**.

Verás una pantalla con configuraciones pre-rellenadas:
*   **Build command**: `npm run build`
*   **Publish directory**: `.next` (o similar, Netlify lo gestiona)

**¡IMPORTANTE!**
Asegúrate de que no haya variables de entorno secretas necesarias por ahora. Como es una UI sin backend real (solo mocks), no necesitas configurar `.env` todavía.

Haz clic en **"Deploy temp-ar"**.

## Paso 5: ¡Listo! 🚀

Netlify tardará unos minutos (1-2 min) en construir tu sitio.
Cuando termine, te dará una URL tipo `https://tempar-randomname.netlify.app`.

### Opcional: Personalizar dominio
En "Site settings" > "Domain management" puedes cambiar el nombre aleatorio a `tempar-app.netlify.app` (si está disponible).
