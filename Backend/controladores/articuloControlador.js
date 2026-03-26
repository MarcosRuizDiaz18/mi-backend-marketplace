// controladores/articuloControlador.js
const mongoose = require("mongoose");
const Articulo = require("../modelos/Articulo");

// ─── Helper: manejo centralizado de errores de Mongoose ───────────────────
const manejarErrorMongo = (error, respuesta, siguiente) => {
  if (error.name === "ValidationError") {
    const mensajesDeError = Object.values(error.errors).map((e) => e.message);
    return respuesta.status(400).json({ error: "Error de validación.", detalles: mensajesDeError });
  }
  if (error.name === "CastError") {
    return respuesta.status(400).json({ error: "El ID proporcionado no tiene un formato válido." });
  }
  siguiente(error);
};

// ─── Helper: verificar si un ID es válido antes de consultar ──────────────
const esIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── POST /api/articulos ───────────────────────────────────────────────────
// Crea un artículo nuevo
const crearArticulo = async (solicitud, respuesta, siguiente) => {
  try {
    const nuevoArticulo = new Articulo(solicitud.body);
    const articuloGuardado = await nuevoArticulo.save();

    respuesta.status(201).json({
      mensaje: "Artículo creado correctamente.",
      articulo: articuloGuardado,
    });
  } catch (error) {
    manejarErrorMongo(error, respuesta, siguiente);
  }
};

// ─── GET /api/articulos ────────────────────────────────────────────────────
// Lista artículos con filtros opcionales combinables por query string.
//
// Filtros geográficos (exactos, case-insensitive):
//   ?partido=Lomas de Zamora
//   ?localidad=Temperley
//
// Otros filtros opcionales:
//   ?categoria=Herramientas
//   ?estado=disponible
//
// Ejemplos combinados:
//   ?partido=Lomas de Zamora&categoria=Herramientas
//   ?partido=Quilmes&localidad=Bernal&estado=disponible
const obtenerArticulos = async (solicitud, respuesta, siguiente) => {
  try {
    const { partido, localidad, categoria, estado } = solicitud.query;

    const filtro = {};

    // Partido y localidad: coincidencia EXACTA (^...$) pero sin distinguir
    // mayúsculas/minúsculas ni tildes de posición.
    // Esto evita que "Lomas" matchee "Lomas de Zamora" cuando se busca solo "Lomas".
    if (partido)   filtro.partido   = { $regex: `^${partido.trim()}$`,   $options: "i" };
    if (localidad) filtro.localidad = { $regex: `^${localidad.trim()}$`, $options: "i" };

    // Categoría: búsqueda parcial para mayor flexibilidad (ej: "Herramienta" matchea "Herramientas")
    if (categoria) filtro.categoria = { $regex: categoria.trim(), $options: "i" };

    // Estado: coincidencia exacta con los valores del enum del modelo
    if (estado) filtro.estado = estado.trim();

    const listaArticulos = await Articulo.find(filtro).sort({ creadoEn: -1 });

    respuesta.status(200).json({
      total: listaArticulos.length,
      filtrosAplicados: filtro,   // Útil para debug desde Postman / frontend
      articulos: listaArticulos,
    });
  } catch (error) {
    siguiente(error);
  }
};

// ─── GET /api/articulos/:id ────────────────────────────────────────────────
// Devuelve el detalle de un artículo por su ID de MongoDB
const obtenerArticuloPorId = async (solicitud, respuesta, siguiente) => {
  try {
    const { id } = solicitud.params;

    if (!esIdValido(id)) {
      return respuesta.status(400).json({ error: "El ID proporcionado no tiene un formato válido." });
    }

    const articulo = await Articulo.findById(id);

    if (!articulo) {
      return respuesta.status(404).json({ error: "No se encontró ningún artículo con ese ID." });
    }

    respuesta.status(200).json({ articulo });
  } catch (error) {
    siguiente(error);
  }
};

// ─── PUT /api/articulos/:id ────────────────────────────────────────────────
// Actualiza campos de un artículo existente (precio, descripción, estado, etc.)
// Solo modifica los campos que se envíen en el body; el resto queda intacto.
const actualizarArticulo = async (solicitud, respuesta, siguiente) => {
  try {
    const { id } = solicitud.params;

    if (!esIdValido(id)) {
      return respuesta.status(400).json({ error: "El ID proporcionado no tiene un formato válido." });
    }

    const articuloActualizado = await Articulo.findByIdAndUpdate(
      id,
      solicitud.body,
      {
        new: true,           // Devuelve el documento YA actualizado
        runValidators: true, // Ejecuta las validaciones del esquema al actualizar
      }
    );

    if (!articuloActualizado) {
      return respuesta.status(404).json({ error: "No se encontró ningún artículo con ese ID." });
    }

    respuesta.status(200).json({
      mensaje: "Artículo actualizado correctamente.",
      articulo: articuloActualizado,
    });
  } catch (error) {
    manejarErrorMongo(error, respuesta, siguiente);
  }
};

// ─── DELETE /api/articulos/:id ─────────────────────────────────────────────
// Elimina un artículo por su ID
const eliminarArticulo = async (solicitud, respuesta, siguiente) => {
  try {
    const { id } = solicitud.params;

    if (!esIdValido(id)) {
      return respuesta.status(400).json({ error: "El ID proporcionado no tiene un formato válido." });
    }

    const articuloEliminado = await Articulo.findByIdAndDelete(id);

    if (!articuloEliminado) {
      return respuesta.status(404).json({ error: "No se encontró ningún artículo con ese ID." });
    }

    respuesta.status(200).json({
      mensaje: "Artículo eliminado correctamente.",
      articulo: articuloEliminado,
    });
  } catch (error) {
    siguiente(error);
  }
};

module.exports = {
  crearArticulo,
  obtenerArticulos,
  obtenerArticuloPorId,
  actualizarArticulo,
  eliminarArticulo,
};
