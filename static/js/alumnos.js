$(document).ready(function () {
    var alumnos = []; // Define the alumnos array
  
    // Fetch Alumnos Data
    $.ajax({
      url: 'https://gaston10.pythonanywhere.com/alumnos',
      method: 'GET',
      dataType: 'json',
      success: function (response) {
        alumnos = response.alumnos; // Assign the response to the alumnos array
        var tableBody = $('#alumnosTableBody');
  
        alumnos.forEach(function (alumno) {
          var row = $('<tr></tr>');
          row.append('<td scope="row"><input type="checkbox" class="individualCheckbox"></td>');
          row.append('<td>' + alumno.id + '</td>');
          row.append('<td>' + alumno.nombre + '</td>');
          row.append('<td>' + alumno.email + '</td>');
          row.append('<td>' + alumno.telefono + '</td>');
          var actionsColumn = $('<td></td>');
          var deleteModalId = 'deleteEmployeeModal-' + alumno.id;
          var editModalId = 'editEmployeeModal-' + alumno.id;
          actionsColumn.append('<a href="#" class="edit" data-bs-toggle="modal" data-bs-target="#' + editModalId + '"><i class="material-icons" data-bs-toggle="tooltip" title="Edit">&#xE254;</i></a>');
          actionsColumn.append('<a href="#" class="delete" data-bs-toggle="modal" data-bs-target="#' + deleteModalId + '"><i class="material-icons" title="Eliminar">&#xE872;</i></a>');
          row.append(actionsColumn);
          tableBody.append(row);
  
          // Create the delete modal
          var deleteModal = $('<div id="' + deleteModalId + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="deleteEmployeeModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<form>' +
            '<div class="modal-header">' +
            '<h4 class="modal-title">Borrar Alumno</h4>' +
            '<button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">&times;</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>Confirmar esta Acción</p>' +
            '<p class="text-warning"><small>Esta acción no se puede deshacer.</small></p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<input type="button" class="btn btn-default" data-bs-dismiss="modal" value="Cancelar">' +
            '<button type="button" class="btn btn-danger btn-delete" data-alumno-id="' + alumno.id + '">Eliminar</button>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '</div>');
  
          // Append the delete modal to the document body
          $('body').append(deleteModal);
  
          // Create the edit modal
          var editModal = $('<div id="' + editModalId + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="editEmployeeModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<form>' +
            '<div class="modal-header">' +
            '<h4 class="modal-title">Editar Alumno</h4>' +
            '<button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">&times;</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<div class="form-group">' +
            '<label for="' + editModalId + '-nombre">Nombre</label>' +
            '<input type="text" class="form-control" id="' + editModalId + '-nombre" value="' + alumno.nombre + '">' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="' + editModalId + '-email">Email</label>' +
            '<input type="email" class="form-control" id="' + editModalId + '-email" value="' + alumno.email + '">' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="' + editModalId + '-telefono">Teléfono</label>' +
            '<input type="text" class="form-control" id="' + editModalId + '-telefono" value="' + alumno.telefono + '">' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<input type="button" class="btn btn-default" data-bs-dismiss="modal" value="Cancelar">' +
            '<button type="button" class="btn btn-primary btn-edit" data-alumno-id="' + alumno.id + '">Guardar</button>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '</div>');
  
          // Append the edit modal to the document body
          $('body').append(editModal);
  
          editModal.find('.btn-edit').click(function () {
            var editModalId = $(this).closest('.modal').attr('id');
            var editedData = {
              nombre: $('#' + editModalId + '-nombre').val(),
              email: $('#' + editModalId + '-email').val(),
              telefono: $('#' + editModalId + '-telefono').val()
            };
  
            // Call the editar function passing the alumno id, editedData, and the button that triggered the event
            editar(alumno.id, editedData, $(this));
  
            // Close the modal
            $('#' + editModalId).modal('hide');
          });
        });
  
        // Toggle individual checkbox when clicked
        $('.individualCheckbox').change(function () {
          var selectAllCheckbox = $('#selectAll');
          if ($('.individualCheckbox:checked').length === alumnos.length) {
            selectAllCheckbox.prop('checked', true);
          } else {
            selectAllCheckbox.prop('checked', false);
          }
        });
  
        // Handle Delete Confirmation
        $('.delete').on('click', function () {
          var deleteModalId = $(this).data('bs-target');
          $(deleteModalId).modal('show');
        });
  
        // Handle Delete Action
        $('.btn-delete').on('click', function () {
          var alumnoId = $(this).data('alumno-id');
          eliminar(alumnoId, $(this)); // Call the eliminar function with the alumnoId and the clicked button
        });
      },
    });
  
    // Handle Select All Checkbox
    $('#selectAll').change(function () {
      var isChecked = $(this).prop('checked');
      $('.individualCheckbox').prop('checked', isChecked);
    });
  
    // Function to delete an entry
    function eliminar(id, button) {
      const deleteUrl = 'https://gaston10.pythonanywhere.com/alumnos/' + id;
  
      const options = {
        method: 'DELETE',
        success: function () {
          alert('Registro eliminado');
          // Remove the deleted entry from the table
          button.closest('tr').remove();
          // Hide the modal
          button.closest('.modal').modal('hide');
          location.reload()
        },
        error: function (err) {
          console.error(err);
          alert('Error al eliminar el registro');
        }
      };
  
      $.ajax(deleteUrl, options);
    }
  
    // Function to edit an entry
    function editar(id, editedData, button) {
      console.log('Edit button clicked. Alumno ID:', id);
  
      var editUrl = 'https://gaston10.pythonanywhere.com/alumnos/' + id;
  
      console.log('Edited data:', editedData);
  
      var options = {
        url: editUrl,
        method: 'PUT',
        data: JSON.stringify(editedData),
        contentType: 'application/json',
        success: function (response) {
          console.log('Edit success. Response:', response);
  
          // Update the JSON data with the edited values
          updateJSONData(id, editedData);
  
          alert('Registro actualizado');
          // Update the table row with the updated data
          updateTableRow(id, editedData);
  
          // Hide the modal
          button.closest('.modal').modal('hide');
          location.reload();
        },
        error: function (err) {
          console.error('Edit error:', err);
          alert('Error al actualizar el registro');
        }
      };
  
      $.ajax(editUrl, options);
    }
  
    // Function to update the JSON data with the edited values
    function updateJSONData(id, editedData) {
      // Find the corresponding entry in the JSON data array
      var entry = alumnos.find(function (alumno) {
        return alumno.id === id;
      });
  
      // Update the entry with the edited values
      if (entry) {
        entry.nombre = editedData.nombre;
        entry.email = editedData.email;
        entry.telefono = editedData.telefono;
      }
    }
  
    // Function to update the table row with the updated data
    function updateTableRow(id, editedData) {
      var row = $('#' + id).closest('tr');
      row.find('.nombre').text(editedData.nombre);
      row.find('.email').text(editedData.email);
      row.find('.telefono').text(editedData.telefono);
    }
  });
  