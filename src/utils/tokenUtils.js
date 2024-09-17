import { jwtDecode } from "jwt-decode";
// hàm isTokenValid để kiểm tra token có hợp lệ hay không
export function isTokenValid(token) {
  try {
    // giải mã token
    const decoded = jwtDecode(token);
    // lấy thời gian hiện tại
    const now = Date.now() / 1000;
    // kiểm tra token có hợp lệ hay không
    return decoded.exp > now;
  } catch (error) {
    // hiển thị thông báo lỗi
    console.error("Error decoding token:", error);
    return false;
  }
}
