import { useState, useEffect } from "react";
import axios from "axios";

export default function SelectBuscador(props) {
  const [busqueda, setBusqueda] = useState('');
  const [data, setdata] = useState([])
  const [opciones, setOpciones] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(props.apiGet);
      setdata(data.results);
    }
    fetchData(busqueda);
  }, [props.apiGet,busqueda]);


  const selectvalue=(event)=>{
   setBusqueda(event.target.id) 
   props.onSelect(event.target.dataset.value);
  }

  
  const handleInputChange = event => {
    const valorBusqueda = event.target.value;
    setBusqueda(valorBusqueda);
    if (valorBusqueda === '') {
      setOpciones([]);
    } else {
      const filteredData = data?.map(record => {
        const [key, value] = Object.entries(record).find(([key, value]) =>
          value.toString().toLowerCase().includes(valorBusqueda.toLowerCase())
        ) || [];
       
        return {id:record._id, key, value };
      }).filter(result => result.key !== undefined);
      setOpciones(filteredData);
    }
  };

  return (
    <div>
      <input type="text" value={busqueda} onChange={handleInputChange} required/>
      <ul>
        {opciones?.map(opcion => (
          <li key={opcion.id} data-value={opcion.id} id={opcion.value} onClick={selectvalue}>
            {opcion.value}
          </li>
        ))}
      </ul>
    </div>
  );
}