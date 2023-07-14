$('#header').html('<nav class="navbar navbar-expand-sm navbar-light bg-light">' +
  '<div class="container">' +
  '  <a class="navbar-brand" href="#">Administrador</a>' +
  '  <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation">' +
  '    <span class="navbar-toggler-icon"></span>' +
  '  </button>' +
  '  <div class="collapse navbar-collapse" id="collapsibleNavId">' +
  '    <ul class="navbar-nav me-auto mt-2 mt-lg-0">' +
  '      <li class="nav-item">' +
  '        <a id="homeLink" class="nav-link active" href="http://127.0.0.1:5000/index" aria-current="page">Home <span class="visually-hidden">(current)</span></a>' +
  '      </li>' +
  '      <li class="nav-item">' +
  '        <a class="nav-link" href="#">Link</a>' +
  '      </li>' +
  '      <li id="crud" class="nav-item dropdown">' +
  '        <a class="nav-link dropdown-toggle" href="#" id="dropdownId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">CRUD</a>' +
  '        <div class="dropdown-menu" aria-labelledby="dropdownId">' +
  '          <a class="dropdown-item" href="http://127.0.0.1:5000/login/home">Alumnos</a>' +
  '          <a class="dropdown-item" href="#">Action 2</a>' +
  '        </div>' +
  '      </li>' +
  '      <li class="nav-item">' +
  '        <a class="nav-link" href="http://127.0.0.1:5000/login">Logout</a>' +
  '      </li>' +
  '    </ul>' +
  '    <form class="d-flex my-2 my-lg-0">' +
  '      <input class="form-control me-sm-2" type="text" placeholder="Search">' +
  '      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>' +
  '    </form>' +
  '  </div>' +
  '</div>' +
'</nav>');

// Enable Bootstrap dropdown functionality
$(document).ready(function() {
    // Enable Bootstrap dropdown functionality
    $('.dropdown-toggle').dropdown();
  });