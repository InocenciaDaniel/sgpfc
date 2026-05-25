import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    alert(`Você clicou no dia: ${date.toLocaleDateString()}`);
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Evita domingos (0) e sábados (6)
  };

  const highlightWithRanges = [
    new Date(2025, 0, 19), // Exemplo: 19 de Janeiro de 2025
    new Date(2025, 0, 25),
  ];

  return (
    <div>
      <style>{` .react-datepicker__day--highlighted {
  background-color: #4caf50;
  color: white;
}
.react-datepicker__day--disabled {
  color: #ccc;
}
`}</style>
      <h2>Selecione uma data</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateClick} // Lida com a seleção de um dia
        inline // Mostra o calendário em linha (não como um pop-up)
        filterDate={isWeekday}
        highlightDates={highlightWithRanges}
      />
      {selectedDate && (
        <p>Data selecionada: {selectedDate.toLocaleDateString()}</p>
      )}
    </div>
  );
};

export default Calendario;
