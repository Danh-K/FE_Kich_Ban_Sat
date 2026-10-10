-- =====================================================================
-- !!! FILE NAY DA DONG BANG (frozen) TU SPRINT 1 !!!
-- Schema gio do Flyway quan ly: backend/src/main/resources/db/migration/.
-- File nay chi con giu 2 vai tro:
--   1. Ban sao y het V1__baseline.sql (docker-compose mount vao initdb de dung DB dev nhanh)
--   2. Tai lieu tham khao schema goc
-- MOI THAY DOI SCHEMA phai viet thanh migration Vn__*.sql moi, KHONG sua file nay
-- (sua se lam lech checksum baseline cua Flyway tren cac DB dang chay).
-- =====================================================================

-- =====================================================================
-- Jubensha Booking DB — schema hop nhat:
--   - noi dung kich ban / hinh anh / vai dien (tu ban thiet ke schema)
--   - booking / session / slot / thanh toan / danh gia (tu ban thiet ke
--     kien truc backend Spring Boot)
-- Chi thiet lap PRIMARY KEY va FOREIGN KEY co ban, khong danh index rieng.
-- Yeu cau: PostgreSQL 13+ (gen_random_uuid() la ham built-in tu ban 13).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Nguoi dung: player / DM (quan tro) / admin
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'PLAYER'
        CHECK (role IN ('PLAYER', 'DM', 'ADMIN')),
    -- Chi ADMIN dang nhap bang username+password (khong can OTP). PLAYER/DM dang nhap bang
    -- email (phai xac thuc OTP truoc), nen username de NULL voi cac tai khoan do.
    username VARCHAR(50) UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ma OTP xac thuc email luc dang ky (PLAYER/DM). 1 user co the co nhieu dong (gui lai nhieu lan);
-- luon lay dong moi nhat, chua consumed, chua het han khi xac thuc.
CREATE TABLE email_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_otp_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 2. Cua hang / chi nhanh
-- ---------------------------------------------------------------------
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    province VARCHAR(255),
    district VARCHAR(255),
    street VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 3. Kich ban sat (~30 game hien co)
-- ---------------------------------------------------------------------
CREATE TABLE scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,     -- dinh danh dung trong URL FE, vd "hon-ma-biet-thu-do"
    min_age INT DEFAULT 0,                 -- Vi du: 16
    genre VARCHAR(255),                    -- "Pha an, kinh di tam linh"
    difficulty_star INT CHECK (difficulty_star BETWEEN 1 AND 5),
    player_count INT NOT NULL,             -- Tong so nguoi choi / so vai
    male_count INT,
    female_count INT,
    duration_text VARCHAR(50),             -- Text goc, vd "3,5 ~ 4 tieng"
    base_price INT,                        -- Gia co ban (VND)
    npc_price INT,                         -- Gia khi co NPC (VND)
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hinh anh cua tung kich ban (anh bia + anh phu)
CREATE TABLE script_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    is_cover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_image_script
        FOREIGN KEY (script_id) REFERENCES scripts(id)
        ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 3.5. Danh muc / categories (de FE loc kich ban theo the loai)
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,      -- vd "Phá án", "Kinh dị", "Cổ trang"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1 kich ban co the thuoc nhieu danh muc (genre goc la text tu do, vd
-- "Pha an, kinh di tam linh" -> tach thanh nhieu dong o day de loc duoc)
CREATE TABLE script_categories (
    script_id UUID NOT NULL,
    category_id UUID NOT NULL,
    PRIMARY KEY (script_id, category_id),
    CONSTRAINT fk_sc_script
        FOREIGN KEY (script_id) REFERENCES scripts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_sc_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 4. Buoi choi cu the (Session) va tung vai/slot trong buoi do
-- ---------------------------------------------------------------------
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL,
    dm_user_id UUID,                       -- Quan tro duoc gan cho buoi
    start_time TIMESTAMP NOT NULL,
    min_players INT NOT NULL,              -- So nguoi toi thieu de buoi duoc xac nhan
    max_players INT NOT NULL,              -- = player_count cua kich ban (chon nhan vat luc den choi truc tiep, khong con qua he thong)
    discount_type VARCHAR(20)              -- Admin nhap luc tao buoi, NULL = khong giam gia
        CHECK (discount_type IN ('PERCENT', 'AMOUNT')),
    discount_value INT,                    -- PERCENT: 1-100 (%) | AMOUNT: so tien VND
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN'
        CHECK (status IN ('OPEN', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_script
        FOREIGN KEY (script_id) REFERENCES scripts(id),
    CONSTRAINT fk_session_dm
        FOREIGN KEY (dm_user_id) REFERENCES users(id)
);

-- 1 slot = 1 cho ngoi an danh trong 1 buoi choi (khong gan vai dien cu the -
-- nguoi choi chon nhan vat truc tiep tai quan sau khi da dat cho + coc)
CREATE TABLE session_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
        CHECK (status IN ('AVAILABLE', 'HOLDING', 'BOOKED')),
    locked_by_user_id UUID,                -- dong bo tam thoi voi Redis lock
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_slot_session
        FOREIGN KEY (session_id) REFERENCES sessions(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_slot_locked_by
        FOREIGN KEY (locked_by_user_id) REFERENCES users(id)
);

-- ---------------------------------------------------------------------
-- 4.5. Voucher khuyen mai (admin tao, nguoi dung nhap ma luc booking)
-- ---------------------------------------------------------------------
CREATE TABLE vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,       -- ma nguoi dung nhap, vd "GIAM10"
    discount_type VARCHAR(20) NOT NULL
        CHECK (discount_type IN ('PERCENT', 'AMOUNT')),
    discount_value INT NOT NULL,            -- PERCENT: 1-100 (%) | AMOUNT: so tien VND
    max_discount_amount INT,                -- tran giam toi da (ap dung cho PERCENT), NULL = khong gioi han
    min_order_amount INT NOT NULL DEFAULT 0,-- gia tri don toi thieu de duoc ap dung voucher
    usage_limit INT,                        -- so lan su dung toi da, NULL = khong gioi han
    used_count INT NOT NULL DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP NOT NULL,         -- han su dung
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID,                        -- admin tao voucher nay
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_voucher_creator
        FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ---------------------------------------------------------------------
-- 5. Dat cho (Booking) va thanh toan
-- ---------------------------------------------------------------------
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_id UUID NOT NULL,
    voucher_id UUID,                       -- voucher da ap dung cho booking nay (neu co)
    discount_amount INT NOT NULL DEFAULT 0,-- so tien duoc giam nho voucher
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED')),
    total_amount INT NOT NULL,             -- so tien phai tra SAU KHI da tru discount_amount
    expires_at TIMESTAMP,                  -- het han neu khong thanh toan (giu cho)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_booking_session
        FOREIGN KEY (session_id) REFERENCES sessions(id),
    CONSTRAINT fk_booking_voucher
        FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

-- Chi tiet: 1 booking co the giu nhieu slot (nhom ban dat tron buoi)
CREATE TABLE booking_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    session_slot_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bslot_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_bslot_slot
        FOREIGN KEY (session_slot_id) REFERENCES session_slots(id),
    -- Lop bao ve cuoi cung: 1 slot chi duoc gan vao dung 1 booking
    CONSTRAINT uq_booking_slot UNIQUE (session_slot_id)
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,  -- dung cho idempotency webhook
    amount INT NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('SUCCESS', 'FAILED', 'REFUNDED')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- ---------------------------------------------------------------------
-- 6. Danh gia sau buoi choi (dac thu nganh Kich ban sat)
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL,
    booking_id UUID NOT NULL,
    user_id UUID NOT NULL,
    dm_user_id UUID,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_script
        FOREIGN KEY (script_id) REFERENCES scripts(id),
    CONSTRAINT fk_review_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_review_dm
        FOREIGN KEY (dm_user_id) REFERENCES users(id)
);
