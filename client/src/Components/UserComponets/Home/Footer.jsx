import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>If you have any questions or feedback, feel free to reach out.</p>
            <p>Email: contact@example.com</p>
            <p>Phone: +123-456-7890</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/menu">Menu</a>
              </li>
              <li>
                <a href="/locations">Locations</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect With Us</h5>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="footer-bottom">
        <Container>
          <Row>
            <Col md={6}>
              <p>&copy; {new Date().getFullYear()} FoodDeliver App. All Rights Reserved.</p>
            </Col>
            <Col md={6}>
              <ul className="list-inline text-md-end">
                <li className="list-inline-item">
                  <a href="/terms">Terms of Use</a>
                </li>
                <li className="list-inline-item">
                  <a href="/sitemap">Sitemap</a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
