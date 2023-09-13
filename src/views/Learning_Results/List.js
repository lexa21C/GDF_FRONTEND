
import * as Reactstrap from "reactstrap";
import Header from "../../components/Headers/HEAD";
import axios from "axios";
import PaginationData from "../../components/Pagination/pagination.js";
import ModalResults from "../Learning_Results/CreateResult.js"
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Search from "../../components/Search/search"

export default function List() {

  const [results, setResults] = useState([]);
  //bucador
  const [searchTerm, setSearchTerm] = useState("");

  const [modal, setModal] = useState(false);

  const [type, setType] = useState(false)

  //select para editar 
  const [selectedResult, setSelectedResult] = useState(null);

  const { competenceid } = useParams();
  const { nameCompetence } = useParams();

  const toggle = () => {
    setModal(!modal);
    setType(false);
  };

  //Editar
  const Edit = (learning_r) => {
    setSelectedResult(learning_r);
    setModal(true);
    setType(true);
  };

  // pagination data
  const totalResults = results?.length;
  const [PerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  const lastIndex = PerPage * currentPage;
  const firstIndex = lastIndex - PerPage;

  const handleInputChange = event => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
  //  getData();
  const fetchData = async () => {
    const { data } = await axios.get(
      `api/v1/learningResults/${competenceid}`
    );
    setResults(data.results);
  };
  fetchData();
  }, [modal, searchTerm, competenceid]
  );

  return (
    <>
      <Header title='Competencias: ' description={`${nameCompetence}`} />
      {/* Page content */}
      <Reactstrap.Container className="mt--7" fluid>
        {/* Table */}
        <Reactstrap.Row>
          <div className="col">
            <Reactstrap.Card className="shadow">
              <Reactstrap.CardHeader className="border-0">

                <Reactstrap.Button color="primary"
                  type="button"
                  className="btn-circle btn-neutral "
                  onClick={toggle}>
                  <i className="ni ni-fat-add" />
                </Reactstrap.Button>
                {/* <h3 className="mb-0">Comptencia</h3><p>: {nameCompetence}</p> */}
                <Search
                  searchTerm={searchTerm}
                  handleInputChange={handleInputChange}
                  placeholder="Buscar Resultado Aprendizaje" />

              </Reactstrap.CardHeader>
              <Reactstrap.Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Codigo</th>
                    <th scope="col">Resultados de aprendizaje</th>
                    <th scope="col">Acciones</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {results
                  ?.filter((result) =>
                    Object.values(result)
                      .join(" ")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )?.slice(firstIndex, lastIndex)
                    .map((learning_result, Index = learning_result._id) => (
                      <tr key={Index}>
                        <th>{Index + 1}</th>
                        <th>{learning_result._id}</th>
                        <th scope="row" >
                          <div className="ml-10 text-sm " id={`t1${learning_result._id}`}>
                            <Reactstrap.UncontrolledTooltip target={`t1${learning_result._id}`}>
                              {learning_result.learning_result}
                            </Reactstrap.UncontrolledTooltip>
                            {learning_result.learning_result.length > 100 ?
                              learning_result.learning_result.slice(0, 100) + '...' : learning_result.learning_result}
                          </div>
                        </th>
                        <td>
                
                          <Reactstrap.Button
                            color="primary"
                            type="button"
                            className="btn-neutral  btn-sm"
                            onClick={() => Edit(learning_result)}
                            id={`icon1${learning_result.code}`}
                          >
                            <i className="fa-solid fa-edit"></i>
                          </Reactstrap.Button>
                          <Reactstrap.UncontrolledTooltip
                            delay={0}
                            target={`icon1${learning_result.code}`}
                          >
                            Editar 
                          </Reactstrap.UncontrolledTooltip>
                        </td>
                      </tr>

                    ))}
                </tbody>
              </Reactstrap.Table>

              <Reactstrap.CardFooter className="py-4">
                <nav aria-label="...">
                  <PaginationData
                    PerPage={PerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    total={totalResults}
                  />
                </nav>
              </Reactstrap.CardFooter>

              {/* Modal crear */}
              <ModalResults
                isOpen={modal}
                toggle={toggle}
                type={type}
                learning_result={selectedResult}
                apiGetC={`api/v1/learningResults/show/${selectedResult?._id}`}
              />

            </Reactstrap.Card>
          </div>
        </Reactstrap.Row>
      </Reactstrap.Container>
    </>
  )
}