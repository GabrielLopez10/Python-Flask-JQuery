$(document).ready(function() {
    const url = 'http://gaston10.pythonanywhere.com/alumnos';

    let selectAll = false;
    let alumnos = [];
    let error = false;
    let cargando = true;
    let showDeleteConfirmation = false;
    let id = 0;
    let nombre = '';
    let email = '';
    let telefono = 0;

    function fetchData() {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                alumnos = data.alumnos;
                cargando = false;
            },
            error: function(err) {
                console.error(err);
                error = true;
            }
        });
    }

    function toggleSelectAll() {
        if (selectAll) {
            alumnos.forEach(function(alumno) {
                alumno.selected = true;
            });
        } else {
            alumnos.forEach(function(alumno) {
                alumno.selected = false;
            });
        }
    }

    function toggleIndividualCheckbox() {
        if (!alumnos.some(function(alumno) { return !alumno.selected; })) {
            selectAll = true;
        } else {
            selectAll = false;
        }
    }

    function deleteAllEntries() {
        const selectedEntries = alumnos.filter(function(alumno) {
            return alumno.selected;
        });

        if (selectedEntries.length > 0) {
            showDeleteConfirmation = true;
        } else {
            alert('Por favor, selecciona al menos una entrada para borrar.');
        }
    }

    function confirmDeleteAll() {
        const selectedIds = alumnos
            .filter(function(alumno) {
                return alumno.selected;
            })
            .map(function(alumno) {
                return alumno.id;
            });

        if (selectedIds.length > 0) {
            const deletePromises = selectedIds.map(function(id) {
                const deleteUrl = url + '/' + id;

                return $.ajax({
                    url: deleteUrl,
                    method: 'DELETE',
                });
            });

            $.when.apply($, deletePromises)
                .done(function() {
                    alert('Todas las entradas seleccionadas han sido eliminadas');
                    fetchData();
                    showDeleteConfirmation = false;
                    location.reload();
                })
                .fail(function(err) {
                    console.error(err);
                    alert('Error al borrar las entradas');
                });
        }
    }

    function editar(alumno) {
        const editUrl = url + '/' + alumno.id;

        const updatedAlumno = {
            nombre: alumno.nombre,
            email: alumno.email,
            telefono: alumno.telefono
        };

        const modal = $('#editEmployeeModal-' + alumno.id); // Updated modal selector
        const form = modal.find('form');
        const cancelBtn = modal.find('input[value="Cancelar"]');
        const saveBtn = modal.find('input[value="Guardar"]');

        form.on('submit', function(e) {
            e.preventDefault();

            const options = {
                data: JSON.stringify(updatedAlumno),
                contentType: 'application/json',
                method: 'PUT',
                success: function() {
                    alert('Registro modificado');
                    fetchData();
                    alumno.nombre = '';
                    alumno.email = '';
                    alumno.telefono = '';
                    alumno.showModal = false;
                    window.location.href = '/login/home';
                },
                error: function(err) {
                    console.error(err);
                    alert('Error al modificar el registro');
                },
                complete: function() {
                    cancelBtn.prop('disabled', false);
                    saveBtn.prop('disabled', false);
                }
            };

            cancelBtn.prop('disabled', true);
            saveBtn.prop('disabled', true);

            $.ajax(editUrl, options);
        });

        // Show the modal
        modal.modal('show');
    }

    function eliminar(id) {
        const deleteUrl = url + '/' + id;

        const options = {
            method: 'DELETE',
            success: function() {
                alert('Registro eliminado');
                location.reload();
            },
            error: function(err) {
                console.error(err);
                alert('Error al eliminar el registro');
            }
        };

        $.ajax(deleteUrl, options);
    }

    function grabar() {
        const alumno = {
            nombre: nombre,
            email: email,
            telefono: telefono,
        };

        const options = {
            data: JSON.stringify(alumno),
            contentType: 'application/json',
            method: 'POST',
            success: function() {
                alert('Registro grabado');
                window.location.href = '/login/home';
            },
            error: function(err) {
                console.error(err);
                alert('Error al grabar el registro');
            }
        };

        $.ajax(url, options);
    }

    fetchData();

    $('#selectAll').on('click', toggleSelectAll);
    $('.individualCheckbox').on('click', toggleIndividualCheckbox);
    $('#deleteAll').on('click', deleteAllEntries);
    $('#confirmDelete').on('click', confirmDeleteAll);
    $('.editBtn').on('click', function() {
        const alumnoId = $(this).data('alumno-id');
        const alumno = alumnos.find(function(a) {
            return a.id === alumnoId;
        });
        editar(alumno);
    });
    $('.deleteBtn').on('click', function() {
        const alumnoId = $(this).data('alumno-id');
        eliminar(alumnoId);
    });
    $('#saveBtn').on('click', grabar);
});
