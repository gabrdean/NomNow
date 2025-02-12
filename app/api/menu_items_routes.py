from flask import Blueprint, request
from ..models.menu_items import MenuItem
from ..models import db
from ..forms.menu_item_form import MenuItemForm
from flask_login import login_required,current_user
from datetime import datetime
from flask import jsonify
from flask_cors import CORS

menu_item_routes = Blueprint('menu_items', __name__)  
# api/menu-items/


### Get a menu item by id   # api/menu-items/id
@menu_item_routes.route('/<int:id>', methods=['GET'])
def get_menu_item(id):
    menu_item = MenuItem.query.get(id)

    if menu_item:
        return jsonify(menu_item.to_dict()), 200
    else:
        return jsonify({"error": "Menu item not found"}), 404
    

    

### Get all-menu item # api/menu-items
@menu_item_routes.route('/', methods=['GET'])
def get_menu_items():
    menu_items = MenuItem.query.all()  # Get all menu items
    
    return jsonify([item.to_dict() for item in menu_items]), 200

    


### Update a menu item # api/menu-items/id/update
@menu_item_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_menu_item(id):
    """
    Updates a menu item
    """
    item_to_update = MenuItem.query.get(id)
    if not item_to_update:
        return jsonify({"error": "Menu item not found"}), 404

    form = MenuItemForm(meta={'csrf': False})  # Disable CSRF if needed for API requests
    data = request.get_json()  # Extract JSON body


    if not data:
        return jsonify({"error": "Invalid request, JSON data required"}), 400

    if form.validate_on_submit():
        item_to_update.name = data.get("name", item_to_update.name)
        item_to_update.food_type = data.get("food_type", item_to_update.food_type)
        item_to_update.description = data.get("description", item_to_update.description)
        item_to_update.price = data.get("price", item_to_update.price)
        item_to_update.food_image = data.get("food_image", item_to_update.food_image)
        item_to_update.updated_at = datetime.now()

        try:
            db.session.commit()
            return jsonify(item_to_update.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({"errors": form.errors}), 400




### Delete a menu item # api/menu-items/id/delete
@menu_item_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_menu_item(id):
    menu_item = MenuItem.query.get(id)

    if menu_item:
        try:
            db.session.delete(menu_item)
            db.session.commit()
            return jsonify({"message": "Menu item deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()  # Rollback the transaction in case of error
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    else:
        return jsonify({"error": "Menu item not found"}), 404





### Create a new menu item # api/menu-items/new
@menu_item_routes.route('/', methods=['POST'])
@login_required
def create_menu_item():
    """
    Creates a new menu item
    """
    form = MenuItemForm(meta={'csrf': False})  # Disable CSRF for API
    data = request.get_json()  # Extract JSON body

    if not data:
        return jsonify({"error": "Invalid request, JSON data required"}), 400

    restaurant_id = data.get("restaurant_id")
    if not restaurant_id:
        return jsonify({"error": "restaurant_id is required"}), 400

    if form.validate_on_submit():
        new_item = MenuItem(
            restaurant_id=restaurant_id, 
            name=data.get("name"),
            food_type=data.get("food_type"),
            description=data.get("description"),
            price=data.get("price"),
            food_image=data.get("food_image"),
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        try:
            db.session.add(new_item)
            db.session.commit()
            return jsonify(new_item.to_dict()), 201  # Return created item with status 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({"errors": form.errors}), 400
