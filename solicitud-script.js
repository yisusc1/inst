document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFSdZkmu6Ri0y8cuMTFoVgTA0mhCD24yHm6HH7nRSLfCughrwdwbzx__MyY9-pVaX47Q/exec';
    const form = document.getElementById('solicitudForm');

    // --- LÓGICA PARA ESTABLECER FECHA Y HORA AUTOMÁTICAS ---
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    
    function setDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        
        fechaInput.value = `${year}-${month}-${day}`;
        horaInput.value = `${hours}:${minutes}`;
    }
    
    setDateTime(); // Establece la fecha y hora al cargar la página

    // --- LÓGICA PARA CAMPOS "OTRO" ---
    const asesorSelect = document.getElementById('asesor');
    const otroAsesorInput = document.getElementById('otro_asesor');
    asesorSelect.addEventListener('change', function() {
        const isOtro = this.value === 'Otro';
        otroAsesorInput.style.display = isOtro ? 'block' : 'none';
        otroAsesorInput.required = isOtro;
    });

    const fuenteSelect = document.getElementById('fuente');
    const otraFuenteInput = document.getElementById('otra_fuente');
    fuenteSelect.addEventListener('change', function() {
        const isOtro = this.value === 'Otro';
        otraFuenteInput.style.display = isOtro ? 'block' : 'none';
        otraFuenteInput.required = isOtro;
    });
    
    // --- LÓGICA DE ENVÍO DEL FORMULARIO ---
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const whatsappTab = window.open('', '_blank');
        
        const formData = new FormData(form);

        // Si se seleccionó "Otro", reemplaza el valor principal con el del campo de texto
        if (formData.get('Asesor') === 'Otro') {
            formData.set('Asesor', formData.get('otro_asesor'));
        }
        if (formData.get('Fuente') === 'Otro') {
            formData.set('Fuente', formData.get('otra_fuente'));
        }
        
        const message = `*--- Nueva Solicitud de Servicio ---*\n\n` +
            `*Fecha:* ${formData.get('Fecha')}\n` +
            `*Hora:* ${formData.get('Hora')}\n` +
            `*Nombre y Apellido:* ${formData.get('Nombre y Apellido') || ''}\n` +
            `*Cédula:* ${formData.get('Cédula') || ''}\n` +
            `*Contacto:* ${formData.get('Contacto') || ''}\n` +
            `*Contacto 2:* ${formData.get('Contacto2') || 'N/A'}\n` +
            `*Ubicación:* ${formData.get('Ubicacion') || ''}\n` +
            `*Municipio:* ${formData.get('Municipio') || ''}\n` +
            `*Sector:* ${formData.get('Sector') || ''}\n` +
            `*Calle/Avenida:* ${formData.get('Calle') || ''}\n` +
            `*Casa/Edif:* ${formData.get('Casa') || ''}\n` +
            `*Correo electrónico:* ${formData.get('Email') || ''}\n` +
            `*Servicio:* ${formData.get('Servicio') || ''}\n` +
            `*Dia de disponibilidad:* ${formData.get('Dia de disponibilidad') || ''}\n` +
            `*Asesor:* ${formData.get('Asesor') || ''}\n` +
            `*Fuente:* ${formData.get('Fuente') || ''}`;

        const htmlPreview = message.replace(/\n/g, '<br>');
        whatsappTab.document.write(`<html><head><title>Vista Previa</title><style>body{font-family:sans-serif;padding:20px;line-height:1.6;}</style></head><body><h3>Revisa tu mensaje...</h3><p>${htmlPreview}</p><hr><p><i>Guardando y conectando con WhatsApp...</i></p></body></html>`);
        
        const submitButton = form.querySelector('button[type="submit"]');
        const statusMessage = document.getElementById('status-message');
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';
        
        fetch(SCRIPT_URL, { method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {
                if (data.result !== 'success') throw new Error(data.message);
                
                whatsappTab.location.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
                form.reset();
                setDateTime(); // Restablece la fecha y hora después de enviar
                
                statusMessage.textContent = '¡Solicitud guardada con éxito!';
                statusMessage.className = 'status-message success';
            })
            .catch(error => {
                whatsappTab.close();
                statusMessage.textContent = `Error: ${error.message}`;
                statusMessage.className = 'status-message error';
                alert(`Error: ${error.message}`);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Guardar y Enviar';
            });
    });
});
