import axios from "axios";

const baseUrl =
  "https://cors-anywhere.herokuapp.com/http://123.18.206.28:8099/api";

async function axiosRequest(
  endpoint,
  method = "GET",
  data = null,
  headers = {}
) {
  // lấy token từ localStorage
  const token = localStorage.getItem("token");
  // tạo URL
  // endpoint là đường dẫn đến API
  const url = `${baseUrl}${endpoint}`;
  // khai báo biến parsedToken
  let parsedToken = null;
  // kiểm tra token có hợp lệ hay không
  try {
    // nếu token tồn tại thì parse token
    // JSON.parse là hàm để parse token
    // token ? JSON.parse(token) : null là hàm để parse token nếu token tồn tại
    parsedToken = token ? JSON.parse(token) : null;
  } catch (e) {
    // nếu có lỗi thì in ra lỗi
    console.error("Token parsing error:", e);
  }
  // lấy token từ parsedToken
  const authToken =
    parsedToken && parsedToken.token ? parsedToken.token : token;
  // xóa khoảng trắng ở đầu và cuối token
  const cleanedToken = authToken?.replace(/^"|"$/g, "");
  // tạo options
  const options = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      Authorization: cleanedToken ? `Bearer ${cleanedToken}` : "",
    },
  };
  // kiểm tra data có tồn tại hay không
  if (data) {
    // nếu tồn tại thì thêm vào options
    options.data = data;
  }
  try {
    // gửi yêu cầu đến server
    const response = await axios(options);
    // trả về response
    return response;
  } catch (error) {
    // nếu có lỗi thì in ra lỗi
    console.error("Axios error:", error);
    throw error;
  }
}

export { axiosRequest };
