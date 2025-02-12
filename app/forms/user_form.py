from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import Email


class UserForm(FlaskForm):
    first_name = StringField("first Name")
    last_name = StringField("last Name")
    phone_number = StringField("phone Number")
    email = StringField("email")
    password = StringField("password")
    address = StringField("address")
    city = StringField("city")
    state = StringField("state")
    zip = IntegerField("zip")

class FundsForm(FlaskForm):
    amount = IntegerField("amount")