"""add all tables with snake case cols

Revision ID: 5dad86975e07
Revises: 
Create Date: 2025-02-09 22:00:29.623647

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5dad86975e07'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=40), nullable=False),
    sa.Column('last_name', sa.String(length=40), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.Column('restaurant_owner', sa.Boolean(), nullable=True),
    sa.Column('address', sa.String(length=40), nullable=False),
    sa.Column('city', sa.String(length=40), nullable=False),
    sa.Column('state', sa.String(length=40), nullable=False),
    sa.Column('zip', sa.Integer(), nullable=False),
    sa.Column('wallet', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('phone_number')
    )
    op.create_table('restaurants',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('address', sa.String(length=255), nullable=False),
    sa.Column('city', sa.String(length=255), nullable=False),
    sa.Column('state', sa.String(length=255), nullable=False),
    sa.Column('zip', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('cuisine_type', sa.Enum('AMERICAN', 'CHINESE', 'ITALIAN', 'JAPANESE', 'MEXICAN', 'INDIAN', 'THAI', 'MEDITERRANEAN', 'KOREAN', 'VIETNAMESE', 'GREEK', 'SPANISH', 'SEAFOOD', 'PIZZA', 'VEGETARIAN', 'VEGAN', 'BREAKFAST', 'FAST_FOOD', 'CARIBBEAN', 'SOUL_FOOD', name='cuisinetype'), nullable=False),
    sa.Column('delivery_fee', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('business_hours', sa.String(length=255), nullable=False),
    sa.Column('servicing', sa.Boolean(), nullable=False),
    sa.Column('store_image', sa.String(length=255), nullable=True),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('price_level', sa.Enum('INEXPENSIVE', 'MODERATE', 'EXPENSIVE', 'VERY_EXPENSIVE', name='pricelevel'), nullable=False),
    sa.Column('delivery_time', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('menu_items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('restaurant_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('food_type', sa.Enum('appetizer', 'entree', 'dessert', 'beverage', name='menuitemenum'), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('food_image', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['restaurant_id'], ['restaurants.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('orders',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('restaurant_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('total_cost', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('status', sa.Enum('Submitted', 'Completed', 'Canceled', 'Active', name='order_status'), nullable=False),
    sa.Column('promo', sa.String(length=255), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['restaurant_id'], ['restaurants.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('restaurant_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('review', sa.Text(), nullable=True),
    sa.Column('order_rating', sa.Integer(), nullable=False),
    sa.Column('restaurant_rating', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['restaurant_id'], ['restaurants.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('order_items',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('menu_item_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['menu_item_id'], ['menu_items.id'], ),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('order_items')
    op.drop_table('reviews')
    op.drop_table('orders')
    op.drop_table('menu_items')
    op.drop_table('restaurants')
    op.drop_table('users')
    # ### end Alembic commands ###
