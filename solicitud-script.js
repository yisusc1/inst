document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFSdZkmu6Ri0y8cuMTFoVgTA0mhCD24yHm6HH7nRSLfCughrwdwbzx__MyY9-pVaX47Q/exec';
    const form = document.getElementById('solicitudForm');
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const whatsappTab = window.open('', '_blank');
        const formData = new FormData(form);
        
        const message = `*--- Nueva Solicitud de Servicio ---*\n\n` +
            `*Fecha:* ${formData.get('Fecha') || ''}\n` +
            `*Hora:* ${formData.get('Hora') || ''}\n` +
            `*Nombre:* ${formData.get('Nombre') || ''}\n` +
            `*Cedula:* ${formData.get('Cedula') || ''}\n` +
            `*Contacto:* ${formData.get('Contacto') || ''}\n` +
            `*Contacto2:* ${formData.get('Contacto2') || 'N/A'}\n` +
            `*Ubicacion:* ${formData.get('Ubicacion') || ''}\n` +
            `*Municipio:* ${formData.get('Municipio') || ''}\n` +
            `*Sector:* ${formData.get('Sector') || ''}\n` +
            `*Calle:* ${formData.get('Calle') || ''}\n` +
            `*Casa:* ${formData.get('Casa') || ''}\n` +
            `*Email:* ${formData.get('Email') || ''}\n` +
            `*Servicio:* ${formData.get('Servicio') || ''}\n` +
            `*Disponibilidad:* ${formData.get('Disponibilidad') || ''}\n` +
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
                statusMessage.textContent = '¡Solicitud guardada con éxito!';
                statusMessage.className = 'status-message success';
            })
            .catch(error => {
                whatsappTab.close();
                statusMessage.textContent = `Error: ${error.message}`;
                statusMessage.className = 'status-message error';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Guardar y Enviar';
            });
    });
});
