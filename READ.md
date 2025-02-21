code flow:
1/ create model schema
2/ import model schema to db-config.js
3/ create model base on schema and export (db-config.js)
4/ import model to controllerModelName.js
5/ import controller and route from controller to server.js


**Lưu ý: để sử dụng được api login (jwt) cần thêm file .env ở ngoài cùng (thư mục root) và thêm nội dung
ACCESS_TOKEN_SECRET=5c0eb22094ee629fbd12edc47614aacad9723cd0bf809ceb687527826a506754c1e05c7a3abe6bf58a3d7989e23fa757807ecaeae9dfc1ae90749910b059af3e


{
    "firstName": "hieu",
    "lastName": "nguyen",
    "username": "hieutestjwt",
    "password": "Hieu@2005",
    "email": "Hieu123@gmail.com",
    "phone": "0749253011"
}

{
    "message": "Đăng nhập thành công.",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhpZXV0ZXN0and0IiwiaWF0IjoxNzM5Njc2NTc0LCJleHAiOjE3Mzk2ODAxNzR9.37H8bbH6Ync__7Pr1--L4BwUn-rsMrZWXhzSshXx4I4",
    "refreshToken": "ubnLFkqIXkuds734uULOUI2FfsJwZljdGhdyoJsO9Me1FgoJrxtJJTrmuOnkOjVX"
}

{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhpZXV0ZXN0and0IiwiaWF0IjoxNzM5Njc2NjI1LCJleHAiOjE3Mzk2ODAyMjV9.9HED1xDB_mtUJZeqo82QhaB2bU6mIp7IfqHp6voSfNk"
}


