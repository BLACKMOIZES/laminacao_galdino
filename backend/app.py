from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, Product  

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db.init_app(app)

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'message': 'Bad Request: Missing name or email'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400

    new_user = User(name=data['name'], email=data['email'])
    db.session.add(new_user)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

    return jsonify({'message': 'User created'}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'name': user.name, 'email': user.email} for user in users])


@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({'message': 'Bad Request: Missing name'}), 400

    new_product = Product(name=data['name'], description=data.get('description', ''))  
    db.session.add(new_product)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating product', 'error': str(e)}), 500

    return jsonify({'message': 'Product created'}), 201


@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{'id': product.id, 'name': product.name, 'description': product.description} for product in products])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
