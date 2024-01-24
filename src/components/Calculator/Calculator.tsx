import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaBrazilianRealSign } from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { CalculatorProps, CurrencyData } from "../../interfaces/interfaces";

export const Calculator = ({ currencies, real }: CalculatorProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyData | null>(
    null
  );
  const [usdConversionValue, setUsdConversionValue] = useState<string>("");
  const [usdToArs, setUsdToArs] = useState<string | number>("");
  const [isInitialSelection, setIsInitialSelection] = useState<boolean>(false);

  useEffect(() => {
    if (currencies.length > 0 && !isInitialSelection) {
      const initialCurrency =
        currencies.find((c) => c.nombre === "Real Blue") || currencies[0];
      setSelectedCurrency(initialCurrency);
      setIsInitialSelection(true);
    }
  }, [currencies, isInitialSelection]);
  useEffect(() => {
    setUsdConversionValue("");
    setUsdToArs("");
  }, [selectedCurrency]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="calculator-container">
      <FormControl fullWidth sx={{ my: 2 }} color="success">
        <InputLabel id="currency-select-label">Tipo de moneda</InputLabel>
        <Select
          labelId="currency-select-label"
          id="currency-select"
          value={selectedCurrency ? selectedCurrency.nombre : ""}
          label="Tipo de moneda"
          onChange={(e) => {
            const selected = currencies
              .concat(real)
              .find((currency) => currency.nombre === e.target.value);
            if (selected) {
              setSelectedCurrency(selected);
            }
          }}>
          {currencies.concat(real || []).map((currency) => (
            <MenuItem key={currency.nombre} value={currency.nombre}>
              {currency.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="calculator-title">
        {selectedCurrency ? (
          <>
            <h2>
              {selectedCurrency.moneda} {selectedCurrency.nombre}
            </h2>
            <span>
              1 {selectedCurrency.moneda} equivale a $
              {Math.round(selectedCurrency.venta)} ARS
            </span>
          </>
        ) : (
          <span>Cargando...</span>
        )}
      </div>
      <div className="conversor-container">
        <div className="input-container">
          <div className="coin-container">
            {selectedCurrency?.nombre === "Real Blue" ? (
              <FaBrazilianRealSign />
            ) : (
              <AiOutlineDollarCircle />
            )}
          </div>
          <CurrencyInput
            suffix={selectedCurrency?.nombre === "Real Blue" ? " BRL" : " USD"}
            prefix="$"
            className="input"
            name="usd-input"
            placeholder={
              selectedCurrency?.nombre === "Real Blue" ? "BRL" : "USD"
            }
            groupSeparator="."
            decimalSeparator=","
            intlConfig={{
              locale: "en-US",
              currency:
                selectedCurrency?.nombre === "Real Blue" ? "BRL" : "USD",
            }}
            autoFocus={true}
            decimalsLimit={2}
            value={usdConversionValue}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Verificar si el valor es válido (opcional)
              const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

              // Actualizar el estado
              setUsdConversionValue(sanitizedValue);
            }}
          />
          <div className="delete-container">
            <AnimatePresence>
              {usdConversionValue ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0, y: -25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 25 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}>
                  <BsTrash
                    onClick={() => {
                      setUsdConversionValue("");
                    }}
                  />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="result-container">
          {selectedCurrency ? (
            <CurrencyInput
              suffix=" ARS"
              prefix="$"
              className="input-result"
              name="ars-output"
              disabled={true}
              readOnly={true}
              groupSeparator="."
              decimalSeparator=","
              intlConfig={{ locale: "en-US", currency: "ARS" }}
              decimalsLimit={2}
              value={
                isNaN(selectedCurrency.venta * +usdConversionValue)
                  ? ""
                  : (selectedCurrency.venta * +usdConversionValue).toFixed(2)
              }
            />
          ) : null}
        </div>
      </div>
      <div className="conversor-container">
        <div className="input-container">
          <div className="coin-container">
            <FaRegMoneyBillAlt />
          </div>
          <CurrencyInput
            suffix=" ARS"
            prefix="$"
            className="input"
            name="ars-input"
            placeholder="ARS"
            groupSeparator="."
            decimalSeparator=","
            intlConfig={{ locale: "en-US", currency: "ARS" }}
            decimalsLimit={2}
            value={usdToArs}
            onValueChange={(value) => {
              if (value !== undefined) {
                const sanitizedValue = value.replace(/[^0-9]/g, '');
                setUsdToArs(sanitizedValue);
              } else {
                setUsdToArs("");
              }
            }}
          />
          <div className="delete-container">
            <AnimatePresence>
              {usdToArs ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0, y: -25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 25 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}>
                  <BsTrash
                    onClick={() => {
                      setUsdToArs("");
                    }}
                  />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="result-container">
          {selectedCurrency ? (
            <CurrencyInput
              suffix={
                selectedCurrency?.nombre === "Real Blue" ? " BRL" : " USD"
              }
              prefix="$"
              className="input-result"
              name="usd-output"
              disabled={true}
              readOnly={true}
              groupSeparator="."
              decimalSeparator=","
              intlConfig={{ locale: "en-US", currency: "USD" }}
              decimalsLimit={2}
              value={
                selectedCurrency && selectedCurrency.venta && +usdToArs
                  ? (+usdToArs / selectedCurrency.venta).toFixed(2)
                  : 0
              }
            />
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};
