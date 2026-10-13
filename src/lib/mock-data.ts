import type { Category, Review, Script, StoreBranch } from "./types";

export const MOCK_MODE =
  process.env.NEXT_PUBLIC_MOCK_DATA === "true" || Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const categoryNames = [
  "Phá án",
  "Kinh dị",
  "Tâm linh",
  "Siêu nhiên",
  "Tâm lý",
  "Tình cảm",
  "Cổ trang",
  "Hài hước",
  "Cơ chế",
  "Giải trí",
  "Học đường",
  "Suy luận",
  "Bí ẩn",
  "Tranh chấp",
  "Yêu nước",
  "Giả tưởng",
  "Lừa đảo",
];

const categories = new Map<string, Category>(
  categoryNames.map((name, index) => [
    name,
    { id: `mock-category-${index + 1}`, name },
  ])
);

const categoryAliases: Record<string, string> = {
  logic: "Suy luận",
  "kinh dị tâm linh": "Tâm linh",
  "kinh dị tâm lý": "Tâm lý",
  "kinh dị siêu nhiên": "Siêu nhiên",
};

type MockScript = [
  string,
  string,
  string,
  number,
  string,
  number,
  number,
  string,
  number,
  string,
];

function createScript(
  index: number,
  [title, slug, image, minAge, genre, difficultyStar, playerCount, durationText, basePrice, description]: MockScript
): Script {
  const genreCategories = genre.split(", ").map((name) => {
    const normalized = categoryAliases[name.toLowerCase()] ?? name;
    return categories.get(normalized) ?? { id: `mock-${normalized}`, name: normalized };
  });

  return {
    id: `mock-script-${String(index).padStart(2, "0")}`,
    title,
    slug,
    minAge,
    genre,
    difficultyStar,
    playerCount,
    maleCount: Math.ceil(playerCount / 2),
    femaleCount: Math.floor(playerCount / 2),
    durationText,
    basePrice,
    npcPrice: basePrice + 30000,
    description,
    categories: genreCategories,
    coverImageUrl: `${PUBLIC_BASE_PATH}/images/scripts/${image}.jpg`,
  };
}

const scriptRows: MockScript[] = [
  ["2/12", "2-12", "2_12", 16, "Phá án, Kinh dị, Tâm linh", 4, 7, "~ 4 tiếng", 199000, "Một ngôi trường yên bình bỗng trở thành hiện trường của những sự kiện kinh hoàng."],
  ["100 Cách Chết Của Người Yêu Cũ", "100-cach-chet-cua-nguoi-yeu-cu", "100_cach_chet_cua_nguoi_yeu_cu", 16, "Phá án, Tranh chấp, Giả tưởng", 2, 5, "~ 3 tiếng", 149000, "Một bữa tiệc mở đầu cho chuỗi sự kiện bí ẩn liên quan đến những người yêu cũ."],
  ["Cô Gái Bên Cửa Sổ", "co-gai-ben-cua-so", "co_gai_ben_cua_so", 16, "Phá án, Kinh dị", 3, 6, "~ 3 tiếng", 159000, "Mười năm sau một vụ án, những thông tin mới bất ngờ khiến sự thật dần lộ diện."],
  ["Cổ Thụ Ngân Nga", "co-thu-ngan-nga", "co_thu_ngan_nga", 16, "Kinh dị, Phá án, Tình cảm, Yêu nước", 5, 6, "~ 5 tiếng", 269000, "Một lời nguyền cổ xưa thức tỉnh dưới gốc đa giữa lòng Hà Nội."],
  ["Cuộc Gọi Đến", "cuoc-goi-den", "cuoc_goi_den", 14, "Cơ chế, Giải trí, Lừa đảo", 2, 6, "3,5 ~ 4 tiếng", 199000, "Một cuộc gọi có thể thay đổi số phận và đẩy con người vào ranh giới đúng sai."],
  ["Đền Thần Shimizu Hachiman", "den-than", "den_than", 16, "Bí ẩn, Kinh dị, Siêu nhiên", 4, 6, "~ 4 tiếng", 499000, "Bước vào ngôi đền Nhật Bản và đối mặt với những oan hồn bị đánh thức."],
  ["Điểm Danh", "dien-danh", "dien_danh", 16, "Kinh dị, Tâm linh, Học đường", 4, 8, "4,5 - 5 tiếng", 249000, "Một câu lạc bộ nghiên cứu hiện tượng siêu nhiên phải đối mặt với lời nguyền đáng sợ."],
  ["Điêu Dân", "dieu-dan", "dieu_dan", 16, "Phá án, Tranh chấp, Hài hước", 3, 6, "~ 3 tiếng", 169000, "Những chuyện kỳ lạ liên tiếp xảy ra trong một ngôi làng tưởng như bình yên."],
  ["Lên Đường", "len-duong", "len_duong", 16, "Kinh dị, Tâm lý, Bí ẩn", 4, 5, "3,5 ~ 4 tiếng", 199000, "Một chuyến đi gia đình che giấu những bí mật không ai muốn nhắc tới."],
  ["Dư Hương", "du-huong", "du_huong", 16, "Phá án, Tâm lý", 5, 5, "~ 5 tiếng", 299000, "Cái chết của người cha đưa năm anh chị em trở lại đối diện với quá khứ."],
  ["Giày Thêu Hoa", "giay-thieu-hoa", "giay_thieu_hoa", 16, "Phá án, Kinh dị, Tâm linh", 3, 6, "~ 3,5 tiếng", 269000, "Một tứ hợp viện cũ kỹ che giấu vụ án mạng và bí mật đen tối."],
  ["Gương", "guong", "guong", 16, "Phá án", 3, 4, "~ 3 tiếng", 179000, "Những tấm gương trong biệt thự dường như đang phản chiếu một người khác."],
  ["Hậu Cung", "hau-cung", "hau_cung", 16, "Cơ chế, Phá án, Cổ trang", 2, 6, "~ 3,5 tiếng", 229000, "Âm mưu và những vụ án bí ẩn liên tiếp xảy ra trong chốn hậu cung."],
  ["Hoàng Đại Tiên", "hoang-dai-tien", "hoang_dai_tien", 16, "Phá án, Kinh dị, Tâm linh", 4, 7, "3,5 ~ 4 tiếng", 219000, "Một buổi livestream gọi hồn biến thành cuộc chiến sinh tồn trong nhà hoang."],
  ["1 Giờ 30", "horror-story", "horror_story", 16, "Phá án, Kinh dị, Tâm linh", 4, 6, "3,5 ~ 4 tiếng", 189000, "Hội kể chuyện quái dị đô thị phải tồn tại qua một đêm không được rời đi."],
  ["Kiếm Tiền", "kiem-tien", "kiem_tien", 14, "Cơ chế, Giải trí, Phá án", 2, 10, "4,5 ~ 5 tiếng", 199000, "Một buổi tiệc của tập đoàn Kim trở thành cuộc đấu trí để giành cơ hội vàng."],
  ["Thiên Hạ Đệ Nhất Tửu", "thien-ha-de-nhat-tuu", "thien_ha_de_nhat_tuu", 16, "Cơ chế, Phá án, Giải trí", 2, 7, "~ 4 tiếng", 249000, "Những tay uống rượu kiệt xuất phải vạch trần hung thủ giữa các âm mưu."],
  ["Ly Hôn Đi! Nhanh Lên!", "ly-hon-di", "ly_hon_di", 14, "Phá án, Cơ chế, Hài hước", 2, 8, "~ 4,5 tiếng", 219000, "Ngày vui của hai gia đình lại là khởi đầu cho những cơn bão ngầm."],
  ["Lý Luận Hư Cấu", "ly-luan-hu-cau", "ly_luan_hu_cau", 16, "Phá án", 5, 6, "5 ~ 5,5 tiếng", 259000, "Một trò chơi trốn tìm nơi thật giả đan xen và mọi lời kể đều đáng ngờ."],
  ["Niên Luân", "nien-luan", "nien_luan", 16, "Suy luận, Phá án, Siêu nhiên", 5, 5, "3,5 ~ 4 tiếng", 229000, "Năm người xa lạ được triệu tập đến một ngôi làng bị lãng quên."],
  ["Sinh Tử", "sinh-tu", "sinh_tu", 16, "Phá án", 3, 5, "~ 3 tiếng", 189000, "Một vụ án rùng rợn trong khách sạn mở ra quá khứ đen tối của nạn nhân."],
  ["Tần Số Cuối", "tan-so-cuoi", "tan_so_cuoi", 16, "Phá án, Kinh dị, Tâm linh", 4, 7, "3,5 ~ 4 tiếng", 269000, "Livestream gọi hồn trong nhà hoang kéo theo những hiện tượng không thể giải thích."],
  ["Thanh Lâu", "thanh-lau", "thanh_lau", 16, "Cơ chế, Phá án, Cổ trang", 3, 7, "~ 6 tiếng", 299000, "Bí mật và ân oán kéo những người trẻ vào cuộc đua trong Ngọc Mãn Lâu."],
  ["Thanh Thanh Mạn", "thanh-thanh-man", "thanh_thanh_man", 16, "Cổ trang, Tình cảm", 3, 6, "~ 4 tiếng", 269000, "Một giấc mộng cổ phong về tình yêu, thù hận và hồi kết tự mình viết nên."],
  ["Yandere 2 - Tình Yêu", "yandere2", "yandere2", 16, "Phá án, Kinh dị, Tâm lý", 4, 6, "~ 4 tiếng", 189000, "Câu chuyện tiếp nối của một tâm hồn tổn thương và những bí mật bị chôn giấu."],
  ["Thông Báo Tìm Người", "thong-bao-tim-nguoi", "thong_bao_tim_nguoi", 16, "Phá án, Suy luận, Tâm linh", 4, 5, "~ 4 tiếng", 219000, "Một đội điều tra đặc biệt truy tìm danh tính nạn nhân giữa hàng loạt vụ mất tích."],
  ["Thược Dược Đen", "thuoc-duoc-den", "thuoc_duoc_den", 16, "Phá án, Kinh dị, Siêu nhiên", 4, 5, "3,5 ~ 4 tiếng", 199000, "Năm con người bị cuốn vào một cuộc điều tra siêu nhiên tại khách sạn Cecil."],
  ["Tội Diễn Sư", "toi-dien-su", "toi_dien_su", 16, "Phá án, Hài hước", 3, 7, "3,5 ~ 4 tiếng", 199000, "Những người diễn lại tội ác phải biến giả thuyết thành bằng chứng sống."],
  ["Tuyết Hương Liên Hoàn Án", "tuyet-huong-lien-hoan-an", "tuyet_huong_lien_hoan_an", 16, "Phá án, Tâm lý, Kinh dị", 3, 6, "~ 4 tiếng", 269000, "Một vụ án liên hoàn được tái hiện qua hai màn chơi đầy bí ẩn."],
  ["Vụ Nha Quán", "vu-nha-quan", "vu_nha_quan", 16, "Phá án", 5, 6, "~ 4,5 tiếng", 249000, "Căn phòng khóa kín và cái tên Bạch Nha mở đầu cho một cuộc điều tra nguy hiểm."],
  ["Xin Chào", "xin-chao", "xin_chao", 16, "Tình cảm, Phá án", 2, 6, "3,5 ~ 4 tiếng", 199000, "Một câu chuyện tình cảm về những cuộc gặp gỡ, chia ly và điều chưa nói."],
  ["Yandere 1 - Tâm Thần Phân Liệt", "yandere1", "yandere1", 16, "Phá án, Kinh dị, Tâm lý", 4, 7, "~ 4 tiếng", 189000, "Bảy mảnh nhật ký dẫn người chơi đi qua một câu chuyện gia đình đầy ám ảnh."],
];

export const MOCK_SCRIPTS = scriptRows.map((row, index) => createScript(index + 1, row));
export const MOCK_OPEN_SCRIPT_IDS = MOCK_SCRIPTS.map((script) => script.id);

export const MOCK_STORES: StoreBranch[] = [
  {
    id: "mock-store-1",
    name: "Kịch Bản Sát - Chi nhánh Quận 1",
    province: "Thành phố Hồ Chí Minh",
    district: "Quận 1",
    street: "12 Nguyễn Huệ, Phường Bến Nghé",
    phone: "0900000001",
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-review-1",
    scriptId: MOCK_SCRIPTS[3].id,
    scriptTitle: MOCK_SCRIPTS[3].title,
    userName: "Người chơi ẩn danh",
    rating: 5,
    comment: "Không khí và mạch suy luận rất cuốn.",
    verified: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "mock-review-2",
    scriptId: MOCK_SCRIPTS[1].id,
    scriptTitle: MOCK_SCRIPTS[1].title,
    userName: "Một người mê phá án",
    rating: 5,
    comment: "Poster đẹp, nội dung nhiều bất ngờ.",
    verified: true,
    createdAt: "2026-02-01T10:00:00Z",
  },
];
