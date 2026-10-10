-- ============================================================
-- Seed data — vouchers (demo). Du lieu fake de demo tinh nang
-- khuyen mai: admin tao ma, nguoi dung nhap ma luc booking de
-- duoc giam theo % hoac theo so tien co dinh, co han su dung.
-- created_by = NULL vi chua co du lieu seed cho bang users.
-- ============================================================

INSERT INTO vouchers (id, code, discount_type, discount_value, max_discount_amount, min_order_amount, usage_limit, valid_from, valid_until, is_active, created_by)
VALUES
    -- Giảm 10%, tối đa 50.000đ, đơn từ 100.000đ, còn hạn dài
    ('40000000-0000-0000-0000-000000000001', 'CHAOMUNG10', 'PERCENT', 10, 50000, 100000, 200, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, NULL),

    -- Giảm thẳng 50.000đ, đơn từ 200.000đ
    ('40000000-0000-0000-0000-000000000002', 'GIAM50K', 'AMOUNT', 50000, NULL, 200000, 100, '2026-01-01 00:00:00', '2026-10-31 23:59:59', TRUE, NULL),

    -- Voucher VIP giảm 20%, tối đa 100.000đ, đơn từ 300.000đ, sắp hết hạn
    ('40000000-0000-0000-0000-000000000003', 'VIPKBS20', 'PERCENT', 20, 100000, 300000, 50, '2026-01-01 00:00:00', '2026-08-31 23:59:59', TRUE, NULL),

    -- Voucher đã hết hạn (demo trạng thái hết hạn / khoá)
    ('40000000-0000-0000-0000-000000000004', 'HETHAN2025', 'AMOUNT', 30000, NULL, 0, 100, '2025-01-01 00:00:00', '2025-12-31 23:59:59', FALSE, NULL);
