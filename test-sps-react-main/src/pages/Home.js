import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { Spinner, Table, Button, Alert, Container } from "react-bootstrap";

function Home() {
  const [users, setUsers] = useState([]); // Estado para almacenar usuarios
  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(""); // Estado para mostrar errores
  const navigate = useNavigate();

  // Obtener el usuario autenticado y su rol
  //const userData = JSON.parse(localStorage.getItem("type"));
  const userRole = JSON.parse(localStorage.getItem("type"));

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado.");
        navigate("/login");
        return;
      }

      const data = await UserService.getUsers(token);
      setUsers(data);
    } catch (error) {
      setError("No tienes permiso para ver los usuarios.");
      setTimeout(() => navigate("/"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await UserService.deleteUser(id, token);
      fetchUsers();
    } catch (error) {
      setError("Error al eliminar usuario");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateUser = () => {
    navigate("/users/0");
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Usuarios</h1>
        <div>
          {userRole === "admin" && (
            <Button variant="success" className="me-2" onClick={handleCreateUser}>
              Nuevo Usuario
            </Button>
          )}
          <Button variant="danger" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Cargando usuarios...</span>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.type}</td>
                    <td>
                      {/* Todos pueden ver el botón "Ver" */}
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => navigate(`/usersView/${user.id}`)}
                      >
                        Ver
                      </Button>

                      {/* Solo los administradores pueden editar y eliminar */}
                      {userRole === "admin" && (
                        <>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() => navigate(`/users/${user.id}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Eliminar
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default Home;
