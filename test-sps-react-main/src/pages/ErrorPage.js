import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="text-danger">¡Oops! Algo salió mal.</h1>
      <p className="text-muted">Parece que hubo un problema al cargar la página.</p>
      <pre className="bg-light p-3">{error.statusText || error.message}</pre>
      <Button variant="primary" onClick={() => navigate("/")}>
        Volver al Inicio
      </Button>
    </Container>
  );
}

export default ErrorPage;
