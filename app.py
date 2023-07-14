from flask import Flask ,jsonify ,request, render_template, redirect, session
# del modulo flask importar la clase Flask y los métodos jsonify,request
from flask_cors import CORS # del modulo flask_cors importar CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
from flask import url_for
from functools import wraps
import json

app=Flask(__name__) # crear el objeto app de la clase Flask

CORS(app) #modulo cors es para que me permita acceder desde el frontend al backend
app.secret_key = ' key'
# configuro la base de datos, con el nombre el usuario y la clave
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:root@localhost/proyecto'
# URI de la BBDD                       driver de la BD user:clave@URLBBDD/nombreBBDD
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False #none
mysql = MySQL(app)
db= SQLAlchemy(app) #crea el objeto db de la clase SQLAlquemy
ma=Marshmallow(app) #crea el objeto ma de de la clase Marshmallow

# defino la tabla
class Alumno(db.Model): # la clase Producto hereda de db.Model
    id=db.Column(db.Integer, primary_key=True) #define los campos de la tabla
    nombre=db.Column(db.String(100))
    email=db.Column(db.String(100))
    telefono=db.Column(db.Integer)
    def __init__(self,nombre,email,telefono): #crea el constructor de la clase
        self.nombre=nombre # no hace falta el id porque lo crea sola mysql por ser auto_incremento
        self.email=email
        self.telefono=telefono
# si hay que crear mas tablas , se hace aqui

class Usuario(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    usuario=db.Column(db.String(50), unique=True)
    clave=db.Column(db.String(255)) 
    email=db.Column(db.String(100))

with app.app_context():
    db.create_all() # aqui crea todas las tablas
# ************************************************************

class UsuarioSchema(ma.Schema):
    class Meta:
        fields = ('id', 'usuario' ,'clave','email')

usuario_schema = UsuarioSchema()

class AlumnoSchema(ma.Schema):
    class Meta:
        fields=('id','nombre','email','telefono')



alumno_schema=AlumnoSchema() # El objeto producto_schema es para traer un producto
alumnos_schema=AlumnoSchema(many=True) # El objeto productos_schema es para traer multiples registros de producto

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'loggedin' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# crea los endpoint o rutas (json)

@app.route('/login', methods=['GET', 'POST'])
def login():
    # Output message if something goes wrong...
    msg = ''
    # Check if "username" and "password" POST requests exist (user submitted form)
    if request.method == 'POST' and 'usuario' in request.form and 'clave' in request.form:
        # Create variables for easy access
        usuario = request.form['usuario']
        clave = request.form['clave']
        # Check if account exists using MySQl
        account = Usuario.query.filter_by(usuario=usuario, clave=clave).first()

        if account:
            # Create session data, we can access this data in other routes
            session['loggedin'] = True
            session['id'] = account.id
            session['usuario'] = account.usuario
            # Redirect to home page
            return redirect(url_for('home'))
        else:
            # Account doesnt exist or username/password incorrect
            msg = 'usuario o clave incorrecto!'
    # Show the login form with message (if any)
    return render_template('login.html', msg=msg)

@app.route('/login/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('usuario', None)
    return redirect(url_for('login'))

@app.route('/login/register', methods=['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST' and 'usuario' in request.form and 'clave' in request.form and 'email' in request.form:
        usuario = request.form['usuario']
        clave = request.form['clave']
        email = request.form['email']

        account = Usuario.query.filter_by(usuario=usuario).first()
        if account:
            msg = 'Esa cuenta ya existe!'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = 'Dirección de email no valido!'
        elif not re.match(r'[A-Za-z0-9]+', usuario):
            msg = 'Usuario debe contener solo letras o números!'
        elif not usuario or not clave or not email:
            msg = 'Por favor llena el formulario!'
        else:
            new_account = Usuario(usuario=usuario, clave=clave, email=email)
            db.session.add(new_account)
            db.session.commit()
            msg = 'Te registrate exitosamente!'
    elif request.method == 'POST':
        msg = 'Por favor llena el formulario!'
    return render_template('registro.html', msg=msg)


@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/courses.json')
def get_courses_json():
    # Load the JSON data from the file with specified encoding
    with open('static/courses.json', 'r', encoding='utf-8') as json_file:
        courses_data = json.load(json_file)

    # Return the JSON data using Flask's jsonify() function
    return jsonify(courses_data)


# alumnos2.html backend
@app.route('/alumnos', methods=['GET'])
def get_alumnos():
    alumnos = Alumno.query.all()
    alumnos_data = [{'id': alumno.id, 'nombre': alumno.nombre, 'email': alumno.email, 'telefono': alumno.telefono} for alumno in alumnos]
    return jsonify({'alumnos': alumnos_data})

@app.route('/alumnos',methods=['POST'])
def create_alumno():
    nombre = request.json['nombre']
    email = request.json['email']
    telefono = request.json['telefono']
    alumno = Alumno(nombre=nombre, email=email, telefono=telefono)
    db.session.add(alumno)
    db.session.commit()

    return jsonify({'message': 'Alumno created successfully'})


@app.route('/alumnos/<id>', methods=['PUT'])
def update_alumno(id):
    alumno = Alumno.query.get(id)

    if not alumno:
        return jsonify({'error': 'Alumno not found'})

    # Retrieve the updated data from the request JSON
    nombre = request.json.get('nombre')
    email = request.json.get('email')
    telefono = request.json.get('telefono')

    # Update the attributes if new values are provided
    if nombre:
        alumno.nombre = nombre
    if email:
        alumno.email = email
    if telefono:
        alumno.telefono = telefono

    # Commit the changes to the database
    db.session.commit()

    return jsonify({'message': 'Alumno updated successfully'})

@app.route('/alumnos/<id>', methods=['DELETE'])
def delete_alumno(id):
    alumno = Alumno.query.get(id)
    if not alumno:
        return jsonify({'error': 'Alumno not found'})

    db.session.delete(alumno)
    db.session.commit()

    # Retrieve the updated list of alumnos after deletion
    alumnos = Alumno.query.all()

    # Convert the alumnos objects to a list of dictionaries
    alumnos_data = []
    for alumno in alumnos:
        alumno_data = {
            'id': alumno.id,
            'nombre': alumno.nombre,
            'email': alumno.email,
            'telefono': alumno.telefono
        }
        alumnos_data.append(alumno_data)

    return jsonify({'message': 'Alumno deleted successfully', 'alumnos': alumnos_data})



@app.route('/login/home')
@login_required
def home():
    if 'loggedin' in session:
        alumnos = alumnos_schema.dump(Alumno.query.all())
        return render_template('alumnos2.html', alumnos=alumnos, usuario=session['usuario'])
    return redirect(url_for('login'))

# programa principal *******************************
if __name__=='__main__':
    app.run(debug=True, port=5000) # ejecuta el servidor Flask en el puerto 5000