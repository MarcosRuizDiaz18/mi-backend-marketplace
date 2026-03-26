// configuracion/baseDeDatos.js
const mongoose = require("mongoose");

const conectarBaseDeDatos = async () => {
  const uriMongo = process.env.MONGO_URI || "mongodb://localhost:27017/marketplace_gba";

  try {
    await mongoose.connect(uriMongo);
    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    process.exit(1); // Detiene el proceso si no hay DB
  }
};

// Eventos de conexión para debugging
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB desconectado.");
});

module.exports = conectarBaseDeDatos;
