// import các thư viện cần thiết
import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { toastSuccess } from "../utils/toastMessage";

const Header = () => {
  const navigate = useNavigate();
  // hàm handleLogout để đăng xuất
  const handleLogout = () => {
    // xóa token
    localStorage.removeItem("token");
    // chuyển hướng đến trang login
    navigate("/login");
    // hiển thị thông báo
    toastSuccess("Đăng xuất thành công");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-header">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          Logo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className="nav-link">
              Tra cứu
            </Nav.Link>
            <Nav.Link onClick={handleLogout} className="nav-link">
              Đăng xuất
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
