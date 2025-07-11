document.addEventListener('DOMContentLoaded', () => {

    const passwordContainer = document.getElementById('password-container');
    const adminPanel = document.getElementById('admin-panel');
    const passwordForm = document.getElementById('password-form');
    
    // Lógica para la contraseña
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (e.target.querySelector('input').value === '666') {
            passwordContainer.style.display = 'none';
            adminPanel.style.display = 'block';
            inicializarTablero();
        } else {
            document.getElementById('password-status').textContent = 'Clave incorrecta.';
        }
    });

    // Lógica para inicializar el tablero Kanban
    function inicializarTablero() {
        const kanban = new jKanban({
            element: '#admin-board', // Elige el contenedor
            gutter: '20px',          // Espacio entre columnas
            widthBoard: '280px',     // Ancho de cada columna
            
            // Definición de las columnas del tablero
            boards: [
                {
                    'id': 'pendientes',
                    'title': 'Solicitudes Pendientes',
                    'class': 'info',
                    'item': [
                        {
                            'title': `
                                <strong>Cliente:</strong> Ana Pérez<br>
                                <strong>Servicio:</strong> Plan Fibra 400MB<br>
                                <strong>Zona:</strong> Los Teques
                            `,
                        }
                    ]
                },
                {
                    'id': 'lunes',
                    'title': 'Lunes',
                    'class': 'primary',
                    'item': []
                },
                {
                    'id': 'martes',
                    'title': 'Martes',
                    'class': 'primary',
                    'item': []
                },
                {
                    'id': 'miercoles',
                    'title': 'Miércoles',
                    'class': 'primary',
                    'item': []
                },
                {
                    'id': 'jueves',
                    'title': 'Jueves',
                    'class': 'primary',
                    'item': []
                },
                {
                    'id': 'viernes',
                    'title': 'Viernes',
                    'class': 'primary',
                    'item': []
                }
            ],
            // Evento que se dispara cuando mueves una tarjeta
            dropEl: function(el, target, source, sibling) {
                const idTarea = el.dataset.eid;
                const idColumnaOrigen = source.parentElement.dataset.id;
                const idColumnaDestino = target.parentElement.dataset.id;
                
                console.log(`Se movió la tarea ${idTarea} de la columna ${idColumnaOrigen} a ${idColumnaDestino}`);
                // Aquí irá la lógica para guardar el cambio en la hoja de cálculo
            }
        });
    }
});