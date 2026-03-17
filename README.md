# FPT Parking Auth Setup

Frontend nay dung **Supabase** lam backend auth chinh.

## Chuc nang da co

- Dang ky tai khoan bang email/password
- Gui email xac nhan tai khoan
- Callback xac nhan email tai `/auth/confirm`
- Quen mat khau bang **OTP 6 so gui qua email**
- Dat lai mat khau sau khi xac minh OTP thanh cong
- Google sign-in qua Supabase
- Ho so nguoi dung luu o backend bang `public.profiles`

## Chay local

1. Cai dependency:
   `npm install`
2. Tao file `.env` tu `.env.example`
3. Dien:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_CLIENT_ID` neu dung Google login
4. Chay app:
   `npm run dev`

Neu muon bat ca frontend va AI backend cung luc:

`npm run start-all`

## Chay AI backend Vehicle Access Verifier

Trang `Dang ky xe` se gui bien so va video khuon mat sang AI backend local truoc khi luu vao Supabase.

Chay backend bang lenh:

`npm run ai-backend`

Neu backend da chay dung, API health se co dia chi:

`http://localhost:8000/api/health`

API dang ky xe ma frontend su dung:

`http://localhost:8000/api/register-vehicle`

Frontend gui `multipart/form-data` gom:

- `user_id`
- `plate`
- `face_media`

## Cau hinh Supabase bat buoc

Trong Supabase Dashboard:

1. Vao `Authentication -> Providers -> Email`
2. Bat `Confirm email`
3. Cau hinh `Site URL`:
   - `http://localhost:3000`
4. Them `Redirect URLs`:
   - `http://localhost:3000/auth/confirm`
   - Neu co domain deploy, them domain that tuong ung
5. Cau hinh `Custom SMTP` de gui email that

## Backend profiles cho nguoi dung

De ten, so dien thoai va thong tin ho so khong bi phu thuoc vao metadata cua Google, app da duoc doi sang dung bang `public.profiles`.

Ban can chay file SQL sau trong Supabase SQL Editor:

`supabase/migrations/20260316_create_profiles.sql`

File nay se:

- tao bang `profiles`
- bat RLS
- tao trigger tu dong tao profile khi co user moi
- backfill profile cho cac tai khoan da ton tai

Sau khi chay xong, ten nguoi dung se duoc doc/ghi tu backend `profiles`, nen sau reload hoac dang xuat dang nhap lai van giu nguyen.

## Backend vehicles cho nguoi dung

App da co service backend cho xe va anh khuon mat. Ban can chay tiep file:

`supabase/migrations/20260316_create_vehicles.sql`

File nay se:

- tao bang `vehicles`
- bat RLS cho du lieu xe
- tao bucket `face-photo`
- tao storage policy de moi user chi upload vao thu muc cua chinh minh

Sau khi chay xong, man dang ky xe va dashboard se doc/ghi du lieu xe tu backend that.

## Email template can sua

### Confirm signup

Dung link callback ve app:

```txt
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

### Reset password

Hien thi OTP thay vi link:

```txt
Ma OTP dat lai mat khau cua ban la: {{ .Token }}
```

## Ghi chu flow

- Sau khi dang ky, nguoi dung chi hoan tat khi bam link trong email xac nhan.
- Sau khi bam link xac nhan thanh cong, app se yeu cau dang nhap lai.
- Khi quen mat khau, app gui OTP qua email, xac minh OTP bang Supabase `verifyOtp`, roi moi cho dat mat khau moi.
- Ten hien thi trong app uu tien lay tu bang `profiles`, khong con phu thuoc vao du lieu tra ve moi lan Google login.
