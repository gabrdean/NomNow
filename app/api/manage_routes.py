from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models.db import db
from app.models import Order, MenuItem, Restaurant, MenuItemEnum
from datetime import datetime

manage_routes = Blueprint("manage", __name__)


# Ensure the user is a restaurant owner before executing any admin actions
def restaurant_owner_required(func):
    def wrapper(*args, **kwargs):
        if not current_user.restaurant_owner:
            return {"message": "Unauthorized - Must be a restaurant owner"}, 403
        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return login_required(wrapper)


# Get restaurant details (owned by current user)
@manage_routes.route("/")
@restaurant_owner_required
def get_my_restaurants():
    restaurants = Restaurant.query.filter_by(owner_id=current_user.id).all()
    if not restaurants:
        return {"message": "No restaurants found for this owner"}, 404
    return jsonify(
        {"restaurants": [restaurant.to_dict() for restaurant in restaurants]}
    ), 200

@manage_routes.route("/<int:restaurant_id>")
@restaurant_owner_required
def get_restaurant_by_id(restaurant_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()
    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404
    return jsonify(restaurant.to_dict()), 200


# Update restaurant details
@manage_routes.route("/<int:restaurant_id>", methods=["PUT"])
@restaurant_owner_required
def update_my_restaurant(restaurant_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()
    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404

    data = request.get_json()
    restaurant.name = data.get("name", restaurant.name)
    restaurant.address = data.get("address", restaurant.address)
    restaurant.city = data.get("city", restaurant.city)
    restaurant.state = data.get("state", restaurant.state)
    restaurant.zip = data.get("zip", restaurant.zip)
    restaurant.cuisine_type = data.get("cuisine_type", restaurant.cuisine_type)
    restaurant.description = data.get("description", restaurant.description)
    restaurant.price_level = data.get("price_level", restaurant.price_level)
    restaurant.business_hours = data.get("business_hours", restaurant.business_hours)

    db.session.commit()
    return jsonify(restaurant.to_dict()), 200
"""
{
    "name": "Updated NomNow Bistro",
    "address": "456 New Food Street",
    "city": "San Francisco",
    "state": "CA",
    "zip": 94110,
    "cuisine_type": "MEXICAN",
    "description": "An updated description of this Mexican restaurant.",
    "price_level": "MODERATE",
    "business_hours": "Mon-Fri: 9 AM - 10 PM, Sat-Sun: 10 AM - 11 PM"
}
"""

# Get all orders for the restaurant
@manage_routes.route("/orders")
@restaurant_owner_required
def get_restaurant_orders():
    restaurants = Restaurant.query.filter_by(owner_id=current_user.id).all()
    if not restaurants:
        return {"message": "No restaurants found for this owner"}, 404

    restaurant_ids = [r.id for r in restaurants]
    orders = Order.query.filter(Order.restaurant_id.in_(restaurant_ids)).all()

    return jsonify({"orders": [order.to_dict() for order in orders]}), 200


# Get all orders for specific restaurant
@manage_routes.route("/<int:restaurant_id>/orders")
@restaurant_owner_required
def get_orders_for_restaurant(restaurant_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()
    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404

    orders = Order.query.filter_by(restaurant_id=restaurant.id).all()
    return jsonify({"orders": [order.to_dict() for order in orders]}), 200


# Get details of a specific order
@manage_routes.route("/orders/<int:order_id>")
@restaurant_owner_required
def get_order_details(order_id):
    order = Order.query.get(order_id)
    if not order or order.restaurant_id != current_user.id:
        return {"message": "Order not found or unauthorized"}, 404
    return jsonify(order.to_dict()), 200


# Update order status (status = Completed or Canceled)
@manage_routes.route(
    "/<int:restaurant_id>/orders/<int:order_id>", methods=["PUT"]
)
@restaurant_owner_required
def update_order_status(restaurant_id, order_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()
    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404

    order = Order.query.filter_by(id=order_id, restaurant_id=restaurant.id).first()
    if not order:
        return {"message": "Order not found or unauthorized"}, 404

    data = request.get_json()
    order.status = data.get("status", order.status)
    db.session.commit()

    return jsonify(order.to_dict()), 200
"""
{
    "status": "Canceled"
}
"""


# Get all menu items for the restaurant
@manage_routes.route("/<int:restaurant_id>/menu")
@restaurant_owner_required
def get_menu_items(restaurant_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()
    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404

    menu_items = MenuItem.query.filter_by(restaurant_id=restaurant.id).all()
    return jsonify({"menu_items": [item.to_dict() for item in menu_items]}), 200


# Add a new menu item
@manage_routes.route("/<int:restaurant_id>/menu", methods=["POST"])
@restaurant_owner_required
def add_menu_item(restaurant_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()

    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404

    data = request.get_json()

    # Validate food_type against Enum
    try:
        food_type = MenuItemEnum[
            data.get("food_type").lower()
        ]  # Convert string to enum
    except KeyError:
        return {
            "message": f"Invalid food_type. Must be one of {MenuItemEnum.to_list()}"
        }, 400

    # Validate required fields
    required_fields = ["name", "price", "food_image"]
    for field in required_fields:
        if field not in data:
            return {"message": f"'{field}' is required"}, 400

    # Create new menu item
    new_item = MenuItem(
        restaurant_id=restaurant.id,
        name=data["name"],
        description=data.get("description", ""),
        price=data["price"],
        food_type=food_type,  # Ensure it's an enum
        food_image=data["food_image"],  # Required field
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify(new_item.to_dict()), 201
"""
{
    "name": "Spicy Tacos",
    "food_type": "entree",
    "description": "Delicious spicy beef tacos with fresh salsa and guacamole.",
    "price": 9.99,
    "food_image": "https://example.com/spicy_tacos.jpg"
}
"""

# Update a menu item
@manage_routes.route(
    "/<int:restaurant_id>/menu/<int:menu_item_id>", methods=["PUT"]
)
@restaurant_owner_required
def update_menu_item(restaurant_id, menu_item_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()
    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404

    menu_item = MenuItem.query.filter_by(
        id=menu_item_id, restaurant_id=restaurant.id
    ).first()
    if not menu_item:
        return {"message": "Menu item not found or unauthorized"}, 404

    data = request.get_json()
    menu_item.name = data.get("name", menu_item.name)
    menu_item.description = data.get("description", menu_item.description)
    menu_item.price = data.get("price", menu_item.price)
    menu_item.food_type = data.get("food_type", menu_item.food_type)

    db.session.commit()
    return jsonify(menu_item.to_dict()), 200
"""
{
    "name": "Updated Spicy Tacos",
    "description": "A modern twist on the classic spicy beef tacos with fresh salsa and guacamole.",
    "price": 10.99,
    "food_type": "entree",
    "food_image": "https://example.com/updated_spicy_tacos.jpg"
}
"""


# Delete a menu item
@manage_routes.route(
    "/<int:restaurant_id>/menu/<int:menu_item_id>", methods=["DELETE"]
)
@restaurant_owner_required
def delete_menu_item(restaurant_id, menu_item_id):
    restaurant = Restaurant.query.filter_by(
        id=restaurant_id, owner_id=current_user.id
    ).first()
    if not restaurant:
        return {"message": "Restaurant not found or unauthorized"}, 404

    menu_item = MenuItem.query.filter_by(
        id=menu_item_id, restaurant_id=restaurant.id
    ).first()
    if not menu_item:
        return {"message": "Menu item not found or unauthorized"}, 404

    db.session.delete(menu_item)
    db.session.commit()
    return {"message": "Menu item deleted successfully"}, 200
