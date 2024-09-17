// import các thư viện cần thiết
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { isTokenValid } from "../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
import { Alert, Card, Container, Form, ListGroup } from "react-bootstrap";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import EditUserModal from "../components/editUserModal";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toastError, toastSuccess } from "../utils/toastMessage";
import Spinner from "react-bootstrap/Spinner";

const Search = () => {
  // khai báo state
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const navigate = useNavigate();

  useEffect(() => {
    // hàm checkToken để kiểm tra token
    const checkToken = () => {
      // lấy dữ liệu từ localStorage
      const token = localStorage.getItem("token");
      // kiểm tra token
      if (!token || !isTokenValid(token)) {
        // nếu không có token hoặc token không hợp lệ, chuyển hướng đến trang login
        navigate("/login");
      }
    };
    checkToken();
    // gọi hàm fetchAllData để lấy dữ liệu từ firebase
  }, [navigate]);

  useEffect(()=>{
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      setLoading(true); // Bắt đầu loading
      // khai báo biến filteredResults
      const filteredResults = [];
      // lấy dữ liệu từ querySnapshot
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Kiểm tra nhiều trường
        if (
          data.hoTen.toLowerCase().includes(searchTerm.trim()) ||
          data.mst.toLowerCase().includes(searchTerm.trim()) ||
          data.diaChi.toLowerCase().includes(searchTerm.trim()) ||
          data.nnkd.toLowerCase().includes(searchTerm.trim())
        ) {
          filteredResults.push({ id: doc.id, ...data });
        }
      });
      setResults(filteredResults);
      setLoading(false); // Kết thúc loading
    });
    // Hàm unsubscribe này có thể được gọi để dừng lắng nghe nếu cần
    return () => unsubscribe();
  }, [searchTerm])

  // hàm handleInputChange để lấy dữ liệu từ input
  const handleInputChange = async (e) => {
    // lấy dữ liệu từ input
    const inputValue = e.target.value.toLowerCase(); 
    setSearchTerm(inputValue);
    // lấy dữ liệu từ firebase
  };

  // hàm handleClose để đóng modal
  const handleClose = () => setShow(false);
  // hàm handleShow để hiển thị modal
  // hàm handleClose để đóng modal
  const handleShow = (user) => {
    setShow(true);
    setUser(user);
  };

  // hàm deleteUser để xóa người dùng
  const deleteUser = async (userId) => {
    const userRef = doc(db, "users", userId); // tham chiếu đến document của người dùng
    try {
      await deleteDoc(userRef); // xóa document
      toastSuccess('Xóa thành công.')
    } catch (error) {
      toastError('Xóa thất bại.')
      console.error("Error deleting user:", error); // hiển thị thông báo lỗi
    }
  };

  return (
    <div>
      <Header />
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-4">Tra cứu hộ kinh doanh</h1>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Nhập từ khóa tra cứu"
                  value={searchTerm}
                  maxLength={20}
                  onChange={handleInputChange}
                  className="form-control-lg"
                />
              </Form.Group>
              <div className="d-grid"></div>
            </Form>
            {/* hiển thị dữ liệu từ state */}
            <div className="position-relative">
              {results &&  results.length > 0 ? (
                <>
                  <Card>
                    <Card.Body>
                      <Card.Title>Kết quả tìm kiếm</Card.Title>
                      {results.slice(0, 10).map((user, index) => ( // Limit to first 10 users
                        <ListGroup key={index}>
                          <ListGroup.Item className="mb-2 d-flex justify-content-between">
                            <span className="align-items-center">
                              <span className="text-muted"> <strong>Họ tên: </strong>{user.hoTen}</span>
                              <br />
                              <span className="text-muted"> <strong>MST: </strong>{user.mst}</span> 
                              <br />
                              <span className="text-muted"> <strong>Địa chỉ: </strong>{user.diaChi}</span> 
                              <br />
                              <span className="text-muted"> <strong>NĐKD: </strong>{user.nnkd}</span> 
                            </span>
                            <div className="pl-2 align-items-center d-flex justify-content-center">
                              <FiEdit
                                onClick={() => handleShow(user)}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                  marginRight: '15px'
                                }}
                              />
                              <AiOutlineDelete
                                onClick={() => {
                                  if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
                                    deleteUser(user.id); // gọi hàm deleteUser với id của người dùng
                                  }
                                }}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      ))}
                    </Card.Body>

                  </Card>
                </>
              ) : searchTerm !== "" && !loading ? (
                <Alert variant="warning">Không tìm thấy hộ kinh doanh</Alert>
              ) : null}
              {loading && (
                  <div className="text-center position-absolute top-50 start-50 translate-middle">
                    <Spinner animation="border" role="status">
                    </Spinner>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
      {/* modal edit */}
      {user && (
        <EditUserModal
          show={show}
          handleClose={handleClose}
          user={user}
        />
      )}
    </div>
  );
};
export default Search;