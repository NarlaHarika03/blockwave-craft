from flask import Flask, jsonify, request
from blockchain import Blockchain
from flask_cors import CORS  # To allow frontend and backend communication
import uuid  # Unique identifier for miner nodes

# Initialize Flask and Blockchain
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
blockchain = Blockchain()

# Generate a unique address for the node (used for mining rewards)
node_identifier = str(uuid.uuid4()).replace('-', '')

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Blockchain API!'})

@app.route('/chain', methods=['GET'])
def get_chain():
    response = {'chain': blockchain.chain, 'length': len(blockchain.chain)}
    return jsonify(response), 200

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()
    required_fields = ['sender', 'recipient', 'amount']
    
    # Validate request data
    if not all(k in values for k in required_fields):
        return jsonify({'error': 'Missing values'}), 400
    
    if not isinstance(values['amount'], (int, float)) or values['amount'] <= 0:
        return jsonify({'error': 'Amount must be a positive number'}), 400

    index = blockchain.new_transaction(values['sender'], values['recipient'], values['amount'])
    return jsonify({'message': f'Transaction will be added to Block {index}'}), 201

@app.route('/mine', methods=['GET'])
def mine():
    if not blockchain.current_transactions:
        return jsonify({'error': 'No transactions to mine!'}), 400  # Prevent mining if no transactions exist

    last_proof = blockchain.last_block['proof']
    proof = blockchain.proof_of_work(last_proof)

    blockchain.new_transaction(
        sender="0",
        recipient=node_identifier,
        amount=1,  # Reward for mining
    )

    previous_hash = blockchain.hash(blockchain.last_block)
    block = blockchain.new_block(proof, previous_hash)

    response = {
        'message': "New Block Mined!",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
