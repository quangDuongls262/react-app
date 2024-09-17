// import các thư viện cần thiết
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toastSuccess, toastError } from "../utils/toastMessage";
const EditUserModal = ({ show, fetchAllData, handleClose, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  // tạo formData để lưu dữ liệu
  const [formData, setFormData] = useState({
    hoTen: user.hoTen,
    mst: user.mst,
    diaChi: user.diaChi,
    nnkd: user.nnkd,
  });

  // kiểm tra nếu user thay đổi thì cập nhật lại formData
  useEffect(() => {
    setFormData({
      hoTen: user.hoTen,
      mst: user.mst,
      diaChi: user.diaChi,
      nnkd: user.nnkd,
    });
  }, [user]);

  // hàm handleChange để lưu dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    // lưu dữ liệu vào formData
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  // hàm handleSave để lưu dữ liệu vào firebase
  const handleSave = async () => {
    try {
      setIsLoading(true);
      // cập nhật dữ liệu vào firebase
      await setDoc(doc(db, "users", user.id), formData);
      // đóng modal
      handleClose();
      // cập nhật lại dữ liệu
      fetchAllData();
      // hiển thị thông báo
      toastSuccess("Cập nhật thành công");
      setIsLoading(false);
    } catch (error) {
      // hiển thị thông báo lỗi
      setIsLoading(false);
      console.error("Error saving user: ", error);
      toastError("Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa hộ kinh doanh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="hoTen">
              <Form.Label>Tên hộ kinh doanh</Form.Label>
              {/* gán value từ formData */}
              <Form.Control
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="mst">
              {/* gán value từ formData */}
              <Form.Label>Mã số thuế</Form.Label>
              <Form.Control
                type="number"
                name="mst"
                value={formData.mst}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="diaChi">
              {/* gán value từ formData */}
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="nnkd">
              {/* gán value từ formData */}
              <Form.Label>Ngành nghề kinh doanh</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="nnkd"
                value={formData.nnkd}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUserModal;
