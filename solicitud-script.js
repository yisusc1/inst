document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFSdZkmu6Ri0y8cuMTFoVgTA0mhCD24yHm6HH7nRSLfCughrwdwbzx__MyY9-pVaX47Q/exec';
    const form = document.getElementById('solicitudForm');

    // --- LÓGICA PARA ESTABLECER FECHA Y HORA AUTOMÁTICAS ---
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const now = new Date();
    // Formato YYYY-MM-DD para el input de fecha
    const today = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
    // Formato HH:MM para el input de hora
    const time = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    fechaInput.value = today;
    horaInput.value = time;

    // --- LÓGICA PARA CAMPOS "OTRO" ---
    const asesorSelect = document.getElementById('asesor');
    const otroAsesorInput = document.getElementById('otro_asesor');
    asesorSelect.addEventListener('change', function() {
        otroAsesorInput.style.display = (this.value === 'Otro') ? 'block' : 'none';
        otroAsesorInput.required = (this.value === 'Otro');
    });

    const fuenteSelect = document.getElementById('fuente');
    const otraFuenteInput = document.getElementById('otra_fuente');
    fuenteSelect.addEventListener('change', function() {
        otraFuenteInput.style.display = (this.value === 'Otro') ? 'block' : 'none';
        otraFuenteInput.required = (this.value === 'Otro');
    });
    
    // --- LÓGICA DE ENVÍO DEL FORMULARIO ---
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const whatsappTab = window.open('', '_blank');
        const formData = new FormData(form);

        // Si el asesor es 'Otro', usamos el valor del campo de texto
        if (formData.get('Asesor') === 'Otro') {
            formData.set('Asesor', formData.get('otro_asesor'));
        }
        // Si la fuente es 'Otra', usamos el valor del campo de texto
        if (formData.get('Fuente') === 'Otro') {
            formData.set('Fuente', formData.get('otra_fuente'));
        }
        
        const message = `*--- Nueva Solicitud de Servicio ---*\n\n` +
            `*Fecha:* ${formData.get('Fecha')}\n` +
            `*Hora:* ${formData.get('Hora')}\n` +
            `*Nombre y Apellido:* ${formData.get('Nombre') || ''}\n` +
            `*Cédula:* ${formData.get('Cedula') || ''}\n` +
            `*Contacto:* ${formData.get('Contacto') || ''}\n` +
            `*Contacto 2:* ${formData.get('Contacto2') || 'N/A'}\n` +
            `*Ubicación:* ${formData.get('Ubicacion') || ''}\n` +
            `*Municipio:* ${formData.get('Municipio') || ''}\n` +
            `*Sector:* ${formData.get('Sector') || ''}\n` +
            `*Calle/Avenida:* ${formData.get('Calle') || ''}\n` +
            `*Casa/Edif:* ${formData.get('Casa') || ''}\n` +
            `*Correo electrónico:* ${formData.get('Email') || ''}\n` +
            `*Servicio:* ${formData.get('Servicio') || ''}\n` +
            `*Día de disponibilidad:* ${formData.get('Disponibilidad') || ''}\n` +
            `*Asesor:* ${formData.get('Asesor') || ''}\n` +
            `*Fuente:* ${formData.get('Fuente') || ''}`;

        const htmlPreview = message.replace(/\n/g, '<br>');
        whatsappTab.document.write(`<html><head><title>Vista Previa</title><style>body{font-family:sans-serif;padding:20px;}</style></head><body><h3>Revisa tu mensaje...</h3><p>${htmlPreview}</p><hr><p><i>Guardando...</i></p></body></html>`);
        
        const submitButton = form.querySelector('button[type="submit"]');
        const statusMessage = document.getElementById('status-message');
        submitButton.disabled = true;
        
        fetch(SCRIPT_URL, { method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {
                if (data.result !== 'success') throw new Error(data.message);
                whatsappTab.location.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
                form.reset();
                // Volver a poner la fecha y hora actuales después de resetear
                fechaInput.value = today;
                horaInput.value = time;
                statusMessage.textContent = '¡Solicitud guardada con éxito!';
            })
            .catch(error => {
                whatsappTab.close();
                alert(`Error: ${error.message}`);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Guardar y Enviar';
            });
    });
});
