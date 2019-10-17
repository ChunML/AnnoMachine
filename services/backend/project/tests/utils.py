from project import db
from project.models import User, Image, Box


def add_user(username, password):
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return user

def add_image(name, user=None):
    image = Image(name=name, user=user, height=100, width=100)
    db.session.add(image)
    db.session.commit()
    return image

def add_box(x_min, y_min, x_max, y_max, label, image=None):
    box = Box(x_min=x_min, y_min=y_min,
              x_max=x_max, y_max=y_max,
              label=label, image=image)
    db.session.add(box)
    db.session.commit()
    return box
