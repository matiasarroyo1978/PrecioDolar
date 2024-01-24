import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useState } from "react";
import { IoCalculatorOutline } from "react-icons/io5";
import {
  PiBackspaceLight,
  PiPushPinSimpleLight,
  PiPushPinSimpleSlashLight,
} from "react-icons/pi";
import "./App.css";
import { Calculator } from "./components/Calculator/Calculator";
import { CurrencyComponent } from "./components/CurrencyComponent/CurrencyComponent";
import { Divider } from "./components/Divider/Divider";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { LastUpdated } from "./components/LastUpdated/LastUpdated";
import { CurrencyData } from "./interfaces/interfaces";
import { getStorageViewValue, storageView } from "./utils/utils";

function App() {
  const [dolar, setDolar] = useState<CurrencyData[]>([]);
  const [real, setReal] = useState<CurrencyData[]>([]);
  const [calculator, setCalculator] = useState(false);
  const [isCalculatorPinned, setIsCalculatorPinned] = useState(false);
  const [precioReal, setPrecioReal] = useState<number | null>(null);

  const getStorageView = () => {
    const storage = localStorage.getItem("IsCalculatorSticky");
    if (storage) {
      setCalculator(storage === "true");
    }
  };
  const URLS = {
    dollars: "https://dolarapi.com/v1/dolares",
    real: "https://dolarapi.com/v1/cotizaciones/brl",
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de dólares
        const dollarsResponse = await axios.get(URLS.dollars);
        const sortedDollarData = dollarsResponse.data.sort((a: CurrencyData, b: CurrencyData) => {
          if (a.nombre === "Blue") return -1;
          if (b.nombre === "Blue") return 1;
          return 0;
        });

        // Actualizar 'dolar' con los datos de dólares
        setDolar(sortedDollarData);

        // Obtener datos del Real
        const realResponse = await axios.get(URLS.real);
        const realData = realResponse.data;

        if (realData && realData.moneda === "BRL" && realData.nombre === "Real Brasileño") {
          const dolarBlue = sortedDollarData.find((currency: any) => currency.nombre === "Blue");
          const dolarOficial = sortedDollarData.find((currency: any) => currency.nombre === "Oficial");

          if (dolarBlue && dolarOficial) {
            const nuevoPrecioReal = (realData.compra * dolarBlue.compra) / dolarOficial.compra;
            setPrecioReal(nuevoPrecioReal);
            setReal((prevReal) => {
              const isRealBlueInReal = prevReal.some((currency: any) => currency.nombre === "Real Blue");
              return isRealBlueInReal ? prevReal : [...prevReal, { ...realData, nombre: "Real Blue", venta: nuevoPrecioReal }];
            });
          } else {
            console.error("No se pudieron encontrar las tasas necesarias para calcular el precio del Real.");
          }
        } else {
          console.error("La respuesta de la API no tiene la estructura esperada:", realData);
        }
      } catch (error) {
        console.log("Hubo un error al obtener los valores de dólares y el Real", error);
      }
    };

    fetchData(); // Llamar a la función que obtiene datos
  },);

  useLayoutEffect(() => {
    const greenLights = document.querySelectorAll('[id^="green"]');
    const redLights = document.querySelectorAll('[id^="red"]');

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(greenLights, {
      duration: 0.5,
      fill: "#FA352D",
      ease: "easeIn",
      stagger: 0.1,
    }).to(redLights, {
      duration: 0.5,
      fill: "#9CBE34",
      ease: "easeIn",
      stagger: 0.1,
      delay: 0.1,
    });
  }, []);

  const date = new Date(dolar[0]?.fechaActualizacion),
    day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear().toString().slice(2),
    hours = date.getHours();
  const formattedDate = `${day}/${month}/${year} a las ${hours}hs`;

  const variants = {
    hidden: { scale: 0 },
    visible: () => ({
      scale: 1,
      transition: { duration: 0.2, ease: "easeIn" },
    }),
    fadeOut: () => ({
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    }),
  };

  return (
    <div className="extension-container">
      <Header />
      <Divider />
      <AnimatePresence>
        {!calculator ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="currencies-container">
            {dolar.map((dolar: any) => (
              <CurrencyComponent
                key={dolar.nombre}
                type={
                  dolar.nombre === "Contado con liquidación"
                    ? "CCL"
                    : dolar.nombre
                }
                buyValue={dolar.compra}
                sellValue={dolar.venta}
              />
            ))}
            {precioReal !== null && (
              <CurrencyComponent
                key="RealBlue"
                type="Real Blue"
                buyValue={precioReal} // Usamos el precio calculado como el valor de compra
                sellValue={precioReal} // Puedes ajustar esto según tus necesidades
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
      {calculator ? <Calculator currencies={dolar} real={real}/> : null}
      <Divider />
      <div className="btns-container">
        <motion.button
          initial="hidden"
          animate="visible"
          variants={variants}
          onClick={() => {
            setCalculator(!calculator);
          }}>
          {!calculator ? <IoCalculatorOutline /> : <PiBackspaceLight />}
          <span>{!calculator ? "Calculadora" : "Atrás"}</span>
        </motion.button>
        {calculator ? (
          getStorageViewValue() ? (
            <motion.button
              initial="hidden"
              animate="visible"
              variants={variants}
              onClick={() => {
                storageView(false);
                getStorageView();
                setIsCalculatorPinned(false);
              }}>
              <PiPushPinSimpleSlashLight />
              Desfijar
            </motion.button>
          ) : (
            <motion.button
              initial="hidden"
              animate={isCalculatorPinned ? "fadeOut" : "visible"}
              variants={variants}
              onClick={() => {
                storageView(true);
                getStorageView();
                setIsCalculatorPinned(true);
              }}>
              <PiPushPinSimpleLight />
              Fijar calculadora
            </motion.button>
          )
        ) : null}
      </div>
      <LastUpdated fullDate={formattedDate} />
      <Footer />
    </div>
  );
}

export default App;
