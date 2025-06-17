import { Container, Spinner } from 'react-bootstrap';

export default function Favorites() {
  return (
    <Container
      fluid
      className="aother-pages d-flex flex-column justify-content-center align-items-center text-center"
    >
      <Spinner className='aother-pages-spinner' animation="grow" variant="warning" />
      <h3 className="mt-3">Favorites Page is Under Development</h3>
      <p className="text-muted">Please check back later!</p>
    </Container>
  );
}
