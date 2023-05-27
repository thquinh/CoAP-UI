## Giao diện CoAP

Xây dựng chương trình thực hiện một trong các giao thức: CoAP cho mạng cảm
biến không dây bao gồm các thành phần:
- Gateway đóng vai trò server
- Chương trình sinh dữ liệu cho các cảm biến để gửi đến server. Chương trình
có giao diện hiển thị phía server.
- Chương trình cho phép các cảm biến nhận dữ liệu (ví dụ dữ liệu điều khiển
từ gateway).

## Yêu cầu chính
1. Chương trình hiển thị thông tin các cảm biến thực hiện kết nối với gateway.
2. Chương trình sinh dữ liệu cho các cảm biến: tự động sinh dữ liệu cảm biến
và gửi dữ liệu lên gateway. Chương trình hiển thị dữ liệu nhận được phía
gateway (sử dụng các biểu đồ line chart, bar chart, pie chart để hiển thị)
3. Chương trình hiển thị thông tin điều khiển tại các cảm biến (được gửi từ
gateway)
4. Chương trình hiển thị đánh giá số lượng tối đa các node cảm biến có thể kết
nối đến gateway.
5. Chương trình hiển thị đánh giá hiệu năng của giao thức: Throughput, delay,
v.v. khi số lượng node cảm biến tăng lên.

## Cài đặt và triển khai 

Cài đặt:

`npm install`   

Chạy giao diện:

`npm run dev`  

Truy cập app:

`localhost:3000`  