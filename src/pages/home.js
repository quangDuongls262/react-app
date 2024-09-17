// import các thư viện cần thiết
import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { axiosRequest } from "../api";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../utils/tokenUtils";
import ItemResults from "../components/itemResults";
import Header from "../components/header";

const Home = () => {
  // khai báo state
  // state là biến để lưu trữ dữ liệu
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // khai báo navigate để chuyển hướng
  const navigate = useNavigate();
  // hàm checkToken để kiểm tra token
  useEffect(() => {
    const checkToken = () => {
      // lấy token từ localStorage
      const token = localStorage.getItem("token");
      // kiểm tra token có hợp lệ hay không
      if (!token || !isTokenValid(token)) {
        // nếu không hợp lệ thì chuyển hướng đến trang login
        navigate("/login");
      }
    };
    // gọi hàm checkToken để kiểm tra token
    checkToken();
    // kiểm tra token khi chuyển hướng
  }, [navigate]);

  // hàm handleSearch để tìm kiếm hộ kinh doanh
  const handleSearch = async (e) => {
    // ngăn chặn trang trình duyệt tự động gửi form
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);
    // kiểm tra xem mã số hộ kinh doanh có trống không
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập mã số hộ kinh doanh");
      setIsLoading(false);
      return;
    }
    // gửi yêu cầu đến server để tìm kiếm hộ kinh doanh
    try {
      const response = await axiosRequest(
        `/exam/HKD?id=${searchTerm.trim()}`,
        "GET"
      );
      // kiểm tra phản hồi từ server
      if (response.data) {
        // lưu dữ liệu vào state
        setResults(response.data);
      }
    } catch (error) {
      // hiển thị thông báo lỗi
      // console.error('Error fetching search results:', error);
      setError("Không tìm thấy mã số hộ kinh doanh");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-4">Tìm kiếm hộ kinh doanh</h1>
            <Form onSubmit={handleSearch}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Nhập mã số hộ kinh doanh"
                  value={searchTerm}
                  maxLength={20}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-lg"
                />
              </Form.Group>
              <div className="d-grid">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                </Button>
              </div>
            </Form>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
            {/* hiển thị dữ liệu từ state */}
            {results && Object.keys(results).length > 0 && (
              // truyền dữ liệu từ state cho ItemResults
              <ItemResults results={results} />
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
