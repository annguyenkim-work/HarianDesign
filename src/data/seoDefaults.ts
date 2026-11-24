import { AppLanguage, SeoSectionConfig, SeoSectionKey } from '../types';
import { withBase } from '../utils/assetUrl';

export const SEO_SECTION_ORDER: SeoSectionKey[] = [
  'home',
  'services',
  'products',
  'news',
  'careers',
  'contact',
];

export const SEO_SECTION_LABELS: Record<
  SeoSectionKey,
  Record<AppLanguage, { label: string; routeHint: string; description: string }>
> = {
  home: {
    vi: {
      label: 'Trang chủ & Tổng quan',
      routeHint: '/',
      description: 'Thẻ tiêu đề, mô tả và Open Graph mặc định khi chia sẻ trang chủ Harian.',
    },
    en: {
      label: 'Home & Overview',
      routeHint: '/',
      description: 'Default page title, meta description, and social share card for the homepage.',
    },
    ja: {
      label: 'トップページ全般',
      routeHint: '/',
      description: 'Harianトップページのタイトル・メタ説明・SNSシェア設定。',
    },
  },
  services: {
    vi: {
      label: 'Dịch vụ & Tư vấn',
      routeHint: '/#dich-vu',
      description: 'Tối ưu tìm kiếm cho tư vấn FDI Nhật – Việt, bất động sản, kiến trúc và thi công Kirara.',
    },
    en: {
      label: 'Advisory & Services',
      routeHint: '/#dich-vu',
      description: 'SEO metadata for Japan–Vietnam corporate consulting, real estate, and Kirara coating.',
    },
    ja: {
      label: '事業内容・コンサルティング',
      routeHint: '/#dich-vu',
      description: '日越企業進出支援、不動産投資、建築内装・キララ施工サービスのSEO設定。',
    },
  },
  products: {
    vi: {
      label: 'Sản phẩm Kirara',
      routeHint: '/#san-pham',
      description: 'Danh mục vật liệu khoáng chất tự nhiên Kirara Cream, Liquid, G.K.O, Donan & Đá Kirara.',
    },
    en: {
      label: 'Kirara Products',
      routeHint: '/#san-pham',
      description: 'Catalog metadata for Kirara Cream, Kirara Liquid, G.K.O, Donan & Mineral Stone.',
    },
    ja: {
      label: '製品ラインナップ',
      routeHint: '/#san-pham',
      description: 'キララクリーム、キララリキッド、G.K.O、Donan、天然鉱石カタログのSEO設定。',
    },
  },
  news: {
    vi: {
      label: 'Tin tức & Sự kiện',
      routeHint: '/#tin-tuc',
      description: 'Thông cáo hợp tác Vietbuild, Yoshino Gypsum, Gensen Global và tin thị trường.',
    },
    en: {
      label: 'News & Updates',
      routeHint: '/#tin-tuc',
      description: 'Press releases on Vietbuild Da Nang, Yoshino Gypsum talks, and Gensen Global news.',
    },
    ja: {
      label: 'ニュース・活動報告',
      routeHint: '/#tin-tuc',
      description: 'Vietbuild展示会出展、吉野石膏との協議、市場開発ニュースのSEO設定。',
    },
  },
  careers: {
    vi: {
      label: 'Tuyển dụng',
      routeHint: '/#tuyen-dung',
      description: 'Cổng tuyển dụng nhân sự kỹ thuật Wall Artist, hành chính nhân sự và tư vấn song ngữ.',
    },
    en: {
      label: 'Careers & Hiring',
      routeHint: '/#tuyen-dung',
      description: 'Job board metadata for Wall Artist technicians, HR executive, and FDI consultants.',
    },
    ja: {
      label: '採用情報・求人',
      routeHint: '/#tuyen-dung',
      description: '技術スタッフ、総務人事、日越企業コンサルタント採用ページのSEO設定。',
    },
  },
  contact: {
    vi: {
      label: 'Liên hệ & Đặt lịch',
      routeHint: '/#lien-he',
      description: 'Trang đặt lịch khảo sát không khí, báo giá sản phẩm và thông tin văn phòng Đà Nẵng.',
    },
    en: {
      label: 'Contact & Booking',
      routeHint: '/#lien-he',
      description: 'Consultation booking, Da Nang office address, and direct hotline metadata.',
    },
    ja: {
      label: 'お問い合わせ・相談予約',
      routeHint: '/#lien-he',
      description: 'ダナン本社連絡先・お見積り・現地調査予約セクションのSEO設定。',
    },
  },
};

export const SEO_IMAGE_PRESETS: Array<{
  path: string;
  labelVi: string;
  labelEn: string;
  labelJa: string;
}> = [
  {
    path: withBase('/src/assets/images/hero_mineral_living_1794973824082.jpg'),
    labelVi: 'Không gian sống khoáng chất Kirara (Hero)',
    labelEn: 'Kirara Mineral Living Space (Hero)',
    labelJa: 'キララ自然鉱物リビング空間 (メイン)',
  },
  {
    path: withBase('/src/assets/images/consulting_architecture_1794973825429.jpg'),
    labelVi: 'Tư vấn doanh nghiệp & Kiến trúc tối giản',
    labelEn: 'Corporate & Minimalist Architecture Advisory',
    labelJa: '企業コンサルティング・ミニマル建築',
  },
  {
    path: withBase('/src/assets/images/product_kirara_cream_1794973824722.jpg'),
    labelVi: 'Sản phẩm sơn bả khoáng chất KIRARA Cream',
    labelEn: 'KIRARA Cream Natural Wall Material',
    labelJa: 'KIRARA Cream 自然健康壁材',
  },
  {
    path: withBase('/src/assets/images/product_kirara_liquid_1794973825163.jpg'),
    labelVi: 'Dung dịch khoáng chất KIRARA Liquid & G.K.O',
    labelEn: 'KIRARA Liquid & G.K.O Air Care',
    labelJa: 'KIRARA Liquid・G.K.O ミネラル溶液',
  },
  {
    path: withBase('/src/assets/images/product_stone_bathroom_1794973826284.jpg'),
    labelVi: 'Đá khoáng tự nhiên Kirara Stone',
    labelEn: 'Kirara Natural Mineral Stone',
    labelJa: 'キララストーン 天然鉱石',
  },
];

export const INITIAL_SEO_SETTINGS: SeoSectionConfig[] = [
  {
    section: 'home',
    ogType: 'website',
    ogImage: withBase('/src/assets/images/hero_mineral_living_1794973824082.jpg'),
    ogSiteName: 'Harian Corporation Vietnam',
    twitterCard: 'summary_large_image',
    canonicalPath: '/',
    robots: 'index, follow',
    keywords: 'Harian Vietnam, Kirara Cream, Kirara Liquid, tư vấn doanh nghiệp Nhật Việt, vật liệu khoáng chất tự nhiên',
    vi: {
      title: 'Harian Vietnam — Giải pháp Không khí Kirara & Tư vấn',
      metaDescription:
        'Harian Corporation Vietnam cung cấp tư vấn doanh nghiệp Nhật – Việt và vật liệu khoáng chất tự nhiên Kirara giúp thanh lọc không khí bền vững.',
      ogTitle: 'Harian Vietnam — Giải pháp Không khí Kirara & Tư vấn Doanh nghiệp',
      ogDescription:
        'Khám phá dịch vụ tư vấn doanh nghiệp FDI Nhật – Việt và giải pháp tường khoáng chất Kirara khử mùi 98%, an toàn chuẩn F☆☆☆☆.',
    },
    en: {
      title: 'Harian Vietnam — Kirara Air Solutions & Advisory',
      metaDescription:
        'Harian Corporation Vietnam delivers Japan–Vietnam corporate consulting and natural Kirara mineral wall solutions for cleaner indoor environments.',
      ogTitle: 'Harian Vietnam — Kirara Mineral Air Solutions & Corporate Advisory',
      ogDescription:
        'Explore bilateral FDI business consulting, green architecture, and 100% natural Japanese Kirara mineral air purification products.',
    },
    ja: {
      title: 'Harian Vietnam — キララ空気環境＆日越企業コンサルティング',
      metaDescription:
        'Harian Corporationはベトナムにおける日系企業進出コンサルティングと日本発の天然鉱物壁材キララをトータルで提供します。',
      ogTitle: 'Harian Vietnam — 自然鉱物塗材キララ & 日越企業コンサルティング',
      ogDescription:
        '与那国島産化石サンゴ壁材キララクリームと日越バイリンガル経営・不動産コンサルティングの公式サイトです。',
    },
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    section: 'services',
    ogType: 'website',
    ogImage: withBase('/src/assets/images/consulting_architecture_1794973825429.jpg'),
    ogSiteName: 'Harian Corporation Vietnam',
    twitterCard: 'summary_large_image',
    canonicalPath: '/#dich-vu',
    robots: 'index, follow',
    keywords: 'tư vấn doanh nghiệp FDI, tư vấn bất động sản Đà Nẵng, thiết kế kiến trúc Nhật Bản, phun phủ Kirara',
    vi: {
      title: 'Dịch vụ Tư vấn Doanh nghiệp & Thi công Kirara | Harian',
      metaDescription:
        'Tư vấn thành lập FDI Nhật – Việt, bất động sản công nghiệp, thiết kế kiến trúc tối giản và dịch vụ phun phủ khoáng chất Kirara chuẩn Nhật.',
      ogTitle: 'Dịch vụ Tư vấn Doanh nghiệp & Giải pháp Kỹ thuật Harian',
      ogDescription:
        'Đồng hành cùng doanh nghiệp Nhật – Việt từ chiến lược pháp lý, thuế kế toán đến kiến tạo không gian sống xanh sạch.',
    },
    en: {
      title: 'Corporate Advisory & Kirara Coating Services | Harian',
      metaDescription:
        'Bilingual Japan–Vietnam FDI consulting, commercial real estate due diligence, minimalist interior design, and certified Kirara mineral coating.',
      ogTitle: 'Corporate Consulting & Technical Air Solutions — Harian Vietnam',
      ogDescription:
        'End-to-end Japan–Vietnam business advisory and Japanese-standard Wall Artist indoor air remediation services.',
    },
    ja: {
      title: '事業内容・日越コンサルティング＆キララ施工 | Harian',
      metaDescription:
        'ベトナム進出支援・会計税務・不動産投資・建築内装監理からキララ天然鉱物コーティング施工まで一貫サポートします。',
      ogTitle: 'Harian 事業内容 — 日越企業コンサルティング & 技術施工',
      ogDescription: '日越バイリンガル専門家と認定ウォールアーティストによる高品質な企業支援・施工サービス。',
    },
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    section: 'products',
    ogType: 'product',
    ogImage: withBase('/src/assets/images/product_kirara_cream_1794973824722.jpg'),
    ogSiteName: 'Harian Corporation Vietnam',
    twitterCard: 'summary_large_image',
    canonicalPath: '/#san-pham',
    robots: 'index, follow',
    keywords: 'KIRARA Cream, KIRARA Liquid, GKO tẩy nấm mốc, Donan khoáng chất, Đá Kirara Nhật Bản',
    vi: {
      title: 'Sản phẩm Khoáng chất Kirara Chính hãng Nhật Bản | Harian',
      metaDescription:
        'Danh mục chính hãng Gensen Nhật Bản: KIRARA Cream san hô hóa thạch 32 màu, KIRARA Liquid, G.K.O tẩy nấm mốc, Donan và Đá khoáng Kirara.',
      ogTitle: 'Hệ sinh thái Sản phẩm Khoáng chất Kirara — Gensen Japan',
      ogDescription:
        'Vật liệu hoàn thiện tường không Formaldehyde, dung dịch khử TVOC và khoáng chất tự nhiên nhập khẩu chính ngạch từ Nhật Bản.',
    },
    en: {
      title: 'Authentic Japanese Kirara Mineral Products | Harian',
      metaDescription:
        'Explore Gensen Japan products: 32-shade KIRARA Cream coral wall finish, KIRARA Liquid mist, G.K.O mold remover, Donan & Mineral Stone.',
      ogTitle: 'Kirara Natural Mineral Product Catalog — Gensen Japan',
      ogDescription:
        'F☆☆☆☆ zero-VOC mineral interior wall finishes and 100% natural air & water health products distributed by Harian Vietnam.',
    },
    ja: {
      title: 'キララ製品ラインナップ（ゲンセン日本正規品）| Harian',
      metaDescription:
        '与那国島化石サンゴ壁材キララクリーム全32色、キララリキッド、HMSS推奨防カビ剤G.K.O、Donanミネラルバランスをご紹介。',
      ogTitle: 'Gensen Japan キララ自然鉱物製品カタログ — Harian公式',
      ogDescription: '不燃認定・F☆☆☆☆取得の安心壁材と天然ミネラルイオン製品をダナン在庫よりお届けします。',
    },
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    section: 'news',
    ogType: 'article',
    ogImage: withBase('/src/assets/images/consulting_architecture_1794973825429.jpg'),
    ogSiteName: 'Harian Corporation Vietnam',
    twitterCard: 'summary_large_image',
    canonicalPath: '/#tin-tuc',
    robots: 'index, follow',
    keywords: 'tin tức Harian, Vietbuild Đà Nẵng, Yoshino Gypsum, Gensen Global, công nghệ Kirara',
    vi: {
      title: 'Tin tức & Sự kiện Hợp tác Nhật - Việt | Harian Vietnam',
      metaDescription:
        'Cập nhật hoạt động triển lãm Vietbuild Đà Nẵng, hợp tác chiến lược cùng Yoshino Gypsum, Gensen Global và tin thị trường vật liệu xanh.',
      ogTitle: 'Tin tức & Hoạt động Hợp tác Quốc tế — Harian Corporation',
      ogDescription:
        'Theo dõi các sự kiện triển lãm kiến trúc, chuyển giao công nghệ Wall Artist và dự án không gian sạch tại Việt Nam.',
    },
    en: {
      title: 'News, Exhibitions & Japan–Vietnam Alliances | Harian',
      metaDescription:
        'Read updates on Vietbuild Da Nang exhibitions, strategic talks with Yoshino Gypsum Group, and Kirara clean-air market expansion.',
      ogTitle: 'Harian Newsroom — Exhibitions & Strategic Partnerships',
      ogDescription:
        'Latest announcements from Harian Corporation and Gensen Global across Da Nang and Ho Chi Minh City.',
    },
    ja: {
      title: 'ニュース・展示会＆日越提携レポート | Harian Vietnam',
      metaDescription:
        'VIETBUILDダナン出展報告、吉野石膏グループとの協議、ホーチミン市への展開などHarianの最新ニュースをお届けします。',
      ogTitle: 'Harian ニュースルーム — 活動報告・パートナーシップ',
      ogDescription: 'ベトナム国内での展示会出展や日系建材メーカーとの協業情報をご覧いただけます。',
    },
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    section: 'careers',
    ogType: 'website',
    ogImage: withBase('/src/assets/images/hero_mineral_living_1794973824082.jpg'),
    ogSiteName: 'Harian Corporation Vietnam',
    twitterCard: 'summary_large_image',
    canonicalPath: '/#tuyen-dung',
    robots: 'index, follow',
    keywords: 'tuyển dụng Harian Đà Nẵng, việc làm tiếng Nhật Đà Nẵng, kỹ thuật viên Wall Artist, tư vấn đầu tư',
    vi: {
      title: 'Tuyển dụng Nhân sự & Kỹ thuật Viên Kirara | Harian',
      metaDescription:
        'Gia nhập Harian Corporation tại Đà Nẵng & TP.HCM: vị trí Kỹ thuật thi công Kirara, Hành chính Nhân sự và Chuyên viên Tư vấn Doanh nghiệp.',
      ogTitle: 'Cơ hội Nghề nghiệp tại Harian Corporation Vietnam',
      ogDescription:
        'Môi trường làm việc chuẩn Nhật, cơ hội đào tạo chứng nhận Wall Artist cùng chuyên gia Gensen Global và lộ trình phát triển rõ ràng.',
    },
    en: {
      title: 'Careers & Open Roles in Da Nang & HCMC | Harian Vietnam',
      metaDescription:
        'Join Harian Corporation Vietnam: hiring Kirara Technical Specialists, HR & Admin Executives, and Japan–Vietnam Investment Consultants.',
      ogTitle: 'Build Your Career at Harian Corporation Vietnam',
      ogDescription:
        'Apply online for engineering, bilingual advisory, and corporate operations roles with Japanese-standard training.',
    },
    ja: {
      title: '採用情報・求人募集（ダナン / ホーチミン）| Harian',
      metaDescription:
        'Harian Corporationではキララ施工技術者、総務人事スタッフ、日越企業コンサルタントを積極採用中です。オンライン応募可。',
      ogTitle: 'Harian Corporation 採用情報 — 日越の架け橋となる人材を募集',
      ogDescription: 'ウォールアーティスト研修制度や日系基準の透明性の高い評価体制をご用意しています。',
    },
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    section: 'contact',
    ogType: 'website',
    ogImage: withBase('/src/assets/images/consulting_architecture_1794973825429.jpg'),
    ogSiteName: 'Harian Corporation Vietnam',
    twitterCard: 'summary_large_image',
    canonicalPath: '/#lien-he',
    robots: 'index, follow',
    keywords: 'liên hệ Harian, đặt lịch tư vấn Đà Nẵng, báo giá Kirara Cream, hotline 0982113488',
    vi: {
      title: 'Liên hệ & Đặt lịch Tư vấn Doanh nghiệp | Harian Vietnam',
      metaDescription:
        'Liên hệ văn phòng Harian Corporation tại 83 Võ Chí Công, Đà Nẵng hoặc đặt lịch khảo sát chất lượng không khí & tư vấn FDI trực tuyến.',
      ogTitle: 'Liên hệ Tư vấn & Báo giá Nhanh — Harian Corporation',
      ogDescription:
        'Hotline 0982 113 488 · Email hariancorp.vn@gmail.com. Đội ngũ chuyên gia Việt – Nhật phản hồi trong ngày làm việc.',
    },
    en: {
      title: 'Contact Us & Book a Consultation | Harian Vietnam',
      metaDescription:
        'Reach Harian Corporation in Da Nang (83 Vo Chi Cong St.) to schedule an FDI corporate consultation, product quote, or indoor air survey.',
      ogTitle: 'Contact Harian Corporation — Da Nang Headquarters',
      ogDescription:
        'Call +84 982 113 488 or book online for bilingual advisory and authentic Kirara product distribution across Vietnam.',
    },
    ja: {
      title: 'お問い合わせ・ご相談予約窓口 | Harian Vietnam',
      metaDescription:
        'ダナン本社（83 Vo Chi Cong）への企業進出相談、現地空気質調査、キララ製品のお見積りはお気軽にご予約ください。',
      ogTitle: 'Harian Corporation お問い合わせ・オンライン予約',
      ogDescription: '日越バイリンガル担当者が1営業日以内に迅速にご連絡いたします。',
    },
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
];
