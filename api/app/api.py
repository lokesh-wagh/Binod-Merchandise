from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig
from dotenv import load_dotenv #importing required modules
from sqlalchemy import create_engine,ForeignKey,Column,String,Boolean,Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import json

import os

load_dotenv() #loading the variables

app = FastAPI()

EMAIL=os.environ.get('EMAIL') #EMAIL used from env
PSWRD=os.environ.get('PSWRD')#PSWRD used from env
USRNAME=os.environ.get('USERNAME')
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "*"
]

conf = ConnectionConfig(
    MAIL_USERNAME = USRNAME,
    MAIL_PASSWORD = PSWRD,
    MAIL_FROM=EMAIL,
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True, #previous configuration was deprecated 
    MAIL_SSL_TLS = False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

DIR_PATH = os.getcwd()

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Backend is working great!!!"}

Base = declarative_base()

class Merch(Base):
    __tablename__ = "merchandise"

    key = Column("key",Integer,primary_key=True)
    name = Column("name",String)
    size = Column("size",String)
    visible = Column("visible",Boolean)

    def __init__(self,key,name,size,visible):
        self.key = key
        self.name = name
        self.size = size
        self.visible = visible 

engine = create_engine("sqlite:///binod.db",echo=True)
Base.metadata.create_all(bind=engine)
Session = sessionmaker(bind=engine)
session = Session()

'''
{
	"products": [
		{ "key": 1, "name": "Cool Jacket", "size": "XL", "visible": true },
		{ "key": 2, "name": "Matte black T-shirt", "size": "L", "visible": true },
		{ "key": 3, "name": "Party jacket", "size": "M", "visible": true },
		{ "key": 4, "name": "Everyday jeans", "size": "L", "visible": true },
		{ "key": 5, "name": "Pattern T-Shirt", "size": "XL", "visible": true },
		{ "key": 6, "name": "Fancy grey scarfed", "size": "M", "visible": true },
		{ "key": 7, "name": "Formal affair", "size": "S", "visible": true }
	]
}
'''
def makeEntriesInDatabase():
    merch1=Merch(1,'Cool Jacket',"XL",True)
    merch2=Merch(2,"Matte black T-shirt","L",True)
    merch3=Merch(3,"Party jacket","M",True)
    merch4=Merch(4,"Everyday jeans","L",True)
    merch5=Merch(5,"Pattern T-Shirt","XL",True)
    merch6=Merch(6,"Fancy grey scarfed","M",True)
    merch7=Merch(7,"Formal affair","S",True)
    session.add_all([merch1,merch2,merch3,merch4,merch5,merch6,merch7])
    session.commit()

#makeEntriesInDatabase() #comment this code out if it is the database has not been created yet 


@app.get("/get_products")
async def read_db_products() -> dict:
    query = session.query(Merch).all()
    serialized_products = [{'name': product.name, 'size': product.size, 'key': product.key, 'visible': product.visible} for product in query]
    produce={"products":serialized_products}
    
    return produce

@app.post("/save_project")
async def save_project(request: Request):
    data = await request.form()
    data = jsonable_encoder(data)
    if len(data.keys())==0:
        return {"message":"No data passed"}
    
    productToEnter = Merch(data["key"],data["title"],data["size"],True)
    session.add(productToEnter)
    session.commit()
    
    return {"message": "Your product has been saved successfully"}

@app.get("/delete_project/{key}")
async def save_project(key: int):
    session.query(Merch).filter(Merch.key==key).delete()
    session.commit()
    return {"message": "Your product has been deleted successfully"}

def get_template(mail,msg):
    return f"""<h1>This Mail is autogenerated and sent to both you and Binod Merchandise</h1><p>Mail: {mail}</p><p>Message: {msg}</p>"""

@app.post("/email")
async def email(request: Request):
    data = await request.form()
    data = jsonable_encoder(data)
    message = MessageSchema(
        subject="Contacted from Binod Merchandise",
        recipients=[data["email"],EMAIL],
        body=get_template(data["email"],data["message"]),
        subtype="html"
        )
    fm = FastMail(conf)
    await fm.send_message(message)
    return {"message": "Email sent successfully"}
