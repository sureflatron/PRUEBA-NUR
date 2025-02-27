import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import { Card, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

// Cargar el usuario desde el backend
export async function userLoader({ params }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return { user: null };
  }

  try {
    const user = await UserService.getUserById(params.userId, token);
    return { user };
  } catch (error) {
    console.error("Error al cargar usuario:", error);
    return { user: null };
  }
}

function UserView() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setError("No se pudo cargar la información del usuario.");
    }
    setLoading(false);
  }, [user]);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-primary text-center">Detalles del Usuario</h2>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Cargando datos...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Card>
              <Card.Body>
                <Card.Text>
                  <strong>Nombre:</strong> {user.name}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {user.email}
                </Card.Text>
                <Card.Text>
                  <strong>Tipo de usuario:</strong> {user.type === "admin" ? "Administrador" : "Usuario"}
                </Card.Text>
                <div className="d-flex justify-content-center">
                  <Button variant="secondary" onClick={() => navigate("/")}>
                    Volver
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default UserView;
