document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFSdZkmu6Ri0y8cuMTFoVgTA0mhCD24yHm6HH7nRSLfCughrwdwbzx__MyY9-pVaX47Q/exec';
    let kanban;
    let tecnicosDisponibles = [];

    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', e => {
        e.preventDefault();
        if (e.target.querySelector('input').value === '666') {
            document.getElementById('password-container').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            document.getElementById('fecha-planificacion').valueAsDate = new Date();
            cargarTecnicosYTablero();
        } else {
            document.getElementById('password-status').textContent = 'Clave incorrecta.';
        }
    });

    function cargarTecnicosYTablero() {
        const url = `${SCRIPT_URL}?action=getTecnicos&t=${new Date().getTime()}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                tecnicosDisponibles = data;
                inicializarTablero();
            })
            .catch(error => alert('Error Crítico al cargar técnicos: ' + error.message));
    }

    function inicializarTablero() {
        kanban = new jKanban({
            element: '#admin-board',
            boards: [{'id': 'pendientes', 'title': 'Solicitudes Pendientes', 'item': []}],
            dropEl: function(el, target, source, sibling) {
                const idTarea = el.dataset.eid;
                const targetBoard = target.parentElement;
                if (targetBoard.dataset.id === 'pendientes') return;

                const headerControls = targetBoard.querySelector('.board-header-controls');
                if (!headerControls) return;
                
                const equipo = headerControls.querySelector('.equipo-select').value;
                const tecnico1 = headerControls.querySelector('.tecnico1-select').value;
                const tecnico2 = headerControls.querySelector('.tecnico2-select').value;
                const fecha = document.getElementById('fecha-planificacion').value;

                if (!equipo || !tecnico1) {
                    alert('Configure el equipo (letra y técnico 1) antes de asignar.');
                    return;
                }
                
                el.style.backgroundColor = '#dbeafe';
                
                fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'assignJob', id: idTarea, fecha, equipo, tecnico1, tecnico2 }),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.result !== 'success') throw new Error(data.message);
                    el.innerHTML += '<small style="color:green; display:block; margin-top:5px;">✓ Guardado</small>';
                })
                .catch(error => {
                    alert('Error al asignar la tarea: ' + error.message);
                    el.style.backgroundColor = '#fff';
                });
            }
        });
        cargarSolicitudes();
    }

    function cargarSolicitudes() {
        const boardTitle = document.querySelector('#pendientes .kanban-board-header');
        if (boardTitle) boardTitle.textContent = 'Cargando...';
        const url = `${SCRIPT_URL}?action=getSolicitudes&t=${new Date().getTime()}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (boardTitle) boardTitle.textContent = 'Solicitudes Pendientes';
                if (data && data.length > 0) {
                    data.forEach(solicitud => {
                        kanban.addElement('pendientes', {
                            id: solicitud.id,
                            title: `<strong>Cliente:</strong> ${solicitud.Nombre || ''}<br><strong>Zona:</strong> ${solicitud.Ubicacion || ''}<br><strong>Asesor:</strong> ${solicitud.Asesor || ''}`
                        });
                    });
                } else {
                     kanban.addElement('pendientes', { title: 'No hay solicitudes nuevas.' });
                }
            })
            .catch(error => {
                if (boardTitle) boardTitle.textContent = 'Error al Cargar';
                console.error('Error al cargar solicitudes:', error);
            });
    }

    document.getElementById('add-equipo-btn').onclick = () => {
        if (tecnicosDisponibles.length === 0) {
            alert('No hay técnicos disponibles. Añádelos en la hoja "Tecnicos".');
            return;
        }
        const equipoId = 'equipo-' + Date.now();
        const tecnicoOptions = tecnicosDisponibles.map(t => `<option value="${t}">${t}</option>`).join('');
        kanban.addBoards([{'id': equipoId, 'title': `
            <div class="board-header-controls">
                <select class="equipo-select"><option value="">Letra...</option>${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => `<option value="Equipo ${l}">Equipo ${l}</option>`).join('')}</select>
                <select class="tecnico1-select"><option value="">Técnico 1...</option>${tecnicoOptions}</select>
                <select class="tecnico2-select"><option value="">Técnico 2...</option>${tecnicoOptions}</select>
            </div>
        `}]);
    };
});
