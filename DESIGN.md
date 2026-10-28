---
name: Nutrición deportiva Colima
description: Acompañamiento cercano para recomposición corporal y rendimiento deportivo.
colors:
  green-emerald-training: "#09674f"
  green-emerald-deep: "#07553f"
  green-card: "#0c5b46"
  green-plan: "#123f34"
  green-footer: "#122c25"
  green-soft-surface: "#eaf3ee"
  white-clean: "#ffffff"
  gray-mist: "#f4f7f5"
  ink: "#16201f"
  ink-soft: "#33413e"
  divider: "#d8e1dc"
  focus-amber: "#bb6d27"
typography:
  display:
    fontFamily: "Encode Sans Variable, Encode Sans, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3.2vw, 3.5rem)"
    fontWeight: 740
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Encode Sans Variable, Encode Sans, sans-serif"
    fontSize: "clamp(1.875rem, 1.25rem + 2.2vw, 2.75rem)"
    fontWeight: 720
    lineHeight: 1.16
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Encode Sans Variable, Encode Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  control:
    fontFamily: "Encode Sans Variable, Encode Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 680
  title:
    fontFamily: "Encode Sans Variable, Encode Sans, sans-serif"
    fontSize: "clamp(1.375rem, 1.25rem + 0.35vw, 1.5rem)"
    fontWeight: 680
    lineHeight: 1.25
  small:
    fontFamily: "Encode Sans Variable, Encode Sans, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.5
  caption:
    fontFamily: "Encode Sans Variable, Encode Sans, sans-serif"
    fontSize: "0.8125rem"
    lineHeight: 1.5
rounded:
  compact: "0.45rem"
  button: "0.7rem"
  large: "0.9rem"
  card: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.green-emerald-training}"
    textColor: "{colors.white-clean}"
    rounded: "{rounded.button}"
    padding: "0.8rem 1.25rem"
    height: "3.45rem"
    typography: "{typography.control}"
  button-primary-hover:
    backgroundColor: "{colors.green-emerald-deep}"
  field-default:
    backgroundColor: "{colors.white-clean}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "0.65rem 0.75rem"
    height: "2.8rem"
---

# Design System: Nutrición deportiva Colima

## Overview

**Creative North Star: “El consultorio que acompaña”**

La interfaz se siente como una consulta de nutrición deportiva donde la persona puede hablar de entrenamiento y vida diaria sin recibir promesas grandilocuentes. La dirección usa lenguaje visual claro, sereno y humano: fotografía editorial como punto de entrada, información concreta y llamadas a la acción fáciles de reconocer.

Las superficies claras mantienen legible el contenido; el verde esmeralda identifica acciones y transiciones entre información y contacto. Los casos de éxito conservan espacios para imágenes autorizadas y no se presentan como evidencia visual hasta recibir material real. El plan se expresa con una superficie verde más profunda para diferenciarlo sin cambiar el tono del sitio.

**Key Characteristics:**
- Fotografía de consulta primero; oferta y acción enseguida.
- Verde de entrenamiento sobre blanco limpio y gris niebla.
- Sans variable de peso firme, con titulares compactos y cuerpo legible.
- Datos de contacto y prueba social tratados con transparencia.

## Colors

La paleta combina verde esmeralda de entrenamiento, blanco limpio y gris niebla; los verdes más profundos distinguen superficies de servicio y beneficio.

### Primary
- **Verde esmeralda de entrenamiento** (#09674f): CTA primario, enlaces de acción, selección y elementos de orientación.
- **Verde esmeralda profundo** (#07553f): hover de CTA y acciones activas.

### Secondary
- **Verde de modalidad** (#0c5b46): tarjeta de consulta presencial.
- **Verde de plan** (#123f34): bloque de beneficios y herramientas del plan.
- **Verde de cierre** (#122c25): pie de página.
- **Verde suave** (#eaf3ee): acentos y superficies ligeras relacionadas con el servicio.

### Neutral
- **Blanco limpio** (#ffffff): fondo principal, campos y texto sobre superficies verdes.
- **Gris niebla** (#f4f7f5): bloques alternos de contenido.
- **Tinta** (#16201f): texto principal.
- **Tinta suave** (#33413e): texto secundario y navegación.
- **Línea** (#d8e1dc): divisores y contornos discretos.
- **Ámbar de foco** (#bb6d27): indicador de foco visible sobre fondos claros.

### Named Rules
**La Regla del Verde de Acción.** El esmeralda marca acciones y orientación; las superficies amplias usan verdes más profundos para que el CTA principal conserve prioridad.

## Typography

**Display Font:** Encode Sans Variable (with Encode Sans, sans-serif fallbacks)  
**Body Font:** Encode Sans Variable (with Encode Sans, sans-serif fallbacks)  
**Label/Mono Font:** Encode Sans Variable; no se usa una fuente monoespaciada.

**Character:** Una sans variable limpia permite pasar de titulares deportivos firmes a instrucciones y respuestas largas sin introducir una segunda voz. Los pesos distinguen jerarquías; el tracking se mantiene en -0.04em o más abierto.

### Hierarchy
- **Display** (740, `--text-hero`, 1.08): titular del hero, de 36 a 56px con raíz de 16px. Comparte la misma escala fluida en todos los dispositivos.
- **Headline** (720, `--text-section`, 1.16): todos los títulos de sección, de 30 a 44px con raíz de 16px.
- **Title** (680, `--text-card`, 1.25): títulos de objetivos, modalidades, casos y formulario, de 22 a 24px.
- **Body and controls** (`--text-body: 1rem`): párrafos, descripciones, preguntas del acordeón, campos y botones a 16px con raíz de 16px. Los párrafos conservan interlineado cómodo y medidas de hasta 68ch; las tarjetas son más estrechas.
- **Small** (`--text-small: 0.875rem`): etiquetas, navegación y texto auxiliar a 14px. El peso distingue etiquetas y acciones.
- **Caption** (`--text-caption: 0.8125rem`): pies y rótulos de las fotografías a 13px.

Los tamaños están centralizados en variables CSS y expresados en rem para respetar el tamaño de letra del navegador. Tablet no amplía párrafos ni botones por separado; textos con la misma función comparten tamaño entre componentes.

### Named Rules
**La Regla del Titular Claro.** Usa peso y tamaño para dar fuerza; evita comprimir la letra más allá de -0.04em.

## Layout

La composición usa un contenedor centrado de hasta 76rem. En móvil empieza con un margen lateral de 1.125rem y la imagen del hero ocupa todo el ancho; desde 640px el margen crece a 1.75rem. El hero conserva el orden fotografía, titular, explicación y acciones hasta escritorio, donde desde 1024px la foto y la oferta se organizan en dos columnas. Desde 1100px la columna fotográfica gana espacio.

La página usa una sola columna para listas y contenido en móvil, dos columnas para modalidades y beneficios desde 640px, y tres columnas para casos en escritorio. Los bloques alternan blanco, gris niebla y verde profundo. El ritmo combina grupos cortos dentro de cada bloque con separación amplia entre secciones.

## Elevation & Depth

El sistema es principalmente plano: color, espacio y divisores suaves separan las áreas. La sombra difusa se reserva para el CTA principal y el contacto flotante; no se usan sombras duras ni tarjetas anidadas para organizar la página.

### Shadow Vocabulary
- **CTA ambiente** (`0 7px 20px rgba(8,91,68,.13)`): eleva discretamente la acción primaria; en hover usa `0 12px 26px rgba(8,91,68,.2)`.
- **Contacto flotante** (`0 5px 18px rgba(5,61,43,.24)`): separa el acceso rápido de WhatsApp de la superficie bajo él.

## Shapes

Los controles tienen esquinas suaves pero definidas: campos compactos de 0.45rem, botones de 0.7rem y tarjetas de hasta 1rem. La fotografía del hero recibe redondeo solo en escritorio; en la apertura móvil queda a sangre. Divisores de 1px organizan listas, formulario y espacios reservados de casos.

## Components

### Buttons
- **Shape:** esquinas redondeadas (0.7rem), altura mínima de 3.45rem y padding de 0.8rem 1.25rem.
- **Primary:** fondo verde esmeralda, texto blanco, peso 680; un sombreado ambiental corto separa la acción del fondo.
- **Hover / Focus:** hover oscurece el verde y eleva 2px; foco visible usa contorno ámbar de 3px con offset de 3px.
- **Secondary:** enlace subrayable en verde, con flecha SVG y aumento pequeño del espacio en hover.

### Cards / Containers
- **Corner Style:** 1rem en modalidades; 0.9rem en formulario y foto de hero en escritorio.
- **Background:** presencial en verde modalidad, consulta online en verde suave; formulario en gris blanquecino.
- **Shadow Strategy:** superficies planas; la jerarquía principal proviene del color y el espacio.
- **Border:** contorno de 1px en formulario y espacios para casos autorizados.
- **Internal Padding:** 1.6rem en móvil y 2rem en pantallas desde 640px para tarjetas de modalidad.

### Inputs / Fields
- **Style:** fondo blanco, borde gris verdoso, esquinas de 0.45rem y padding de 0.65rem 0.75rem.
- **Focus:** borde verde y contorno ámbar visible.
- **Error / Disabled:** validación nativa del navegador; no se inventa un estado de error propio ni se muestra un campo deshabilitado.

### Navigation
- **Style:** marca tipográfica a la izquierda y navegación directa; CTA de contacto identificado con verde.
- **Hover / Focus:** el enlace cambia a verde y el foco mantiene el contorno visible.
- **Mobile:** botón de menú accesible, panel desplegable con cierre por Escape y devolución del foco al control.

### FAQ
- **Behavior:** un botón por pregunta controla su respuesta mediante `aria-expanded`, `aria-controls`, `aria-hidden` e `inert`.
- **Motion:** altura y opacidad se animan al abrir; la preferencia de movimiento reducido acorta o elimina las transiciones.

### Evidence Placeholders
- Los huecos de imagen de casos se mantienen como marcadores hasta contar con fotografías autorizadas.
- El pie del hero identifica la fotografía editorial como ilustrativa.

## Do's and Don'ts

### Do:
- **Do** usa el verde esmeralda para acciones, orientación y enlaces de contacto.
- **Do** deja que la foto del hero abra la historia y presenta la oferta inmediatamente después.
- **Do** conserva anchos de lectura y el cambio a columnas según los breakpoints observados: 640px, 1024px y 1100px.
- **Do** usa SVG para iconos, texto real para etiquetas y un foco visible con contraste.
- **Do** etiqueta como ilustrativa la fotografía editorial y conserva los marcadores de casos hasta recibir material autorizado.
- **Do** respeta `prefers-reduced-motion` y mantiene controles operables con teclado.

### Don't:
- **Don't** comprimas titulares o marca más allá de -0.04em.
- **Don't** inventes fotos de pacientes, resultados, métricas, precios, credenciales ni datos de contacto.
- **Don't** conviertas los marcadores de caso en testimonios visuales sin autorización.
- **Don't** uses emojis o glifos de texto para sustituir los iconos SVG.
- **Don't** añadas kickers sobre los títulos, gradientes de texto ni sombras duras de bloque.
