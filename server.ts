import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_SEO_SETTINGS, SEO_SECTION_ORDER } from './src/data/seoDefaults';
import type { SeoSectionConfig, SeoSectionKey } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

interface StoreData {
  products: Array<{
    id: string;
    sku: string;
    name: string;
    subtitle: string;
    category: string;
    priceVnd: number;
    priceLabel: string;
    stock: number;
    stockLabel: string;
    variants: string[];
    origin: string;
    summary: string;
    highlights: string[];
    specs: Array<{ label: string; value: string }>;
    imageKey: string;
    featured?: boolean;
    isVisible?: boolean;
    translations?: Record<string, {
      name?: string;
      subtitle?: string;
      category?: string;
      stockLabel?: string;
      origin?: string;
      summary?: string;
      variants?: string[];
      highlights?: string[];
      specs?: Array<{ label: string; value: string }>;
    }>;
    subDetails?: unknown[];
  }>;
  orders: Array<{
    id: string;
    code: string;
    productId: string;
    productName: string;
    variant: string;
    quantity: number;
    unitPriceVnd: number;
    totalVnd: number;
    customerName: string;
    companyName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    note: string;
    status: 'Chờ xác nhận' | 'Đang xử lý' | 'Đang giao hàng' | 'Hoàn tất' | 'Đã hủy';
    createdAt: string;
  }>;
  news: Array<{
    id: string;
    title: string;
    category: string;
    summary: string;
    content: string;
    author: string;
    publishedAt: string;
    status: 'published' | 'draft';
    imageKey: string;
  }>;
  jobs: Array<{
    id: string;
    title: string;
    department: string;
    location: string;
    employmentType: string;
    salaryRange: string;
    deadline: string;
    summary: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    isOpen: boolean;
  }>;
  applications: Array<{
    id: string;
    code: string;
    jobId: string;
    jobTitle: string;
    fullName: string;
    email: string;
    phone: string;
    experienceYears: string;
    languageLevel: string;
    portfolioUrl: string;
    resumeName: string;
    resumeSummary: string;
    coverLetter: string;
    status: 'Mới tiếp nhận' | 'Đang phỏng vấn' | 'Đạt yêu cầu' | 'Lưu hồ sơ';
    submittedAt: string;
  }>;
  consultations: Array<{
    id: string;
    code: string;
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    serviceType: string;
    productInterest: string;
    preferredDate: string;
    message: string;
    status: 'Chờ liên hệ' | 'Đã lên lịch' | 'Hoàn thành';
    notes?: string;
    submittedAt: string;
  }>;
  seoSettings: SeoSectionConfig[];
}

const INITIAL_PRODUCTS: StoreData['products'] = [
  {
    id: 'kirara-cream',
    sku: 'KIRARA Cream - 01',
    name: 'KIRARA Cream',
    subtitle: 'Vật liệu hoàn thiện nội thất sơn bả khoáng chất 2 trong 1 từ san hô hóa thạch Yonaguni & đá Danto Aichi',
    category: 'Giải pháp về không khí trong nhà',
    priceVnd: 5852000,
    priceLabel: '5.852.000 VNĐ',
    stock: 18,
    stockLabel: 'Sẵn nền 01 · Đặt pha 32 màu',
    variants: ['Can tiêu chuẩn 19L', 'Can tiện dụng 6L', '32 màu sắc tự nhiên'],
    origin: 'Gensen Co., Ltd. (Kanagawa) · Đảo Yonaguni & Tỉnh Aichi, Nhật Bản',
    summary:
      'Vật liệu hoàn thiện tường nội thất dạng kem gốc tự nhiên (sơn lót & lớp phủ 2 trong 1) phát triển bởi Gensen Co., Ltd. từ san hô hóa thạch nghìn năm đảo Yonaguni (Okinawa) và bột đá Danto (thạch anh phiến tỉnh Aichi). Công thức không Silic tinh thể, đạt chuẩn không cháy Bộ Đất đai Nhật Bản (MLIT) và F☆☆☆☆, hấp thụ/nhả ẩm nhanh gấp 2,5 lần vữa vôi Shikkui truyền thống, khử 98% mùi hôi trong 2 giờ và phát ion âm gấp 10 lần văn phòng thông thường.',
    highlights: [
      'Khả năng hút & cân bằng độ ẩm vượt trội gấp ~2,5 lần vữa vôi Shikkui truyền thống, tuổi thọ bán vĩnh viễn > 20 năm',
      'Khử mùi amoniac, khói thuốc, mùi thú cưng, H₂S đến 98% trong 2 giờ nhờ hàng tỷ mao quản san hô xốp',
      'Không phát thải Formaldehyde (F☆☆☆☆), không chứa Silic tinh thể, đạt chuẩn Vật liệu không cháy MLIT Nhật Bản',
      'Kháng nấm mốc (JIS Z 2911A) & kháng khuẩn (JIS Z 2801), độ đàn hồi cao hạn chế nứt chân chim bề mặt',
      'Phủ trực tiếp lên giấy dán tường cũ hoặc thạch cao bằng con lăn, bay trét hay súng phun (dùng kèm Clean Sealer)',
    ],
    specs: [
      { label: 'Thành phần cốt lõi', value: 'Bột san hô hóa thạch Yonaguni (Okinawa), đá Danto (Aichi), Eco Binder sinh học, sắc tố khoáng chuẩn thực phẩm' },
      { label: 'Chứng nhận an toàn', value: 'F☆☆☆☆ (JIS) · Chứng nhận Vật liệu không cháy Bộ Đất đai Nhật Bản (MLIT) · 0% Silic tinh thể' },
      { label: 'Hiệu suất lọc khí & vi sinh', value: 'Khử mùi 98%/2h · Kháng khuẩn JIS Z 2801 · Kháng nấm mốc JIS Z 2911A · Ion âm 300/cc' },
      { label: 'Định mức thi công (19L)', value: '~25 m² bằng bay trét (dày ~1mm) hoặc ~35 m² bằng con lăn / súng phun (2 lớp)' },
      { label: 'Bảo quản & hạn dùng', value: 'Nhiệt độ 4°C–40°C trong nhà, sử dụng tốt nhất trong 3 tháng kể từ ngày sản xuất' },
      { label: 'Bảng màu & thành tích', value: '32 sắc thái tự nhiên · Đã ứng dụng tại >10.000 nhà ở, ~100 trường học, ~40 phòng khám Nhật Bản' },
    ],
    imageKey: 'kirara_cream',
    featured: true,
    isVisible: true,
  },
  {
    id: 'kirara-liquid',
    sku: 'Can 10L · 700ML · 500ML',
    name: 'KIRARA LIQUID',
    subtitle: 'Dung dịch khoáng chất ion hóa 100% thiên nhiên thanh lọc không khí nhà ở, văn phòng & ô tô',
    category: 'Giải pháp về không khí trong nhà',
    priceVnd: 11340000,
    priceLabel: '11.340.000 VNĐ',
    stock: 14,
    stockLabel: 'Sẵn kho & dịch vụ phun phủ',
    variants: ['Can công nghiệp 10L', 'Chai 700ML', 'Chai xịt 500ML'],
    origin: 'Gensen Co., Ltd. · Gensen Global, Nhật Bản',
    summary:
      'Dung dịch khoáng chất trong suốt không màu 100% thiên nhiên chứa ion Canxi và Magie hoạt tính, đã hoàn tất kiểm nghiệm độc tính cấp tính đường uống đảm bảo an toàn tuyệt đối cho người, trẻ sơ sinh và thú cưng. Khi phun lên tường, rèm cửa, sofa, thảm hoặc nội thất ô tô, Kirara Liquid tạo màng khoáng vi mô giúp phân hủy khí độc TVOC, kết tụ bụi mịn PM2.5, khử mùi và bức xạ tia hồng ngoại xa 6,27 micron.',
    highlights: [
      'Kiểm nghiệm độc tính cấp tính đường uống: 100% nước khoáng tinh khiết không cồn, không hóa chất tổng hợp',
      'Phân hủy TVOC, Formaldehyde từ gỗ công nghiệp – keo dán và hỗ trợ kết tụ giảm bụi mịn PM2.5 lơ lửng',
      'Ức chế vi khuẩn (E.coli, tụ cầu vàng), bào tử nấm mốc và tác nhân gây mùi trên mọi bề mặt vải, da, gỗ',
      'Bức xạ tia hồng ngoại xa bước sóng 6,27 micron và ion âm giúp giảm say xe, ngủ sâu và giảm dị ứng hô hấp',
    ],
    specs: [
      { label: 'Quy cách đóng gói', value: 'Chai xịt 500ML · Chai 700ML · Can công nghiệp 10 Lít (kèm dịch vụ phun phủ chuyên dụng)' },
      { label: 'Thành phần & độ an toàn', value: 'Nước khoáng tinh khiết giàu ion Ca²⁺, Mg²⁺ thiên nhiên 100% (đã kiểm nghiệm độc tính đường uống)' },
      { label: 'Bước sóng hồng ngoại xa', value: '6,27 micron tạo không gian chống oxy hóa, hỗ trợ tuần hoàn và thư giãn thần kinh' },
      { label: 'Phạm vi ứng dụng', value: 'Căn hộ mới bàn giao, phòng ngủ, trường mầm non, bệnh viện, rèm/sofa vải và khoang xe ô tô' },
    ],
    imageKey: 'kirara_liquid',
    featured: true,
    isVisible: true,
  },
  {
    id: 'gko-tay-nam-moc',
    sku: 'GKO-200ML · 500ML · 4L',
    name: 'G.K.O Tẩy nấm mốc',
    subtitle: 'Dung dịch xử lý nấm mốc & vết ố khói thuốc tận bào tử chuẩn hệ thống HMSS Nhật Bản',
    category: 'Giải pháp về không khí trong nhà',
    priceVnd: 270000,
    priceLabel: '270.000 VNĐ',
    stock: 112,
    stockLabel: 'Còn 112 chai sẵn kho',
    variants: ['Chai 200ML', 'Chai 500ML', 'Can chuyên dụng 4L'],
    origin: 'Gensen Global · Khuyến nghị chuẩn HMSS (House Mold Security System) Nhật Bản',
    summary:
      'Sản phẩm chuyên dụng được khuyến nghị trong hệ thống an ninh chống mốc nhà ở HMSS (House Mold Security System) tại Nhật Bản để xử lý dứt điểm nấm mốc nội – ngoại thất và tẩy sạch vết ố vàng nhựa thuốc lá. Sử dụng phụ gia đạt chuẩn an toàn thực phẩm giúp giảm mạnh mùi Clo hắc khó chịu, thẩm thấu sâu phá vỡ vách tế bào sợi nấm và vô hiệu hóa nhân bào tử ẩn sâu dưới vữa.',
    highlights: [
      'Khuyến nghị chính thức trong quy trình xử lý nấm mốc HMSS Nhật Bản — không cần chà xát mạnh làm hỏng tường',
      'Thẩm thấu xuyên lớp bảo vệ cứng của tế bào nấm mốc, tiêu diệt tận gốc bào tử để ngăn tái phát nhanh',
      'Khử trùng tới 99,9% vi khuẩn E.coli và tụ cầu vàng trên ron gạch, trần thạch cao, tường bê tông và giấy dán',
      'Công thức kết hợp phụ gia chuẩn thực phẩm giảm thiểu mùi Clo nồng gắt, lý tưởng để xử lý nền trước khi phủ Kirara',
    ],
    specs: [
      { label: 'Quy cách dung tích', value: 'Chai 200ML (270.000 VNĐ) · Chai 500ML · Can bảo trì tòa nhà 4 Lít' },
      { label: 'Tiêu chuẩn khuyến nghị', value: 'Hệ thống kiểm soát nấm mốc HMSS (House Mold Security System) · Nhật Bản' },
      { label: 'Hiệu lực diệt khuẩn', value: '99,9% vi khuẩn E.coli & tụ cầu vàng (Staphylococcus aureus)' },
      { label: 'Công dụng kép', value: 'Tẩy nấm mốc tường/ron gạch/gỗ & Làm sạch vết ố vàng khói thuốc lá (nicotine/tar)' },
    ],
    imageKey: 'gko',
    isVisible: true,
  },
  {
    id: 'can-bang-khoang-chat-donan',
    sku: 'DONAN-120G',
    name: 'Cân bằng khoáng chất Donan',
    subtitle: 'Giải pháp bổ sung & cân bằng vi khoáng thiên nhiên theo triết lý "Không khí × Nước × Muối Khoáng = Sức khỏe"',
    category: 'Khoáng chất tốt cho sức khỏe',
    priceVnd: 1390000,
    priceLabel: '1.390.000 VNĐ',
    stock: 9,
    stockLabel: 'Sẵn 9 hộp · Đặt định kỳ Nhật Bản',
    variants: ['Hộp tiêu chuẩn 120g', 'Gói chia nhỏ 45g (tiện mang theo)'],
    origin: 'Gensen Co., Ltd. · Nhập khẩu chính ngạch Nhật Bản',
    summary:
      'Sản phẩm chăm sóc sức khỏe thuộc hệ sinh thái "Không khí × Nước × Muối Khoáng × Thực phẩm = Sức khỏe" của Gensen Nhật Bản. Donan bổ sung tổ hợp nguyên tố vi khoáng thiên nhiên tinh khiết thường bị thiếu hụt trong nước lọc RO hiện đại và khẩu phần ăn công nghiệp, góp phần cân bằng điện giải nội bào, hỗ trợ chuyển hóa năng lượng và nâng cao sức đề kháng tự nhiên.',
    highlights: [
      'Cung cấp phổ khoáng chất vi lượng tự nhiên cân đối, dễ hòa tan và hấp thu trong sinh hoạt hằng ngày',
      'Bù khoáng hiệu quả cho nước uống tinh khiết lọc RO/máy lọc gia đình và cân bằng vị ngọt thanh tự nhiên',
      'Kiểm soát chất lượng nghiêm ngặt từng lô sản xuất tại Nhật Bản với truy xuất nguồn gốc rõ ràng',
      'Hỗ trợ giảm mệt mỏi thể chất, duy trì cân bằng kiềm – khoáng cho người làm việc cường độ cao và người lớn tuổi',
    ],
    specs: [
      { label: 'Quy cách tiêu chuẩn', value: 'Hộp 120g (phiên bản gia đình) · Tùy chọn gói chia nhỏ 45g tiện dụng' },
      { label: 'Triết lý sản phẩm', value: 'Hệ sinh thái sức khỏe toàn diện Gensen: Không khí × Nước × Khoáng chất = Sức khỏe' },
      { label: 'Kiểm soát chất lượng', value: 'Kiểm định an toàn & truy xuất nguồn gốc lô hàng trực tiếp từ Nhật Bản' },
      { label: 'Cách dùng linh hoạt', value: 'Pha lượng nhỏ theo định mức khuyến nghị vào nước uống, trà hoặc nấu ăn hằng ngày' },
    ],
    imageKey: 'donan',
    isVisible: true,
  },
  {
    id: 'da-kirara',
    sku: 'KIRARA-STONE-1KG',
    name: 'Đá Kirara',
    subtitle: 'Đá khoáng thiên nhiên Nhật Bản giàu nguyên tố vi lượng thanh lọc nước & tạo ion âm bền vững',
    category: 'Khoáng chất tốt cho sức khỏe',
    priceVnd: 2184000,
    priceLabel: '2.184.000 VNĐ',
    stock: 25,
    stockLabel: 'Còn 25 bộ sẵn kho Đà Nẵng',
    variants: ['Túi tiêu chuẩn 1kg'],
    origin: 'Gensen Co., Ltd. · Khoáng sản thiên nhiên Nhật Bản',
    summary:
      'Đá khoáng tự nhiên Kirara (Kirara Stone) được tuyển chọn từ nguồn khoáng thạch giàu nguyên tố vi lượng tại Nhật Bản, có khả năng giải phóng ion âm ổn định và khoáng hóa nhẹ nguồn nước. Sử dụng đa năng cho bình nước uống (làm mềm nước, tăng vị thanh khi pha trà/cà phê), ngâm bồn tắm thư giãn hoặc đặt khử mùi trong tủ lạnh, tủ giày với độ bền vật lý nhiều năm.',
    highlights: [
      'Khoáng hóa và làm mềm phân tử nước tự nhiên, mang lại vị nước thanh dịu lý tưởng cho trà đạo và cà phê',
      'Phát tán ion âm ổn định giúp khử mùi ẩm mốc trong tủ lạnh, phòng ngủ, tủ giày hoặc không gian điều hòa kín',
      'Ứng dụng làm đá ngâm bồn tắm khoáng thư giãn hỗ trợ làm dịu da và lưu thông khí huyết',
      'Độ bền sử dụng nhiều năm: chỉ cần rửa sạch bằng nước và phơi nắng định kỳ hàng tháng để tái tạo bề mặt',
    ],
    specs: [
      { label: 'Quy cách đóng gói', value: '1kg đá khoáng thiên nhiên tuyển chọn kèm hướng dẫn vệ sinh tái tạo' },
      { label: 'Tác động sinh học', value: 'Giải phóng vi khoáng nhẹ · Phát tán ion âm · Hấp thụ mùi & làm mềm nước' },
      { label: 'Ứng dụng đa năng', value: 'Bình nước uống · Bồn tắm khoáng · Tủ lạnh · Tủ quần áo & Không gian phòng kín' },
      { label: 'Tình trạng kho', value: 'Sẵn 25 túi tại kho Harian Đà Nẵng — giao nhanh 24–48h toàn quốc' },
    ],
    imageKey: 'kirara_stone',
    isVisible: true,
  },
];

const INITIAL_STORE: StoreData = {
  products: INITIAL_PRODUCTS,
  orders: [
    {
      id: 'ord-sample-1',
      code: 'DH-2026-4810',
      productId: 'kirara-cream',
      productName: 'KIRARA Cream',
      variant: 'Can tiêu chuẩn 19L · 01 Coral White',
      quantity: 4,
      unitPriceVnd: 5852000,
      totalVnd: 23408000,
      customerName: 'Phạm Hữu Tín',
      companyName: 'Công ty Kiến trúc Sông Hàn',
      email: 'tin.pham@songhanarch.vn',
      phone: '0905 332 710',
      shippingAddress: '112 Bạch Đằng, Hải Châu, Đà Nẵng',
      note: 'Giao tại công trình biệt thự Hòa Xuân, kèm tài liệu hướng dẫn thi công.',
      status: 'Đang xử lý',
      createdAt: '2026-07-28T08:40:00.000Z',
    },
    {
      id: 'ord-sample-2',
      code: 'DH-2026-4825',
      productId: 'gko-tay-nam-moc',
      productName: 'G.K.O Tẩy nấm mốc',
      variant: '200ML',
      quantity: 10,
      unitPriceVnd: 270000,
      totalVnd: 2700000,
      customerName: 'Nguyễn Thị Lan Anh',
      companyName: 'Hệ thống Mầm non Sakura',
      email: 'lananh@sakurakids.edu.vn',
      phone: '0913 884 512',
      shippingAddress: '45 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng',
      note: 'Xuất hóa đơn VAT cho trường mầm non.',
      status: 'Hoàn tất',
      createdAt: '2026-07-26T14:10:00.000Z',
    },
    {
      id: 'ord-sample-3',
      code: 'DH-2026-4839',
      productId: 'da-kirara',
      productName: 'Đá Kirara',
      variant: 'Túi 1kg',
      quantity: 2,
      unitPriceVnd: 2184000,
      totalVnd: 4368000,
      customerName: 'Trần Quốc Bảo',
      companyName: 'Khách hàng cá nhân',
      email: 'bao.tq@gmail.com',
      phone: '0989 441 902',
      shippingAddress: 'Tòa nhà Landmark 2, Bình Thạnh, TP. Hồ Chí Minh',
      note: 'Giao giờ hành chính.',
      status: 'Chờ xác nhận',
      createdAt: '2026-07-28T16:05:00.000Z',
    },
  ],
  news: [
    {
      id: 'news-vietbuild-danang-2026',
      title: 'HARIAN DẤU ẤN TẠI VIETBUILD ĐÀ NẴNG 2026',
      category: 'Sự kiện',
      summary:
        'Harian Corporation giới thiệu hệ sinh thái vật liệu khoáng chất Kirara từ Nhật Bản cùng dịch vụ tư vấn công trình xanh tại Triển lãm Quốc tế Vietbuild Đà Nẵng 2026.',
      content:
        'Tại Triển lãm Quốc tế Vietbuild Đà Nẵng 2026, gian hàng của Công ty Cổ phần Harian thu hút sự quan tâm lớn từ giới kiến trúc sư, nhà thầu xây dựng và chủ đầu tư dự án nghỉ dưỡng miền Trung.\n\nĐiểm nhấn tại sự kiện là khu vực trải nghiệm thực tế hai dòng sản phẩm chủ lực KIRARA Cream (vật liệu sơn bả 2 trong 1 từ san hô hóa thạch đảo Yonaguni) và KIRARA Liquid. Khách tham quan được trực tiếp kiểm chứng khả năng khử mùi trong vài phút, đo chỉ số ion âm tự nhiên và tìm hiểu bảng 32 sắc thái khoáng chất không chứa VOC độc hại.\n\nBên cạnh giới thiệu sản phẩm, đội ngũ chuyên gia của Harian cũng thực hiện các phiên tư vấn chuyên sâu dành cho doanh nghiệp Nhật Bản đang tìm kiếm cơ hội đầu tư hạ tầng và bất động sản bền vững tại Đà Nẵng.',
      author: 'Ban Truyền thông Harian',
      publishedAt: '2026-07-28',
      status: 'published',
      imageKey: 'hero_living',
    },
    {
      id: 'news-yoshino-gypsum-2026',
      title: 'Công ty CP Gensen Global và Công ty CP Harian làm việc với Tập đoàn Yoshino Gypsum, mở rộng hợp tác quốc tế',
      category: 'Hợp tác quốc tế',
      summary:
        'Buổi làm việc song phương giữa Gensen Global, Harian và Tập đoàn Yoshino Gypsum nhằm chuẩn hóa chuỗi cung ứng vật liệu xây dựng an toàn Nhật – Việt.',
      content:
        'Công ty Cổ phần Gensen Global và Công ty Cổ phần Harian đã có buổi làm việc chính thức với Tập đoàn Yoshino Gypsum — một trong những nhà sản xuất vật liệu tấm thạch cao và giải pháp nội thất hàng đầu Nhật Bản.\n\nHai bên tập trung trao đổi về tiêu chuẩn đồng bộ giữa tấm thạch cao kỹ thuật và vật liệu hoàn thiện bề mặt khoáng chất Kirara Cream nhằm giải quyết triệt để vấn đề ẩm mốc, nồm ẩm và hội chứng nhà mới tại khí hậu nhiệt đới gió mùa Việt Nam.\n\nThỏa thuận định hướng mở ra cơ hội chuyển giao quy trình đào tạo Wall Artist (kỹ thuật viên thi công chuẩn Nhật) và hỗ trợ kỹ thuật trực tiếp cho các dự án trường học, bệnh viện và khu đô thị mới.',
      author: 'Phòng Đối ngoại Nhật – Việt',
      publishedAt: '2026-07-28',
      status: 'published',
      imageKey: 'consulting',
    },
    {
      id: 'news-gaea-field-hcm-2026',
      title: 'Harian mở rộng hợp tác chiến lược cùng Gaea Field Việt Nam tại thị trường TP. Hồ Chí Minh',
      category: 'Thị trường',
      summary:
        'Đưa các giải pháp cải thiện chất lượng không khí trong nhà và tư vấn doanh nghiệp FDI đến gần hơn với hệ thống đối tác phía Nam.',
      content:
        'Với mục tiêu mở rộng mạng lưới phân phối và đưa giải pháp cải thiện chất lượng không khí trong nhà đến gần hơn với các hộ gia đình và doanh nghiệp phía Nam, Harian cùng Gensen Global đã chính thức làm việc chiến lược với Công ty Cổ phần Gaea Field Việt Nam tại TP. Hồ Chí Minh.\n\nSự hợp tác tập trung vào phát triển hệ thống đại lý ủy quyền, đào tạo đội ngũ tư vấn giải pháp không khí sạch cho căn hộ cao cấp, phòng khám nhi – nha khoa và văn phòng doanh nghiệp FDI Nhật Bản đang hoạt động tại TP.HCM và các tỉnh lân cận.',
      author: 'Ban Phát triển Thị trường',
      publishedAt: '2026-07-28',
      status: 'published',
      imageKey: 'kirara_cream',
    },
    {
      id: 'news-vietbuild-2025-gensen',
      title: 'HARIAN CORP tại VIETBUILD 2025: Hợp tác cùng GENSEN GLOBAL mang không gian sống xanh đến Đà Nẵng',
      category: 'Công nghệ Kirara',
      summary:
        'Sự kiện đánh dấu cột mốc ra mắt đồng bộ dòng vật liệu san hô hóa thạch Yonaguni và dung dịch khử nấm mốc sinh học G.K.O tại miền Trung.',
      content:
        'Triển lãm Quốc tế Vietbuild Đà Nẵng 2025 đã chứng kiến màn phối hợp ấn tượng giữa Harian Corporation và đối tác chiến lược Gensen Global đến từ Nhật Bản.\n\nGian hàng của Harian không chỉ thu hút đông đảo kiến trúc sư, nhà thầu xây dựng mà còn trở thành điểm đến của hàng ngàn gia đình đang tìm kiếm giải pháp không gian sống xanh, không Formaldehyde và an toàn tuyệt đối cho trẻ nhỏ.',
      author: 'Ban Truyền thông Harian',
      publishedAt: '2026-07-23',
      status: 'published',
      imageKey: 'kirara_liquid',
    },
  ],
  jobs: [
    {
      id: 'job-ky-thuat',
      title: 'Nhân viên Kỹ thuật & Triển khai Giải pháp Không khí',
      department: 'Kỹ thuật & Thi công Kirara',
      location: 'Đà Nẵng (Hỗ trợ công tác toàn quốc)',
      employmentType: 'Toàn thời gian',
      salaryRange: '12.000.000 – 18.000.000 VNĐ',
      deadline: '2026-12-30',
      summary:
        'Trực tiếp tiếp nhận công nghệ Nhật Bản từ chuyên gia Gensen Global, thực hiện khảo sát chất lượng không khí, hướng dẫn thi công vật liệu Kirara Cream / Kirara Liquid tại các công trình dân dụng và thương mại.',
      responsibilities: [
        'Khảo sát hiện trạng bề mặt tường, độ ẩm và chất lượng không khí (VOC, PM2.5) tại công trình và xe ô tô.',
        'Trực tiếp thi công phun phủ khoáng chất Kirara Liquid, xử lý nấm mốc G.K.O và giám sát kỹ thuật sơn bả Kirara Cream.',
        'Đào tạo chuyển giao kỹ thuật chuẩn Nhật cho các đội thợ, nhà thầu và đại lý đối tác.',
        'Lập báo cáo nghiệm thu kỹ thuật và bảo hành chất lượng sau bàn giao.',
      ],
      requirements: [
        'Tốt nghiệp Trung cấp/Cao đẳng/Đại học chuyên ngành Xây dựng, Vật liệu, Kỹ thuật môi trường hoặc liên quan.',
        'Cẩn trọng, trung thực, yêu thích làm việc với sản phẩm công nghệ Nhật Bản.',
        'Có khả năng di chuyển linh hoạt theo tiến độ dự án; ưu tiên ứng viên có kinh nghiệm thi công hoàn thiện nội thất.',
      ],
      benefits: [
        'Được đào tạo bài bản quy trình Wall Artist từ chuyên gia Nhật Bản.',
        'Lương cơ bản cạnh tranh + phụ cấp công trình + thưởng hiệu suất dự án.',
        'Đóng BHXH, BHYT đầy đủ, khám sức khỏe định kỳ và du lịch hằng năm.',
      ],
      isOpen: true,
    },
    {
      id: 'job-hanh-chinh-nhan-su',
      title: 'Nhân viên Hành chính Nhân sự (HR & Admin)',
      department: 'Hành chính & Vận hành Doanh nghiệp',
      location: 'Hòa Xuân, Cẩm Lệ, Đà Nẵng',
      employmentType: 'Toàn thời gian',
      salaryRange: '10.000.000 – 15.000.000 VNĐ',
      deadline: '2026-12-20',
      summary:
        'Đảm nhiệm công tác tuyển dụng, quản lý hồ sơ nhân sự, điều phối hành chính văn phòng và hỗ trợ thủ tục vận hành cho khối tư vấn doanh nghiệp Nhật – Việt tại trụ sở Đà Nẵng.',
      responsibilities: [
        'Triển khai quy trình tuyển dụng nhân sự khối kỹ thuật, kinh doanh và tư vấn.',
        'Quản lý hợp đồng lao động, chấm công, bảo hiểm xã hội và phúc lợi nội bộ.',
        'Hỗ trợ hậu cần cho các buổi làm việc song phương với đối tác Nhật Bản và triển lãm chuyên ngành.',
        'Lưu trữ hồ sơ pháp lý doanh nghiệp, quản lý văn phòng phẩm và tài sản công ty.',
      ],
      requirements: [
        'Tốt nghiệp Đại học chuyên ngành Quản trị Nhân lực, Quản trị Kinh doanh, Luật hoặc Ngôn ngữ.',
        'Có ít nhất 1 năm kinh nghiệm ở vị trí Hành chính Nhân sự; thành thạo tin học văn phòng.',
        'Giao tiếp tiếng Anh hoặc tiếng Nhật (từ N3) là lợi thế lớn.',
      ],
      benefits: [
        'Môi trường làm việc chuẩn Nhật chuyên nghiệp, minh bạch và tôn trọng cá nhân.',
        'Lộ trình thăng tiến rõ ràng lên vị trí Trưởng nhóm Hành chính / Điều phối Dự án.',
        'Chế độ nghỉ phép, thưởng lễ Tết và đào tạo kỹ năng quản trị.',
      ],
      isOpen: true,
    },
    {
      id: 'job-tu-van-doanh-nghiep',
      title: 'Chuyên viên Tư vấn Doanh nghiệp & Đầu tư Nhật – Việt',
      department: 'Tư vấn Chiến lược & FDI',
      location: 'Đà Nẵng / TP. Hồ Chí Minh',
      employmentType: 'Toàn thời gian',
      salaryRange: '18.000.000 – 30.000.000 VNĐ',
      deadline: '2026-12-31',
      summary:
        'Phụ trách nghiên cứu thị trường, tư vấn chiến lược mở rộng đầu tư, thủ tục pháp lý – thuế và kết nối đối tác thương mại giữa doanh nghiệp Nhật Bản và Việt Nam.',
      responsibilities: [
        'Tiếp nhận yêu cầu từ khách hàng doanh nghiệp Nhật Bản và Việt Nam về mở rộng đầu tư, bất động sản và vận hành.',
        'Soạn thảo đề xuất giải pháp tư vấn chiến lược, phối hợp cùng bộ phận kế toán – thuế để triển khai hồ sơ.',
        'Phiên dịch, điều phối các phiên họp cấp quản lý và khảo sát thực địa dự án.',
      ],
      requirements: [
        'Sử dụng thành thạo tiếng Nhật (JLPT N2 trở lên) hoặc tiếng Anh thương mại xuất sắc.',
        'Hiểu biết về luật đầu tư, doanh nghiệp, thuế tại Việt Nam hoặc từng làm việc tại công ty Nhật.',
        'Tư duy hệ thống, kỹ năng trình bày và thuyết phục khách hàng B2B tốt.',
      ],
      benefits: [
        'Thu nhập hấp dẫn theo năng lực + hoa hồng tư vấn dự án.',
        'Cơ hội công tác Nhật Bản và làm việc trực tiếp cùng ban lãnh đạo các tập đoàn đối tác.',
        'Đầy đủ chế độ bảo hiểm và phúc lợi cao cấp.',
      ],
      isOpen: true,
    },
  ],
  applications: [
    {
      id: 'app-sample-1',
      code: 'HR-2026-1042',
      jobId: 'job-ky-thuat',
      jobTitle: 'Nhân viên Kỹ thuật & Triển khai Giải pháp Không khí',
      fullName: 'Nguyễn Minh Quân',
      email: 'minhquan.arch@example.com',
      phone: '0905 412 889',
      experienceYears: '3 năm',
      languageLevel: 'Tiếng Anh giao tiếp',
      portfolioUrl: 'https://linkedin.com/in/minhquan-kientruc',
      resumeName: 'CV_NguyenMinhQuan_KyThuat.pdf',
      resumeSummary: '3 năm giám sát thi công hoàn thiện nội thất căn hộ & khách sạn tại Đà Nẵng.',
      coverLetter: 'Mong muốn tiếp cận công nghệ vật liệu sạch Kirara Nhật Bản và đóng góp vào đội ngũ triển khai miền Trung.',
      status: 'Đang phỏng vấn',
      submittedAt: '2026-07-27T09:30:00.000Z',
    },
    {
      id: 'app-sample-2',
      code: 'HR-2026-1058',
      jobId: 'job-tu-van-doanh-nghiep',
      jobTitle: 'Chuyên viên Tư vấn Doanh nghiệp & Đầu tư Nhật – Việt',
      fullName: 'Trần Thị Thu Hà',
      email: 'thuha.jpconsulting@example.com',
      phone: '0935 771 204',
      experienceYears: '4 năm',
      languageLevel: 'Tiếng Nhật JLPT N2',
      portfolioUrl: '',
      resumeName: 'CV_TranThiThuHa_N2.pdf',
      resumeSummary: '4 năm điều phối dự án FDI và hỗ trợ doanh nghiệp sản xuất Nhật Bản tại KCN Hòa Khánh.',
      coverLetter: 'Tôi đánh giá cao mô hình kết hợp giữa tư vấn doanh nghiệp và giải pháp môi trường sống xanh của Harian.',
      status: 'Mới tiếp nhận',
      submittedAt: '2026-07-28T14:15:00.000Z',
    },
  ],
  consultations: [
    {
      id: 'cons-sample-1',
      code: 'TV-2026-0318',
      fullName: 'Lê Hoàng Nam',
      companyName: 'Công ty TNHH Kiến trúc Không Gian Xanh',
      email: 'nam.le@khonggianxanh.vn',
      phone: '0914 228 900',
      serviceType: 'Tư vấn Thiết kế Nội thất & Kiến trúc',
      productInterest: 'KIRARA Cream (01 Coral White)',
      preferredDate: '2026-08-05',
      message: 'Cần nhận mẫu thử sơn khoáng chất Kirara Cream và báo giá thi công 450m² tường cho dự án trường mầm non tại Sơn Trà.',
      status: 'Đã lên lịch',
      notes: 'Đã gửi bộ mẫu màu Coral White và hẹn khảo sát công trình sáng 05/08.',
      submittedAt: '2026-07-28T10:20:00.000Z',
    },
    {
      id: 'cons-sample-2',
      code: 'TV-2026-0324',
      fullName: 'Kenji Takahashi',
      companyName: 'Osaka Precision Manufacturing VN',
      email: 'takahashi@osaka-mfg.jp',
      phone: '0901 662 418',
      serviceType: 'Tư vấn Doanh nghiệp Toàn diện',
      productInterest: 'Chưa chọn sản phẩm cụ thể',
      preferredDate: '2026-08-12',
      message: 'Tìm hiểu dịch vụ tư vấn thuế, kế toán và mở rộng văn phòng đại diện tại khu vực miền Trung.',
      status: 'Chờ liên hệ',
      notes: '',
      submittedAt: '2026-07-28T15:45:00.000Z',
    },
  ],
  seoSettings: INITIAL_SEO_SETTINGS,
};

const INITIAL_TRANSLATIONS_BY_ID: Record<
  string,
  Record<
    string,
    {
      name?: string;
      subtitle?: string;
      category?: string;
      stockLabel?: string;
      origin?: string;
      summary?: string;
      variants?: string[];
      highlights?: string[];
      specs?: Array<{ label: string; value: string }>;
    }
  >
> = {
  'kirara-cream': {
    en: {
      name: 'KIRARA Cream',
      subtitle: '2-in-1 natural mineral cream interior wall finish made from Yonaguni fossilized coral & Aichi Danto stone',
      category: 'Indoor Air Solutions',
      stockLabel: '#01 In Stock · 32 Custom Shades',
      variants: ['19L Standard Pail', '6L Compact Pail', '32 Natural Shades'],
      origin: 'Gensen Co., Ltd. (Kanagawa) · Yonaguni Island & Aichi, Japan',
      summary:
        'A natural cream interior wall material (2-in-1 primer & topcoat) developed by Gensen Co., Ltd. using fossilized coral from Yonaguni Island (Okinawa) and Danto stone powder (Aichi). Crystalline silica-free, F☆☆☆☆ certified, and MLIT Non-Combustible approved, Kirara delivers ~2.5× the humidity control of traditional Shikkui lime plaster, 98% deodorization in 2 hours, and 300 negative ions/cc.',
      highlights: [
        '~2.5× higher moisture absorption & release than traditional Shikkui plaster with 20+ years functional lifespan',
        'Removes up to 98% of ammonia, tobacco, pet odors, and H₂S within 2 hours via porous coral capillaries',
        'Zero Formaldehyde (F☆☆☆☆), 0% Crystalline Silica, and MLIT Non-Combustible certification (Japan)',
        'Antibacterial (JIS Z 2801) & anti-mold (JIS Z 2911A) with high elasticity that resists hairline cracks',
        'Applies directly over existing wallpaper or gypsum board via roller, trowel, or sprayer with Clean Sealer',
      ],
      specs: [
        { label: 'Core Ingredients', value: 'Yonaguni fossilized coral powder, Aichi Danto stone, Eco Binder, food-grade mineral pigments' },
        { label: 'Safety Certifications', value: 'F☆☆☆☆ (JIS) · MLIT Non-Combustible Material Certified · 0% Crystalline Silica' },
        { label: 'Air & Microbial Performance', value: '98% deodorization/2h · JIS Z 2801 antibacterial · JIS Z 2911A anti-mold · 300 ions/cc' },
        { label: 'Coverage Rate (19L Pail)', value: '~25 m² by trowel (1mm thick) or ~35 m² by roller / spray gun (2 coats)' },
        { label: 'Storage & Shelf Life', value: 'Store indoors at 4°C–40°C; recommended use within 3 months of manufacture' },
        { label: 'Colors & Track Record', value: '32 natural shades · Installed in 10,000+ homes, ~100 schools, and ~40 clinics in Japan' },
      ],
    },
    ja: {
      name: 'KIRARA Cream（キララクリーム）',
      subtitle: '与那国島産化石サンゴ＆愛知県段戸石ベースの2in1自然健康クリーム壁材',
      category: '室内空気ソリューション',
      stockLabel: '#01即納 · 全32色調色対応',
      variants: ['標準缶 19L', 'レディース缶 6L', '全32色天然カラー'],
      origin: '株式会社ゲンセン（神奈川）· 沖縄県与那国島 & 愛知県段戸石',
      summary:
        '与那国島産化石サンゴと愛知県産段戸石（石英片岩）、エコバインダー、食品衛生法水準の天然顔料のみで構成された2in1健康壁材。結晶質シリカフリー・F☆☆☆☆・国土交通省「不燃認定」を取得し、一般漆喰の約2.5倍の吸放湿性能、2時間で98%の脱臭率を実現しています。',
      highlights: [
        '一般漆喰（シックイ）の約2.5倍に達する優れた調湿能力と、20年以上の機能持続実績',
        'アンモニア・タバコ臭・ペット臭・生活臭を2時間で最大98%消臭',
        '結晶質シリカフリー・F☆☆☆☆・国土交通省「不燃認定」取得の高い安全性',
        '抗菌（JIS Z 2801）・防カビ（JIS Z 2911A）準拠、クラックを抑える高弾性設計',
      ],
      specs: [
        { label: '主な原材料', value: '与那国島産化石サンゴ、愛知県産段戸石パウダー、エコバインダー、食品水準天然顔料' },
        { label: '安全・公的認定', value: 'F☆☆☆☆（JIS）、国土交通省大臣認定「不燃材料」、結晶質シリカ0%' },
        { label: '空気浄化・抗菌試験', value: '脱臭率98%/2h · 抗菌 JIS Z 2801 · 防カビ JIS Z 2911A · マイナスイオン300個/cc' },
        { label: '標準施工面積（19L）', value: 'コテ塗り 約25㎡ / ローラー・吹付 約35㎡' },
      ],
    },
  },
  'kirara-liquid': {
    en: {
      name: 'KIRARA LIQUID',
      subtitle: '100% natural ionized mineral solution for residential, office & automotive air purification',
      category: 'Indoor Air Solutions',
      stockLabel: 'In Stock · Spray Service Ready',
      variants: ['10L Commercial Tank', '700ML Bottle', '500ML Spray'],
      origin: 'Gensen Co., Ltd. · Gensen Global, Japan',
      summary:
        'A clear, colorless 100% natural aqueous solution enriched with active Calcium (Ca²⁺) and Magnesium (Mg²⁺) ions, having passed acute oral toxicity testing for complete peace of mind around infants and pets.',
      highlights: [
        'Passed acute oral toxicity testing: 100% pure natural mineral water free of alcohol or synthetic surfactants',
        'Breaks down Formaldehyde & TVOCs from engineered wood/adhesives while settling suspended PM2.5 dust',
        'Inhibits E. coli, Staphylococcus aureus, mold spores, and odor molecules on fabrics, leather, and walls',
        'Radiates 6.27-micron far-infrared waves & negative ions to ease motion sickness and support restful sleep',
      ],
      specs: [
        { label: 'Packaging Options', value: '500ML Spray · 700ML Refill Bottle · 10L Commercial Tank' },
        { label: 'Composition & Safety', value: '100% natural Ca²⁺ & Mg²⁺ mineral water (acute oral toxicity tested)' },
        { label: 'Far-Infrared Wavelength', value: '6.27 microns creating an antioxidant, fatigue-relieving microclimate' },
        { label: 'Applications', value: 'New apartments, bedrooms, nurseries, clinics, upholstery & car interiors' },
      ],
    },
    ja: {
      name: 'KIRARA LIQUID（キララリキッド）',
      subtitle: '室内・車内空気清浄のための100%天然ミネラルイオン水溶液',
      category: '室内空気ソリューション',
      stockLabel: '在庫あり・施工対応可',
      variants: ['業務用 10L缶', '700MLボトル', '500MLスプレー'],
      origin: '株式会社ゲンセン · Gensen Global（日本）',
      summary:
        '天然のカルシウムイオン（Ca²⁺）とマグネシウムイオン（Mg²⁺）のみを含有した無色透明・100%天然由来水溶液。急性経口毒性試験クリア。',
      highlights: [
        '急性経口毒性試験済み：アルコール・化学界面活性剤不使用の100%天然ミネラル水',
        'ホルムアルデヒド・TVOCを分解し、浮遊PM2.5を抑制',
        '6.27ミクロンの遠赤外線とマイナスイオンにより車酔い軽減・快眠環境をサポート',
      ],
      specs: [
        { label: '容量ラインナップ', value: '500MLスプレー · 700MLボトル · 業務用10Lタンク' },
        { label: '成分・安全性', value: '100%天然Ca²⁺・Mg²⁺ミネラル水溶液' },
        { label: '遠赤外線波長', value: '6.27ミクロン' },
      ],
    },
  },
  'gko-tay-nam-moc': {
    en: {
      name: 'G.K.O Mold & Tar Remover',
      subtitle: 'Japanese HMSS-recommended deep spore-eradicating mold & nicotine stain remover',
      category: 'Indoor Air Solutions',
      stockLabel: '112 Units In Stock (Ready to Ship)',
      variants: ['200ML Bottle', '500ML Bottle', '4L Commercial Tank'],
      origin: 'Gensen Global · Recommended by HMSS (House Mold Security System) Japan',
      summary:
        'Formulated under Japan’s House Mold Security System (HMSS) guidelines to eliminate indoor/outdoor mold down to the root spore and strip stubborn yellow tobacco tar stains with minimal chlorine odor.',
      highlights: [
        'Officially recommended in Japan’s HMSS anti-mold protocol — apply without damaging wall surfaces',
        'Penetrates tough mold cell walls to neutralize deep-seated spores and delay recurrence',
        '99.9% bactericidal efficacy against E. coli and Staphylococcus aureus',
        'Low-chlorine-odor food-grade blend, ideal prior to applying Kirara Cream',
      ],
      specs: [
        { label: 'Available Sizes', value: '200ML (270,000 VNĐ) · 500ML · 4L Commercial Tank' },
        { label: 'Recommended Standard', value: 'Japan HMSS (House Mold Security System) certified protocol' },
        { label: 'Sanitizing Rate', value: '99.9% reduction of E. coli & Staphylococcus aureus' },
      ],
    },
    ja: {
      name: 'G.K.O カビ・ヤニ除去剤',
      subtitle: '日本HMSS推奨 — カビ胞子深層除去＆タバコのヤニ汚れ徹底分解',
      category: '室内空気ソリューション',
      stockLabel: '在庫 112点（即納可）',
      variants: ['200MLボトル', '500MLボトル', '業務用 4Lタンク'],
      origin: 'Gensen Global · 日本HMSS推奨',
      summary:
        '日本の住宅防カビ対策システム「HMSS」推奨の専門処方。屋内外のカビ根絶とタバコのヤニ黄ばみ除去に対応。',
      highlights: [
        '日本HMSS公式推奨手順採用 — ゴシゴシ擦らず塗布のみで除去',
        '大腸菌・黄色ブドウ球菌を99.9%除菌',
        '低塩素臭の食品添加物水準ブレンド',
      ],
      specs: [
        { label: '容量バリエーション', value: '200ML · 500ML · 4Lタンク' },
        { label: '推奨基準', value: '日本HMSS防カビ推奨製品' },
        { label: '除菌率', value: '99.9%（大腸菌・黄色ブドウ球菌）' },
      ],
    },
  },
  'can-bang-khoang-chat-donan': {
    en: {
      name: 'Donan Mineral Balance',
      subtitle: 'Trace mineral supplementation rooted in "Air × Water × Minerals × Food = Health"',
      category: 'Health Mineral Products',
      stockLabel: '9 Boxes In Da Nang Stock',
      variants: ['120g Standard Box', '45g Travel Pack'],
      origin: 'Gensen Co., Ltd. · Direct Import from Japan',
      summary:
        'Part of Gensen Japan’s holistic health philosophy ("Air × Water × Salt/Minerals × Food = Health"), Donan replenishes essential trace minerals stripped by RO purifiers and modern diets.',
      highlights: [
        'Balanced spectrum of bioavailable natural trace minerals that dissolve effortlessly',
        'Re-mineralizes RO purified drinking water for smoother hydration',
        'Strict batch-by-batch Japanese quality control and provenance traceability',
      ],
      specs: [
        { label: 'Pack Sizes', value: '120g Family Box · 45g Compact Travel Pack' },
        { label: 'Quality Assurance', value: 'Japanese food-safety testing and lot traceability' },
        { label: 'Daily Usage', value: 'Dissolve recommended measure into drinking water, tea, or cooking' },
      ],
    },
    ja: {
      name: 'Donan ミネラルバランス',
      subtitle: '「空気×水×塩（ミネラル）×食＝健康」に基づく微量ミネラル補給',
      category: '健康ミネラル製品',
      stockLabel: 'ダナン在庫あり・日本定期輸入対応',
      variants: ['120g 標準ボックス', '45g コンパクト小袋'],
      origin: '株式会社ゲンセン · 日本正規直輸入品',
      summary:
        '「空気 × 水 × 塩（ミネラル） × 食 ＝ 健康」の理念から生まれた微量ミネラル補給製品。RO浄水や日常の食生活で不足しがちなミネラルを手軽に補給できます。',
      highlights: [
        '吸収性に優れた天然微量ミネラルをバランス良く配合',
        'RO浄水器の純水に不足しがちなミネラル分を手軽に補う',
        '日本国内での徹底した製造ロット別トレーサビリティ管理',
      ],
      specs: [
        { label: '内容量ラインナップ', value: '120g標準ボックス ／ 45g携帯用小袋' },
        { label: '品質基準', value: '日本基準の安全試験・トレーサビリティ管理' },
      ],
    },
  },
  'da-kirara': {
    en: {
      name: 'Kirara Mineral Stone (1kg)',
      subtitle: 'Japanese natural trace-mineral stone for water softening, mineral baths & odor absorption',
      category: 'Health Mineral Products',
      stockLabel: '25 Sets In Da Nang Stock',
      variants: ['1kg Standard Pack'],
      origin: 'Gensen Co., Ltd. · Natural Japanese Mineral Ore',
      summary:
        'Selected Japanese natural mineral stone rich in trace elements with steady negative-ion emission for softening drinking water, soothing mineral baths, and deodorizing enclosed spaces.',
      highlights: [
        'Naturally softens water clusters and enhances tea and coffee clarity',
        'Emits steady negative ions to freshen refrigerators, bedrooms, and closets',
        'Reusable for years with monthly clean-water rinse and sun-drying',
      ],
      specs: [
        { label: 'Net Weight', value: '1kg Standard Pack (divisible by usage zone)' },
        { label: 'Core Effects', value: 'Mild mineralization · Negative ions · Odor absorption · Water softening' },
        { label: 'Availability & Origin', value: '25 sets in Da Nang · Made in Japan' },
      ],
    },
    ja: {
      name: 'キララストーン（天然鉱石）',
      subtitle: '飲料水・入浴・空間消臭に使える日本産天然ミネラル鉱石 1kg',
      category: '健康ミネラル製品',
      stockLabel: '在庫 25点（即納可）',
      variants: ['1kg 標準パック'],
      origin: '株式会社ゲンセン · 日本産天然鉱物素材',
      summary:
        '豊富な微量元素と安定したマイナスイオン放出特性を持つ日本産天然鉱石「キララストーン」。',
      highlights: [
        '天然ミネラル溶出と水分子のまろやか化でお茶やコーヒーの風味向上',
        'マイナスイオン放出により冷蔵庫・クローゼットのこもり臭を低減',
        '月1回の水洗いと天日干しで半永久的に長持ち',
      ],
      specs: [
        { label: '内容量', value: '1kg 標準パック' },
        { label: '活用シーン', value: '飲料水ポット · バスタイム温浴 · 冷蔵庫 · 靴箱' },
      ],
    },
  },
};

function sanitizeLocaleBlock(raw: unknown) {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  const cleaned: {
    name?: string;
    subtitle?: string;
    category?: string;
    stockLabel?: string;
    origin?: string;
    summary?: string;
    variants?: string[];
    highlights?: string[];
    specs?: Array<{ label: string; value: string }>;
  } = {};

  if (typeof obj.name === 'string') cleaned.name = obj.name.trim();
  if (typeof obj.subtitle === 'string') cleaned.subtitle = obj.subtitle.trim();
  if (typeof obj.category === 'string') cleaned.category = obj.category.trim();
  if (typeof obj.stockLabel === 'string') cleaned.stockLabel = obj.stockLabel.trim();
  if (typeof obj.origin === 'string') cleaned.origin = obj.origin.trim();
  if (typeof obj.summary === 'string') cleaned.summary = obj.summary.trim();
  if (Array.isArray(obj.variants)) {
    cleaned.variants = obj.variants.map((v) => String(v).trim()).filter(Boolean);
  }
  if (Array.isArray(obj.highlights)) {
    cleaned.highlights = obj.highlights.map((h) => String(h).trim()).filter(Boolean);
  }
  if (Array.isArray(obj.specs)) {
    cleaned.specs = obj.specs
      .filter(
        (s): s is { label: string; value: string } =>
          Boolean(s && typeof s === 'object' && 'label' in s && 'value' in s)
      )
      .map((s) => ({ label: String(s.label).trim(), value: String(s.value).trim() }))
      .filter((s) => s.label && s.value);
  }
  return cleaned;
}

function sanitizeTranslations(raw: unknown) {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  const out: Record<string, NonNullable<ReturnType<typeof sanitizeLocaleBlock>>> = {};
  for (const code of ['vi', 'en', 'ja']) {
    const block = sanitizeLocaleBlock(obj[code]);
    if (block) out[code] = block;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} VNĐ`;
}

function ensureStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const seeded: StoreData = {
      ...INITIAL_STORE,
      products: INITIAL_STORE.products.map((p) => ({
        ...p,
        translations: {
          vi: {
            name: p.name,
            subtitle: p.subtitle,
            category: p.category,
            stockLabel: p.stockLabel,
            origin: p.origin,
            summary: p.summary,
            variants: p.variants,
            highlights: p.highlights,
            specs: p.specs,
          },
          ...(INITIAL_TRANSLATIONS_BY_ID[p.id] || {}),
        },
      })),
      seoSettings: INITIAL_SEO_SETTINGS,
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(seeded, null, 2), 'utf-8');
    return seeded;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    let mutated = false;
    if (!Array.isArray(parsed.products)) {
      parsed.products = INITIAL_STORE.products;
      mutated = true;
    } else {
      const LEGACY_SUBTITLES = new Set([
        'Vật liệu hoàn thiện nội thất sơn bả 2 trong 1 từ san hô hóa thạch',
        'Dung dịch phun phủ khoáng chất cải thiện chất lượng không khí',
        'Dung dịch xử lý nấm mốc tận bào tử công nghệ Nhật Bản',
        'Bổ sung và cân bằng vi khoáng tự nhiên cho sức khỏe hằng ngày',
        'Đá khoáng tự nhiên hỗ trợ thanh lọc và tạo ion âm cho nước & không gian',
      ]);
      const cleaned = parsed.products
        .filter((p) => p.id !== 'bon-rua-pancras' && p.category !== 'Trang thiết bị vệ sinh')
        .map((p) => {
          let nextProd = p;
          if (LEGACY_SUBTITLES.has(p.subtitle)) {
            const fresh = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
            if (fresh) {
              mutated = true;
              nextProd = {
                ...fresh,
                isVisible: p.isVisible !== false,
                subDetails: p.subDetails,
                stock: typeof p.stock === 'number' ? p.stock : fresh.stock,
              };
            }
          }
          const presetTrans = INITIAL_TRANSLATIONS_BY_ID[nextProd.id];
          if (!nextProd.translations || !nextProd.translations.en || !nextProd.translations.vi) {
            mutated = true;
            nextProd = {
              ...nextProd,
              translations: {
                vi: {
                  name: nextProd.name,
                  subtitle: nextProd.subtitle,
                  category: nextProd.category,
                  stockLabel: nextProd.stockLabel,
                  origin: nextProd.origin,
                  summary: nextProd.summary,
                  variants: nextProd.variants,
                  highlights: nextProd.highlights,
                  specs: nextProd.specs,
                  ...(nextProd.translations?.vi || {}),
                },
                en: {
                  ...(presetTrans?.en || {}),
                  ...(nextProd.translations?.en || {}),
                },
                ja: {
                  ...(presetTrans?.ja || {}),
                  ...(nextProd.translations?.ja || {}),
                },
              },
            };
          }
          return nextProd;
        });
      if (cleaned.length !== parsed.products.length) {
        mutated = true;
      }
      parsed.products = cleaned;
    }
    if (!Array.isArray(parsed.orders)) {
      parsed.orders = INITIAL_STORE.orders;
      mutated = true;
    }
    if (Array.isArray(parsed.consultations)) {
      parsed.consultations = parsed.consultations.map((c) => {
        if (!c.status) {
          mutated = true;
          return { ...c, status: 'Chờ liên hệ' as const, notes: c.notes || '' };
        }
        return c;
      });
    } else {
      parsed.consultations = INITIAL_STORE.consultations;
      mutated = true;
    }
    if (!Array.isArray(parsed.news)) {
      parsed.news = INITIAL_STORE.news;
      mutated = true;
    }
    if (!Array.isArray(parsed.jobs)) {
      parsed.jobs = INITIAL_STORE.jobs;
      mutated = true;
    }
    if (!Array.isArray(parsed.applications)) {
      parsed.applications = INITIAL_STORE.applications;
      mutated = true;
    }
    if (!Array.isArray(parsed.seoSettings) || parsed.seoSettings.length === 0) {
      parsed.seoSettings = INITIAL_SEO_SETTINGS;
      mutated = true;
    } else {
      const existingBySection = new Map(
        parsed.seoSettings
          .filter((item): item is SeoSectionConfig => Boolean(item && item.section))
          .map((item) => [item.section, item])
      );
      const mergedSeo: SeoSectionConfig[] = [];
      for (const sec of SEO_SECTION_ORDER) {
        const def = INITIAL_SEO_SETTINGS.find((d) => d.section === sec)!;
        const found = existingBySection.get(sec);
        if (!found) {
          mutated = true;
          mergedSeo.push(def);
        } else {
          mergedSeo.push({
            ...def,
            ...found,
            vi: { ...def.vi, ...(found.vi || {}) },
            en: { ...def.en, ...(found.en || {}) },
            ja: { ...def.ja, ...(found.ja || {}) },
          });
        }
      }
      if (mergedSeo.length !== parsed.seoSettings.length) {
        mutated = true;
      }
      parsed.seoSettings = mergedSeo;
    }
    const complete = parsed as StoreData;
    if (mutated) {
      saveStore(complete);
    }
    return complete;
  } catch {
    fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_STORE, null, 2), 'utf-8');
    return INITIAL_STORE;
  }
}

function saveStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));
  ensureStore();

  // --- Products API ---
  app.get('/api/products', (_req, res) => {
    const store = ensureStore();
    res.json(store.products);
  });

  app.post('/api/products', (req, res) => {
    const body = req.body ?? {};
    const rawName = typeof body.name === 'string' ? body.name.trim() : '';
    if (rawName.length < 2) {
      res.status(400).json({ error: 'Tên sản phẩm phải có ít nhất 2 ký tự.' });
      return;
    }

    const store = ensureStore();
    const baseSlug = rawName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueId =
      baseSlug && !store.products.some((p) => p.id === baseSlug)
        ? baseSlug
        : `${baseSlug || 'product'}-${Date.now().toString().slice(-5)}`;

    const priceVnd = Math.max(0, Number(body.priceVnd) || 0);
    const stock = Math.max(0, Number(body.stock) || 0);
    const incomingTranslations = sanitizeTranslations(body.translations);
    const created = {
      id: uniqueId,
      sku:
        typeof body.sku === 'string' && body.sku.trim()
          ? body.sku.trim()
          : `HARIAN-${Date.now().toString().slice(-4)}`,
      name: incomingTranslations?.vi?.name || rawName,
      subtitle:
        incomingTranslations?.vi?.subtitle ||
        (typeof body.subtitle === 'string' && body.subtitle.trim()
          ? body.subtitle.trim()
          : 'Giải pháp & sản phẩm chính hãng Harian Vietnam'),
      category:
        typeof body.category === 'string' && body.category.trim()
          ? body.category.trim()
          : 'Giải pháp về không khí trong nhà',
      priceVnd,
      priceLabel:
        typeof body.priceLabel === 'string' && body.priceLabel.trim()
          ? body.priceLabel.trim()
          : formatVnd(priceVnd),
      stock,
      stockLabel:
        incomingTranslations?.vi?.stockLabel ||
        (typeof body.stockLabel === 'string' && body.stockLabel.trim()
          ? body.stockLabel.trim()
          : stock > 0
          ? `Còn ${stock} sản phẩm`
          : 'Đặt hàng theo yêu cầu'),
      variants:
        incomingTranslations?.vi?.variants && incomingTranslations.vi.variants.length > 0
          ? incomingTranslations.vi.variants
          : Array.isArray(body.variants) && body.variants.length > 0
          ? body.variants.map((v: unknown) => String(v).trim()).filter(Boolean)
          : ['Tiêu chuẩn'],
      origin:
        incomingTranslations?.vi?.origin ||
        (typeof body.origin === 'string' && body.origin.trim()
          ? body.origin.trim()
          : 'Nhật Bản · Phân phối chính hãng Harian'),
      summary:
        incomingTranslations?.vi?.summary ??
        (typeof body.summary === 'string' ? body.summary.trim() : ''),
      highlights:
        incomingTranslations?.vi?.highlights ??
        (Array.isArray(body.highlights)
          ? body.highlights.map((h: unknown) => String(h).trim()).filter(Boolean)
          : []),
      specs:
        incomingTranslations?.vi?.specs ??
        (Array.isArray(body.specs)
          ? body.specs
              .filter(
                (s: unknown): s is { label: string; value: string } =>
                  Boolean(s && typeof s === 'object' && 'label' in s && 'value' in s)
              )
              .map((s: { label: string; value: string }) => ({
                label: String(s.label).trim(),
                value: String(s.value).trim(),
              }))
              .filter((s: { label: string; value: string }) => s.label && s.value)
          : []),
      imageKey:
        typeof body.imageKey === 'string' && body.imageKey.trim()
          ? body.imageKey.trim()
          : 'kirara_cream',
      featured: Boolean(body.featured),
      isVisible: body.isVisible !== false,
      translations: {
        ...incomingTranslations,
        vi: {
          name: incomingTranslations?.vi?.name || rawName,
          subtitle:
            incomingTranslations?.vi?.subtitle ||
            (typeof body.subtitle === 'string' ? body.subtitle.trim() : ''),
          origin:
            incomingTranslations?.vi?.origin ||
            (typeof body.origin === 'string' ? body.origin.trim() : ''),
          ...(incomingTranslations?.vi || {}),
        },
      },
      subDetails: Array.isArray(body.subDetails) ? body.subDetails : [],
    };

    store.products.push(created);
    saveStore(store);
    res.status(201).json(created);
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const store = ensureStore();
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      return;
    }
    const existing = store.products[idx];
    const body = req.body ?? {};
    const nextPrice =
      typeof body.priceVnd === 'number' && body.priceVnd >= 0
        ? body.priceVnd
        : existing.priceVnd;
    const nextStock =
      typeof body.stock === 'number' && body.stock >= 0 ? body.stock : existing.stock;

    const incomingTranslations = sanitizeTranslations(body.translations);
    const nextVi = incomingTranslations?.vi;

    const nextName =
      nextVi?.name ||
      (typeof body.name === 'string' && body.name.trim() ? body.name.trim() : existing.name);
    const nextSubtitle =
      nextVi?.subtitle !== undefined
        ? nextVi.subtitle
        : typeof body.subtitle === 'string'
        ? body.subtitle.trim()
        : existing.subtitle;
    const nextCategory =
      typeof body.category === 'string' && body.category.trim()
        ? body.category.trim()
        : existing.category;
    const nextStockLabel =
      nextVi?.stockLabel ||
      (typeof body.stockLabel === 'string' && body.stockLabel.trim()
        ? body.stockLabel.trim()
        : nextStock > 0
        ? `Còn ${nextStock} sản phẩm`
        : 'Đặt hàng theo yêu cầu');
    const nextVariants =
      nextVi?.variants !== undefined
        ? nextVi.variants
        : Array.isArray(body.variants)
        ? body.variants.map((v: unknown) => String(v).trim()).filter(Boolean)
        : existing.variants;
    const nextOrigin =
      nextVi?.origin !== undefined
        ? nextVi.origin
        : typeof body.origin === 'string'
        ? body.origin.trim()
        : existing.origin;
    const nextSummary =
      nextVi?.summary !== undefined
        ? nextVi.summary
        : typeof body.summary === 'string'
        ? body.summary.trim()
        : existing.summary;
    const nextHighlights =
      nextVi?.highlights !== undefined
        ? nextVi.highlights
        : Array.isArray(body.highlights)
        ? body.highlights.map((h: unknown) => String(h).trim()).filter(Boolean)
        : existing.highlights;
    const nextSpecs =
      nextVi?.specs !== undefined
        ? nextVi.specs
        : Array.isArray(body.specs)
        ? body.specs
            .filter(
              (s: unknown): s is { label: string; value: string } =>
                Boolean(s && typeof s === 'object' && 'label' in s && 'value' in s)
            )
            .map((s: { label: string; value: string }) => ({
              label: String(s.label).trim(),
              value: String(s.value).trim(),
            }))
            .filter((s: { label: string; value: string }) => s.label && s.value)
        : existing.specs;

    const mergedTranslations = {
      ...(existing.translations || {}),
      ...(incomingTranslations || {}),
      vi: {
        ...(existing.translations?.vi || {}),
        ...(nextVi || {}),
        name: nextName,
        subtitle: nextSubtitle,
        category: nextVi?.category || nextCategory,
        stockLabel: nextStockLabel,
        variants: nextVariants,
        origin: nextOrigin,
        summary: nextSummary,
        highlights: nextHighlights,
        specs: nextSpecs,
      },
    };

    const updated = {
      ...existing,
      sku: typeof body.sku === 'string' && body.sku.trim() ? body.sku.trim() : existing.sku,
      name: nextName,
      subtitle: nextSubtitle,
      category: nextCategory,
      priceVnd: nextPrice,
      priceLabel:
        typeof body.priceLabel === 'string' && body.priceLabel.trim() && body.priceVnd === undefined
          ? body.priceLabel.trim()
          : formatVnd(nextPrice),
      stock: nextStock,
      stockLabel: nextStockLabel,
      variants: nextVariants,
      origin: nextOrigin,
      summary: nextSummary,
      highlights: nextHighlights,
      specs: nextSpecs,
      imageKey:
        typeof body.imageKey === 'string' && body.imageKey.trim()
          ? body.imageKey.trim()
          : existing.imageKey,
      featured: typeof body.featured === 'boolean' ? body.featured : existing.featured,
      isVisible: typeof body.isVisible === 'boolean' ? body.isVisible : existing.isVisible !== false,
      translations: mergedTranslations,
      subDetails: Array.isArray(body.subDetails) ? body.subDetails : existing.subDetails,
    };
    store.products[idx] = updated;
    saveStore(store);
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const store = ensureStore();
    const next = store.products.filter((p) => p.id !== id);
    if (next.length === store.products.length) {
      res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      return;
    }
    store.products = next;
    saveStore(store);
    res.json({ deleted: true, id });
  });

  // --- Sales & Orders API ---
  app.get('/api/orders', (_req, res) => {
    const store = ensureStore();
    const sorted = [...store.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(sorted);
  });

  app.post('/api/orders', (req, res) => {
    const {
      productId,
      variant,
      quantity,
      customerName,
      companyName,
      email,
      phone,
      shippingAddress,
      note,
    } = req.body ?? {};

    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      res.status(400).json({ error: 'Vui lòng nhập họ tên người đặt hàng.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Địa chỉ email không hợp lệ.' });
      return;
    }
    const phoneDigits = String(phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 13) {
      res.status(400).json({ error: 'Số điện thoại cần có 9–13 chữ số.' });
      return;
    }
    if (!shippingAddress || typeof shippingAddress !== 'string' || shippingAddress.trim().length < 5) {
      res.status(400).json({ error: 'Vui lòng nhập địa chỉ nhận hàng.' });
      return;
    }

    const store = ensureStore();
    const product = store.products.find((p) => p.id === productId);
    if (!product) {
      res.status(404).json({ error: 'Không tìm thấy sản phẩm được chọn.' });
      return;
    }

    const qty = Math.max(1, Math.min(999, Number(quantity) || 1));
    const code = `DH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const order = {
      id: `ord-${Date.now()}`,
      code,
      productId: product.id,
      productName: product.name,
      variant: String(variant || product.variants[0] || 'Tiêu chuẩn').trim(),
      quantity: qty,
      unitPriceVnd: product.priceVnd,
      totalVnd: product.priceVnd * qty,
      customerName: customerName.trim(),
      companyName: String(companyName || 'Khách hàng cá nhân').trim(),
      email: email.trim(),
      phone: String(phone).trim(),
      shippingAddress: shippingAddress.trim(),
      note: String(note || '').trim(),
      status: 'Chờ xác nhận' as const,
      createdAt: new Date().toISOString(),
    };

    store.orders.unshift(order);
    saveStore(store);
    res.status(201).json(order);
  });

  app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body ?? {};
    const allowed = ['Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Hoàn tất', 'Đã hủy'];
    if (!allowed.includes(status)) {
      res.status(400).json({ error: 'Trạng thái đơn hàng không hợp lệ.' });
      return;
    }
    const store = ensureStore();
    const idx = store.orders.findIndex((o) => o.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
      return;
    }
    store.orders[idx].status = status;
    saveStore(store);
    res.json(store.orders[idx]);
  });

  // --- News CMS API ---
  app.get('/api/news', (_req, res) => {
    const store = ensureStore();
    const sorted = [...store.news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    res.json(sorted);
  });

  app.post('/api/news', (req, res) => {
    const { title, category, summary, content, author, publishedAt, status, imageKey } = req.body ?? {};
    if (!title || typeof title !== 'string' || title.trim().length < 4) {
      res.status(400).json({ error: 'Tiêu đề bài viết phải có ít nhất 4 ký tự.' });
      return;
    }
    if (!summary || typeof summary !== 'string' || summary.trim().length < 10) {
      res.status(400).json({ error: 'Tóm tắt bài viết phải có ít nhất 10 ký tự.' });
      return;
    }
    if (!content || typeof content !== 'string' || content.trim().length < 20) {
      res.status(400).json({ error: 'Nội dung chi tiết bài viết phải có ít nhất 20 ký tự.' });
      return;
    }

    const store = ensureStore();
    const newArticle = {
      id: `news-${Date.now()}`,
      title: title.trim(),
      category: category || 'Sự kiện',
      summary: summary.trim(),
      content: content.trim(),
      author: (author || 'Ban Biên tập Harian').trim(),
      publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
      status: status === 'draft' ? 'draft' : 'published',
      imageKey: imageKey || 'consulting',
    } as StoreData['news'][number];

    store.news.unshift(newArticle);
    saveStore(store);
    res.status(201).json(newArticle);
  });

  app.put('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const store = ensureStore();
    const idx = store.news.findIndex((item) => item.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy bài viết.' });
      return;
    }

    const existing = store.news[idx];
    const body = req.body ?? {};
    const updated = {
      ...existing,
      title: typeof body.title === 'string' && body.title.trim() ? body.title.trim() : existing.title,
      category: body.category || existing.category,
      summary: typeof body.summary === 'string' && body.summary.trim() ? body.summary.trim() : existing.summary,
      content: typeof body.content === 'string' && body.content.trim() ? body.content.trim() : existing.content,
      author: typeof body.author === 'string' && body.author.trim() ? body.author.trim() : existing.author,
      publishedAt: body.publishedAt || existing.publishedAt,
      status: body.status === 'draft' || body.status === 'published' ? body.status : existing.status,
      imageKey: body.imageKey || existing.imageKey,
    };

    store.news[idx] = updated;
    saveStore(store);
    res.json(updated);
  });

  app.delete('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const store = ensureStore();
    const nextNews = store.news.filter((item) => item.id !== id);
    if (nextNews.length === store.news.length) {
      res.status(404).json({ error: 'Không tìm thấy bài viết để xóa.' });
      return;
    }
    store.news = nextNews;
    saveStore(store);
    res.json({ deleted: true, id });
  });

  // --- Recruitment Jobs & Applications API ---
  app.get('/api/jobs', (_req, res) => {
    const store = ensureStore();
    res.json(store.jobs);
  });

  app.post('/api/jobs', (req, res) => {
    const {
      title,
      department,
      location,
      employmentType,
      salaryRange,
      deadline,
      summary,
      responsibilities,
      requirements,
      benefits,
      isOpen,
    } = req.body ?? {};
    if (!title || typeof title !== 'string' || title.trim().length < 4) {
      res.status(400).json({ error: 'Vui lòng nhập tên vị trí tuyển dụng.' });
      return;
    }
    const store = ensureStore();
    const job = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      department: String(department || 'Kỹ thuật & Vận hành').trim(),
      location: String(location || 'Đà Nẵng').trim(),
      employmentType: String(employmentType || 'Toàn thời gian').trim(),
      salaryRange: String(salaryRange || 'Thỏa thuận theo năng lực').trim(),
      deadline: String(deadline || '2026-12-31').trim(),
      summary: String(summary || '').trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      isOpen: isOpen !== false,
    };
    store.jobs.unshift(job);
    saveStore(store);
    res.status(201).json(job);
  });

  app.put('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const store = ensureStore();
    const idx = store.jobs.findIndex((j) => j.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy vị trí tuyển dụng.' });
      return;
    }
    const existing = store.jobs[idx];
    const body = req.body ?? {};
    store.jobs[idx] = {
      ...existing,
      title: typeof body.title === 'string' && body.title.trim() ? body.title.trim() : existing.title,
      department: body.department ?? existing.department,
      location: body.location ?? existing.location,
      employmentType: body.employmentType ?? existing.employmentType,
      salaryRange: body.salaryRange ?? existing.salaryRange,
      deadline: body.deadline ?? existing.deadline,
      summary: body.summary ?? existing.summary,
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities
        : existing.responsibilities,
      requirements: Array.isArray(body.requirements) ? body.requirements : existing.requirements,
      benefits: Array.isArray(body.benefits) ? body.benefits : existing.benefits,
      isOpen: typeof body.isOpen === 'boolean' ? body.isOpen : existing.isOpen,
    };
    saveStore(store);
    res.json(store.jobs[idx]);
  });

  app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const store = ensureStore();
    const next = store.jobs.filter((j) => j.id !== id);
    if (next.length === store.jobs.length) {
      res.status(404).json({ error: 'Không tìm thấy vị trí.' });
      return;
    }
    store.jobs = next;
    saveStore(store);
    res.json({ deleted: true, id });
  });

  app.get('/api/applications', (_req, res) => {
    const store = ensureStore();
    const sorted = [...store.applications].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    res.json(sorted);
  });

  app.post('/api/applications', (req, res) => {
    const {
      jobId,
      jobTitle,
      fullName,
      email,
      phone,
      experienceYears,
      languageLevel,
      portfolioUrl,
      resumeName,
      resumeSummary,
      coverLetter,
    } = req.body ?? {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      res.status(400).json({ error: 'Vui lòng nhập đầy đủ họ và tên.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Địa chỉ email không hợp lệ.' });
      return;
    }
    const phoneDigits = String(phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 13) {
      res.status(400).json({ error: 'Số điện thoại cần có 9–13 chữ số.' });
      return;
    }
    if (!jobTitle) {
      res.status(400).json({ error: 'Vui lòng chọn vị trí ứng tuyển.' });
      return;
    }
    if (!coverLetter || typeof coverLetter !== 'string' || coverLetter.trim().length < 15) {
      res.status(400).json({ error: 'Thư giới thiệu cần có ít nhất 15 ký tự.' });
      return;
    }

    const store = ensureStore();
    const code = `HR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const application = {
      id: `app-${Date.now()}`,
      code,
      jobId: jobId || 'general',
      jobTitle: String(jobTitle).trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: String(phone).trim(),
      experienceYears: String(experienceYears || 'Chưa có kinh nghiệm').trim(),
      languageLevel: String(languageLevel || 'Tiếng Việt').trim(),
      portfolioUrl: String(portfolioUrl || '').trim(),
      resumeName: String(resumeName || 'Ho_so_truc_tuyen.pdf').trim(),
      resumeSummary: String(resumeSummary || '').trim(),
      coverLetter: coverLetter.trim(),
      status: 'Mới tiếp nhận' as const,
      submittedAt: new Date().toISOString(),
    };

    store.applications.unshift(application);
    saveStore(store);
    res.status(201).json(application);
  });

  app.patch('/api/applications/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body ?? {};
    const allowed = ['Mới tiếp nhận', 'Đang phỏng vấn', 'Đạt yêu cầu', 'Lưu hồ sơ'];
    if (!allowed.includes(status)) {
      res.status(400).json({ error: 'Trạng thái hồ sơ không hợp lệ.' });
      return;
    }
    const store = ensureStore();
    const idx = store.applications.findIndex((a) => a.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ ứng tuyển.' });
      return;
    }
    store.applications[idx].status = status;
    saveStore(store);
    res.json(store.applications[idx]);
  });

  // --- Consultations & Contacts API ---
  app.get('/api/consultations', (_req, res) => {
    const store = ensureStore();
    const sorted = [...store.consultations].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    res.json(sorted);
  });

  app.post('/api/consultations', (req, res) => {
    const { fullName, companyName, email, phone, serviceType, productInterest, preferredDate, message } = req.body ?? {};
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      res.status(400).json({ error: 'Vui lòng nhập họ và tên liên hệ.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Email liên hệ không hợp lệ.' });
      return;
    }
    const phoneDigits = String(phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 13) {
      res.status(400).json({ error: 'Số điện thoại liên hệ không hợp lệ.' });
      return;
    }

    const store = ensureStore();
    const code = `TV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const consultation = {
      id: `cons-${Date.now()}`,
      code,
      fullName: fullName.trim(),
      companyName: String(companyName || 'Khách hàng cá nhân').trim(),
      email: email.trim(),
      phone: String(phone).trim(),
      serviceType: String(serviceType || 'Tư vấn Doanh nghiệp Toàn diện').trim(),
      productInterest: String(productInterest || 'Không chọn sản phẩm cụ thể').trim(),
      preferredDate: String(preferredDate || '').trim(),
      message: String(message || '').trim(),
      status: 'Chờ liên hệ' as const,
      notes: '',
      submittedAt: new Date().toISOString(),
    };

    store.consultations.unshift(consultation);
    saveStore(store);
    res.status(201).json(consultation);
  });

  app.patch('/api/consultations/:id', (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body ?? {};
    const allowed = ['Chờ liên hệ', 'Đã lên lịch', 'Hoàn thành'];
    const store = ensureStore();
    const idx = store.consultations.findIndex((c) => c.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Không tìm thấy yêu cầu liên hệ.' });
      return;
    }
    if (status && allowed.includes(status)) {
      store.consultations[idx].status = status;
    }
    if (typeof notes === 'string') {
      store.consultations[idx].notes = notes;
    }
    saveStore(store);
    res.json(store.consultations[idx]);
  });

  // --- SEO Manager API ---
  app.get('/api/seo', (_req, res) => {
    const store = ensureStore();
    res.json(store.seoSettings);
  });

  app.put('/api/seo/:section', (req, res) => {
    const section = req.params.section as SeoSectionKey;
    if (!SEO_SECTION_ORDER.includes(section)) {
      res.status(404).json({ error: 'Không tìm thấy phân mục SEO.' });
      return;
    }
    const body = req.body ?? {};
    const store = ensureStore();
    const idx = store.seoSettings.findIndex((s) => s.section === section);
    const fallback = INITIAL_SEO_SETTINGS.find((s) => s.section === section)!;
    const existing = idx >= 0 ? store.seoSettings[idx] : fallback;

    const sanitizeLang = (
      raw: unknown,
      base: SeoSectionConfig['vi']
    ): SeoSectionConfig['vi'] => {
      if (!raw || typeof raw !== 'object') return base;
      const obj = raw as Record<string, unknown>;
      return {
        title: typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim() : base.title,
        metaDescription:
          typeof obj.metaDescription === 'string'
            ? obj.metaDescription.trim()
            : base.metaDescription,
        ogTitle:
          typeof obj.ogTitle === 'string' && obj.ogTitle.trim()
            ? obj.ogTitle.trim()
            : typeof obj.title === 'string' && obj.title.trim()
            ? obj.title.trim()
            : base.ogTitle,
        ogDescription:
          typeof obj.ogDescription === 'string' && obj.ogDescription.trim()
            ? obj.ogDescription.trim()
            : typeof obj.metaDescription === 'string'
            ? obj.metaDescription.trim()
            : base.ogDescription,
      };
    };

    const allowedOgTypes = ['website', 'article', 'product'] as const;
    const allowedRobots = ['index, follow', 'noindex, follow', 'noindex, nofollow'] as const;
    const allowedCards = ['summary_large_image', 'summary'] as const;

    const nextConfig: SeoSectionConfig = {
      ...existing,
      ogType: allowedOgTypes.includes(body.ogType) ? body.ogType : existing.ogType,
      ogImage:
        typeof body.ogImage === 'string' && body.ogImage.trim()
          ? body.ogImage.trim()
          : existing.ogImage,
      ogSiteName:
        typeof body.ogSiteName === 'string' && body.ogSiteName.trim()
          ? body.ogSiteName.trim()
          : existing.ogSiteName,
      twitterCard: allowedCards.includes(body.twitterCard)
        ? body.twitterCard
        : existing.twitterCard,
      canonicalPath:
        typeof body.canonicalPath === 'string' && body.canonicalPath.trim()
          ? body.canonicalPath.trim()
          : existing.canonicalPath,
      robots: allowedRobots.includes(body.robots) ? body.robots : existing.robots,
      keywords: typeof body.keywords === 'string' ? body.keywords.trim() : existing.keywords,
      vi: sanitizeLang(body.vi, existing.vi),
      en: sanitizeLang(body.en, existing.en),
      ja: sanitizeLang(body.ja, existing.ja),
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      store.seoSettings[idx] = nextConfig;
    } else {
      store.seoSettings.push(nextConfig);
    }
    saveStore(store);
    res.json(nextConfig);
  });

  app.post('/api/seo/:section/reset', (req, res) => {
    const section = req.params.section as SeoSectionKey;
    const def = INITIAL_SEO_SETTINGS.find((s) => s.section === section);
    if (!def) {
      res.status(404).json({ error: 'Không tìm thấy phân mục SEO.' });
      return;
    }
    const store = ensureStore();
    const resetEntry: SeoSectionConfig = {
      ...def,
      updatedAt: new Date().toISOString(),
    };
    const idx = store.seoSettings.findIndex((s) => s.section === section);
    if (idx >= 0) {
      store.seoSettings[idx] = resetEntry;
    } else {
      store.seoSettings.push(resetEntry);
    }
    saveStore(store);
    res.json(resetEntry);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Harian server running at http://localhost:${PORT}`);
  });
}

startServer();
