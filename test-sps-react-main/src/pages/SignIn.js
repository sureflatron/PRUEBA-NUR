import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Verificar token al cargar el componente
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          await UserService.validateToken();
          navigate("/"); // 🔹 Cambiado de "/users" a "/"
        } catch (err) {
          localStorage.removeItem("token"); // Eliminar token inválido
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await UserService.login(email, password);
      localStorage.setItem("token", data.accessToken);

      if (data.type) {
        localStorage.setItem("type", JSON.stringify(data.type));
        console.log("TYPE",data.type)
      }else{
        console.log("FALLO AL OBTENER TYPE")
      }

      navigate("/"); // 🔹 Cambiado de "/users" a "/"
    } catch (error) {
      setError("Error en credenciales, verifica tu usuario y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Procesando...</span>
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default SignIn;
