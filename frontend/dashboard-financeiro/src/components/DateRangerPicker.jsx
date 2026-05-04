import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const DateRangePicker = ({ value, onChange }) => {
    const inputRef = useRef(null);
    const pickerRef = useRef(null);

    const formatDateBR = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("pt-BR");
    };

    // 🔧 inicializa flatpickr
    useEffect(() => {
        if (!inputRef.current) return;

        pickerRef.current = flatpickr(inputRef.current, {
            mode: "range",
            dateFormat: "d/m/Y",
            allowInput: false,

            defaultDate:
                value?.inicio && value?.fim
                    ? [value.inicio, value.fim]
                    : null,

            onChange: (selectedDates) => {
                const [inicio, fim] = selectedDates;

                onChange({
                    inicio: inicio || null,
                    fim: fim || null
                });
            }
        });

        return () => {
            pickerRef.current?.destroy();
            pickerRef.current = null;
        };
    }, []);

    // 🔄 sincroniza quando value muda (externamente)
    useEffect(() => {
        if (!pickerRef.current) return;

        if (value?.inicio && value?.fim) {
            pickerRef.current.setDate([value.inicio, value.fim], false);

            inputRef.current.value =
                `${formatDateBR(value.inicio)} até ${formatDateBR(value.fim)}`;
        } else {
            pickerRef.current.clear();
            inputRef.current.value = "";
        }
    }, [value]);

    return (
        <div className="relative w-full max-w-sm">
            <input
                ref={inputRef}
                type="text"
                placeholder="Selecione o período"
                readOnly
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer"
            />
        </div>
    );
};

export default DateRangePicker;