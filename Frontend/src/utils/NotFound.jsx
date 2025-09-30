/* eslint-disable no-unused-vars */
import { Link } from "react-router";
import { motion } from "motion/react";
import { Home, Footprints, ArrowRight, Settings } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Footprints className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-white">StepStyle</span>
          </div>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
          className="mb-6"
        >
          <h1 className="text-8xl font-bold text-white">
            4
            <motion.span
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="inline-block text-blue-200"
            >
              0
            </motion.span>
            4
          </h1>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-white mb-4"
        >
          ¡Ups! Camino Equivocado
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-blue-100 mb-8 text-lg leading-relaxed"
        >
          Lo sentimos, no encontramos el camino que buscas.
          Parece que estos zapatos tomaron una dirección diferente.
        </motion.p>

        {/* Animated Shoe */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-8"
        >
          <Footprints className="mx-auto text-white opacity-90" size={80} />
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-blue-600 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
          >
            <Home size={20} />
            VOLVER AL INICIO
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>

          {/* Secondary Link */}
          <Link
            to="/catalogo"
            className="inline-block text-white hover:text-blue-200 text-sm underline transition-colors"
          >
            O explorar nuestro catálogo
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-blue-200 text-xs mt-8 space-y-1"
        >
          <p>¿Perdido en nuestra colección?</p>
          <p>Te ayudamos a encontrar el camino correcto.</p>
        </motion.div>

        {/* Decorative Elements */}
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 right-10"
          >
            <Settings size={80} className="text-white opacity-15" />
          </motion.div>

          <motion.div
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-10 left-10"
          >
            <Settings size={300} className="text-white opacity-15" />
          </motion.div>

          {/* Tercer icono */}
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 right-1/4"
          >
            <Settings size={50} className="text-white opacity-10" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};