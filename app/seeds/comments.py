from app.models import db, User, Post, Comment, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_comments():
    users = User.query.all()
    posts = Post.query.all()
    comments = [
        Comment(content='This is great news!', author=users[0], post=posts[0], created_at=datetime.utcnow()),
        Comment(content='Thanks for sharing', author=users[1], post=posts[0], created_at=datetime.utcnow()),
        Comment(content='I disagree with your point', author=users[2], post=posts[1], created_at=datetime.utcnow()),
        Comment(content='Can you clarify what you mean?', author=users[0], post=posts[1], created_at=datetime.utcnow()),
        Comment(content='I found this article really interesting', author=users[1], post=posts[2], created_at=datetime.utcnow()),
        Comment(content='This is a great resource for beginners', author=users[2], post=posts[2], created_at=datetime.utcnow())
    ]
    db.session.add_all(comments)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the comments table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()