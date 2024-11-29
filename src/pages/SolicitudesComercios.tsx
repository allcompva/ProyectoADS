import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextareaAutosize,
  DialogActions,
  Box,
} from "@mui/material"

import useFetch from "../hooks/useFetch"
import TableBox from "../components/Table/TableBox"
import Container from "../components/Container"
import StateCell from "../components/Table/Statecell"
import { Link } from "react-router-dom"
import { useTheme } from "@emotion/react"
import Filters from "../components/Table/Filters"
import Button from "../components/Button/Button"

const SolicitudesComercios = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [messageDefault, setMessageDefault] = useState({ message: "", modal: false })

  const theme = useTheme()
  const { data: comercios, loading, error } = useFetch(
    'https://recreas.net/BackEnd/Tur_comercio/read?idCate=1'
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value)
  }

  const handleMessageConfiguration = (event) => {}

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  // Filtrar comercios por estado seleccionado
  const filteredComercios =
    selectedStatus === "Todos"
      ? comercios
      : comercios.filter((comercio) => comercio.estado === selectedStatus)

  return (
    <Container title="Aprobación de solicitudes">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: "1rem",
        }}
      >
        <Filters>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            sx={{ "& .MuiSelect-nativeInput": { border: "none" } }}
          >
            <MenuItem value="Todos">Estado</MenuItem>
            <MenuItem value="aprobado">Aprobado</MenuItem>
            <MenuItem value="rechazado">Rechazado</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
          </Select>
        </Filters>
        <Button
          variant="contained"
          sx={{ background: "#F48F007d" }}
          onClick={() => setMessageDefault({ ...messageDefault, modal: true })}
        >
          Configurar mensajes
        </Button>
      </Box>

      <TableBox>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Comercio</TableCell>
                <TableCell>Fecha de Solicitud</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComercios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((comercio) => (
                  <Link
                    to={`/admin/solicitudes-comercios/${comercio.solicitudId}`}
                    style={{ display: "contents" }}
                    key={comercio.solicitudId} // Mover key aquí para evitar advertencias
                  >
                    <TableRow>
                      <TableCell>{comercio.nombreComercio}</TableCell>
                      <TableCell>{comercio.fechaSolicitud}</TableCell>
                      <StateCell estado={comercio.estado} />
                    </TableRow>
                  </Link>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredComercios.length} // Cambiar a filteredComercios
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableBox>

      <Dialog
        open={messageDefault.modal}
        onClose={() => setMessageDefault({ ...messageDefault, modal: false })}
        sx={{
          height: { xs: "70vh", sm: "60vh" },
          maxHeight: "33rem",
          alignSelf: "center",
          "& .MuiDialog-paper": {
            width: "70vw",
            height: "100%",
            maxWidth: "none",
            borderRadius: "12px",
            padding: { xs: "0.5rem", sm: "2rem" },
          },
        }}
      >
        <DialogTitle
          fontWeight="bold"
          textAlign="left"
          sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}
        >
          Configuración de Mensajes para Comercios
        </DialogTitle>
        <DialogContent sx={{ background: "none" }}>
          <DialogContentText sx={{ textAlign: "left", marginBottom: "1rem", color: "black" }}>
            Mensaje de Aprobación
          </DialogContentText>
          <TextareaAutosize
            minRows={6}
            placeholder="Escribe un comentario..."
            value={messageDefault.message}
            onChange={handleMessageConfiguration}
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
              padding: "1rem",
              fontSize: "1rem",
              resize: "none",
              background: "#E6E0E9",
              color: "black",
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: "1rem", paddingBottom: "1rem" }}>
          <Button
            variant="text"
            onClick={() => setMessageDefault({ ...messageDefault, modal: false })}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{ background: theme.palette.primary["500"] }}
            onClick={() => setMessageDefault({ ...messageDefault, modal: false })}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SolicitudesComercios
