import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

// Cargar el usuario desde el backend
export async function userLoader({ params }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return { user: null };
  }

  if (params.userId === "0") {
    return { user: null, isCreating: true };
  }

  try {
    const user = await UserService.getUserById(params.userId, token);
    return { user, isCreating: false };
  } catch (error) {
    console.error("Error al cargar usuario:", error);
    return { user: null, isCreating: false };
  }
}

function UserForm() {
  const { user, isCreating } = useLoaderData();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("user");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar datos del usuario existente si está en modo edición
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setType(user.type || "user");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    const userData = { name, email, type, password };

    try {
      if (userId === "0") {
        await UserService.createUser(userData, token);
        alert("Usuario creado correctamente");
      } else {
        await UserService.editUser(userId, userData, token);
        alert("Usuario actualizado correctamente");
      }
      navigate("/");
    } catch (error) {
      setError(error.message || (userId === "0" ? "Error al crear usuario" : "Error al actualizar usuario"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-primary text-center">
            {userId === "0" ? "Crear Nuevo Usuario" : "Editar Usuario"}
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de usuario</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={userId === "0"} 
                placeholder={userId !== "0" ? "Dejar vacío para mantener la actual" : ""}
              />
              {userId !== "0" && (
                <Form.Text className="text-muted">
                  Dejar vacío para mantener la contraseña actual.
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate("/")}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Procesando...
                  </>
                ) : userId === "0" ? "Crear Usuario" : "Guardar Cambios"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default UserForm;
