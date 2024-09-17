// import các thư viện cần thiết
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toastSuccess } from "../utils/toastMessage";
const Login = () => {
  // khai báo state
  // state là biến để lưu trữ dữ liệu
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false); // Trạng thái hiển thị mật khẩu
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateInput = () => {
    // kiểm tra tên đăng nhập và mật khẩu có được điền hay không
    if (!username || !password) {
      setError("Tên đăng nhập và mật khẩu không được để trống.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    // ngăn chặn trang trình duyệt tự động gửi form
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateInput()) {
      // nếu không hợp lệ thì đặt trạng thái loading về false
      setIsLoading(false);
      // không thực hiện gửi yêu cầu đến server
      return;
    }

    try {
      // gửi yêu cầu đến server để đăng nhập
      // tạo dữ liệu để gửi đến server
      const data = JSON.stringify({ username, password });
      // gửi yêu cầu đến server
      const response = await axiosRequest("/auth/login", "POST", data);
      // kiểm tra phản hồi từ server
      if (!response || !response.data) {
        // nếu phản hồi không hợp lệ thì throw ra lỗi
        throw new Error("Phản hồi không hợp lệ từ máy chủ");
      }
      // lấy token từ phản hồi
      const { token } = response.data;
      if (!token) {
        throw new Error("Không tìm thấy token");
      }
      // lưu token vào localStorage
      localStorage.setItem("token", JSON.stringify(token));
      // hiển thị thông báo đăng nhập thành công
      toastSuccess("Đăng nhập thành công");
      // chuyển hướng đến trang home
      navigate("/");
    } catch (error) {
      // hiển thị thông báo lỗi
      console.log("Login error", error);
      setError(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu."
      );
    } finally {
      // đặt trạng thái loading về false
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col xs={12} md={4} className="bg-light p-4 rounded">
            <h1 className="text-center mb-4">Đăng nhập</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={show ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <AiFillEye /> : <AiFillEyeInvisible />}{" "}
                  </span>
                </div>
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
