-- ============================================================
-- Seed data — 32 kich ban (script) trich xuat tu anh poster
-- Khop schema: scripts, script_images (xem schema.sql)
--
-- Ghi chu ve du lieu fake / dieu chinh (demo, khong phai so lieu that):
--   - male_count / female_count: hau het poster khong ghi ro so nam/nu,
--     nen minh dien so lieu fake hop ly (tong = player_count) de UI demo
--     khong bi trong. 2 script von da co so lieu that (Co Thu Ngan Nga,
--     Thanh Thanh Man) duoc giu nguyen.
--   - npc_price: cac script khong ghi gia NPC rieng duoc fake = base_price
--     cong them 20.000 ~ 30.000 VND cho co du lieu hien thi demo.
--   - script #29 "Tuyet Huong Lien Hoan An": poster chi ghi "Bat buoc ghep
--     team" khong co so cu the -> fake player_count = 6 (thay vi placeholder
--     0 khong hop le cho demo).
--   - script #16, #18, #28: poster ghi khoang so nguoi (vd "7 - 10 nguoi"),
--     da luu gia tri toi da vao player_count, ghi chu khoang thuc te trong
--     phan dau description.
--   - image_url: tro thang ve file anh thuc te dang nam phang trong
--     db/image/<slug>.jpg (khong dung cau truc thu muc /images/scripts/<slug>/cover.jpg
--     vi thu muc do chua ton tai trong repo).
-- ============================================================

-- 1. 2/12
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '2/12',
    '2-12',
    16,
    'Phá án, kinh dị tâm linh',
    4,
    7,
    4,
    3,
    '~ 4 tiếng',
    199000,
    219000,
    'Hàng loạt sự kiện kỳ lạ và đáng sợ xảy ra với học sinh: Một số mất tích bí ẩn, một số khác bị ám ảnh bởi ác mộng quay quắt, và có người thậm chí cảm thấy như đang bị ai đó rình rập, truy đuổi. Ngôi trường vốn dĩ yên bình, bỗng chốc trở thành hiện trường của những sự kiện kinh hoàng khiến ai nấy không khỏi hoài nghi về những gì thực sự đang diễn ra. Liệu có phải lời nguyền nào đó đang được khơi dậy, hay một bí mật đen tối nào đó từ lâu đã được giấu kín trong những bức tường của trường Chân Lý?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '/images/scripts/2_12.jpg', TRUE);


-- 2. 100 Cách Chết Của Người Yêu Cũ
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '100 Cách Chết Của Người Yêu Cũ',
    '100-cach-chet-cua-nguoi-yeu-cu',
    16,
    'Phá án, tranh chấp, giả tưởng',
    2,
    5,
    2,
    3,
    '~ 3 tiếng',
    149000,
    169000,
    'Nhịp sống sôi động của thành phố, năm người bạn - mỗi người với cuộc sống riêng biệt và mối tình của mình - tập hợp lại với nhau trong một buổi tiệc, không ai ngờ rằng, đêm đó sẽ trở thành khởi đầu của một chuỗi sự kiện kinh hoàng. Cái chết đột ngột và bí ẩn của bạn trai một thành viên trong nhóm chỉ là màn mở đầu, sự việc ngày càng thêm rắc rối khi những điểm bất thường của người bạn trai quá cố này bắt đầu xuất hiện ở bạn trai của các thành viên khác. Một mô hình kỳ lạ và đáng sợ dần hé lộ, khiến mọi người không khỏi hoài nghi và sợ hãi.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '/images/scripts/100_cach_chet_cua_nguoi_yeu_cu.jpg', TRUE);


-- 3. Cô Gái Bên Cửa Sổ
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'Cô Gái Bên Cửa Sổ',
    'co-gai-ben-cua-so',
    16,
    'Thuần phá án, kinh dị',
    3,
    6,
    3,
    3,
    '~ 3 tiếng',
    159000,
    179000,
    'Mười năm trước, một nữ sinh bị sát hại một cách tàn nhẫn, nhưng thủ phạm vẫn chưa bị bắt. Duy nhất một diễn đàn trực tuyến vẫn không ngừng theo dõi và cập nhật về vụ án này. Ngày kỷ niệm mười năm vụ án, những thông tin mới bất ngờ xuất hiện khiến diễn đàn lại một lần nữa sục sôi. Hãy cùng khám phá sự thật đằng sau bức màn bí mật, liệu bạn có thể tìm ra manh mối giải quyết vụ án? Mọi bí ẩn sẽ dần được hé lộ qua từng trang kịch bản mà bạn mở.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '/images/scripts/co_gai_ben_cua_so.jpg', TRUE);


-- 4. Cổ Thụ Ngân Nga
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    'Cổ Thụ Ngân Nga',
    'co-thu-ngan-nga',
    16,
    'Kinh dị, Phá án, Tình Cảm, Yêu nước',
    5,
    6,
    3,
    3,
    '~ 5 tiếng',
    269000,
    299000,
    'Giữa lòng Hà Nội, dưới tán đa ngàn năm tuổi nơi từng vang vọng tiếng trống lễ Tạ Phúc Cầu An, người dân tin rằng nơi ấy hội tụ linh khí đất trời, là chốn thần linh ngự trị. Rồi một dự án xây dựng được phê duyệt trên chính nền đất thiêng ấy. Kể từ đó, mỗi năm, vào đúng đêm lễ tế, lại có người chết trong những hoàn cảnh thảm khốc. Lời nguyền của "Cổ thụ" bắt đầu lan rộng, và khu đất ấy dần bị quên lãng... Nhiều năm sau, một ngôi trường mang tên THPT K.T. được xây dựng lại trên mảnh đất xưa. Sáu học sinh của trường – những người tưởng chừng chẳng hề liên quan, bất ngờ rơi vào trạng thái mất ý thức trong ngày diễn ra lễ Tạ Phúc Cầu An. Khi tỉnh lại, họ thấy mình mắc kẹt trong một phiên bản méo mó của chính ngôi trường ấy: Ánh sáng đỏ như máu, tiếng cười trẻ con văng vẳng, những bóng người thật giả lẫn lộn, và gốc đa cổ thụ như đang thở than. Để thoát ra, họ buộc phải đối diện với những ký ức bị chôn vùi, những linh hồn chưa siêu thoát và cả sự thật bị che giấu suốt hàng chục năm dưới lời nguyền đất thiêng. Lễ Tạ Phúc Cầu An sắp bắt đầu.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '/images/scripts/co_thu_ngan_nga.jpg', TRUE);


-- 5. Cuộc Gọi Đến
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    'Cuộc Gọi Đến',
    'cuoc-goi-den',
    14,
    'Cơ chế, giải trí, lừa đảo',
    2,
    6,
    3,
    3,
    '3,5 ~ 4 tiếng',
    199000,
    219000,
    'Khi thời đại thay đổi, con người có thể bị chôn vùi hoặc vươn lên từ những khó khăn để chào đón cuộc sống mới. Cuộc sống tạm bợ, an phận là điều thường thấy, nhưng nhiều người vẫn mơ ước bay cao mà không dám đánh thức giấc mơ để bước ra con đường rộng mở. Dù sự thuần khiết của ánh mặt trời che đậy những tham vọng xấu xa, bản chất con người vẫn dễ hiểu: thiện lương, nhưng lòng người lại khó đoán. Khi cuộc sống dồn ép, lằn ranh giữa đúng và sai trở nên mong manh. Một cuộc gọi có thể thay đổi cả số phận, đưa con người thoát khỏi nghèo đói, hoặc nhấn chìm họ vào vòng xoáy tội lỗi. "Cuộc Gọi Đến" — có đơn giản là trò chơi của những kẻ lạc lối giữa lương thiện và tham vọng. Bạn có dám tham gia?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', '/images/scripts/cuoc_goi_den.jpg', TRUE);


-- 6. Đền Thần Shimizu Hachiman
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000006',
    'Đền Thần Shimizu Hachiman',
    'den-than',
    16,
    'Bí ẩn, kinh dị siêu nhiên',
    4,
    6,
    3,
    3,
    '~ 4 tiếng',
    499000,
    529000,
    'Bước vào thế giới bí ẩn của Nhật Bản vào năm 794 công nguyên, trong bối cảnh di dời đô thành tới Heian Kyo, khởi đầu cho thời kỳ Heian đầy rối ren. Trong game "Đền Thần Shimizu Hachiman", bạn sẽ khám phá một làng nhỏ tách biệt, nơi cuộc sống bình yên bị phá vỡ bởi những oan hồn và ma quỷ. Onmyoji, những bậc thầy về giải quyết họa phúc, giữ vai trò là người cân bằng giữa thế giới người và linh hồn. Tại đền thờ Shimizu Hachiman, lễ cúng không chỉ là nghi lễ tôn giáo, mà còn là bức tường chắn cuối cùng chống lại thế lực tà ác. Khi một âm mưu đen tối bắt đầu nhắm vào một gia đình nông dân bình thường, cuộc sống của họ và toàn bộ làng bị đẩy vào vòng xoáy của sự kiện kinh hoàng. Hãy tham gia và khám phá, liệu bạn có thể phá giải bí ẩn và khôi phục lại bình yên không?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', '/images/scripts/den_than.jpg', TRUE);


-- 7. Điểm Danh
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000007',
    'Điểm Danh',
    'dien-danh',
    16,
    'Kinh dị tâm linh, học đường',
    4,
    8,
    4,
    4,
    '4,5 - 5 tiếng',
    249000,
    279000,
    'Tại Học viện Tư thục Inada tồn tại một Câu lạc bộ Nghiên cứu Hiện tượng Siêu nhiên, nơi những kẻ ưa khám phá bóng tối tụ họp để điều tra các hiện tượng bí ẩn, đồng thời đối mặt với những sự kiện rợn người mà khoa học đành bất lực. Trong căn phòng sinh hoạt vắng lặng của câu lạc bộ, bỗng dưng một luồng gió lạnh buốt nổi lên, dẫu cho tất cả cửa sổ và cửa ra vào đều đóng chặt. Bàn ghế bắt đầu tự động cọt kẹt xê dịch, cửa kính lạch cạch khép mở như có bàn tay vô hình nào đó đang thao túng. Giữa sự im lặng ngột ngạt, một tràng cười chói tai, the thé, vang vọng khắp không trung khiến sống lưng lạnh buốt. Lần theo âm thanh quái đản ấy, mọi ánh mắt đổ dồn về phía nóc tủ. Ở đó, một con búp bê Geisha đang ngồi chễm chệ. Nó khoác lên mình bộ kimono đỏ thẫm như thấm đẫm máu, từng đường nét tinh xảo. Đôi mắt đen sâu hoắm của nó lấp lánh như thể trong đó giam giữ linh hồn một con người đầy oán hận. Rồi, trong khoảng không nặng nề, nó khẽ cúi đầu, mở miệng thốt ra lời nguyền rợn gáy: "Tất cả các ngươi... đều phải chết."'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', '/images/scripts/dien_danh.jpg', TRUE);


-- 8. Điêu Dân
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000008',
    'Điêu Dân',
    'dieu-dan',
    16,
    'Phá án, tranh chấp, hài hước',
    3,
    6,
    3,
    3,
    '~ 3 tiếng',
    169000,
    189000,
    'Ngôi làng nhỏ nằm sâu trong hẻm núi bao năm vẫn luôn bình yên, người dân trong làng thật thà, chất phác. Bỗng một ngày, một đội khảo sát tới làng muốn di dời người dân để đầu tư khu du lịch. Cũng từ đây bao nhiêu chuyện kỳ lạ xảy ra trong làng đột nhiên có người qua đời rồi vội vàng chôn ngay trong ngày, khu núi mồ của làng đột ngột bốc cháy, cá trong ao của một hộ gia đình đột ngột chết sạch... Liệu bí ẩn gì đang xảy ra tại ngôi làng vốn dĩ đang yên bình này?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', '/images/scripts/dieu_dan.jpg', TRUE);


-- 9. Lên Đường
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000009',
    'Lên Đường',
    'len-duong',
    16,
    'Kinh dị tâm lý, bí ẩn',
    4,
    5,
    2,
    3,
    '3,5 ~ 4 tiếng',
    199000,
    219000,
    'Trong khung cảnh của một bầu trời xám xịt, một gia đình năm người ngồi trong chiếc SUV, đang lướt qua những con đường quen thuộc trên xa lộ. Tuy nhiên, không khí trong xe không mang hơi thở của chuyến đi chủ nhật bình thường. Thay vào đó, không gian bao trùm bởi sự căng thẳng, với ánh mắt lo lắng của người cha cầm lái và vẻ mặt bồn chồn của người mẹ bên cạnh. Phía sau, ba đứa trẻ thì thầm với nhau, sự phân vân và lo lắng lộ rõ trên từng gương mặt nhỏ bé. Chuyến đi lần này khác biệt, nặng nề với những bí mật chưa được tiết lộ. Câu hỏi được đặt ra không chỉ là họ đang đi đâu, mà quan trọng hơn, họ đang trốn chạy điều gì?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', '/images/scripts/len_duong.jpg', TRUE);


-- 10. Dư Hương
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'Dư Hương',
    'du-huong',
    16,
    'Phá án, tâm lý xã hội',
    5,
    5,
    3,
    2,
    '~ 5 tiếng',
    299000,
    329000,
    'Câu chuyện của năm anh chị em, mỗi người mang những hiểu lầm và quan điểm riêng biệt do những thăng trầm của cuộc sống. Tình cảm gia đình đã thay đổi, nứt vỡ dần qua thời gian. Cái chết của người bố đã làm dấy lên cơ hội hiếm hoi để họ tái ngộ. Những bí mật lâu nay giấu kín bắt đầu được phơi bày, và mọi người phải đối mặt với những hiểu lầm và mâu thuẫn đã tích tụ bao năm. Liệu cuộc họp gia đình này có thể hàn gắn những rạn nứt, hay nó chỉ khiến cho hiểu lầm càng trở lên trầm trọng? Và quan trọng hơn, cái chết của người cha thực sự chỉ là một tai nạn. Hay đằng sau đó là một âm mưu đen tối? Hãy cùng khám phá sự thật "Dư Hương".'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', '/images/scripts/du_huong.jpg', TRUE);


-- 11. Giày Thêu Hoa
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000011',
    'Giày Thêu Hoa',
    'giay-thieu-hoa',
    16,
    'Phá án, kinh dị tâm linh',
    3,
    6,
    3,
    3,
    '~ 3,5 tiếng',
    269000,
    299000,
    'Bắc Kinh, 1985, giữa thời đại đầy rẫy mê tín phong kiến và tư tưởng "trọng nam khinh nữ," ranh giới giữa lý trí và cuồng loạn trở nên mong manh. Ở vùng ngoại ô phía Đông Nam thành phố, một tứ hợp viện cũ kỹ lặng lẽ ẩn mình dưới lớp bụi thời gian. Một tấm giấy thông báo cho thuê, viết vội bằng nét chữ nguệch ngoạc, đã kéo theo những thanh niên tỉnh lẻ đổ về Bắc Kinh với giấc mộng đổi đời. Nhưng rồi, một vụ án mạng kinh hoàng xảy ra, cách thức giết người tàn bạo đến mức khiến ai nấy rùng mình. Đằng sau sự bình yên giả tạo của tứ hợp viện, một bí ẩn đen tối đang dần lộ diện, một thứ tội ác khoác lên mình bộ mặt từ bi nhưng mang trái tim rắn độc. Đêm đó, kim đồng hồ vừa điểm chín giờ. "Thình! Thình! Thình!" Tiếng gõ cửa dồn dập xé toạc màn đêm tĩnh mịch... Liệu các bạn có đủ can đảm bước vào căn tứ hợp viện này không?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000011', '/images/scripts/giay_thieu_hoa.jpg', TRUE);


-- 12. Gương
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000012',
    'Gương',
    'guong',
    16,
    'Thuần phá án',
    3,
    4,
    2,
    2,
    '~ 3 tiếng',
    179000,
    199000,
    'Khi bạn nhìn chăm chú vào gương. Người trong gương cũng đang nhìn chăm chú vào bạn. Tháng 7/2013, Biệt thự Sương Mai rực rỡ ánh đèn, chào đón những vị khách danh giá đến buổi dạ tiệc hóa trang xa hoa của Vương Sở Phàm. Một bữa tiệc, một lời tuyên bố, và một bí ẩn bao trùm cả tòa biệt thự. Nhưng khi những ly rượu nâng lên, bạn chợt nhận ra - những tấm gương quanh mình dường như có gì đó sai lệch. Hình ảnh phản chiếu không chỉ là bóng dáng của bạn... mà còn là một ánh mắt khác, lạnh lẽo và thầm lặng. Đêm nay, liệu bạn có dám nhìn thẳng vào gương?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000012', '/images/scripts/guong.jpg', TRUE);


-- 13. Hậu Cung
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000013',
    'Hậu Cung',
    'hau-cung',
    16,
    'Cơ chế, phá án, cổ trang',
    2,
    6,
    2,
    4,
    '~ 3,5 tiếng',
    229000,
    249000,
    'Chào mừng bạn đến với triều đại huy hoàng nhưng đầy rối ren, nơi có một vị hoàng đế không thể nắm bắt được những sóng gió đang ập đến. Trong lòng của Hậu Cung lộng lẫy, bốn nàng phi tần không chỉ sở hữu vẻ đẹp kiêu sa mà còn ẩn chứa tài trí và tham vọng sâu sắc. Mỗi bước đi của họ đều được tính toán kỹ lưỡng, mỗi nụ cười là một mưu đồ, mỗi ánh mắt là một âm mưu toan tính. Trong bức tranh Hoàng Gia này, hàng loạt các vụ án bí ẩn liên tiếp xảy ra, mỗi cái chết đều vẽ lên một dấu hỏi lớn không lời giải. Từ những cái chết bất thường của các phi tần, đến những mất tích không dấu vết của cung nữ, mỗi sự kiện đều khiến hậu cung thêm phần u ám.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000013', '/images/scripts/hau_cung.jpg', TRUE);


-- 14. Hoàng Đại Tiên
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000014',
    'Hoàng Đại Tiên',
    'hoang-dai-tien',
    16,
    'Phá án, kinh dị tâm linh',
    4,
    7,
    4,
    3,
    '3,5 ~ 4 tiếng',
    219000,
    249000,
    'Gặp gỡ nhóm "Hoàng Đại Tiên" - 7 sinh viên đam mê Livestream các hiện tượng siêu nhiên. Trong một buổi tối không trăng, họ quyết tâm tổ chức một buổi livestream gọi hồn tại khu nhà hoang ở Văn Thành, nổi tiếng với những câu chuyện rùng rợn, với camera ghi hình từng góc tối, buổi gọi hồn bắt đầu nhưng không lâu sau, những sự kiện kỳ bí và đáng sợ bắt đầu xảy ra. Tiếng động lạ, bóng người hiện hữu nơi góc khuất, và những hiện tượng không thể giải thích được, đe dọa sự an toàn của họ. Trong khi cố gắng khám phá sự thật đằng sau những bí ẩn của khu nhà hoang, liệu họ có phát hiện ra điều gì vượt quá khả năng chịu đựng của con người không? Tham gia "Hoàng Đại Tiên" để khám phá liệu những thế lực siêu nhiên có thật sự tồn tại, hay chỉ là những trò chơi tâm lý của bóng tối.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000014', '/images/scripts/hoang_dai_tien.jpg', TRUE);


-- 15. 1 Giờ 30 (file gốc: horror_story.jpg — tên chính thức trong khung info là "1 Giờ 30",
--     "HORROR STORY 01:30" là tên chuỗi sổ tay hướng dẫn)
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000015',
    '1 Giờ 30',
    'horror-story',
    16,
    'Phá án, kinh dị tâm linh',
    4,
    6,
    3,
    3,
    '3,5 ~ 4 tiếng',
    189000,
    209000,
    'Chào mừng bạn đến với "1 Giờ 30", buổi tụ họp bí ẩn của hội kể truyện quái dị đô thị. Vào đêm không trăng mỗi tháng một lần, những người từ mọi nẻo đường, dù tin vào thần thánh hay không, đều tập hợp và chia sẻ những câu chuyện kỳ bí nhất mà họ đã gặp phải, nhằm xua tan cô đơn và sợ hãi. Nhưng một khi đã ngồi vào vòng tròn của hội, không ai được phép rời đi cho tới khi buổi tụ họp chấm dứt. Dù xảy ra chuyện gì, hãy chuẩn bị sẵn sàng để đối mặt với bóng tối, và khám phá ra liệu bạn có đủ dũng cảm để tồn tại qua đêm không?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000015', '/images/scripts/horror_story.jpg', TRUE);


-- 16. Kiếm Tiền
-- LƯU Ý: poster ghi số lượng dạng khoảng "7 - 10 người" (không phải số cố định).
-- Vì cột player_count chỉ nhận 1 giá trị INT, ở đây lưu giá trị TỐI ĐA (10).
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000016',
    'Kiếm Tiền',
    'kiem-tien',
    14,
    'Cơ chế, giải trí, phá án',
    2,
    10,
    5,
    5,
    '4,5 ~ 5 tiếng',
    199000,
    219000,
    '[Số lượng người chơi thực tế: 7 - 10 người] Hãy bước vào thế giới của tập đoàn Kim. Tập đoàn bí ẩn và giàu có bậc nhất khu vực. Mỗi năm một lần, họ mở cửa tổ chức một buổi tiệc hoành tráng, nơi qui tụ các nhà đầu tư trẻ và những nhà kinh doanh đầy tham vọng. Buổi tiệc không chỉ là dịp để mọi người thể hiện khả năng và tìm kiếm cơ hội đầu tư, mà còn là cửa ngõ để có thể gia nhập hàng ngũ của tập đoàn Kim danh giá. Trong buổi tiệc hôm nay, các nhà đầu tư phải sử dụng mọi kỹ năng và mưu trí của mình để chứng minh giá trị và giành lấy cơ hội vàng này. Liệu họ có thể vượt qua các thử thách, áp lực và sự cạnh tranh khốc liệt để tỏa sáng? Tham gia "Kiếm Tiền", một trò chơi của sự khéo léo, chiến lược và lòng dũng cảm, nơi chỉ những người xứng đáng mới có thể chiến thắng.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000016', '/images/scripts/kiem_tien.jpg', TRUE);


-- 17. Thiên Hạ Đệ Nhất Tửu
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000017',
    'Thiên Hạ Đệ Nhất Tửu',
    'thien-ha-de-nhat-tuu',
    16,
    'Cơ chế, phá án, giải trí',
    2,
    7,
    4,
    3,
    '~ 4 tiếng',
    249000,
    279000,
    '[Game có đi kèm đồ uống theo nội dung kịch bản.] 7 người chơi sẽ hóa thân thành những tay uống rượu kiệt xuất. Từng người sẽ mang trong mình những bí mật và mục tiêu riêng. Họ sẽ phải đối mặt với những âm mưu sâu xa, vạch trần hung thủ và giải mã những bí mật của trung tâm. Liệu bạn có đủ tỉnh táo để thoát khỏi vòng xoáy của men rượu và sự dối trá. "Thiên Hạ Đệ Nhất Tửu" - Một kịch bản vui vẻ, giải trí nhưng không kém phần kịch tính. Với những bất ngờ, hài hước trong cách chơi. Hãy chuẩn bị tinh thần bước vào một thế giới - nơi men say và bí ẩn giao thoa.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000017', '/images/scripts/thien_ha_de_nhat_tuu.jpg', TRUE);


-- 18. Ly Hôn Đi! Nhanh Lên!
-- LƯU Ý: poster ghi số lượng dạng khoảng "6 - 8 người". Lưu giá trị TỐI ĐA (8).
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000018',
    'Ly Hôn Đi! Nhanh Lên!',
    'ly-hon-di',
    14,
    'Phá án, cơ chế, hài hước',
    2,
    8,
    4,
    4,
    '~ 4,5 tiếng',
    219000,
    249000,
    '[Số lượng người chơi thực tế: 6 - 8 người] Kết hôn, sinh con – ai rồi cũng phải trải qua. Thế nhưng, sau tiếng pháo cưới rộn ràng, những lời chúc tụng ngọt ngào, đập vào mặt là hàng tá chuyện phải lo: cơm áo gạo tiền, con cái học hành, mẹ chồng nàng dâu, ai cũng có nỗi khổ riêng.... Hôm nay, ở khu dân cư nọ có hai hộ gia đình kèn trống rộn ràng dán chữ Hỉ rực rỡ. Môn đăng hộ đối, trai tài gái sắc, cả làng hân hoan gọi đây là "mối duyên trời ban"! Cha mẹ đôi bên, bà con họ hàng tề tựu đông đủ, chứng kiến giây phút trọng đại của người thân yêu. Ai mà có ngờ, ngày vui ấy lại chính là khởi đầu cho những "cơn bão ngầm" đang dần kéo tới...'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000018', '/images/scripts/ly_hon_di.jpg', TRUE);


-- 19. Lý Luận Hư Cấu
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000019',
    'Lý Luận Hư Cấu',
    'ly-luan-hu-cau',
    16,
    'Thuần phá án',
    5,
    6,
    3,
    3,
    '5 ~ 5,5 tiếng',
    259000,
    289000,
    '"Lý Luận Hư Cấu" mở ra một thế giới nơi thật giả đan xen, biến mọi sự phán đoán thành con dao hai lưỡi. Thư Mời Tham Gia Câu Lạc Bộ Manchester được gửi đi, cùng lời chào mừng đầy vẻ lịch thiệp, nhưng ẩn giấu sau đó là trò chơi Trốn Tìm quái gở. Người tham gia đeo mặt nạ, bước lên sân khấu kể hai câu chuyện: một là ký ức thật chưa từng tiết lộ, một là lời bịa đặt khéo léo giăng bẫy người nghe. Không bàn luận, không gọi tên, chỉ có những lá phiếu lặng lẽ phơi bày ai lộ sơ hở. Kẻ bại trận sẽ ôm lấy trách nhiệm chuộc lỗi, bằng tiền bạc và một bữa tiệc kỳ quái, nơi sự hoài nghi chưa từng khép lại.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000019', '/images/scripts/ly_luan_hu_cau.jpg', TRUE);


-- 20. Niên Luân
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000020',
    'Niên Luân',
    'nien-luan',
    16,
    'Suy luận, phá án, siêu nhiên',
    5,
    5,
    3,
    2,
    '3,5 ~ 4 tiếng',
    229000,
    259000,
    'Dưới đáy giếng cũ kỹ, năm con người đứng lặng, ánh mắt hướng lên bầu trời u ám. Họ không quen biết nhau, nhưng có một điểm chung—mỗi người đều mất đi một người thân trong những cái chết bí ẩn. Một bức thư không tên, một lời kêu gọi từ kẻ bí ẩn đã dẫn họ đến đây—ngôi làng bị lãng quên, nơi mười năm trước từng chìm trong biển lửa. Ai là kẻ đã triệu tập họ? Là sự tình cờ, hay có một bí mật kinh hoàng đang chờ được phơi bày? Những cái chết trong quá khứ thực sự là tai nạn, hay chỉ là màn mở đầu cho một kế hoạch chưa hoàn tất?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000020', '/images/scripts/nien_luan.jpg', TRUE);


-- 21. Sinh Tử
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000021',
    'Sinh Tử',
    'sinh-tu',
    16,
    'Thuần phá án',
    3,
    5,
    3,
    2,
    '~ 3 tiếng',
    189000,
    209000,
    'Ngày 28 tháng 07 năm 2008, thành phố Hạ Long chìm trong cơn mưa u ám, một vụ án rùng rợn xảy ra tại phòng 401 khách sạn Minh Vũ, thi thể không đầu, với chiếc đầu heo thay thế, nằm giữa mùi máu tanh và dòng chữ oán hận viết bằng máu trên tường, bí ẩn phủ kín, nạn nhân được gọi là "Súc Sinh", mang theo một quá khứ đen tối, cái chết này là sự trừng phạt, hay chỉ là sự khởi đầu cho tội ác mới? Khi màn đêm buông xuống, bí mật đen tối dần hé lộ, không một tội ác nào thoát khỏi số phận.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000021', '/images/scripts/sinh_tu.jpg', TRUE);


-- 22. Tần Số Cuối
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000022',
    'Tần Số Cuối',
    'tan-so-cuoi',
    16,
    'Phá án, kinh dị tâm linh',
    4,
    7,
    4,
    3,
    '3,5 ~ 4 tiếng',
    269000,
    299000,
    'Bảy sinh viên đam mê Livestream các hiện tượng siêu nhiên. Trong một buổi tối không trăng, họ quyết tâm tổ chức một buổi livestream gọi hồn ở khu nhà hoang Văn Thành, nổi tiếng với những câu chuyện rùng rợn, với camera ghi hình từng góc tối, buổi gọi hồn bắt đầu nhưng không lâu sau, những sự kiện kỳ bí và đáng sợ bắt đầu xảy ra. Tiếng động lạ, bóng người hiện hữu nơi góc khuất, và những hiện tượng không thể giải thích được, đe dọa sự an toàn của họ. Trong khi cố gắng khám phá sự thật đằng sau những bí ẩn của khu nhà hoang, liệu họ có phát hiện ra điều gì vượt quá khả năng chịu đựng của con người không? Tham gia "Tần Số Cuối" để khám phá liệu những thế lực siêu nhiên có thật sự tồn tại, hay chỉ là những trò chơi tâm lý của bóng tối.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000022', '/images/scripts/tan_so_cuoi.jpg', TRUE);


-- 23. Thanh Lâu
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000023',
    'Thanh Lâu',
    'thanh-lau',
    16,
    'Cơ chế, phá án, cổ trang',
    3,
    7,
    3,
    4,
    '~ 6 tiếng',
    299000,
    329000,
    'Bước vào Ngọc Mãn Lâu, Thanh Lâu danh tiếng nhất Trường An, nơi quy tụ bốn ca kỹ tài sắc vẹn toàn và bốn chàng công tử giàu có. Dưới vẻ ngoài lộng lẫy của nghệ thuật và tình yêu, ẩn chứa một mạng lưới ân oán từ đời trước, kéo những người trẻ vào cuộc đua tranh đầy kịch tính, khám phá bí mật đăng sau những nụ cười rạng rỡ và tiếng đàn mê hoặc, liệu bạn có thể vén lên màn sương của sự dối trá và tham vọng?'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000023', '/images/scripts/thanh_lau.jpg', TRUE);


-- 24. Thanh Thanh Mạn
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000024',
    'Thanh Thanh Mạn',
    'thanh-thanh-man',
    16,
    'Cổ trang, tình cảm',
    3,
    6,
    3,
    3,
    '~ 4 tiếng',
    269000,
    299000,
    'Một sợi tơ hồng vương ba kiếp, tam sinh thạch khắc chữ kết duyên, hết thảy huyền cơ nay giao cho các ngươi tự giải. Tiếng bước ngân vang, dĩ vãng tiền trần dần hóa hư không. Chén canh Mạnh Bà đã uống cạn, đổi lấy một đời lệ rơi khắc tận tâm can. Ái tình vương thù hận, một kiếp nổi trôi rồi tan biến, muốn quên mà chẳng thể giữ lòng thanh tịnh. "Thanh Thanh Mạn" – tựa game cổ trang đượm hồn thi ca, sẽ đưa bạn vào một khung cảnh ngập tràn giai điệu u hoài của quá khứ. Không chỉ là một trò chơi, Thanh Thanh Mạn còn là một giấc mộng cổ phong – nơi bạn sống lại yêu hận tình thù, và tự mình viết nên hồi kết cho câu chuyện ngàn năm chưa dứt.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000024', '/images/scripts/thanh_thanh_man.jpg', TRUE);


-- 25. Yandere 2 - Tình Yêu
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000025',
    'Yandere 2 - Tình Yêu',
    'yandere2',
    16,
    'Phá án, kinh dị tâm lý',
    4,
    6,
    3,
    3,
    '~ 4 tiếng',
    189000,
    209000,
    'Khép lại Nhật Ký (1) Yandere - Tâm Thần Phân Liệt là sự việc Cậu bé tâm thần phân liệt đáng thương tự sát. Vậy, nếu cậu ấy năm đó tự sát không thành công, tôi nói là nếu cậu ấy đã được cứu sống kịp thời... Thì mọi người biết câu chuyện tiếp theo sẽ như thế nào không? Cùng khám phá ngay câu chuyện được viết tiếp như thế nào với phần 2: NHẬT KÝ YANDERE - TÌNH YÊU.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000025', '/images/scripts/yandere2.jpg', TRUE);


-- 26. Thông Báo Tìm Người
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000026',
    'Thông Báo Tìm Người',
    'thong-bao-tim-nguoi',
    16,
    'Phá án, logic, tâm linh',
    4,
    5,
    3,
    2,
    '~ 4 tiếng',
    219000,
    249000,
    'Ngày 13/8/2019, Bắc Giang chấn động khi cảnh sát phát hiện một khuôn đúc thép khổng lồ bị lấp đầy thép nguội, kèm đoạn video mờ ám cho thấy có người từng bị ném sống vào dòng thép nóng chảy. Thi thể đã tan biến hoàn toàn, ADN không thể trích xuất, buộc cảnh sát lập đội điều tra đặc biệt để truy tìm danh tính nạn nhân giữa hàng loạt vụ mất tích bí ẩn. Đêm 14/8, năm người dân lần lượt xuất hiện tại đồn công an trong trạng thái hoảng loạn tột độ, hé lộ những tình tiết khiến cả đội điều tra phải đối mặt với một âm mưu đen tối và cái ác chưa từng có tiền lệ.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000026', '/images/scripts/thong_bao_tim_nguoi.jpg', TRUE);


-- 27. Thược Dược Đen
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000027',
    'Thược Dược Đen',
    'thuoc-duoc-den',
    16,
    'Phá án, kinh dị, siêu nhiên',
    4,
    5,
    3,
    2,
    '3,5 ~ 4 tiếng',
    199000,
    219000,
    'Tại khách sạn Cecil, nơi mà những bí ẩn chưa được giải đáp và câu chuyện ma quái tụ họp, năm cá nhân không liên quan tới nhau đã bị cuốn vào một vụ điều tra siêu nhiên bí ẩn, mỗi người mang theo một mục đích riêng, họ tập hợp dưới một mái nhà với hy vọng khám phá ra những sự thật đen tối ẩn sau những bức tường của khách sạn này. Khi họ bắt đầu đi sâu vào những hiện tượng kỳ lạ và những câu chuyện rùng rợn, mọi liên kết dần được hé lộ, và những bóng ma của quá khứ bắt đầu thách thức hiện tại của họ, liệu họ có thể làm việc cùng nhau để giải mã bí ẩn, hay những bí mật mà họ khám phá sẽ tạo ra những hậu quả đáng sợ hơn họ tưởng tượng? Tham gia "Thược Dược Đen", Một hành trình khám phá nơi ranh giới giữa sự thật và ám ảnh trở nên mờ ảo.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000027', '/images/scripts/thuoc_duoc_den.jpg', TRUE);


-- 28. Tội Diễn Sư
-- LƯU Ý: poster ghi số lượng dạng khoảng "6 - 7 người". Lưu giá trị TỐI ĐA (7).
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000028',
    'Tội Diễn Sư',
    'toi-dien-su',
    16,
    'Thuần phá án, hài hước',
    3,
    7,
    4,
    3,
    '3,5 ~ 4 tiếng',
    199000,
    219000,
    '[Số lượng người chơi thực tế: 6 - 7 người] Năm 2026, Máy Truy Vết Tội Phạm CX-5A ra đời – một bước ngoặt trong điều tra hình sự. Chỉ cần quét qua thi thể, nó có thể nhanh chóng xác định vị trí nghi phạm. Nhưng công lý không thể chỉ dựa vào những phán đoán máy móc. CX-5A không có trực giác, không cảm xúc, không thấy được sự dối trá và càng không thể đưa ra bằng chứng buộc tội. Vì thế, Tội Diễn Sư đã ra đời. HỌ KHÔNG NHƯ CẢNH SÁT. HỌ KHÔNG SUY LUẬN NHƯ THÁM TỬ. Họ diễn lại tội ác - Họ chính là nghệ thuật trong trinh thám. Tội Diễn Sư nhập vai – tái hiện tâm lý và hành vi của nghi phạm lẫn nạn nhân tại thời điểm gây án. Họ biến giả thuyết thành bằng chứng sống. Họ là người cuối cùng đưa sự thật ra ánh sáng.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000028', '/images/scripts/toi_dien_su.jpg', TRUE);


-- 29. Tuyết Hương Liên Hoàn Án
-- LƯU Ý: poster KHÔNG ghi số người cụ thể, chỉ ghi "Bắt buộc ghép team".
-- Fake player_count = 6 (thay vì placeholder 0 không hợp lệ cho demo).
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000029',
    'Tuyết Hương Liên Hoàn Án',
    'tuyet-huong-lien-hoan-an',
    16,
    'Phá án, tâm lý, kinh dị',
    3,
    6,
    3,
    3,
    '~ 4 tiếng',
    269000,
    299000,
    '[LƯU Ý: Số lượng người chơi là "Bắt buộc ghép team", poster chưa ghi số liệu cụ thể — player_count ở đây là giá trị demo] Câu chuyện này được cải biên dựa trên vụ án có thật "Vụ án 218" tại khu vực Đông Bắc Trung Quốc vào những năm 90. Tác giả đã quay lại hiện trường vụ án để thu thập tài liệu và biến nó thành một trò chơi Kịch Bản Sát với hai màn, dẫn dắt bạn đến với hiện trường vụ án thực sự. Chúc bạn có một hành trình đón giao thừa đầy khác biệt. Và bây giờ, trò chơi chính thức bắt đầu....'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000029', '00000000-0000-0000-0000-000000000029', '/images/scripts/tuyet_huong_lien_hoan_an.jpg', TRUE);


-- 30. Vụ Nha Quán
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000030',
    'Vụ Nha Quán',
    'vu-nha-quan',
    16,
    'Thuần phá án',
    5,
    6,
    3,
    3,
    '~ 4,5 tiếng',
    249000,
    279000,
    '"Tách, tách..." Tiếng búng tay vang lên, kéo bạn ra khỏi cơn mộng mị. Trên bàn là một xấp tài liệu về vụ án giết người kỳ quái nhất gần đây. Thị trưởng Ngô Miên bị sát hại trong phòng làm việc tại căn biệt thự Vụ Nha Quán. Cửa khóa kín. Cửa sổ bị bịt chặt. Nạn nhân bị quấn kín trong lớp băng dính lạnh lẽo, như một lời thách thức đầy ngạo nghễ của hung thủ. Mọi dấu vết đều chỉ về một cái tên đã vắng bóng nhiều năm - Bạch Nha. Là huyền thoại, là kẻ trừng phạt, hay chỉ là một bóng ma trở về từ quá khứ? Đây mới chỉ là sự khởi đầu mà thôi…'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000030', '/images/scripts/vu_nha_quan.jpg', TRUE);


-- 31. Xin Chào
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000031',
    'Xin Chào',
    'xin-chao',
    16,
    'Tình cảm, phá án',
    2,
    6,
    3,
    3,
    '3,5 ~ 4 tiếng',
    199000,
    219000,
    '"Xin Chào" là một tác phẩm kịch bản tình cảm sâu sắc, khám phá những cung bậc của tình yêu và cuộc sống, cũng như những thăng trầm không thể tránh khỏi mà mỗi người chúng ta đều trải qua. Trong cuộc đời, chúng ta đối mặt với những khoảnh khắc chia ly, mỗi người một quan niệm: Có người cho rằng chia ly là không bao giờ gặp lại, nhưng cũng có người tin rằng chỉ khi nào chúng ta quên lãng, chia ly mới thực sự xảy ra. Kịch bản này mời gọi bạn dừng chân, lắng nghe và cảm nhận sự yên bình quý giá của cuộc sống. Trong mỗi tương tác, mỗi câu chuyện, "Xin Chào" không chỉ là một lời từ biệt, một sự khởi đầu mới trong sự hiểu biết và chia sẻ, khám phá những khoảnh khắc tình yêu, sự đồng cảm và sự tha thứ trong thế giới phức tạp này, và để mỗi "Xin Chào" dẫn lối đến một trải nghiệm sâu sắc hơn về cuộc sống và mối quan hệ.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000031', '/images/scripts/xin_chao.jpg', TRUE);


-- 32. Yandere 1 - Tâm Thần Phân Liệt
INSERT INTO scripts (id, title, slug, min_age, genre, difficulty_star, player_count, male_count, female_count, duration_text, base_price, npc_price, description)
VALUES (
    '00000000-0000-0000-0000-000000000032',
    'Yandere 1 - Tâm Thần Phân Liệt',
    'yandere1',
    16,
    'Phá án, kinh dị tâm lý',
    4,
    7,
    4,
    3,
    '~ 4 tiếng',
    189000,
    209000,
    'Một cậu bé mang trong mình 7 nhân cách khác biệt đang phải đối mặt với bi kịch khủng khiếp của gia đình. Bố mẹ và em trai của cậu đã chết một cách bí ẩn, để lại đằng sau những dấu vết mơ hồ và những bí mật đen tối. Chỉ có 7 cuốn nhật ký của cậu bé mới vén màn sự thật kinh hoàng ẩn giấu phía sau. Liệu các thám tử tài ba có đủ khả năng giải mã từng mảnh ghép ký ức hỗn loạn của cậu bé để tìm ra kẻ thủ ác? Hãy bước vào thế giới đầy rẫy sự lừa dối và hoang tưởng, nơi mỗi bước đi đều có thể dẫn đến một sự thật rợn người mà bạn chưa từng tưởng tượng.'
);

INSERT INTO script_images (id, script_id, image_url, is_cover)
VALUES ('10000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000032', '/images/scripts/yandere1.jpg', TRUE);
