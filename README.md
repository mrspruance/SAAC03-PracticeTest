# SAA-C03 Practice Test

Simulador de práctica para el examen **AWS Solutions Architect – Associate (SAA-C03)**. Corre completamente en el navegador, sin dependencias ni backend.

## Características

- **Modo práctica** — feedback inmediato al confirmar cada respuesta: muestra si acertaste y la explicación de cada alternativa.
- **Modo examen** — sin feedback hasta el final, con temporizador regresivo que simula las condiciones reales del examen.
- Navegación entre preguntas (siguiente / anterior) en modo examen.
- Resultado final con porcentaje, indicador visual de aprobación (~72%) y revisión detallada de todas las respuestas.
- Opciones configurables: cantidad de preguntas (10, 20, 65 o todas), duración del examen y orden aleatorio.
- Enlace a la documentación oficial de AWS en cada pregunta.

## Dominios cubiertos

| Dominio | Tema | Peso |
|---------|------|------|
| 1 | Diseño de arquitecturas seguras | 30 % |
| 2 | Diseño de arquitecturas resilientes | 26 % |
| 3 | Diseño de arquitecturas de alto rendimiento | 24 % |
| 4 | Diseño de arquitecturas optimizadas en costos | 20 % |

## Uso

No se requiere instalación. Abre `index.html` directamente en cualquier navegador moderno.

```
open index.html
```

O sirve los archivos con cualquier servidor local estático, por ejemplo:

```bash
npx serve .
# o
python3 -m http.server
```

## Estructura del proyecto

```
├── index.html      # Estructura y pantallas de la UI
├── styles.css      # Estilos
├── questions.js    # Banco de preguntas (variable QUESTIONS)
└── app.js          # Lógica del simulador
```

Para agregar o editar preguntas, modifica el array `QUESTIONS` en `questions.js` siguiendo esta estructura:

```js
{
  domain: "Dominio 1 · Arquitecturas seguras",
  text: "Enunciado de la pregunta",
  multiple: false,                          // true si hay más de una respuesta correcta
  doc: "https://docs.aws.amazon.com/...",   // enlace a documentación oficial
  options: [
    { text: "Opción A", correct: true,  explanation: "Explicación..." },
    { text: "Opción B", correct: false, explanation: "Explicación..." }
  ]
}
```

## Aviso

Contenido de práctica no oficial creado con fines de estudio. AWS y SAA-C03 son marcas registradas de Amazon Web Services. Verifica siempre con la [documentación oficial de AWS](https://docs.aws.amazon.com/).
