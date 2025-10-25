from sqlalchemy import create_engine, Column, Integer, DateTime, String, ForeignKey, Enum, Text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload
from datetime import datetime


DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)

Base = declarative_base()
# --- Models ---

class Region(Base):
    __tablename__ = "region"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)
    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AvisoAdopcion", back_populates="comuna")

class AvisoAdopcion(Base):
    __tablename__ = "aviso_adopcion"
    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, default=datetime.now)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    comuna = relationship("Comuna", back_populates="avisos")

    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    tipo = Column(Enum("gato", "perro"))
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum("a", "m"))
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text(500))

    fotos = relationship("Foto", back_populates="aviso")
    contactos = relationship("ContactarPor", back_populates="aviso")
    

class Foto(Base):
    __tablename__ = "foto"
    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = "contactar_por"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Enum("whatsapp", "telegram", "X", "instagram", "tiktok", "otra"))
    identificador = Column(String(150), nullable=False)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="contactos")


#COMENTARIOS (tarea 3)
class Comentario(Base):
    __tablename__ = "comentario"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, default=datetime.now)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)

    aviso = relationship("AvisoAdopcion", back_populates="comentarios")

#definir relacion inversa
AvisoAdopcion.comentarios = relationship("Comentario", back_populates="aviso")

###############################################################################


# --- Database Functions ---

# --- FUNCIONES DE AYUDA --- #

def query_avisos_con_relaciones(session):
    return session.query(AvisoAdopcion).options(
        joinedload(AvisoAdopcion.comuna),
        joinedload(AvisoAdopcion.fotos),
        joinedload(AvisoAdopcion.contactos)
    )

def get_regiones():
    session = SessionLocal()
    data = session.query(Region).order_by(Region.nombre).all()
    session.close()
    return data


def get_comunas():
    session = SessionLocal()
    data = session.query(Comuna).order_by(Comuna.nombre).all()
    session.close()
    return data


def get_last_avisos(limit=5):
    session = SessionLocal()
    data = (
        query_avisos_con_relaciones(session)
        .order_by(AvisoAdopcion.fecha_ingreso.desc())
        .limit(limit)
        .all()
    )
    session.close()
    return data


def create_aviso(comuna_id, sector, nombre, email, celular, tipo,
                 cantidad, edad, unidad, fecha_entrega, descripcion):
    session = SessionLocal()
    aviso = AvisoAdopcion(
        fecha_ingreso=datetime.now(),
        comuna_id=comuna_id,
        sector=sector,
        nombre=nombre,
        email=email,
        celular=celular,
        tipo=tipo,
        cantidad=cantidad,
        edad=edad,
        unidad_medida=unidad,
        fecha_entrega=fecha_entrega,
        descripcion=descripcion
    )
    session.add(aviso)
    session.commit()
    aviso_id = aviso.id
    session.close()
    return aviso_id


def add_foto(ruta_archivo, nombre_archivo, aviso_id):
    session = SessionLocal()
    foto = Foto(ruta_archivo=ruta_archivo, nombre_archivo=nombre_archivo, aviso_id = aviso_id)
    session.add(foto)
    session.commit()
    session.close()


def add_contacto(nombre, identificador, aviso_id):
    session = SessionLocal()
    contacto = ContactarPor(nombre=nombre, identificador=identificador, aviso_id=aviso_id)
    session.add(contacto)
    session.commit()
    session.close()


def get_avisos_paginated(page, per_page):
    session = SessionLocal()
    total = session.query(AvisoAdopcion).count()
    avisos = (
        query_avisos_con_relaciones(session)
        .order_by(AvisoAdopcion.fecha_ingreso.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    session.close()
    return avisos, total


def get_aviso_by_id(aviso_id):
    session = SessionLocal()
    aviso = (
        query_avisos_con_relaciones(session)
        .filter_by(id=aviso_id).
        first()
    )
    session.close()
    return aviso



# para comentarios (tarea 3)

def add_comentario(nombre, texto, aviso_id):
    session = SessionLocal()
    comentario = Comentario(
        nombre=nombre.strip(),
        texto=texto.strip(),
        fecha=datetime.now(),
        aviso_id=aviso_id
    )
    session.add(comentario)
    session.commit()
    session.close()


def get_comentarios_by_aviso(aviso_id):
    session = SessionLocal()
    data = (
        session.query(Comentario)
        .filter_by(aviso_id=aviso_id)
        .order_by(Comentario.fecha.desc())
        .all()
    )
    session.close()
    return data

