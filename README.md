# Nutrición deportiva en Colima

Landing estática de Vite + Tailwind CSS, en español y mobile-first.

## Desarrollo

```sh
npm install
npm run dev
```

## Compilar

```sh
npm run build
npm run preview
```

## Configurar los datos reales

Edita `src/data/siteConfig.js` antes de publicar:

- `professionalName`: nombre del profesional.
- `whatsappNumber`: teléfono internacional solo con dígitos. Configurado en `523122281628` para WhatsApp, los CTA, el formulario y las llamadas.
- `phoneDisplay`: formato visible del teléfono (`312 228 1628`).
- `email` e `instagramUrl`: correo y perfil de Instagram proporcionados por el usuario.

Las seis imágenes de casos en `assets/cases/` provienen de los pares antes/después que proporcionó el usuario y se muestran en las historias correspondientes.

## Pruebas

```sh
npm test
npm audit
```

`npm test` compila la web y ejecuta 28 comprobaciones (incluida una auditoría de accesibilidad con axe-core) en Chrome/Chromium mediante Playwright. En Windows utiliza Chrome si está instalado en su ubicación habitual. También admite `CHROME_PATH`; si no hay Chrome instalado, ejecuta `npx playwright install chromium` para preparar el navegador de Playwright.

Las capturas y métricas se guardan en `artifacts/verification/`, excluido de Git. No se envían mensajes: las pruebas interceptan la apertura de WhatsApp y comprueban el destino y el texto preparado.

Consulta `VERIFICATION.md` para conocer los resultados y el alcance de la revisión.

## Recursos

Las imágenes publicadas están en WebP con compresión con pérdida de alta calidad (SSIM ≥ 0.98 frente al original). Las fotos grandes tienen versiones de 600–1000 px servidas con `srcset`, así que cada dispositivo descarga solo el tamaño que necesita. Las versiones previas a la optimización se conservan en `.impeccable/sources/pre-optimization/`. Los registros históricos de diseño pueden mencionar los nombres PNG anteriores.
