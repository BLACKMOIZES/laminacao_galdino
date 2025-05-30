from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, Product, Order, OrderItem

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'message': 'Requisição inválida: Falta nome ou email'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email já existe'}), 400

    new_user = User(name=data['name'], email=data['email'])
    db.session.add(new_user)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Erro ao criar usuário', 'error': str(e)}), 500

    return jsonify({'message': 'Usuário criado'}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'name': user.name, 'email': user.email} for user in users])

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({'message': 'Requisição inválida: Falta nome'}), 400

    new_product = Product(name=data['name'], description=data.get('description', ''))  
    db.session.add(new_product)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Erro ao criar produto', 'error': str(e)}), 500

    return jsonify({'message': 'Produto criado'}), 201

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{'id': product.id, 'name': product.name, 'description': product.description} for product in products])

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({'message': 'Requisição inválida: Falta nome'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Produto não encontrado'}), 404

    product.name = data['name']
    product.description = data.get('description', product.description)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Erro ao atualizar produto', 'error': str(e)}), 500

    return jsonify({'message': 'Produto atualizado'}), 200

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Produto não encontrado'}), 404

    db.session.delete(product)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Erro ao deletar produto', 'error': str(e)}), 500

    return jsonify({'message': 'Produto deletado'}), 200

@app.route('/pedidos', methods=['POST'])
def criar_pedido():
    data = request.get_json()
    
    if not data or 'usuario_id' not in data or 'produtos' not in data:
        return jsonify({'mensagem': 'Requisição inválida: Falta dados necessários'}), 400
    
    usuario = User.query.get(data['usuario_id'])
    if not usuario:
        return jsonify({'mensagem': 'Usuário não encontrado'}), 404

    produtos = []
    for produto_data in data['produtos']:
        produto = Product.query.get(produto_data['produto_id'])
        if produto:
            order_item = OrderItem(product_id=produto.id, quantity=produto_data['quantidade'])
            produtos.append(order_item)
        else:
            return jsonify({'mensagem': f'Produto com ID {produto_data["produto_id"]} não encontrado'}), 404
    
    novo_pedido = Order(usuario_id=data['usuario_id'], items=produtos)
    db.session.add(novo_pedido)
    db.session.commit()

    return jsonify({'mensagem': 'Pedido criado com sucesso'}), 201

@app.route('/pedidos/<int:usuario_id>', methods=['GET'])
def listar_pedidos(usuario_id):
    pedidos = Order.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([{
        'id': p.id,
        'status': p.status,
        'data_pedido': p.data_pedido,
        'produtos': [{'produto': item.product.name, 'quantidade': item.quantity} for item in p.items]
    } for p in pedidos])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
