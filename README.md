# Vun bồi thịnh vượng · Quà Tết 2027 cho Standard Chartered

Landing page pitching bộ sưu tập quà tặng Tết Đinh Mùi 2027 dành riêng cho **Standard Chartered Việt Nam**, do **VIER Fine Wines × Wine Embassy** thực hiện.

Trang tĩnh (HTML, CSS, JavaScript thuần), không cần cài đặt hay build. Mở `index.html` là chạy.

## Nội dung trang

1. Hoạt cảnh mở đầu: logo Standard Chartered chính thức trên nền trắng, sắc đỏ Tết lan ra, logo chuyển sang vàng, tan thành hạt và ghép thành con dê leo lên đỉnh núi (có nút **Bỏ qua** và **Xem lại hoạt cảnh**)
2. Logo Standard Chartered trên nền trắng
3. Giá trị thương hiệu “Here for good”
4. Tết Đinh Mùi 2027 và sự liên kết với thương hiệu
5. Key visual toàn bộ sưu tập
6. Concept “Vun bồi thịnh vượng” (Khởi Sắc, Vun Bồi, Mùa Vàng)
7. Vì sao chọn VIER và 8 set quà (thành phần, xuất xứ, giá niêm yết, ưu đãi tới 25%)
8. Thiệp chúc Tết, có khung thử cá nhân hóa lời chúc
9. VIER Fine Wines, Wine Embassy và các thương hiệu đồng hành
10. Liên hệ
11. Lời cảm ơn

## Cấu trúc thư mục

```
vier-standard-chartered-tet-2027/
├── index.html                  Trang chính
├── assets/
│   ├── css/style.css           Toàn bộ giao diện (màu, font, bố cục)
│   ├── js/main.js              Hoạt cảnh mở đầu, bộ lọc set quà, phóng to ảnh, thiệp cá nhân hóa
│   └── img/
│       ├── favicon.svg
│       ├── key-visual-tet-2027.webp
│       ├── thiep-chuc-tet-2027.webp
│       ├── gifts/              Ảnh 8 set quà (k1 … v6)
│       └── logos/              Logo Standard Chartered (SVG gốc), VIER, Wine Embassy, đối tác
├── .nojekyll                   Để GitHub Pages phục vụ nguyên trạng file
├── .gitignore
└── README.md
```

## Xem thử trên máy

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một server nhỏ trong thư mục này:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

Font chữ (Lexend, Playfair Display) tải từ Google Fonts nên cần có mạng.

## Đưa lên GitHub

**Cách 1: giao diện web**

1. Vào github.com, bấm **New repository**, đặt tên (ví dụ `vier-standard-chartered-tet-2027`), không tick thêm README.
2. Bấm **uploading an existing file**, kéo toàn bộ nội dung bên trong thư mục này (cả thư mục `assets`) vào, rồi **Commit changes**.
   Lưu ý: macOS ẩn file bắt đầu bằng dấu chấm (`.nojekyll`, `.gitignore`). Nhấn `Cmd + Shift + .` trong Finder để hiện chúng trước khi kéo thả.

**Cách 2: dòng lệnh**

```bash
cd vier-standard-chartered-tet-2027
git init
git add .
git commit -m "Landing page quà Tết 2027 cho Standard Chartered"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/vier-standard-chartered-tet-2027.git
git push -u origin main
```

## Bật GitHub Pages

Settings → **Pages** → Source: **Deploy from a branch** → Branch: `main`, thư mục `/ (root)` → **Save**.
Sau khoảng 1–2 phút, trang có địa chỉ dạng `https://<tai-khoan>.github.io/vier-standard-chartered-tet-2027/`.

## Lưu ý bảo mật

- Đây là tài liệu pitching có giá. Trang GitHub Pages ai có đường link đều xem được, kể cả khi repository để private.
- GitHub Pages với repository private chỉ có ở gói GitHub Pro, Team hoặc Enterprise; gói Free chỉ hỗ trợ repository public.
- `index.html` đã có thẻ `noindex, nofollow` để Google không đưa trang vào kết quả tìm kiếm. Xoá thẻ này nếu muốn ngược lại.

## Chỉnh sửa nhanh

| Muốn đổi | Sửa ở đâu |
| --- | --- |
| Giá một set | `index.html`, tìm mã set (ví dụ `id="set-v2"`), sửa cả **giá niêm yết** và giá **“từ …”** (= giá niêm yết × 0,75) |
| Thành phần, xuất xứ | `index.html`, khối `<ul class="items">` trong card của set đó |
| Số điện thoại, email | `index.html`, phần `id="lien-he"`: sửa chữ hiển thị, `href="tel:…"`, `href="mailto:…"` và `data-copy="…"` |
| Ảnh set quà | Thay file cùng tên trong `assets/img/gifts/` (tỷ lệ 2:1, khuyến nghị 1440×720, định dạng WebP hoặc JPG) |
| Màu sắc, cỡ chữ | Các biến ở đầu `assets/css/style.css` (`--lacquer-…`, `--gold-…`, `--fs-…`) |
| Thời lượng hoạt cảnh | `assets/js/main.js`, hàm `playIntro` (các giá trị `wait(...)` và `tween(...)` tính bằng mili giây) |

## Thương hiệu và hình ảnh

- Logo Standard Chartered dùng nguyên bản file SVG chính thức (`assets/img/logos/standard-chartered.svg`), màu chuẩn: xanh lam `#0473EA`, xanh lục `#38D200`, xám `#525355`. Bản màu đặt trên nền trắng; bản vàng chỉ dùng như hiệu ứng ép kim trên nền đỏ.
- Logo và nhãn hiệu thuộc quyền sở hữu của các chủ sở hữu tương ứng. Hình ảnh sản phẩm mang tính minh họa; quy cách cuối cùng theo mẫu duyệt.
- Giá chưa bao gồm VAT và chưa chiết khấu. Ưu đãi tối đa 25%, tùy sản lượng, xác nhận trong báo giá chính thức.

## Liên hệ

Ms. Trang · 0985 296 329 · office@wineembassy.com.vn

© 2026 VIER Fine Wines × Wine Embassy. Tài liệu dành riêng cho Standard Chartered Việt Nam.
