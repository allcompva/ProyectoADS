import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Switch,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material"
import Button from "../components/Button/Button"
import useFetch from "../hooks/useFetch"
import Container from "../components/Container"
import TableBox from "../components/Table/TableBox"
import Filters from "../components/Table/Filters"
import { Link } from "react-router-dom"
import axios from "axios"

interface Atraccion {
  publicada: boolean
  nombre: string
  atraccionId: string
  descripcion: string
}

const GestionAtracciones = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const { data: atracciones, loading, error } = useFetch("atracciones")
  const [places, setPlaces] = useState<Atraccion[]>([])

  useEffect(() => {
    /*if (!atracciones?.data) return
    setPlaces(atracciones.data)*/
    const fetchData = async () => {
      const response = await axios.get('https://recreas.net/BackEnd/Tur_publicaciones/GetByCategoria?id=1');
      setPlaces(response.data);
      fetchData();
    };
  }, [atracciones])
  useEffect(() => {
    const filteredAtracciones = () => {
      return atracciones?.data.filter((atraccion) => {
        const matchesStatus =
          selectedStatus === "Todos" ||
          (selectedStatus === "Aprobado" && atraccion.publicada) ||
          (selectedStatus === "No Publicado" && !atraccion.publicada)
        const matchesSearch = atraccion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
      })
    }
    setPlaces(filteredAtracciones)
  }, [selectedStatus])

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleStatusChange = (event) => setSelectedStatus(event.target.value)

  const handleSearchChange = (event) => setSearchTerm(event.target.value)

  const handleToggleEstado = (atraccionId: string) => {
    const changedAtraccion = places?.map((atraccion: any) =>
      atraccion.atraccionId === atraccionId
        ? { ...atraccion, publicada: !atraccion.publicada }
        : atraccion
    )
    setPlaces(changedAtraccion)
  }

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>
  return (
    <Container title="Gestión de Atracciones">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: "1rem",
        }}
      >
        <Filters sx={{ gap: "1rem" }}>
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              height: "100%",
              minWwidth: "25rem",
              width: "100%",
            }}
          />
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            variant="outlined"
            sx={{ width: "100%" }}
          >
            <MenuItem value="Todos">Todos los estados</MenuItem>
            <MenuItem value="Aprobado">Aprobado</MenuItem>
            <MenuItem value="No Publicado">No Publicado</MenuItem>
          </Select>
        </Filters>
        <Link to="/admin/atracciones/nueva">
          <Button variant="contained" sx={{ background: "#F48F007d" }}>
            Nueva Atracción
          </Button>
        </Link>
      </Box>

      <TableBox>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {places
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((atraccion) => (
                  <TableRow key={atraccion.atraccionId}>
                    <TableCell>{atraccion.nombre}</TableCell>
                    <TableCell>{atraccion.descripcion}</TableCell>
                    <TableCell>
                      <Switch
                        checked={atraccion.publicada}
                        onChange={() => handleToggleEstado(atraccion.atraccionId)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => console.log("Editar")}
                        variant="text"
                        sx={{ color: "black", width: "6rem" }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={places?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableBox>
    </Container>
  )
}

export default GestionAtracciones
