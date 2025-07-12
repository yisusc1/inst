document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFSdZkmu6Ri0y8cuMTFoVgTA0mhCD24yHm6HH7nRSLfCughrwdwbzx__MyY9-pVaX47Q/exec';
    const passwordContainer = document.getElementById('password-container');
    const formContainer = document.getElementById('form-container');
    const passwordForm = document.getElementById('password-form');
    
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (e.target.querySelector('input').value === '0000') {
            passwordContainer.style.display = 'none';
            formContainer.style.display = 'block';
        } else {
            document.getElementById('password-status').textContent = 'Clave incorrecta.';
        }
    });
    
    const form = document.getElementById('reporteForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const whatsappTab = window.open('', '_blank');
        const formData = new FormData(form);
        const reporte = `*Reporte De instalación:*\n` +
            `*Equipo:* ${formData.get('Equipo') || 'N/A'}\n` +
            `*Fecha:* ${formData.get('Fecha') || ''}\n` +
            `*Hora:* ${formData.get('Hora') || ''}\n` +
            `*Cliente:* ${formData.get('Cliente') || 'N/A'}\n` +
            `*SI Asignado:* ${formData.get('SI Asignado') || 'N/A'}\n` +
            `*PW Asignado:* ${formData.get('PW Asignado') || 'N/A'}\n` +
            `*MAC:* ${formData.get('MAC') || 'N/A'}\n` +
            `*Precinto:* ${formData.get('Precinto') || 'N/A'}\n` +
            `*ONU PON:* ${formData.get('ONU PON') || 'N/A'}\n` +
            `*Router:* ${formData.get('Router') || 'N/A'}\n` +
            `*PLAN:* ${formData.get('PLAN') || 'N/A'}\n` +
            `*V. descarga:* ${formData.get('V. descarga') || 'N/A'}\n` +
            `*V. Subida:* ${formData.get('V. Subida') || 'N/A'}\n` +
            `*Potencia NAP:* ${formData.get('Potencia NAP') || 'N/A'}\n` +
            `*Potencia Cliente:* ${formData.get('Potencia Cliente') || 'N/A'}\n` +
            `*Caja NAP:* ${formData.get('Caja NAP') || 'N/A'}\n` +
            `*Puerto:* ${formData.get('Puerto') || 'N/A'}\n` +
            `*Metraje Utilizado:* ${formData.get('Metraje Utilizado') || 'N/A'}\n` +
            `*Metraje Desechado:* ${formData.get('Metraje Desechado') || 'N/A'}\n` +
            `*Tensores Utilizados:* ${formData.get('Tensores Utilizados') || 'N/A'}\n` +
            `*Instalación:* ${formData.get('Instalación') || 'N/A'}\n` +
            `*Técnico 1:* ${formData.get('Técnico 1') || 'N/A'}\n` +
            `*Técnico 2:* ${formData.get('Técnico 2') || 'N/A'}`;
        
        const htmlPreview = reporte.replace(/\n/g, '<br>');
        whatsappTab.document.write(`<html><head><title>Vista Previa</title></head><body><p>${htmlPreview}</p></body></html>`);
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        
        fetch(SCRIPT_URL, { method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {
                if (data.result !== 'success') throw new Error(data.message);
                whatsappTab.location.href = `https://wa.me/?text=${encodeURIComponent(reporte)}`;
                form.reset();
            })
            .catch(error => {
                whatsappTab.close();
                alert(`Error: ${error.message}`);
            })
            .finally(() => {
                submitButton.disabled = false;
            });
    });
});