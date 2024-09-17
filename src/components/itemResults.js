// import các thư viện cần thiết
import React from "react";
import { Button, Card } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { toastSuccess, toastError } from "../utils/toastMessage";

const ItemResults = ({ results }) => {
  // hàm handleSubmit để lưu dữ liệu vào firebase
  const handleSubmit = async () => {
    try {
      // tạo query để kiểm tra xem mst đã tồn tại chưa
      const q = query(collection(db, "users"), where("mst", "==", results.mst));
      // lấy dữ liệu từ firebase
      const querySnapshot = await getDocs(q);
      // kiểm tra xem mst đã tồn tại chưa
      if (!querySnapshot.empty) {
        toastError("Hộ kinh doanh đã tồn tại.");
        return;
      }
      // Nếu MST chưa tồn tại, tiến hành lưu
      await addDoc(collection(db, "users"), {
        hoTen: results.hoTen,
        mst: results.mst,
        diaChi: results.diaChi,
        nnkd: results.nnkd,
      });
      // hiển thị thông báo
      toastSuccess("Đã lưu thành công!");
    } catch (error) {
      // hiển thị thông báo lỗi
      console.error("Error: ", error);
      toastError("Đã xảy ra lỗi khi lưu.");
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header as="h5">Kết quả tìm kiếm</Card.Header>
      <Card.Body>
        <dl className="row">
          {/* họ tên */}
          <dt className="col-sm-3">Họ tên:</dt>
          <dd className="col-sm-9">{results.hoTen}</dd>
          {/* mã số thuế */}
          <dt className="col-sm-3">Mã số thuế:</dt>
          <dd className="col-sm-9">{results.mst}</dd>
          {/* địa chỉ */}
          <dt className="col-sm-3">Địa chỉ:</dt>
          <dd className="col-sm-9">{results.diaChi}</dd>
          {/* ngành nghề kinh doanh */}
          <dt className="col-sm-3">Ngành nghề kinh doanh:</dt>
          <dd className="col-sm-9">{results.nnkd}</dd>
        </dl>
        <div className="d-grid mt-3">
          {/* nút lưu kết quả */}
          <Button variant="success" onClick={handleSubmit} type="submit">
            Lưu kết quả
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemResults;
