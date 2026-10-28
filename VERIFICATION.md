# Revisión funcional y limpieza

Fecha: 17 de octubre de 2026.

## Resultado

- Compilación de producción completada con Vite.
- 17 comprobaciones funcionales aprobadas en Chrome 155.0.8059.80 mediante Playwright. Node informa 18 pruebas al incluir el contenedor principal.
- Sin errores JavaScript ni respuestas HTTP fallidas durante los recorridos.
- `npm audit`: ninguna vulnerabilidad conocida reportada en las dependencias instaladas.

## Cobertura

- Estructura semántica, identificadores únicos, enlaces internos, iconos SVG, carga de imágenes y etiquetas de campos.
- Navegación de escritorio, enlace para saltar al contenido y foco visible.
- Menú móvil mediante interacción táctil, cierre al navegar y tecla Escape.
- FAQ cerrada inicialmente, una respuesta abierta por vez, teclado y ajuste al redimensionar.
- Destinos de correo, teléfono, Instagram y mensajes específicos por objetivo en WhatsApp.
- Formulario vacío, modalidad sin elegir, campos con solo espacios y contenido válido con acentos. Mensaje codificado y enlace alternativo ante ventanas bloqueadas.
- Pasarela continua hacia la izquierda, continuidad al pasar el mouse y desplazar la página, repetición sin salto y preferencia de movimiento reducido.
- Anchos de 320, 390, 768, 1024 y 1440 px; cuerpo y campos de 16 px, sin desbordamiento horizontal.
- Texto al 200 % en 390 y 1440 px, sin desbordamiento horizontal.
- Capturas de escritorio y móvil en `artifacts/verification/`.

## Correcciones y limpieza

- El formulario recorta espacios y rechaza nombres u objetivos vacíos. Incluye un enlace directo a WhatsApp si no se abre la ventana.
- Ajustes de columnas, campos y saltos de palabra para admitir texto ampliado.
- Imágenes de 17.161.372 a 2.538.390 bytes: reducción del 85,2 %, manteniendo sus dimensiones. Logo y seis fotos de casos comprobados sin cambios en píxeles visibles. Originales conservados en `.impeccable/sources/`.
- Eliminadas dos imágenes que ya no se mostraban, un script temporal antiguo, una variable sin uso, listeners innecesarios y 12 declaraciones tipográficas repetidas.
- Solo se publica el subconjunto latino de la fuente, compatible con el texto español del sitio.

## Alcance y límites

Las comprobaciones usan Chrome de escritorio con tamaños de pantalla y entrada táctil emulados. No equivalen a pruebas en dispositivos físicos, Safari o Firefox. Se verifica la preparación de WhatsApp sin enviar mensajes ni comprobar su entrega. La auditoría de dependencias refleja la información disponible en npm en esta fecha.

La pasarela conserva la ausencia de botón de pausa y de pausa al pasar el mouse, según lo solicitado. Respeta la preferencia del sistema de reducir movimiento; no se certifica cumplimiento completo de accesibilidad.
