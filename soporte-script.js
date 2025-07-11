document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFSdZkmu6Ri0y8cuMTFoVgTA0mhCD24yHm6HH7nRSLfCughrwdwbzx__MyY9-pVaX47Q/exec';

    const passwordContainer = document.getElementById('password-container');
    const formContainer = document.getElementById('form-container');
    const passwordForm = document.getElementById('password-form');
    
    const fechaInput = document.getElementById('soporte-fecha');
    const horaInput = document.getElementById('soporte-hora');
    const coordsBtn = document.getElementById('get-coords-btn');
    const coordsInput = document.getElementById('soporte-coordenadas');
    
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (e.target.querySelector('input').value === '1111') {
            passwordContainer.style.display = 'none';
            formContainer.style.display = 'block';
            const now = new Date();
            fechaInput.value = now.toISOString().split('T')[0];
            horaInput.value = now.toTimeString().split(' ')[0].substring(0, 5);
        } else {
            document.getElementById('password-status').textContent = 'Clave incorrecta.';
        }
    });

    coordsBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            coordsInput.value = 'Geolocalización no soportada.';
            return;
        }
        coordsInput.placeholder = 'Obteniendo coordenadas...';
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lon = position.coords.longitude.toFixed(6);
            coordsInput.value = `${lat}, ${lon}`;
        }, () => {
            coordsInput.placeholder = 'No se pudo obtener la ubicación.';
        });
    });
    
    const form = document.getElementById('soporteForm');
    form.addEventListener('submit', e => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const statusMessage = document.getElementById('status-message');
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';
        statusMessage.textContent = 'Leyendo formulario...';

        const fileInput = document.getElementById('soporte-imagen');
        const file = fileInput.files[0];

        if (file) {
            statusMessage.textContent = 'Procesando imagen...';
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileData = {
                    imagenData: e.target.result,
                    imagenNombre: file.name,
                    imagenMimeType: file.type
                };
                sendData(fileData);
            };
            reader.onerror = function() {
                alert('Error al leer el archivo de imagen.');
                submitButton.disabled = false;
                submitButton.textContent = 'Guardar y Enviar';
            };
            reader.readAsDataURL(file);
        } else {
            sendData({});
        }
    });

    function sendData(fileInfo) {
        const formData = new FormData(form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        const dataToSend = { ...formObject, ...fileInfo };

        const reporte = `*Reporte Técnico de Soporte:*\n\n*Fecha:* ${dataToSend.Fecha}\n*Hora:* ${dataToSend.Hora}\n*Cliente:* ${dataToSend.Cliente}\n*Precinto:* ${dataToSend.Precinto}\n*Caja Nap:* ${dataToSend['Caja Nap']}\n*Coordenadas:* http://googleusercontent.com/maps.google.com/8{dataToSend.Coordenadas}\n*Estatus:* ${dataToSend.Estatus}\n*Causa:* ${dataToSend.Causa}\n*Acción Realizada:* ${dataToSend['Accion Realizada']}\n*Conectores:* ${dataToSend['Conectores utilizados']}\n*Metraje:* ${dataToSend['Metraje utilizado']}\n*Observaciones:* ${dataToSend['Observaciones Adicionales']}\n*Realizado por:* ${dataToSend['Realizado por']}`;
        const htmlPreview = reporte.replace(/\n/g, '<br>');

        const whatsappTab = window.open('', '_blank');
        whatsappTab.document.write(`<html><head><title>Vista Previa</title><style>body{font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;}</style></head><body><h3>Revisa tu mensaje...</h3><p>${htmlPreview}</p><hr><p><i>Subiendo imagen y guardando datos...</i></p></body></html>`);

        const submitButton = form.querySelector('button[type="submit"]');
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = 'Enviando al servidor...';
        
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.result !== 'success') throw new Error(data.message);

            let finalReporte = reporte;
            if (data.imageUrl) {
                finalReporte += `\n*Enlace a la Imagen:* ${data.imageUrl}`;
            }

            whatsappTab.location.href = `https://wa.me/?text=${encodeURIComponent(finalReporte)}`;
            
            form.reset();
            const now = new Date();
            document.getElementById('soporte-fecha').value = now.toISOString().split('T')[0];
            document.getElementById('soporte-hora').value = now.toTimeString().split(' ')[0].substring(0, 5);
            statusMessage.textContent = '¡Reporte guardado con éxito!';
        })
        .catch(error => {
            whatsappTab.close();
            statusMessage.textContent = `Error: ${error.message}`;
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar y Enviar';
        });
    }
});
