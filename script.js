// --- Elementos del DOM ---
const imageUpload = document.getElementById('imageUpload');
const imageUrlInput = document.getElementById('imageUrl');
const loadImageFromUrlBtn = document.getElementById('loadImageFromUrl');
const imageDisplayWrapper = document.getElementById('imageDisplayWrapper');
const fileInputLabel = document.querySelector('.file-input-label');
const decodedMessageTextarea = document.getElementById('decodedMessage');
const copyMessageBtn = document.getElementById('copyMessage');
const symbolKeyboard = document.getElementById('symbolKeyboard');
const backspaceBtn = document.getElementById('backspaceBtn');
const spaceBtn = document.getElementById('spaceBtn');


// --- Configuración del Teclado de Símbolos (SOLO A-Z) ---
// Define aquí los símbolos y sus letras correspondientes.
// Asegúrate de que tengas una imagen para cada símbolo en la carpeta 'symbols/'.
const symbolsData = [];
for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // Genera 'A', 'B', 'C', ... 'Z'
    symbolsData.push({
        letter: letter,
        symbolImage: `simbolo_${letter}.png` // Ej: 'simbolo_A.png'
    });
}


// --- Funciones y Event Listeners ---

/**
 * Genera el teclado de símbolos dinámicamente.
 */
function generateSymbolKeyboard() {
    symbolKeyboard.innerHTML = ''; // Limpiar cualquier teclado existente
    symbolsData.forEach(symbol => {
        const button = document.createElement('button');
        button.classList.add('symbol-button');
        button.dataset.letter = symbol.letter; // Almacena la letra real como un atributo de datos

        const img = document.createElement('img');
        img.src = `symbols/${symbol.symbolImage}`; // Ruta a tus imágenes de símbolos
        img.alt = `Símbolo para ${symbol.letter}`;

        button.appendChild(img);
        symbolKeyboard.appendChild(button);

        button.addEventListener('click', () => {
            // Inserta la letra en la posición actual del cursor
            const start = decodedMessageTextarea.selectionStart;
            const end = decodedMessageTextarea.selectionEnd;
            const currentText = decodedMessageTextarea.value;
            decodedMessageTextarea.value = currentText.substring(0, start) + symbol.letter + currentText.substring(end);
            
            // Reposiciona el cursor después del texto insertado
            decodedMessageTextarea.selectionEnd = start + symbol.letter.length;
            decodedMessageTextarea.focus(); // Mantiene el foco en el textarea
        });
    });
}

/**
 * Actualiza el texto del label del input de archivo con el nombre del archivo seleccionado.
 */
imageUpload.addEventListener('change', () => {
    if (imageUpload.files.length > 0) {
        fileInputLabel.textContent = imageUpload.files[0].name;
        imageUrlInput.value = ''; // Limpia el input de URL si se carga un archivo
    } else {
        fileInputLabel.textContent = 'Seleccionar imagen';
    }
});

/**
 * Muestra una imagen en el contenedor principal.
 * @param {string} src - La URL o Data URL de la imagen a mostrar.
 * @param {HTMLElement} wrapper - El contenedor donde se mostrará la imagen.
 * @param {HTMLElement} placeholder - El elemento de texto placeholder asociado.
 */
function displayImageInWrapper(src, wrapper, placeholder) {
    wrapper.innerHTML = ''; // Limpiar contenido anterior
    placeholder.style.display = 'none'; // Ocultar placeholder

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Imagen cargada';
    img.onerror = () => {
        wrapper.innerHTML = `<p class="image-placeholder error">Error al cargar la imagen. Intenta con una URL válida o un archivo diferente.</p>`;
        placeholder.style.display = 'block'; // Mostrar placeholder de error
    };
    wrapper.appendChild(img);
}

// Event listener para cargar imagen clave desde el dispositivo
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const placeholder = document.querySelector('.image-display-wrapper .image-placeholder');
        displayImageInWrapper(e.target.result, imageDisplayWrapper, placeholder);
    } else {
        imageDisplayWrapper.innerHTML = '<p class="image-placeholder">La imagen clave aparecerá aquí.</p>';
    }
});

// Event listener para cargar imagen clave desde URL
loadImageFromUrlBtn.addEventListener('click', () => {
    const url = imageUrlInput.value.trim();
    if (url) {
        const imageExtensions = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i;
        const placeholder = document.querySelector('.image-display-wrapper .image-placeholder');

        if (imageExtensions.test(url)) {
            displayImageInWrapper(url, imageDisplayWrapper, placeholder);
            imageUpload.value = '';
            fileInputLabel.textContent = 'Seleccionar imagen';
        } else {
            alert('Por favor, introduce una URL de imagen válida (ej. .jpg, .png, .gif, .webp, .svg).');
            imageDisplayWrapper.innerHTML = '<p class="image-placeholder">La imagen clave aparecerá aquí.</p>';
        }
    } else {
        alert('Por favor, introduce una URL de imagen para cargar.');
        imageDisplayWrapper.innerHTML = '<p class="image-placeholder">La imagen clave aparecerá aquí.</p>';
    }
});

// Listener para el campo de texto decodificado
decodedMessageTextarea.addEventListener('keydown', (event) => {
    // Previene la entrada de teclado nativa
    event.preventDefault(); 
});

decodedMessageTextarea.addEventListener('input', (event) => {
    // Si por alguna razón el texto cambia (ej. pegar con Ctrl+V), asegura que sea mayúscula.
    event.target.value = event.target.value.toUpperCase();
});


// Event listener para el botón Borrar (Backspace)
backspaceBtn.addEventListener('click', () => {
    const start = decodedMessageTextarea.selectionStart;
    const end = decodedMessageTextarea.selectionEnd;
    const currentText = decodedMessageTextarea.value;

    if (start === end && start > 0) { // Si no hay selección y el cursor no está al inicio
        decodedMessageTextarea.value = currentText.substring(0, start - 1) + currentText.substring(end);
        decodedMessageTextarea.selectionEnd = start - 1; // Mueve el cursor a la izquierda
    } else if (start !== end) { // Si hay una selección
        decodedMessageTextarea.value = currentText.substring(0, start) + currentText.substring(end);
        decodedMessageTextarea.selectionEnd = start; // Mueve el cursor al inicio de la selección eliminada
    }
    decodedMessageTextarea.focus();
});

// Event listener para el botón Espacio
spaceBtn.addEventListener('click', () => {
    const start = decodedMessageTextarea.selectionStart;
    const end = decodedMessageTextarea.selectionEnd;
    const currentText = decodedMessageTextarea.value;
    decodedMessageTextarea.value = currentText.substring(0, start) + ' ' + currentText.substring(end);
    decodedMessageTextarea.selectionEnd = start + 1; // Mueve el cursor después del espacio
    decodedMessageTextarea.focus();
});


// Event listener para copiar el mensaje al portapapeles
copyMessageBtn.addEventListener('click', () => {
    if (decodedMessageTextarea.value.trim()) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(decodedMessageTextarea.value)
                .then(() => {
                    alert('¡Mensaje copiado al portapapeles!');
                })
                .catch(err => {
                    console.error('Error al copiar el mensaje con navigator.clipboard:', err);
                    fallbackCopyTextToClipboard(decodedMessageTextarea.value);
                });
        } else {
            fallbackCopyTextToClipboard(decodedMessageTextarea.value);
        }
    } else {
        alert('No hay mensaje para copiar.');
    }
});

/**
 * Función de respaldo para copiar texto al portapapeles usando document.execCommand.
 * @param {string} text - El texto a copiar.
 */
function fallbackCopyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('¡Mensaje copiado al portapapeles!');
        } else {
            alert('No se pudo copiar el mensaje automáticamente. Por favor, cópialo manualmente (Ctrl+C o Cmd+C).');
        }
    } catch (err) {
        console.error('Error al copiar el mensaje con execCommand:', err);
        alert('No se pudo copiar el mensaje automáticamente. Por favor, cópialo manualmente (Ctrl+C o Cmd+C).');
    }

    document.body.removeChild(textarea);
}

// --- Inicialización al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    generateSymbolKeyboard(); // Generar el teclado al cargar la página
});
