import { ProductItem, ProductSubDetail, ProductSubDetailLocale } from '../types';

function makeInquiryTile(
  productNameVi: string,
  productNameJa: string,
  imageKey: ProductSubDetail['imageKey'],
  productNameEn?: string
): ProductSubDetail {
  const enName = productNameEn || productNameVi;
  return {
    slug: 'inquiry',
    imageKey,
    kind: 'inquiry',
    vi: {
      cardTitle: 'Liên hệ tư vấn',
      pageTitle: `Liên hệ tư vấn — ${productNameVi}`,
      eyebrow: 'Tư vấn kỹ thuật & Báo giá dự án',
      lead: `Đặt lịch trao đổi trực tiếp với đội ngũ kỹ thuật Harian Vietnam về mẫu thử, định mức thi công và giải pháp phù hợp cho ${productNameVi}.`,
      sections: [
        {
          heading: 'Hỗ trợ kỹ thuật tận công trình & văn phòng',
          body: 'Đội ngũ kỹ sư Harian tại Đà Nẵng sẵn sàng khảo sát thực tế bề mặt tường, đo kiểm độ ẩm không khí và đề xuất phương án tối ưu chi phí theo từng hạng mục.',
          bullets: [
            'Gửi mẫu màu thực tế và tài liệu kiểm định Nhật Bản miễn phí',
            'Lập dự toán khối lượng chi tiết theo bản vẽ mặt bằng hoặc m² thực tế',
            'Tư vấn kết hợp cùng chuyên gia nội thất & kiến trúc Nhật – Việt',
          ],
        },
      ],
      metrics: [
        { value: '< 4h', label: 'Phản hồi yêu cầu tư vấn trong giờ làm việc' },
        { value: '100%', label: 'Hàng nhập khẩu chính ngạch Nhật Bản' },
        { value: '0982 113 488', label: 'Hotline kỹ thuật & báo giá trực tiếp' },
      ],
    },
    en: {
      cardTitle: 'Inquiry',
      pageTitle: `Technical Inquiry — ${enName}`,
      eyebrow: 'Technical Advisory & Project Quote',
      lead: `Schedule a consultation with Harian Vietnam engineers regarding material samples, coverage estimates, and deployment for ${enName}.`,
      sections: [
        {
          heading: 'On-Site & Corporate Technical Support',
          body: 'Our Da Nang engineering team conducts on-site substrate inspection, air humidity checks, and tailored cost estimation for residential and commercial spaces.',
          bullets: [
            'Complimentary physical color swatches and Japanese lab test dossiers',
            'Accurate quantity take-off from architectural drawings or m² measurements',
            'Integrated consulting with Japan–Vietnam interior & architecture specialists',
          ],
        },
      ],
      metrics: [
        { value: '< 4h', label: 'Business-hours consultation response time' },
        { value: '100%', label: 'Direct Japanese authorized import' },
        { value: '0982 113 488', label: 'Direct technical & quotation hotline' },
      ],
    },
    ja: {
      cardTitle: 'お問合せ',
      pageTitle: `お問合せ — ${productNameJa}`,
      eyebrow: '技術相談・お見積り依頼',
      lead: `${productNameJa}の導入検討、サンプル請求、施工単価や技術仕様に関するご相談を日本語・ベトナム語で承ります。`,
      sections: [
        {
          heading: '現地調査・導入プランのご提案',
          body: 'ダナン拠点のHarianエンジニアチームが、下地確認や空気環境の診断を行い、建物の用途に最適な施工仕様とお見積りをご提示します。',
          bullets: [
            '日本試験機関データおよび実物カラーサンプルの無償提供',
            '図面・面積に応じた正確な必要数量・概算費用の算出',
            '日系・ベトナム企業向け建築・内装コンサルティングとの連携対応',
          ],
        },
      ],
      metrics: [
        { value: '4時間以内', label: '営業時間内のお問合せ初回回答目安' },
        { value: '100%', label: '日本メーカー正規直輸入品' },
        { value: '0982 113 488', label: '日本語・ベトナム語対応窓口' },
      ],
    },
  };
}

function makeOnlineShopTile(
  productNameVi: string,
  productNameJa: string,
  priceLabel: string,
  imageKey: ProductSubDetail['imageKey'],
  productNameEn?: string
): ProductSubDetail {
  const enName = productNameEn || productNameVi;
  return {
    slug: 'online-shop',
    imageKey,
    kind: 'order',
    vi: {
      cardTitle: 'Đặt hàng trực tuyến',
      pageTitle: `Đặt hàng trực tuyến — ${productNameVi}`,
      eyebrow: 'Cửa hàng chính hãng Harian Vietnam',
      lead: `Đặt mua trực tiếp ${productNameVi} với đơn giá tham khảo ${priceLabel}. Đơn hàng được ghi nhận vào hệ thống quản trị kho & xuất hóa đơn VAT theo yêu cầu.`,
      sections: [
        {
          heading: 'Quy trình giao nhận & thanh toán minh bạch',
          body: 'Các mã sản phẩm có sẵn tại kho Đà Nẵng được xuất giao trong 24–48 giờ. Đối với sản phẩm pha màu theo yêu cầu (như 32 màu Kirara Cream), thời gian chuẩn bị và bàn giao được thông báo rõ ngay khi xác nhận đơn.',
          bullets: [
            'Hỗ trợ xuất hóa đơn VAT doanh nghiệp và chứng từ CO/CQ đầy đủ',
            'Chiết khấu thương mại dành cho kiến trúc sư, nhà thầu và đối tác Wall Artist',
            'Hướng dẫn bảo quản và tài liệu kỹ thuật đi kèm mỗi kiện hàng',
          ],
        },
      ],
      metrics: [
        { value: priceLabel, label: 'Đơn giá niêm yết tham khảo' },
        { value: '24–48h', label: 'Giao hàng nhanh tại Đà Nẵng & toàn quốc' },
        { value: 'VAT', label: 'Hỗ trợ xuất hóa đơn & chứng từ dự án' },
      ],
    },
    en: {
      cardTitle: 'Online Shop',
      pageTitle: `Online Order — ${enName}`,
      eyebrow: 'Official Harian Vietnam Store',
      lead: `Order authentic ${enName} online at reference price ${priceLabel}. Orders sync directly with Harian warehouse management and support corporate VAT invoicing.`,
      sections: [
        {
          heading: 'Transparent Delivery & Corporate Billing',
          body: 'In-stock items at our Da Nang warehouse ship within 24–48 hours. Custom-tinted shades (such as the 32 Kirara Cream shades) include clear production and delivery scheduling upon confirmation.',
          bullets: [
            'Corporate VAT invoicing and full CO/CQ provenance documentation',
            'Trade pricing for architects, contractors, and certified Wall Artists',
            'Storage temperature guide and technical manual included with every shipment',
          ],
        },
      ],
      metrics: [
        { value: priceLabel, label: 'Listed reference price' },
        { value: '24–48h', label: 'Fast dispatch from Da Nang nationwide' },
        { value: 'VAT', label: 'Corporate invoicing & project documentation' },
      ],
    },
    ja: {
      cardTitle: 'オンラインショップ',
      pageTitle: `オンライン注文 — ${productNameJa}`,
      eyebrow: 'Harian 公式オンラインストア',
      lead: `${productNameJa}（標準参考価格：${priceLabel}）をオンラインで直接ご注文いただけます。受注管理システムに即時登録され、法人向けVATインボイス発行にも対応しています。`,
      sections: [
        {
          heading: '納期・法人請求・パートナー割引について',
          body: 'ダナン倉庫在庫品は24〜48時間以内に出荷いたします。全32色オーダー品については、確定後すぐに生産・輸入スケジュールをご案内します。',
          bullets: [
            'レッドインボイス（VAT請求書）および原産地・品質証明書の添付対応',
            '認定ウォールアーティスト・設計事務所・施工会社様向けの特別卸価格',
            '施工マニュアルおよび保管温度ガイドを同梱発送',
          ],
        },
      ],
      metrics: [
        { value: priceLabel, label: '標準参考単価' },
        { value: '24–48h', label: '在庫品の最短出荷リードタイム' },
        { value: 'VAT', label: '法人請求書・プロジェクト書類対応' },
      ],
    },
  };
}

export const PRODUCT_SUB_DETAILS: Record<string, ProductSubDetail[]> = {
  'kirara-cream': [
    makeInquiryTile('KIRARA Cream', 'KIRARA Cream', 'consulting'),
    makeOnlineShopTile('KIRARA Cream', 'KIRARA Cream', '5.852.000 VNĐ', 'kirara_cream'),
    {
      slug: 'who-is-kirara',
      imageKey: 'kirara_cream',
      kind: 'editorial',
      vi: {
        cardTitle: 'Kirara là gì?',
        pageTitle: 'Kirara là gì? Triết lý vật liệu khoáng chất từ Nhật Bản',
        eyebrow: '03 · Tổng quan sản phẩm',
        lead: 'KIRARA là vật liệu hoàn thiện tường nội thất dạng kem gốc tự nhiên 2 trong 1 (vừa là lớp bả tạo nền, vừa là lớp sơn hoàn thiện), giúp chuyển hóa không gian kín thành bầu không khí trong lành như rừng nguyên sinh.',
        sections: [
          {
            heading: 'Sự kết hợp của san hô hóa thạch Yonaguni & đá Danto Aichi',
            body: 'Khác với sơn nước công nghiệp chứa nhựa tổng hợp và dung môi VOC tạo màng bít kín bề mặt tường, Kirara Cream sử dụng san hô hóa thạch nghìn năm từ đảo Yonaguni (Okinawa) kết hợp cùng bột đá Danto tự nhiên vùng Aichi và chất kết dính sinh học Eco Binder.',
            bullets: [
              'Cấu trúc vi lỗ rỗng tự nhiên giúp bức tường "thở" liên tục 24/7 — hút và nhả ẩm nhanh gấp ~2,5 lần vữa vôi Shikkui truyền thống',
              '0% Silic tinh thể (Crystalline Silica) & 0% VOC — đạt cấp phát thải F☆☆☆☆ và chuẩn Vật liệu không cháy MLIT Nhật Bản',
              'Sắc tố khoáng và chất tạo màu đạt chuẩn an toàn thực phẩm Nhật Bản, độ đàn hồi cao giúp hạn chế nứt chân chim',
              'Bền vững bán vĩnh viễn trên 20 năm mà không mất chức năng khử mùi hay điều ẩm',
            ],
          },
          {
            heading: 'Vượt xa một loại vật liệu sơn tường thông thường',
            body: 'Trong bối cảnh hội chứng nhà mới (Sick House Syndrome) do keo dán gỗ, sơn hóa học và điều hòa kín ngày càng phổ biến, Kirara kiến tạo lớp phủ tường chủ động hấp thụ và phân hủy khí độc, biến mỗi căn phòng thành không gian nghỉ dưỡng đúng nghĩa.',
          },
        ],
        metrics: [
          { value: '~2,5×', label: 'Hiệu suất hút & nhả ẩm so với vữa vôi Shikkui truyền thống' },
          { value: '10.000+', label: 'Nhà ở dân dụng & công trình y tế – giáo dục tại Nhật đã dùng' },
          { value: '32 màu', label: 'Bảng màu khoáng tự nhiên chuẩn nội thất Nhật Bản' },
        ],
      },
      ja: {
        cardTitle: 'キララとは？',
        pageTitle: 'キララとは？天然鉱物クリーム壁材の正体',
        eyebrow: '03 · 製品概要',
        lead: '「キララ（KIRARA）」は、沖縄・与那国島の化石サンゴと愛知県産段戸石をベースにした、下塗り不要・ひと塗りで仕上がる日本発の天然健康クリーム壁材です。',
        sections: [
          {
            heading: '与那国島化石サンゴ × 愛知産段戸石の結晶構造',
            body: '化学樹脂で壁面を塞ぐ一般的なビニールクロスや合成塗料とは異なり、キララは微細な多孔質構造を維持したまま硬化します。発がん性リスクが指摘される「結晶質シリカ」を一切含まず、食品レベルの天然顔料とエコバインダーのみで構成されています。',
            bullets: [
              '一般漆喰（シックイ）の約2.5倍に相当する優れた吸放湿性能と、20年以上の機能持続実績',
              '結晶質シリカフリー・F☆☆☆☆認定・国土交通省不燃認定で施工者も居住者も安心',
              '弾力性に優れたクリーム設計により、経年による微細なひび割れ（クラック）を抑制',
              '和室にも洋室にも馴染む32色の天然カラーバリエーション',
            ],
          },
          {
            heading: 'シックハウス対策からウェルネス空間創造へ',
            body: '気密性の高い現代建築で問題となるVOCや生活臭を壁面全体で吸着・分解し、マイナスイオンと遠赤外線に包まれた森林浴のような室内環境を実現します。',
          },
        ],
        metrics: [
          { value: '約2.5倍', label: '一般漆喰（シックイ）比の吸放湿レスポンス能力' },
          { value: '10,000+', label: '日本国内の累計施工住宅・施設実績' },
          { value: '32色', label: '自然鉱物由来の標準カラー展開' },
        ],
      },
    },
    {
      slug: 'easy-installation',
      imageKey: 'consulting',
      kind: 'editorial',
      vi: {
        cardTitle: 'Thi công dễ dàng & hiệu quả kinh tế',
        pageTitle: 'Thi công dễ dàng & Hiệu quả kinh tế dài hạn',
        eyebrow: '04 · Quy trình thi công & Tối ưu chi phí',
        lead: 'Dạng kem trộn sẵn đóng thùng tiêu chuẩn 19L và 6L: mở nắp là có thể lăn rulo, phun máy hoặc trét bay ngay, rút ngắn một nửa thời gian thi công so với trét vữa đất tảo cát truyền thống.',
        sections: [
          {
            heading: 'Tương thích đa dạng bề mặt — thậm chí phủ trực tiếp lên giấy dán tường cũ',
            body: 'Với các dự án cải tạo căn hộ, văn phòng hoặc nhà hàng, Kirara không yêu cầu bóc bỏ toàn bộ lớp giấy dán tường hay sơn cũ còn bám chắc. Chỉ cần vệ sinh bề mặt và lăn sơn lót Clean Sealer là có thể hoàn thiện trực tiếp.',
            bullets: [
              'Định mức 19L: khoảng 25 m² bằng bay trét (~1mm) hoặc 35 m² bằng con lăn / máy phun (2 lớp)',
              'Không tạo bụi công trình khi khuấy trộn, thi công sạch sẽ ngay cả trong nhà đang ở',
              'Dễ dàng dặm vá cục bộ nếu có vết bẩn hoặc va quệt về sau mà không lộ vết nối',
              'Tuổi thọ chức năng trên 20 năm — chi phí vòng đời thấp hơn nhiều lần việc thay giấy dán tường định kỳ 5–7 năm',
            ],
          },
        ],
        metrics: [
          { value: '35 m²', label: 'Diện tích phủ 1 thùng 19L bằng con lăn / phun (2 lớp)' },
          { value: '25 m²', label: 'Diện tích phủ 1 thùng 19L bằng bay trét thủ công' },
          { value: '> 20 năm', label: 'Độ bền chức năng không cần thay mới định kỳ' },
        ],
        comparisonHeaders: ['Hạng mục so sánh', 'KIRARA Cream', 'Giấy dán tường / Sơn công nghiệp'],
        comparisonRows: [
          { label: 'Chuẩn bị vật tư', primaryValue: 'Dạng kem pha sẵn, mở nắp dùng ngay', secondaryValue: 'Phải pha bột hoặc keo nhiều lớp' },
          { label: 'Cải tạo tường cũ', primaryValue: 'Phủ trực tiếp lên nền sạch (với Clean Sealer)', secondaryValue: 'Tốn chi phí bóc bỏ và xử lý rác thải' },
          { label: 'Bảo trì & sửa chữa', primaryValue: 'Dặm vá nhanh tại điểm hỏng', secondaryValue: 'Thường phải bóc thay cả mảng tường' },
          { label: 'Chi phí vòng đời 15 năm', primaryValue: '1 lần đầu tư, không mất phí thay mới', secondaryValue: 'Thay mới 2–3 lần do bong tróc, ố vàng' },
        ],
      },
      ja: {
        cardTitle: '簡単施工と高い経済性',
        pageTitle: '簡単施工と高い経済性 — DIYから大規模改修まで',
        eyebrow: '04 · 施工性・コストパフォーマンス',
        lead: '練り済みのペースト状でお届けするため、フタを開けてすぐローラー・吹付け・コテで施工可能。既存壁紙の上からも直接施工でき、廃材と工期を大幅に削減します。',
        sections: [
          {
            heading: 'ビニールクロスの上から直接塗れるリフォーム革命',
            body: '従来の珪藻土や漆喰は下地処理と粉体攪拌に熟練技術が必要でしたが、キララは専用シーラー（クリーンシーラー）処理を行うことで既存クロスや石膏ボードに素早く定着します。',
            bullets: [
              '19L缶の施工面積目安：ローラー・吹付け2回塗りで約35㎡、コテ塗り（1mm厚）で約25㎡',
              '攪拌時の粉塵がゼロ。営業中の店舗や居住中の住宅でもクリーンに施工可能',
              '部分的な汚れやキズも、同色のキララを上から少量補修するだけで目立たず修復',
              '5〜7年ごとのクロス張り替え不要。20年以上の長期ライフサイクルで圧倒的な経済性',
            ],
          },
        ],
        metrics: [
          { value: '約35㎡', label: '19L缶（ローラー・吹付け2回塗り）標準施工面積' },
          { value: '約25㎡', label: '19L缶（コテ塗り1mm厚）標準施工面積' },
          { value: '20年以上', label: '張り替え不要の長期機能持続実績' },
        ],
        comparisonHeaders: ['比較項目', 'キララ クリーム', '一般ビニールクロス'],
        comparisonRows: [
          { label: '施工準備', primaryValue: '練り済み缶を開封して即施工', secondaryValue: '糊付け・裁断・養生の手間' },
          { label: 'リフォーム対応', primaryValue: '既存クロスの上から施工可（廃材ゼロ）', secondaryValue: '剥がし作業・産業廃棄物費用が発生' },
          { label: '部分補修', primaryValue: '少量のタッチアップでシームレス補修', secondaryValue: '一面ごとの貼り替えが必要' },
          { label: '長期コスト', primaryValue: '半永久持続によりランニングコスト極小', secondaryValue: '5〜10年周期での全面更新コスト' },
        ],
      },
    },
    {
      slug: 'safety',
      imageKey: 'hero_living',
      kind: 'editorial',
      vi: {
        cardTitle: 'Độ an toàn của Kirara',
        pageTitle: 'Độ an toàn tuyệt đối — Chứng nhận F☆☆☆☆ & Chống cháy Bộ Đất đai Nhật Bản',
        eyebrow: '05 · Kiểm định an toàn sức khỏe',
        lead: 'An toàn đến mức trẻ nhỏ và thợ thi công có thể chạm tay trần trực tiếp trong quá trình sơn mà không lo kích ứng da hay hít phải hơi độc.',
        sections: [
          {
            heading: 'Không Formaldehyde · Không VOC · Không Silic tinh thể',
            body: 'KIRARA đạt cấp độ phát thải an toàn cao nhất F☆☆☆☆ tại Nhật Bản và chứng nhận Vật liệu không cháy (不燃認定) của Bộ Đất đai, Hạ tầng, Giao thông và Du lịch Nhật Bản (MLIT). Toàn bộ bảng màu sử dụng sắc tố khoáng tự nhiên và chất tạo màu chuẩn thực phẩm.',
            bullets: [
              'Không chứa Formaldehyde, Toluene, Xylene hay hóa chất diệt nấm tổng hợp độc hại',
              'Chứng nhận vật liệu không cháy của Bộ trưởng Bộ Đất đai & Giao thông Nhật Bản',
              'Không sinh khói độc hay khí độc hại ngay cả khi tiếp xúc nguồn nhiệt cao',
              'Đã kiểm chứng tại gần 100 trường mầm non và 40 phòng khám nhi – nha khoa tại Nhật',
            ],
          },
        ],
        metrics: [
          { value: 'F☆☆☆☆', label: 'Cấp độ an toàn phát thải cao nhất theo chuẩn JIS' },
          { value: '0%', label: 'Hàm lượng Silic tinh thể (Crystalline Silica)' },
          { value: '140+', label: 'Cơ sở mầm non, trường học & phòng khám tại Nhật tin dùng' },
        ],
      },
      ja: {
        cardTitle: 'キララの安全性',
        pageTitle: 'キララの安全性 — F☆☆☆☆・国土交通省「不燃認定」取得',
        eyebrow: '05 · 安全性・公的認定',
        lead: '素手で触れても安全、小さな子どもが過ごす空間にもためらいなく使える。キララは原材料の選定から公的認定取得まで徹底した安全基準を満たしています。',
        sections: [
          {
            heading: '「不燃認定」と最高等級「F☆☆☆☆」を両立した天然処方',
            body: '国土交通省大臣認定「不燃認定」を取得しており、万一の火災時にも燃え広がらず有毒ガスを発生しません。さらに食品衛生法レベルの天然着色料のみを使用し、ホルムアルデヒドなどの揮発性有機化合物を排出したしません。',
            bullets: [
              'ホルムアルデヒド放散等級 最高ランク F☆☆☆☆ 取得',
              '国土交通省大臣認定「不燃材料」として商業施設・高層建築にも対応',
              '結晶質シリカ・重金属・有機溶剤を一切含まない安心の無添加設計',
              '保育園・幼稚園（約100件）や歯科・小児科クリニック（約40件）で採用実績多数',
            ],
          },
        ],
        metrics: [
          { value: 'F☆☆☆☆', label: 'JIS基準 ホルムアルデヒド放散最高安全等級' },
          { value: '不燃認定', label: '国土交通省大臣認定取得済' },
          { value: '0%', label: '結晶質シリカ・有害VOC含有率' },
        ],
      },
    },
    {
      slug: 'deodorizing-purification',
      imageKey: 'kirara_liquid',
      kind: 'editorial',
      vi: {
        cardTitle: 'Khử mùi & làm sạch không khí',
        pageTitle: 'Chức năng khử mùi & Thanh lọc không khí liên tục',
        eyebrow: '06 · Công nghệ lọc khí thụ động',
        lead: 'Loại bỏ tới 98% mùi Amoniac, thuốc lá, mùi thức ăn và mùi thú cưng chỉ trong vòng 2 giờ nhờ cấu trúc vi khoáng san hô xốp và cơ chế trung hòa ion âm.',
        sections: [
          {
            heading: 'Phân hủy mùi hôi & ức chế vi khuẩn, nấm mốc theo chuẩn JIS',
            body: 'Thay vì dùng hương liệu che lấp mùi như xịt phòng thông thường, bề mặt Kirara hấp thụ phân tử khí gây mùi vào hàng triệu khoang vi mô của san hô hóa thạch và phân hủy chúng thành phân tử vô hại.',
            bullets: [
              'Khử mùi Amoniac (NH₃), Hydro Sunfua (H₂S), Trimethylamine & khói thuốc hiệu suất tới 98%/2 giờ',
              'Kháng khuẩn đạt chuẩn JIS Z 2801 và kháng nấm mốc đạt chuẩn JIS Z 2911A',
              'Mật độ ion âm đạt ~300 ion/cc — cao gấp ~10 lần môi trường văn phòng điều hòa thông thường',
              'Giảm thiểu triệu chứng dị ứng bụi mịn, viêm mũi dị ứng và hội chứng nhà mới',
            ],
          },
        ],
        metrics: [
          { value: '98%', label: 'Tỷ lệ khử mùi đặc hiệu kiểm nghiệm trong 2 giờ' },
          { value: '300 /cc', label: 'Mật độ ion âm tạo bầu không khí tươi mát như thác nước' },
          { value: 'JIS Z 2801', label: 'Tiêu chuẩn kháng khuẩn & kháng nấm mốc (JIS Z 2911A)' },
        ],
      },
      ja: {
        cardTitle: '脱臭・空気浄化機能',
        pageTitle: '脱臭・空気浄化機能 — 2時間で悪臭を最大98%低減',
        eyebrow: '06 · 脱臭・空気清浄メカニズム',
        lead: '芳香剤で香りを被せるのではなく、アンモニア・タバコ・ペット臭・VOCガスを壁面の微細孔が吸着し、無害化・分解し続けます。',
        sections: [
          {
            heading: 'JIS規格に基づく高い抗菌・防カビ・マイナスイオン発生性能',
            body: '化石サンゴと段戸石が持つ超微細な多孔質構造が空気中の悪臭分子や有害物質を捉え、光や温度変化と連動しながら浄化サイクルを回し続けます。',
            bullets: [
              'アンモニア等の生活悪臭を2時間で最大98%削減（第三者試験データ）',
              '抗菌試験 JIS Z 2801 準拠 ／ 防カビ試験 JIS Z 2911A 準拠',
              '一般オフィス環境の約10倍にあたる約300個/ccのマイナスイオンを測定',
              '飲食店・クリニック・ペット共生住宅などニオイ対策が必須の空間に最適',
            ],
          },
        ],
        metrics: [
          { value: '98%低減', label: '2時間以内のアンモニア・悪臭除去率' },
          { value: '約300個/cc', label: '室内マイナスイオン発生量（一般環境の約10倍）' },
          { value: 'JIS準拠', label: 'JIS Z 2801抗菌・JIS Z 2911A防カビ性能' },
        ],
      },
    },
    {
      slug: 'temperature-control',
      imageKey: 'hero_living',
      kind: 'editorial',
      vi: {
        cardTitle: 'Chức năng điều hòa nhiệt độ',
        pageTitle: 'Chức năng điều hòa nhiệt độ & Phát tia hồng ngoại xa',
        eyebrow: '07 · Vi khí hậu & Tiết kiệm năng lượng',
        lead: 'Lớp khoáng chất Kirara hoạt động như lớp đệm nhiệt tự nhiên: giúp giảm cảm giác oi bức mùa hè, giữ ấm dịu nhẹ mùa lạnh và tăng hiệu suất điều hòa không khí.',
        sections: [
          {
            heading: 'Hiệu ứng nhiệt bức xạ hồng ngoại xa dịu nhẹ cho cơ thể',
            body: 'Khoáng chất đá Danto kết hợp san hô hóa thạch giúp giảm dẫn truyền nhiệt đột ngột qua bề mặt tường và phát tán tia hồng ngoại xa bước sóng tự nhiên. Nhờ vậy, không khí trong phòng lưu thông nhiệt độ đồng đều hơn giữa trần và sàn.',
            bullets: [
              'Giảm hiện tượng "lạnh chân – nóng đầu" thường gặp khi bật điều hòa liên tục',
              'Hỗ trợ giảm tải cho máy lạnh và máy sưởi, góp phần tiết kiệm điện năng vận hành hàng tháng',
              'Bề mặt tường không bị đổ mồ hôi hay lạnh buốt khi chạm vào vào mùa nồm ẩm',
            ],
          },
        ],
        metrics: [
          { value: '6–14 μm', label: 'Vùng bước sóng hồng ngoại xa tương thích cơ thể người' },
          { value: 'Ổn định', label: 'Giảm chênh lệch nhiệt độ giữa sàn và trần nhà' },
          { value: 'Tiết kiệm', label: 'Giảm tải công suất điều hòa không khí trong nhà' },
        ],
      },
      ja: {
        cardTitle: 'キララの調温機能',
        pageTitle: 'キララの調温機能 — 遠赤外線と蓄熱・断熱バランス',
        eyebrow: '07 · 温熱環境と省エネ効果',
        lead: '天然鉱物とサンゴ層の空気層が熱伝導を緩やかにし、夏は涼しく冬は底冷えしにくい快適な温熱環境とエアコン効率の向上をもたらします。',
        sections: [
          {
            heading: '遠赤外線放射によるやわらかな体感温度の安定化',
            body: '石質成分から放射される遠赤外線と壁表面の微細な空気層により、室温の急激な上下変動を抑え、部屋全体の温度ムラを軽減します。',
            bullets: [
              '暖房時の足元の冷えや、冷房時の冷えすぎによる不快感を緩和',
              '空調負荷を抑えることで、住宅・オフィスのランニングコスト削減に寄与',
              '壁表面の結露・冷輻射を抑え、冬場のヒートショック対策にも有効',
            ],
          },
        ],
        metrics: [
          { value: '遠赤外線', label: '鉱物成分由来の穏やかな輻射熱効果' },
          { value: '省エネ', label: '冷暖房エアコンの運転効率サポート' },
          { value: '結露抑制', label: '壁面温度差の緩和による冷輻射低減' },
        ],
      },
    },
    {
      slug: 'humidity-control',
      imageKey: 'bathroom',
      kind: 'editorial',
      vi: {
        cardTitle: 'Chức năng cân bằng độ ẩm',
        pageTitle: 'Chức năng cân bằng độ ẩm tự nhiên — Chống nồm ẩm & Ngừa khô hanh',
        eyebrow: '08 · Kiểm soát độ ẩm chủ động',
        lead: 'Tự động hút ẩm khi độ ẩm không khí tăng cao vào mùa mưa nồm tại Việt Nam và nhả ẩm nhẹ nhàng khi phòng bật điều hòa khô hanh, duy trì vùng độ ẩm lý tưởng 40%–60%.',
        sections: [
          {
            heading: 'Cơ chế hít thở độ ẩm gấp ~2,5 lần vữa vôi truyền thống',
            body: 'Độ ẩm trên 70% là môi trường lý tưởng cho nấm mốc và mạt bụi phát triển, trong khi dưới 40% lại dễ gây khô niêm mạc hô hấp và tăng nguy cơ virus lây lan. Cấu trúc mao quản san hô tự nhiên của Kirara cho tốc độ hút – nhả ẩm đạt khoảng 2,5 lần so với vữa vôi Shikkui truyền thống mà hoàn toàn không dùng điện.',
            bullets: [
              'Ngăn chặn hiện tượng đọng sương, chảy nước trên mặt tường trong mùa nồm ẩm miền Bắc & ven biển miền Trung',
              'Không sử dụng điện năng, không phát sinh tiếng ồn và không cần vệ sinh khay nước như máy hút ẩm',
              'Bảo vệ đồ gỗ nội thất, tủ quần áo, nhạc cụ, sách vở và thiết bị điện tử khỏi hư hại do ẩm mốc',
            ],
          },
        ],
        metrics: [
          { value: '~2,5×', label: 'Hiệu suất điều hòa ẩm so với vữa vôi Shikkui truyền thống' },
          { value: '40–60%', label: 'Ngưỡng độ ẩm tối ưu bảo vệ hệ hô hấp & ngăn nấm mốc' },
          { value: '0 W', label: 'Vận hành hoàn toàn tự nhiên, không tiêu thụ điện năng' },
        ],
      },
      ja: {
        cardTitle: 'キララの調湿機能',
        pageTitle: 'キララの調湿機能 — 一般漆喰の約2.5倍の吸放湿力で40〜60%をキープ',
        eyebrow: '08 · 自律調湿メカニズム',
        lead: '湿気が多い梅雨や雨季には余分な水分を吸収し、エアコン暖房で乾燥する時期には蓄えた水分を放出。カビ・ダニと乾燥ウイルスの両方を同時に遠ざけます。',
        sections: [
          {
            heading: '一般漆喰（シックイ）の約2.5倍に達する自然調湿フィルター',
            body: '相対湿度70%以上でカビ・ダニが急増し、40%以下でウイルス感染リスクが高まるとされています。キララは一般的な漆喰の約2.5倍の吸放湿能力を備え、無数の微細孔がスポンジのように呼吸して室内を快適域へ導きます。',
            bullets: [
              '窓周りや北側壁面の結露・黒カビ発生を根本から抑制',
              '電気代ゼロ・メンテナンスフリーで除湿機や加湿器の負荷を軽減',
              '木製家具や収納スペース、楽器・書籍の湿気ダメージ予防にも最適',
            ],
          },
        ],
        metrics: [
          { value: '約2.5倍', label: '一般的な漆喰（シックイ）と比較した吸放湿能力' },
          { value: '40〜60%', label: '理想とされる快適・健康な室内湿度帯' },
          { value: '電力0W', label: '自然呼吸による完全パッシブ調湿' },
        ],
      },
    },
    {
      slug: 'training-events',
      imageKey: 'consulting',
      kind: 'editorial',
      vi: {
        cardTitle: 'Đào tạo & Sự kiện Kirara',
        pageTitle: 'Đào tạo Wall Artist & Sự kiện Workshop trải nghiệm',
        eyebrow: '09 · Chương trình đối tác & Huấn luyện',
        lead: 'Khóa huấn luyện kỹ thuật thực hành trở thành nghệ nhân thi công Wall Artist chính thức, mở quyền tiếp cận chính sách giá đối tác và chứng nhận kỹ năng chuẩn Nhật Bản.',
        sections: [
          {
            heading: 'Trở thành đối tác thi công Wall Artist tại Việt Nam',
            body: 'Harian Vietnam định kỳ tổ chức các buổi workshop trải nghiệm thực tế và khóa đào tạo chuyên sâu cho nhà thầu, kiến trúc sư, thợ sơn chuyên nghiệp và chủ doanh nghiệp muốn cung cấp giải pháp không khí sạch Kirara.',
            bullets: [
              'Thực hành trực tiếp 3 kỹ thuật: Bay trét tạo vân nghệ thuật, con lăn nhanh và súng phun áp lực',
              'Hướng dẫn xử lý bề mặt nền cũ, pha phối 32 sắc thái màu và lập dự toán công trình',
              'Cấp chứng nhận Wall Artist cùng ưu đãi đơn giá thương mại dành riêng cho học viên tốt nghiệp',
              'Đồng hành tổ chức hội thảo kiến trúc xanh cho doanh nghiệp Nhật – Việt tại Đà Nẵng & toàn quốc',
            ],
          },
        ],
        metrics: [
          { value: '1 ngày', label: 'Thời lượng khóa đào tạo thực hành tiêu chuẩn' },
          { value: '3 kỹ thuật', label: 'Trét bay nghệ thuật · Con lăn · Phun phủ chuyên dụng' },
          { value: 'Partner', label: 'Áp dụng bảng giá ưu đãi dành riêng cho Wall Artist' },
        ],
      },
      ja: {
        cardTitle: 'キララの研修・イベント',
        pageTitle: 'ウォールアーティスト研修・体験ワークショップのご案内',
        eyebrow: '09 · 認定研修・イベント',
        lead: '施工技術と製品知識を習得する「ウォールアーティスト（Wall Artist）認定研修」を定期開催。修了された施工店様・設計事務所様にはパートナー特別価格が適用されます。',
        sections: [
          {
            heading: '実践中心の施工カリキュラムとパートナー制度',
            body: '初めてキララを取り扱う職人様や内装会社様でも短時間で美しい仕上がりを実現できるよう、コテ・ローラー・ガン吹付けの実技から下地判定・見積作成まで体系的に学べます。',
            bullets: [
              '3種類の仕上げ実技：フラット塗り、パターン付け、ローラー／吹付け工法',
              '既存クロスやコンクリートなど下地別のクリーンシーラー選定方法',
              '認定証の発行およびパートナー卸売価格・技術サポート窓口の提供',
              'ダナンショールームでの一般向け塗り壁体験ワークショップも随時開催',
            ],
          },
        ],
        metrics: [
          { value: '1日完結', label: '実践型ウォールアーティスト認定プログラム' },
          { value: '3工法', label: 'コテ・ローラー・吹付け施工をすべて体験' },
          { value: '認定特典', label: 'パートナー特別仕入価格の適用' },
        ],
      },
    },
    {
      slug: 'specifications',
      imageKey: 'kirara_cream',
      kind: 'editorial',
      vi: {
        cardTitle: 'Bảng thông số kỹ thuật Kirara',
        pageTitle: 'Bảng thông số kỹ thuật & Dữ liệu định mức KIRARA Cream',
        eyebrow: '10 · Hồ sơ kỹ thuật tiêu chuẩn',
        lead: 'Tổng hợp đầy đủ thông số thành phần, định mức thi công theo từng dụng cụ, điều kiện bảo quản và chứng nhận tiêu chuẩn Nhật Bản.',
        sections: [
          {
            heading: 'Hướng dẫn bảo quản & Chuẩn bị trước khi thi công',
            body: 'Sản phẩm dạng kem không chất bảo quản hóa học mạnh, cần được bảo quản ở nơi thoáng mát tránh ánh nắng trực tiếp và băng giá (4°C – 40°C) và sử dụng tối ưu trong vòng 3 tháng kể từ ngày sản xuất.',
          },
        ],
        comparisonHeaders: ['Thông số kỹ thuật', 'Chi tiết tiêu chuẩn KIRARA Cream'],
        comparisonRows: [
          { label: 'Tên thương mại', primaryValue: 'KIRARA — Vật liệu hoàn thiện nội thất sơn bả khoáng chất 2 trong 1' },
          { label: 'Nhà sản xuất gốc', primaryValue: 'Gensen Co., Ltd. (Nhật Bản) · Phân phối chính hãng: Harian Vietnam' },
          { label: 'Thành phần cốt lõi', primaryValue: 'San hô hóa thạch Yonaguni (Okinawa), đá Danto (Aichi), Eco Binder, sắc tố an toàn thực phẩm' },
          { label: 'Quy cách thùng', primaryValue: 'Thùng tiêu chuẩn 19 Lít & Thùng tiện dụng 6 Lít' },
          { label: 'Độ phủ ước tính (19L)', primaryValue: '25 m² (bay trét 1mm) · 35 m² (con lăn / máy phun 2 lớp)' },
          { label: 'Thời gian khô bề mặt', primaryValue: 'Khô chạm tay 2–4 giờ · Khô hoàn toàn 24 giờ (tùy độ ẩm môi trường)' },
          { label: 'Nhiệt độ bảo quản', primaryValue: '4°C – 40°C, thời hạn khuyến nghị 3 tháng kể từ ngày sản xuất' },
          { label: 'Chứng nhận an toàn', primaryValue: 'F☆☆☆☆ (JIS), Chứng nhận Vật liệu không cháy MLIT Nhật Bản' },
          { label: 'Bề mặt tương thích', primaryValue: 'Thạch cao, ván ép, giấy dán tường cũ, vữa xi măng, bê tông (dùng kèm Clean Sealer)' },
          { label: 'Bảng màu sẵn có', primaryValue: '32 sắc thái màu khoáng tự nhiên (từ #01 Coral White đến #32 Custom)' },
        ],
      },
      ja: {
        cardTitle: 'キララの仕様一覧',
        pageTitle: 'キララ（KIRARA Cream）技術仕様・規格一覧',
        eyebrow: '10 · 技術仕様・スペック',
        lead: '配合成分、施工面積の目安、対応下地、保管条件、公的認証データを一覧にまとめました。設計仕様書への記載資料としてもご活用いただけます。',
        sections: [
          {
            heading: '保管および取り扱い上の注意',
            body: '天然原料由来の水系クリーム製品のため、直射日光および凍結を避けた4℃〜40℃の環境で保管し、製造日から3ヶ月以内を目安にご使用ください。',
          },
        ],
        comparisonHeaders: ['仕様項目', 'KIRARA Cream 規格値'],
        comparisonRows: [
          { label: '製品正式名称', primaryValue: '天然健康クリーム壁材 キララ（下塗り・上塗り兼用タイプ）' },
          { label: '開発・製造元', primaryValue: '株式会社ゲンセン（日本）／ ベトナム総代理：株式会社ハリアン' },
          { label: '主原料', primaryValue: '与那国島産化石サンゴ、愛知県産段戸石、エコバインダー、食品衛生法適合顔料' },
          { label: '荷姿・容量', primaryValue: '19L標準ペール缶 ／ 6Lコンパクト缶' },
          { label: '標準施工面積（19L）', primaryValue: 'コテ塗り（約1mm厚）：約25㎡ ／ ローラー・吹付け（2回塗り）：約35㎡' },
          { label: '乾燥時間の目安', primaryValue: '指触乾燥 約2〜4時間 ／ 完全硬化 約24時間（季節・湿度により変動）' },
          { label: '保管条件', primaryValue: '4℃〜40℃の屋内冷暗所（未開封で製造後3ヶ月推奨）' },
          { label: '公的取得認定', primaryValue: 'F☆☆☆☆（JIS）、国土交通省大臣認定「不燃材料」' },
          { label: '施工可能下地', primaryValue: '石膏ボード、合板、既存ビニールクロス、モルタル、コンクリート（要専用シーラー）' },
          { label: 'カラー展開', primaryValue: '全32色（#01コーラルホワイト基準・特注調色相談可）' },
        ],
      },
    },
    {
      slug: 'faq',
      imageKey: 'kirara_cream',
      kind: 'editorial',
      vi: {
        cardTitle: 'Câu hỏi thường gặp',
        pageTitle: 'Câu hỏi thường gặp về vật liệu tường KIRARA (FAQ)',
        eyebrow: '11 · Giải đáp thắc mắc kỹ thuật',
        lead: 'Tổng hợp những câu hỏi phổ biến nhất từ chủ đầu tư, kiến trúc sư và gia đình khi tìm hiểu hoặc thi công sơn khoáng chất Kirara Cream.',
        sections: [],
        faqs: [
          {
            q: 'Tuổi thọ và khả năng duy trì chức năng khử mùi – cân bằng ẩm của Kirara là bao lâu?',
            a: 'Hiệu quả khử mùi, phát ion âm và điều hòa độ ẩm của Kirara mang tính bán vĩnh viễn. Nhiều công trình đầu tiên tại Nhật Bản thi công từ hơn 20 năm trước đến nay vẫn giữ nguyên khả năng hô hấp ẩm và lọc không khí tự nhiên.',
          },
          {
            q: 'Có thể tự thi công (DIY) hoặc phủ trực tiếp lên tường đang dán giấy dán tường cũ không?',
            a: 'Hoàn toàn có thể. Với bề mặt giấy dán tường hoặc tường sơn cũ còn chắc chắn không bong tróc, chỉ cần làm sạch bụi dầu mỡ và lăn một lớp sơn lót Clean Sealer là có thể tự lăn rulo hoặc trét bay Kirara Cream mà không phải đục phá.',
          },
          {
            q: 'Trẻ nhỏ chạm tay vào tường hoặc ở trong phòng ngay khi thi công có an toàn không?',
            a: 'Có. Kirara đạt chứng nhận F☆☆☆☆ (không phát thải Formaldehyde), không chứa Silic tinh thể và dùng sắc tố chuẩn thực phẩm. Thợ thi công không cần đeo mặt nạ phòng độc hóa chất và gia đình có thể dọn vào sinh hoạt ngay sau khi tường khô.',
          },
          {
            q: 'Nếu trẻ em vẽ bẩn hoặc tường bị trầy xước nhẹ thì xử lý như thế nào?',
            a: 'Với vết bụi nhẹ, có thể dùng gôm tẩy bút chì sạch hoặc khăn ẩm vắt khô lau nhẹ. Nếu vết bẩn sâu hoặc trầy xước vật lý, chỉ cần chấm nhẹ một lớp mỏng Kirara Cream cùng mã màu lên vị trí đó để phục hồi liền mạch.',
          },
          {
            q: 'Mất bao lâu để đặt hàng và giao màu tùy chọn tại Việt Nam?',
            a: 'Màu tiêu chuẩn #01 Coral White và các màu phổ biến được ưu tiên điều phối nhanh. Các mã màu đặc biệt trong bảng 32 màu được đặt pha chuẩn Nhật Bản và bàn giao theo lịch hẹn cam kết trong hợp đồng.',
          },
        ],
      },
      ja: {
        cardTitle: 'よく頂くご質問',
        pageTitle: 'よく頂くご質問（FAQ）— KIRARA Cream',
        eyebrow: '11 · よくある質問',
        lead: 'キララの寿命、効果持続期間、DIY施工の可否、お手入れ方法、納期などお客様から多く寄せられる疑問にお答えします。',
        sections: [],
        faqs: [
          {
            q: '調湿・脱臭効果はどのくらいの期間持続しますか？',
            a: '効果は半永久的です。多孔質鉱物そのものが機能するため、20年以上前に施工された初期の物件でも、現在まで変わらず調湿・空気浄化機能が維持されています。',
          },
          {
            q: '既存のビニールクロスの上からそのまま塗れますか？素人でもDIYできますか？',
            a: 'はい、可能です。クロスの大きな剥がれがなければ、剥がさずに上から専用シーラーを塗布して施工できます。練り済みクリーム状で伸びが良く、ご家族でDIYされるお客様も多くいらっしゃいます。',
          },
          {
            q: '施工中や入居直後に臭いや有害物質はありませんか？',
            a: 'F☆☆☆☆取得・食品レベル天然顔料使用のため、施工中もツンとした刺激臭がありません。小さなお子様やペットがいるご家庭でも安心して導入いただけます。',
          },
          {
            q: '壁に汚れやキズがついた場合のお手入れ方法は？',
            a: '軽い手垢などは消しゴムや固く絞った布で優しく拭き取れます。深いキズや汚れがついた場合も、同色のキララを少量上塗りすることで目立たなく補修可能です。',
          },
          {
            q: '32色のカラー発注から納品までの目安は？',
            a: '定番の#01コーラルホワイトは優先出荷、全32色の特注カラーについてもご注文確定後すみやかに生産・配送スケジュールをご案内いたします。',
          },
        ],
      },
    },
    {
      slug: 'examples',
      imageKey: 'hero_living',
      kind: 'editorial',
      vi: {
        cardTitle: 'Công trình & Dự án thực tế',
        pageTitle: 'Công trình tiêu biểu ứng dụng KIRARA Cream',
        eyebrow: '12 · Hồ sơ năng lực & Dự án thực tế',
        lead: 'Hơn 10.000 căn hộ, biệt thự, trường mầm non, phòng khám nha khoa – nhi khoa và chuỗi nhà hàng đã tin tưởng ứng dụng vật liệu tường khoáng chất Kirara.',
        sections: [
          {
            heading: 'Đa dạng không gian từ nhà ở dân dụng đến công trình công cộng',
            body: 'Bề mặt lì mịn ấm áp, hiệu ứng ánh sáng dịu mắt và khả năng khử mùi vượt trội giúp Kirara trở thành điểm nhấn khác biệt cho cả kiến trúc nhà ở tối giản lẫn không gian thương mại cao cấp.',
          },
        ],
        examples: [
          {
            title: 'Phòng khách & Phòng ngủ Biệt thự biển tối giản',
            location: 'Đà Nẵng · Việt Nam',
            area: '185 m² tường & trần',
            note: 'Sử dụng mã màu #01 Coral White kết hợp #05 Silky Beige giúp chống nồm ẩm gió biển, duy trì độ ẩm ổn định và khử mùi nội thất gỗ mới.',
          },
          {
            title: 'Trường Mầm non & Cơ sở Giáo dục chuẩn Nhật',
            location: 'Tokyo & Aichi · Nhật Bản',
            area: '~100 cơ sở tiêu biểu',
            note: 'Phủ tường lớp học bằng Kirara F☆☆☆☆ giúp không khí thông thoáng, giảm lây nhiễm chéo hô hấp và bảo vệ làn da nhạy cảm của trẻ nhỏ.',
          },
          {
            title: 'Phòng khám Nha khoa & Nhi khoa cao cấp',
            location: 'Osaka & Đà Nẵng',
            area: '~40 phòng khám ứng dụng',
            note: 'Loại bỏ đặc trưng mùi thuốc sát trùng, mang lại tâm lý thư giãn dịu nhẹ cho bệnh nhân ngay khi bước vào khu vực chờ.',
          },
          {
            title: 'Nhà hàng ẩm thực Nhật & Quán Cà phê Specialty',
            location: 'Aichi · Nhật Bản & Miền Trung VN',
            area: '~40 cơ sở F&B',
            note: 'Khử triệt để mùi dầu mỡ nướng và mùi thuốc lá sau giờ phục vụ, đồng thời tạo mảng tường màu #19 Cocoa & #12 Apricot sang trọng.',
          },
        ],
      },
      ja: {
        cardTitle: 'キララの施工例',
        pageTitle: 'キララの導入事例・施工実績ギャラリー',
        eyebrow: '12 · 施工実績',
        lead: '一般住宅10,000棟以上をはじめ、保育園・幼稚園約100施設、クリニック約40施設、飲食店約40店舗など幅広い建築空間で採用されています。',
        sections: [
          {
            heading: '用途や空間デザインに合わせて選べる32色の仕上がり',
            body: 'コテ仕上げの立体感ある陰影から、ローラーによる落ち着いたマット仕上げまで、空間のコンセプトに応じた表情を演出できます。',
          },
        ],
        examples: [
          {
            title: '海辺のミニマルヴィラ（リビング・主寝室）',
            location: 'ベトナム・ダナン',
            area: '壁・天井 185㎡',
            note: '#01コーラルホワイトと#05シルキーベージュを採用。海風による高湿度環境下でも結露・カビを防ぎ、新築木製家具の匂いを早期解消。',
          },
          {
            title: '認可保育園・幼稚園 保育室空間',
            location: '日本国内 約100園',
            area: '保育室・プレイルーム',
            note: 'F☆☆☆☆基準と素手施工できる安全性が評価され採用。園児が毎日吸い込む空気をクリーンに保ちます。',
          },
          {
            title: '歯科・小児科クリニック 待合・診察室',
            location: '大阪・愛知ほか 約40院',
            area: '受付・待合スペース',
            note: '医療機関特有の薬剤臭を大幅に低減し、患者様がリラックスして過ごせる温かみのある医療空間を実現。',
          },
          {
            title: '和食ダイニング・カフェ店舗内装',
            location: '日本・ベトナム各都市 約40店舗',
            area: '客席ホール壁面',
            note: '調理臭やタバコ臭を翌日に残さない脱臭性能に加え、#19ココアや#12アプリコットなど上質な色味で集客力を向上。',
          },
        ],
      },
    },
  ],

  'kirara-liquid': [
    makeInquiryTile('KIRARA LIQUID', 'KIRARA LIQUID', 'kirara_liquid'),
    makeOnlineShopTile('KIRARA LIQUID', 'KIRARA LIQUID', '11.340.000 VNĐ', 'kirara_liquid'),
    {
      slug: 'overview-mineral-mist',
      imageKey: 'kirara_liquid',
      kind: 'editorial',
      vi: {
        cardTitle: 'Tổng quan Kirara Liquid',
        pageTitle: 'KIRARA LIQUID — Dung dịch khoáng chất ion hóa 100% thiên nhiên',
        eyebrow: '03 · Giới thiệu sản phẩm',
        lead: 'Dung dịch khoáng chất trong suốt không màu chứa ion Canxi (Ca²⁺) và Magie (Mg²⁺) hoạt tính nguồn gốc 100% thiên nhiên, giúp chuyển đổi bề mặt nội thất nhà ở và khoang xe ô tô thành lớp màng lọc không khí sinh học.',
        sections: [
          {
            heading: 'Đã kiểm nghiệm độc tính cấp tính đường uống — An toàn cho mọi thành viên',
            body: 'Không chứa cồn công nghiệp, chất hoạt động bề mặt hay hương liệu tổng hợp. Kirara Liquid đã vượt qua kiểm nghiệm độc tính cấp tính đường uống tại Nhật Bản, đảm bảo an toàn khi phun phủ trong không gian có trẻ sơ sinh, phụ nữ mang thai, người cao tuổi và thú cưng.',
            bullets: [
              'Dung dịch trong suốt 100% nước khoáng giàu ion Ca²⁺ & Mg²⁺, không để lại cặn trắng hay đổi màu nội thất',
              'Phun phủ linh hoạt trên tường sơn nước, giấy dán tường, rèm cửa, sofa vải, thảm, đệm ngủ và da ô tô',
              'Không cần đục phá hay sơn sửa — cải thiện chất lượng không khí trong căn hộ đang ở chỉ trong vài giờ',
            ],
          },
        ],
        metrics: [
          { value: '100%', label: 'Nước khoáng ion Ca²⁺ & Mg²⁺ thiên nhiên, đạt kiểm nghiệm đường uống' },
          { value: '6,27 μm', label: 'Bước sóng tia hồng ngoại xa tạo không gian chống oxy hóa' },
          { value: '3 quy cách', label: 'Chai xịt 500ML · Chai 700ML · Can công nghiệp 10 Lít' },
        ],
      },
      ja: {
        cardTitle: 'キララリキッドとは？',
        pageTitle: 'KIRARA LIQUID — 経口急性毒性試験済 100%天然ミネラル空気浄化水溶液',
        eyebrow: '03 · 製品概要',
        lead: '天然由来のカルシウムイオン（Ca²⁺）・マグネシウムイオン（Mg²⁺）を含有した無色透明のミネラル水溶液を室内や車内に噴霧し、大掛かりな改修工事なしで清潔で抗酸化性の高い空間を構築します。',
        sections: [
          {
            heading: '急性経口毒性試験クリア — 乳幼児やペットのいる空間でも安心',
            body: 'アルコール・界面活性剤・合成香料を一切含まず、急性経口毒性試験にて高い安全性が確認されています。壁紙、カーテン、布製ソファ、革シートの風合いを損なうことなく均一なミネラル層を形成します。',
            bullets: [
              '100%天然ミネラル水成分で、噴霧後の変色やベタつき・白い跡残りなし',
              '入居中の住宅、保育園、病院待合室、店舗にも即日スピード導入可能',
              '遠赤外線効果とマイナスイオンでアレルギー緩和や快眠環境をサポート',
            ],
          },
        ],
        metrics: [
          { value: '100%', label: '急性経口毒性試験済み 天然Ca²⁺・Mg²⁺ミネラル水溶液' },
          { value: '6.27μm', label: '抗酸化空間・血行促進を支える遠赤外線波長' },
          { value: '3サイズ', label: '500ML・700ML・業務用10Lタンク' },
        ],
      },
    },
    {
      slug: 'tvoc-pm25-purification',
      imageKey: 'hero_living',
      kind: 'editorial',
      vi: {
        cardTitle: 'Phân hủy TVOC & Giảm PM2.5',
        pageTitle: 'Cơ chế phân hủy Formaldehyde/TVOC & Kết tụ bụi mịn PM2.5',
        eyebrow: '04 · Thanh lọc không khí & Kháng khuẩn',
        lead: 'Chủ động trung hòa và phân hủy các hợp chất hữu cơ dễ bay hơi (TVOC, Formaldehyde) phát thải từ gỗ công nghiệp, keo dán nội thất mới và khói bụi đô thị.',
        sections: [
          {
            heading: 'Kết tụ bụi mịn PM2.5 & ức chế vi khuẩn E.coli, tụ cầu vàng',
            body: 'Mạng lưới ion khoáng Ca²⁺/Mg²⁺ tích điện tự nhiên giúp phá vỡ cấu trúc lơ lửng của bụi siêu mịn PM2.5, phấn hoa và tác nhân gây dị ứng, đồng thời ức chế sự sinh sôi của vi khuẩn E.coli, tụ cầu vàng (Staphylococcus aureus) và bào tử nấm mốc.',
            bullets: [
              'Hiệu quả rõ rệt trong căn hộ mới bàn giao, văn phòng mới lắp đặt đồ gỗ MDF hoặc vừa cải tạo',
              'Giảm triệu chứng hắt hơi, nghẹt mũi buổi sáng và cải thiện độ sâu giấc ngủ ban đêm',
              'Phát tán tia hồng ngoại xa 6,27 micron giúp không gian giảm cảm giác bí bách trong phòng điều hòa kín',
            ],
          },
        ],
        metrics: [
          { value: 'TVOC', label: 'Hỗ trợ phân hủy Formaldehyde & khí thải nội thất mới' },
          { value: 'PM2.5', label: 'Kết tụ bụi mịn lơ lửng, giảm kích ứng đường hô hấp' },
          { value: '6,27 μm', label: 'Tia hồng ngoại xa hỗ trợ chống oxy hóa tế bào' },
        ],
      },
      ja: {
        cardTitle: 'TVOC分解・PM2.5対策',
        pageTitle: 'ホルムアルデヒド・TVOC分解とPM2.5抑制メカニズム',
        eyebrow: '04 · 空気浄化・抗菌作用',
        lead: '合板家具や接着剤から継続的に放出されるホルムアルデヒドやTVOC（総揮発性有機化合物）を分解し、室内浮遊PM2.5や細菌リスクを低減します。',
        sections: [
          {
            heading: '抗酸化空間の創出と大腸菌・黄色ブドウ球菌の繁殖抑制',
            body: 'カルシウム・マグネシウム由来のミネラルイオンが微細な浮遊粉塵の静電気バランスを整えて落下・固定化させ、大腸菌・黄色ブドウ球菌やカビ胞子の活動を抑え込みます。',
            bullets: [
              '新築・リフォーム直後の化学物質臭やシックハウス対策に高い即効性',
              '気管支が敏感なお子様やご高齢者の寝室・病室環境を健やかに維持',
              '6.27ミクロン遠赤外線による抗酸化作用で、閉鎖空調環境でも疲れにくい室内を実現',
            ],
          },
        ],
        metrics: [
          { value: 'TVOC分解', label: '新築家具由来の有害揮発ガス・悪臭を低減' },
          { value: 'PM2.5', label: '微粒子の浮遊を抑えアレルゲン吸入リスクを軽減' },
          { value: '6.27μm', label: '抗酸化・リラクゼーションを促す遠赤外線波長' },
        ],
      },
    },
    {
      slug: 'automotive-treatment',
      imageKey: 'consulting',
      kind: 'editorial',
      vi: {
        cardTitle: 'Phun phủ cho Xe ô tô',
        pageTitle: 'Giải pháp phun phủ khoáng chất cho Khoang nội thất Ô tô',
        eyebrow: '05 · Chăm sóc xe cao cấp chuẩn Nhật',
        lead: 'Loại bỏ mùi nhựa da xe mới, mùi ẩm mốc điều hòa, khói thuốc ám trần nỉ và bức xạ tia hồng ngoại xa 6,27 micron giúp tài xế tỉnh táo, giảm mệt mỏi & say xe.',
        sections: [
          {
            heading: 'Quy trình phun phủ chuẩn Nhật Bản (dịch vụ từ 1.100.000 VNĐ)',
            body: 'Kỹ thuật viên Harian sử dụng súng phun sương mịn chuyên dụng xử lý toàn diện trần xe, ghế da/nỉ, tựa đầu, thảm sàn, hộc đồ và hệ thống cửa gió điều hòa. Màng khoáng khô nhanh không gây ẩm ướt hay ố bề mặt điện tử.',
            bullets: [
              'Trung hòa mùi da mới, mùi thuốc lá và mùi hôi điều hòa kéo dài ổn định nhiều tháng',
              'Bức xạ hồng ngoại xa 6,27 micron & ion âm hỗ trợ lưu thông tuần hoàn, giảm cảm giác ngột ngạt say xe',
              'An toàn tuyệt đối cho xe gia đình chở trẻ sơ sinh và phụ nữ mang thai',
            ],
          },
        ],
        metrics: [
          { value: '1,1 triệu', label: 'Chi phí dịch vụ phun phủ trọn gói khoang xe từ 1.100.000 VNĐ' },
          { value: '6,27 μm', label: 'Giảm mệt mỏi thần kinh & tình trạng say xe đường dài' },
          { value: '45 phút', label: 'Thời gian thi công hoàn thiện nhanh chóng, nhận xe dùng ngay' },
        ],
      },
      ja: {
        cardTitle: '自動車車内コーティング',
        pageTitle: '自動車車内向け ミネラル空気浄化コーティング',
        eyebrow: '05 · カーライフ快適化',
        lead: '新車特有のプラスチック・革シート臭やエアコンのカビ臭、タバコ臭を中和し、6.27ミクロンの遠赤外線とマイナスイオン効果で運転疲労と車酔いを和らげます。',
        sections: [
          {
            heading: 'Harian専門チームによるスピーディー車内施工（1,100,000 VND〜）',
            body: '天井・シート・ヘッドレスト・フロアマット・空調吹き出し口へ専用マイクロガンで均一噴霧。電子機器やレザー素材を傷めず、数ヶ月にわたり爽やかな車室空間をキープします。',
            bullets: [
              '車酔いしやすいお子様やご家族を乗せるファミリーカーに高い支持',
              '本革シート・アルカンターラ・布シートすべての車室内装に対応',
              '施工後すぐに乗車可能。香料で誤魔化さない無臭・自然な空気感を実現',
            ],
          },
        ],
        metrics: [
          { value: '110万VND〜', label: '車内フルコーティング標準サービス価格' },
          { value: '6.27μm', label: '運転疲労・車酔いを緩和する遠赤外線作用' },
          { value: '約45分', label: 'スピーディー施工で当日お渡し可能' },
        ],
      },
    },
    {
      slug: 'specs-and-faq',
      imageKey: 'kirara_liquid',
      kind: 'editorial',
      vi: {
        cardTitle: 'Thông số & FAQ',
        pageTitle: 'Thông số kỹ thuật & Câu hỏi thường gặp — KIRARA LIQUID',
        eyebrow: '06 · Hồ sơ kỹ thuật & Hỏi đáp',
        lead: 'Chi tiết đóng gói chai 500ML, 700ML, can công nghiệp 10 Lít cùng hướng dẫn sử dụng hiệu quả trong gia đình và công trình.',
        sections: [],
        comparisonHeaders: ['Hạng mục kỹ thuật', 'Chi tiết tiêu chuẩn KIRARA LIQUID'],
        comparisonRows: [
          { label: 'Quy cách đóng gói', primaryValue: 'Chai xịt 500ML · Chai bổ sung 700ML · Can công nghiệp 10 Lít' },
          { label: 'Thành phần khoáng chất', primaryValue: 'Nước khoáng tinh khiết chứa ion Canxi (Ca²⁺) & Magie (Mg²⁺) 100% thiên nhiên' },
          { label: 'Kiểm nghiệm an toàn', primaryValue: 'Đạt kiểm nghiệm độc tính cấp tính đường uống · Không cồn · Không hương liệu' },
          { label: 'Bước sóng hồng ngoại xa', primaryValue: '6,27 micron (hỗ trợ chống oxy hóa & thư giãn tuần hoàn)' },
          { label: 'Ứng dụng điển hình', primaryValue: 'Nhà ở mới bàn giao, phòng ngủ trẻ em, văn phòng, bệnh viện, rèm/sofa, xe ô tô' },
        ],
        faqs: [
          {
            q: 'Một lần phun phủ dịch vụ cho nhà ở hoặc xe ô tô giữ được tác dụng bao lâu?',
            a: 'Sau khi phun phủ đúng kỹ thuật, lớp ion khoáng chất bám chặt vào sợi vải, bề mặt tường và trần xe giúp duy trì hiệu quả khử mùi và phát ion âm ổn định trong nhiều tháng liền (tới 6–12 tháng với bề mặt ít chà rửa).',
          },
          {
            q: 'Xịt trực tiếp lên nệm ngủ trẻ sơ sinh, thú nhồi bông hay chuồng thú cưng có an toàn không?',
            a: 'Hoàn toàn an toàn. Sản phẩm là nước khoáng thiên nhiên 100%, đã qua kiểm nghiệm độc tính cấp tính đường uống, không chứa hóa chất diệt khuẩn tổng hợp nên không cần lau rửa lại sau khi xịt.',
          },
          {
            q: 'Chai 500ML/700ML khác gì với Can 10L?',
            a: 'Thành phần hoạt tính hoàn toàn giống nhau. Chai 500ML/700ML phù hợp sử dụng hàng ngày tại gia đình và xe hơi; Can 10L tối ưu chi phí cho các đội thi công phun phủ toàn bộ căn hộ, khách sạn, trường học hoặc gara chăm sóc xe.',
          },
        ],
      },
      ja: {
        cardTitle: '仕様一覧・FAQ',
        pageTitle: 'KIRARA LIQUID 仕様一覧とよくあるご質問',
        eyebrow: '06 · 仕様・FAQ',
        lead: '容量ラインナップ、安全性試験データおよび日常使用に関するQ&Aをまとめました。',
        sections: [],
        comparisonHeaders: ['仕様項目', 'KIRARA LIQUID 規格詳細'],
        comparisonRows: [
          { label: '容量ラインナップ', primaryValue: '500MLスプレー ／ 700MLボトル ／ 業務用10Lタンク' },
          { label: '有効成分', primaryValue: '100%天然カルシウムイオン（Ca²⁺）・マグネシウムイオン（Mg²⁺）含有水' },
          { label: '安全性試験', primaryValue: '急性経口毒性試験クリア · アルコール・合成界面活性剤・香料ゼロ' },
          { label: '遠赤外線波長', primaryValue: '6.27ミクロン（抗酸化空間形成・リラクゼーション）' },
          { label: '推奨用途', primaryValue: '住宅リビング・子供部屋・オフィス・医療機関・寝具/ソファ・自動車車内' },
        ],
        faqs: [
          {
            q: '1回の噴霧施工でどのくらい効果が持続しますか？',
            a: '繊維や壁面に定着したミネラル成分が拭き取られない限り、数ヶ月〜半年以上わたり安定した消臭・空気浄化効果を発揮します。',
          },
          {
            q: '赤ちゃんの寝具やペット周辺に直接スプレーしても大丈夫ですか？',
            a: 'はい。急性経口毒性試験済みの100%天然ミネラル水溶液ですので、万一お口に触れても問題なく、拭き取り不要でご使用いただけます。',
          },
          {
            q: '500ML/700MLと業務用10Lタンクの中身は同じですか？',
            a: '中身は同一の高純度ミネラル水溶液です。日常ケアには500ML/700MLを、住宅全体やカーディテイリング店舗での広範囲施工にはコストメリットの高い10Lタンクをおすすめします。',
          },
        ],
      },
    },
  ],

  'gko-tay-nam-moc': [
    makeInquiryTile('G.K.O Tẩy nấm mốc', 'G.K.O 防カビ・カビ取り剤', 'kirara_liquid'),
    makeOnlineShopTile('G.K.O Tẩy nấm mốc', 'G.K.O 防カビ・カビ取り剤', '270.000 VNĐ', 'kirara_liquid'),
    {
      slug: 'spore-mechanism',
      imageKey: 'kirara_liquid',
      kind: 'editorial',
      vi: {
        cardTitle: 'Cơ chế diệt tận bào tử',
        pageTitle: 'Cơ chế thẩm thấu diệt bào tử nấm mốc chuẩn HMSS & Tẩy ố khói thuốc',
        eyebrow: '03 · Công nghệ xử lý gốc rễ HMSS Nhật Bản',
        lead: 'Được khuyến nghị trong Hệ thống An ninh Chống mốc Nhà ở HMSS (House Mold Security System) tại Nhật Bản: G.K.O thẩm thấu xuyên lớp vỏ bảo vệ của sợi nấm để diệt tận nhân bào tử và đánh bay vết ố nhựa thuốc lá.',
        sections: [
          {
            heading: 'Xử lý triệt để mà không cần chà xát làm hỏng bề mặt tường',
            body: 'Khác với hóa chất tẩy rửa thông thường chỉ tẩy trắng lớp mốc trên bề mặt dẫn đến mốc mọc lại chỉ sau vài tuần, G.K.O thẩm thấu sâu vào kết cấu ron gạch, vữa xi măng và gỗ, đồng thời phân giải sắc tố vàng của nhựa thuốc lá (nicotine/tar) trong các phòng hút thuốc hoặc căn hộ cũ.',
            bullets: [
              'Khuyến nghị chính thức trong quy trình kiểm soát nấm mốc HMSS Nhật Bản',
              'Phá hủy cấu trúc màng tế bào nấm mốc và tiêu diệt nhân bào tử để kéo dài thời gian không tái phát',
              'Khử trùng 99,9% vi khuẩn E.coli và tụ cầu vàng (Staphylococcus aureus) ngay khi tiếp xúc',
              'Công dụng kép: Tẩy nấm mốc ẩm thấp & Làm sạch ố vàng khói thuốc lá trên trần, rèm, tường cũ',
            ],
          },
        ],
        metrics: [
          { value: 'HMSS', label: 'Khuyến nghị chuẩn Hệ thống An ninh Chống mốc Nhà ở Nhật Bản' },
          { value: '99,9%', label: 'Hiệu quả diệt khuẩn bề mặt (E.coli & tụ cầu vàng)' },
          { value: '112 chai', label: 'Sẵn hàng tại kho Harian Đà Nẵng (từ 270.000 VNĐ)' },
        ],
      },
      ja: {
        cardTitle: '胞子分解メカニズム',
        pageTitle: 'HMSS推奨 — カビ胞子根絶 ＆ タバコのヤニ除去メカニズム',
        eyebrow: '03 · HMSS基準の浸透テクノロジー',
        lead: '日本の住宅カビ対策システム「HMSS（House Mold Security System）」でも推奨されるプロ仕様処方。カビの細胞壁を貫通し、再発源となる菌糸・胞子の核と頑固なタバコのヤニ汚れを分解します。',
        sections: [
          {
            heading: 'ゴシゴシ擦らず塗布するだけで99.9%除菌＆ヤニ汚れ除去',
            body: '表面を漂白するだけの一般的な洗剤とは異なり、素材深部の菌糸レベルまで浸透して胞子を不活性化します。浴室や外壁のカビだけでなく、喫煙室や飲食店の壁面に蓄積したタバコのヤニ（黄ばみ）の除去にも優れた効果を発揮します。',
            bullets: [
              '日本のカビ対策専門スキーム「HMSS」技術推奨製品',
              'カビ胞子の芯まで分解し、処理後の黒カビ再発サイクルを大幅に遅延',
              '大腸菌・黄色ブドウ球菌を99.9%除菌し衛生的な下地を回復',
              '外壁・浴室目地・木材・クロスのヤニ洗浄まで1本で多用途対応',
            ],
          },
        ],
        metrics: [
          { value: 'HMSS推奨', label: '日本住宅防カビセキュリティシステム推奨処方' },
          { value: '99.9%', label: '大腸菌・黄色ブドウ球菌の除菌率' },
          { value: 'ヤニ対応', label: 'カビ根絶と同時にタバコ黄ばみも強力分解' },
        ],
      },
    },
    {
      slug: 'safety-food-grade',
      imageKey: 'hero_living',
      kind: 'editorial',
      vi: {
        cardTitle: 'An toàn & Ít mùi Clo',
        pageTitle: 'Phụ gia chuẩn thực phẩm — Giảm thiểu mùi Clo nồng gắt',
        eyebrow: '04 · An toàn người dùng & Tương thích Kirara',
        lead: 'Công thức tối ưu kết hợp phụ gia đạt chuẩn an toàn thực phẩm giúp giảm mạnh mùi hắc khó chịu thường gặp khi tẩy mốc trong không gian kín.',
        sections: [
          {
            heading: 'Bước tiền xử lý lý tưởng trước khi sơn phủ khoáng chất Kirara Cream',
            body: 'Với các bức tường cũ đã từng bị nấm mốc do mùa mưa nồm, đội ngũ Wall Artist của Harian luôn sử dụng G.K.O để tiêu diệt sạch bào tử ẩn dưới lớp vữa trước khi lăn Clean Sealer và hoàn thiện bằng Kirara Cream, bảo đảm tường sạch khỏe lâu dài.',
            bullets: [
              'Giảm thiểu cảm giác cay mắt, kích ứng đường hô hấp cho người sử dụng và thợ bảo trì',
              'Phụ gia nguồn gốc chuẩn an toàn thực phẩm, thân thiện hơn với môi trường sinh hoạt',
              'Không tạo cặn hóa chất gây bong tróc cho lớp sơn khoáng chất hoàn thiện tiếp theo',
            ],
          },
        ],
        metrics: [
          { value: 'Ít mùi Clo', label: 'Công thức phụ gia chuẩn thực phẩm êm dịu trong phòng kín' },
          { value: '2 bước', label: 'Xử lý nền bằng G.K.O trước khi hoàn thiện tường Kirara' },
          { value: '3 cỡ', label: 'Chai 200ML gia đình · Chai 500ML · Can 4L dự án' },
        ],
      },
      ja: {
        cardTitle: '低塩素臭・高い安全性',
        pageTitle: '食品添加物水準の配合 — 刺激臭を抑えた安心設計',
        eyebrow: '04 · 安全性とキララ下地連携',
        lead: '食品添加物グレードの補助成分を組み合わせることで、密閉された浴室や室内でも作業しやすいようツンとした塩素刺激臭を大幅に抑制しています。',
        sections: [
          {
            heading: 'キララクリーム施工前の「リセット下地処理」にも最適',
            body: '長年の湿気でカビやヤニが定着した壁面をG.K.Oで細胞レベルからリセットしてから専用シーラーとキララクリームを仕上げることで、再発リスクのない健康空間を構築できます。',
            bullets: [
              '作業時の目や喉へのツンとした刺激感を抑えたマイルド使用感',
              'ご家庭のお掃除からビル・ホテルメンテナンスまで幅広く安全に導入可能',
              '上塗り材（キララクリーム等）の密着性を阻害する余分な残留物なし',
            ],
          },
        ],
        metrics: [
          { value: '低刺激臭', label: '食品添加物水準配合で室内でも作業しやすい処方' },
          { value: '下地連携', label: 'キララ壁材施工前の完全除菌リセットに対応' },
          { value: '3サイズ', label: '200ML・500ML・業務用4Lの豊富なラインナップ' },
        ],
      },
    },
    {
      slug: 'application-guide',
      imageKey: 'consulting',
      kind: 'editorial',
      vi: {
        cardTitle: 'Hướng dẫn xử lý 3 bước',
        pageTitle: 'Quy trình xử lý nấm mốc & vết ố khói thuốc trong 3 bước',
        eyebrow: '05 · Hướng dẫn sử dụng thực tế',
        lead: 'Thực hiện nhanh gọn bằng bình xịt hoặc chổi quét mà không đòi hỏi máy móc phức tạp hay chà xát mạnh.',
        sections: [
          {
            heading: 'Bước 1 — Làm sạch bụi rời & giữ bề mặt ráo ráo',
            body: 'Dùng khăn khô hoặc chổi mềm quét nhẹ lớp bụi màng nhện bám lỏng bên ngoài mảng mốc để dung dịch tiếp xúc trực tiếp với chân nấm.',
          },
          {
            heading: 'Bước 2 — Phun hoặc quét đều dung dịch G.K.O',
            body: 'Phun ướt đều khu vực bị nấm mốc hoặc vùng ố vàng khói thuốc và mở rộng ra rìa xung quanh 10–15cm. Chờ 15–30 phút để dung dịch thẩm thấu phá vỡ bào tử (không cần chà mạnh).',
          },
          {
            heading: 'Bước 3 — Rửa sạch bằng nước hoặc lau lại khăn ẩm',
            body: 'Tại nhà tắm/ban công có thể xịt xả trực tiếp bằng nước; trên tường phòng ngủ hoặc trần nhà hãy lau lại kỹ bằng khăn ẩm sạch và để khô tự nhiên trước khi sơn hoàn thiện.',
          },
        ],
      },
      ja: {
        cardTitle: '3ステップ施工手順',
        pageTitle: 'G.K.O カビ・ヤニ除去 3ステップガイド',
        eyebrow: '05 · 使用方法',
        lead: '特別な機材や力の要るブラッシングは不要。スプレーまたは刷毛塗りの3ステップで誰でも確実に処理できます。',
        sections: [
          {
            heading: 'STEP 1 — 表面のホコリ・余分な水分の除去',
            body: '対象面の浮いたホコリや水滴を乾いた布で軽く拭き取り、薬剤がカビ・ヤニに直接浸透しやすい状態にします。',
          },
          {
            heading: 'STEP 2 — G.K.Oの均一塗布と15〜30分の浸透待機',
            body: 'カビ発生箇所およびその周囲10〜15cmまでむらなく塗布または噴霧し、15〜30分ほど放置して胞子レベルまで分解させます。',
          },
          {
            heading: 'STEP 3 — 水洗いまたは固く絞った雑巾での拭き上げ',
            body: '浴室や屋外では水で洗い流し、室内の壁紙や壁面ではきれいな濡れ雑巾で丁寧に拭き取って自然乾燥させます。',
          },
        ],
      },
    },
    {
      slug: 'specs-and-faq',
      imageKey: 'kirara_liquid',
      kind: 'editorial',
      vi: {
        cardTitle: 'Thông số & FAQ',
        pageTitle: 'Thông số quy cách & Câu hỏi thường gặp — G.K.O',
        eyebrow: '06 · Thông số kỹ thuật & Hỏi đáp',
        lead: 'Chi tiết dung tích 200ML, 500ML và Can 4 Lít dùng cho hộ gia đình, khách sạn hoặc đơn vị bảo trì tòa nhà.',
        sections: [],
        comparisonHeaders: ['Thông số', 'Giá trị tiêu chuẩn G.K.O'],
        comparisonRows: [
          { label: 'Dung tích sẵn có', primaryValue: 'Chai 200ML (270.000 VNĐ) · Chai 500ML · Can chuyên dụng 4 Lít' },
          { label: 'Chuẩn khuyến nghị', primaryValue: 'HMSS (House Mold Security System) — Nhật Bản' },
          { label: 'Hiệu lực diệt khuẩn', primaryValue: '99,9% E.coli & tụ cầu vàng (Staphylococcus aureus)' },
          { label: 'Phạm vi bề mặt', primaryValue: 'Tường vữa, bê tông, ron gạch men, gỗ, trần thạch cao, khu vực ố khói thuốc' },
          { label: 'Xuất xứ', primaryValue: 'Gensen Global · Nhật Bản (112 chai sẵn kho Harian Đà Nẵng)' },
        ],
        faqs: [
          {
            q: 'Chai 200ML xử lý được diện tích tường khoảng bao nhiêu m²?',
            a: 'Tùy mức độ nấm mốc nặng hay nhẹ, mỗi chai 200ML có thể phun xử lý hiệu quả khoảng 4–6 m² bề mặt tường, ron gạch phòng tắm hoặc góc trần bị thấm ẩm.',
          },
          {
            q: 'G.K.O có tẩy được vết ố vàng do khói thuốc lá lâu năm trên tường không?',
            a: 'Có. Ngoài xử lý nấm mốc, công thức của G.K.O còn phân giải rất hiệu quả lớp nhựa thuốc lá (nicotine/tar) bám vàng trên tường phòng khách sạn, quán ăn và căn hộ cũ trước khi sơn mới.',
          },
          {
            q: 'Sau khi tẩy mốc bằng G.K.O thì bao lâu có thể phủ Kirara Cream lên trên?',
            a: 'Sau bước lau sạch bằng khăn ẩm, chỉ cần để bề mặt tường khô tự nhiên hoàn toàn (thường sau 12–24 giờ tùy độ thông thoáng) là có thể lăn sơn lót Clean Sealer và thi công Kirara Cream.',
          },
        ],
      },
      ja: {
        cardTitle: '仕様・FAQ',
        pageTitle: 'G.K.O 仕様詳細・よくあるご質問',
        eyebrow: '06 · 仕様・FAQ',
        lead: '家庭用200ML・500MLおよび施設メンテナンス用4Lタンクの製品情報とよくあるご質問。',
        sections: [],
        comparisonHeaders: ['項目', 'G.K.O 規格詳細'],
        comparisonRows: [
          { label: '展開サイズ', primaryValue: '200ML (270,000 VND) ・ 500ML ・ 4Lタンク' },
          { label: '推奨基準', primaryValue: '日本HMSS（House Mold Security System）推奨製品' },
          { label: '除菌性能', primaryValue: '99.9%（大腸菌・黄色ブドウ球菌）' },
          { label: '適用素材', primaryValue: 'コンクリート・モルタル・浴室タイル目地・木材・タバコのヤニ付着壁面' },
          { label: '原産国・在庫', primaryValue: '日本（株式会社ゲンセン）／ ダナン倉庫 112本即納可' },
        ],
        faqs: [
          {
            q: '200MLボトル1本でどのくらいの面積に使用できますか？',
            a: 'カビの程度にもよりますが、約4〜6㎡の壁面や浴室目地の処理に十分お使いいただけます。',
          },
          {
            q: '長年染み付いたタバコのヤニ汚れにも使えますか？',
            a: 'はい。ホテル客室や飲食店の壁面・天井に付着したタバコのヤニ（黄ばみ）の分解洗浄にも優れた効果を発揮します。',
          },
          {
            q: 'G.K.Oで除菌した後、どのくらいでキララクリームを上塗りできますか？',
            a: '水拭き仕上げの後、下地が完全に乾燥するまで（通常12〜24時間目安）お待ちいただければ、クリーンシーラー処理を経てキララクリームを施工できます。',
          },
        ],
      },
    },
  ],

  'can-bang-khoang-chat-donan': [
    makeInquiryTile('Cân bằng khoáng chất Donan', 'Donan ミネラルバランス', 'kirara_cream'),
    makeOnlineShopTile('Cân bằng khoáng chất Donan', 'Donan ミネラルバランス', '1.390.000 VNĐ', 'kirara_cream'),
    {
      slug: 'mineral-origin',
      imageKey: 'kirara_cream',
      kind: 'editorial',
      vi: {
        cardTitle: 'Nguồn khoáng tự nhiên Donan',
        pageTitle: 'Triết lý "Không khí × Nước × Muối Khoáng × Thực phẩm = Sức khỏe"',
        eyebrow: '03 · Triết lý dinh dưỡng khoáng chất Gensen',
        lead: 'Trong hệ sinh thái chăm sóc sức khỏe toàn diện của Gensen Nhật Bản, Donan đóng vai trò bù đắp tổ hợp nguyên tố vi khoáng thiết yếu thường bị loại bỏ hoàn toàn trong nước lọc RO hiện đại và thực phẩm chế biến.',
        sections: [
          {
            heading: 'Tại sao cơ thể hiện đại dễ thiếu hụt vi khoáng?',
            body: 'Đất canh tác bạc màu cùng hệ thống máy lọc nước RO tuy loại bỏ tạp chất nhưng đồng thời lọc mất phần lớn Canxi, Magie, Kali và các khoáng chất vi lượng tự nhiên. Donan giúp khôi phục tỷ lệ vi khoáng cân bằng, hỗ trợ cân bằng điện giải và tăng hiệu quả chuyển hóa năng lượng tế bào.',
            bullets: [
              'Nguồn khoáng chất thiên nhiên tinh khiết, tỷ lệ sinh học hài hòa giúp cơ thể dễ hấp thu',
              'Bổ sung trực tiếp cho nước uống gia đình dùng máy lọc RO mà không làm đổi mùi khó chịu',
              'Hỗ trợ giảm mệt mỏi thể chất, cải thiện chất lượng trao đổi chất cho người bận rộn và người cao tuổi',
            ],
          },
        ],
        metrics: [
          { value: '120g / 45g', label: 'Tùy chọn Hộp gia đình 120g & Gói nhỏ 45g tiện mang theo' },
          { value: '100%', label: 'Khoáng chất tự nhiên kiểm định nghiêm ngặt tại Nhật Bản' },
          { value: 'RO-Ready', label: 'Tối ưu bù khoáng cho nước tinh khiết máy lọc gia đình' },
        ],
      },
      ja: {
        cardTitle: '天然ミネラルの恵み',
        pageTitle: '「空気 × 水 × 塩（ミネラル） × 食 ＝ 健康」を支える微量ミネラル補給',
        eyebrow: '03 · ゲンセン健康哲学・コンセプト',
        lead: '「空気×水×塩（ミネラル）×食＝健康」というゲンセンの理念に基づき、RO浄水器の水や現代の精製食品で失われがちな必須微量ミネラルを自然なバランスで補います。',
        sections: [
          {
            heading: '吸収しやすい天然バランス処方で毎日のコンディションをサポート',
            body: '厳格な品質管理のもとで精製・配合された天然ミネラル成分が、体内の電解質バランスや酵素の働きを助け、疲れにくい健やかな身体づくりを支えます。',
            bullets: [
              'RO浄水やミネラル不足の飲料水に溶かして手軽においしく補給',
              '保存料・人工甘味料不使用の自然なミネラル設計',
              '働き盛りの方からご年配のご家族まで毎日続けやすい安心仕様',
            ],
          },
        ],
        metrics: [
          { value: '120g / 45g', label: '家庭用120gボックス＆携帯用45g小袋の2展開' },
          { value: '100%', label: '日本品質管理基準に基づく厳選天然ミネラル' },
          { value: 'RO水対応', label: '家庭の浄水・飲料水を手軽にミネラルバランス水へ' },
        ],
      },
    },
    {
      slug: 'quality-traceability',
      imageKey: 'consulting',
      kind: 'editorial',
      vi: {
        cardTitle: 'Kiểm soát chuẩn Nhật Bản',
        pageTitle: 'Quy trình kiểm định nguồn gốc & Đóng gói hộp 120g / gói 45g',
        eyebrow: '04 · Chất lượng & Truy xuất lô hàng',
        lead: 'Sản phẩm nhập khẩu nguyên quy cách từ Nhật Bản với mã truy xuất lô sản xuất minh bạch, đảm bảo độ tinh khiết và thời hạn sử dụng mới nhất.',
        sections: [
          {
            heading: 'Hai quy cách đóng gói linh hoạt: Hộp 120g & Gói chia nhỏ 45g',
            body: 'Bên cạnh hộp tiêu chuẩn 120g dùng tại gia đình và văn phòng (sẵn 9 hộp tại Đà Nẵng), khách hàng có thể đặt thêm quy cách gói 45g gọn nhẹ để mang theo khi công tác, tập luyện thể thao hoặc du lịch.',
            bullets: [
              'Kiểm định an toàn thực phẩm & hàm lượng kim loại nặng đạt chuẩn Nhật Bản',
              'Nhập khẩu định kỳ theo lô mới giúp giữ trọn độ tơi mịn của tinh thể khoáng',
              'Harian cung cấp đầy đủ chứng từ xuất xứ và hướng dẫn liều lượng bằng tiếng Việt & Nhật',
            ],
          },
        ],
      },
      ja: {
        cardTitle: '日本の徹底品質管理',
        pageTitle: 'トレーサビリティと日本国内一貫製造品質（120g・45g）',
        eyebrow: '04 · 品質・安全性',
        lead: '製造ロットごとの厳密な成分・衛生検査を経た正規日本仕様品。120gの標準ボックスと携帯に便利な45g小袋タイプをご用意しています。',
        sections: [
          {
            heading: '新鮮な製造ロットで計画輸入＆ダナン即納在庫対応',
            body: 'ダナン拠点に9箱常備在庫をご用意しているほか、大口・定期購入のご要望に合わせて日本より最新ロットを迅速に輸入手配いたします。',
            bullets: [
              '日本国内工場での厳格なロット別トレーサビリティ管理',
              '自宅用の120gボックスに加え、出張・スポーツ時に便利な45gタイプも展開',
              '日本語・ベトナム語両対応の摂取目安ガイドを同封',
            ],
          },
        ],
      },
    },
    {
      slug: 'usage-guide',
      imageKey: 'hero_living',
      kind: 'editorial',
      vi: {
        cardTitle: 'Hướng dẫn sử dụng',
        pageTitle: 'Cách sử dụng & Bảo quản Cân bằng khoáng chất Donan hằng ngày',
        eyebrow: '05 · Hướng dẫn thực hành',
        lead: 'Kết hợp đơn giản cùng nước lọc RO, trà thảo mộc, nước ép hoặc nêm nếm tinh tế trong nấu ăn gia đình.',
        sections: [
          {
            heading: 'Gợi ý 3 cách bổ sung vào sinh hoạt mỗi ngày',
            body: 'Donan hòa tan nhanh trong nước ở nhiệt độ thường hoặc nước ấm, không để lại vị mặn gắt nhờ cân bằng khoáng tự nhiên.',
            bullets: [
              'Pha 1 lượng nhỏ theo thìa đong vào bình nước uống 1–1,5 Lít dùng suốt ngày làm việc hoặc khi vận động thể thao',
              'Thêm nhẹ vào nước nấu cơm, nước dùng canh hoặc pha trà để tăng độ ngọt thanh và bù khoáng bữa ăn',
              'Đậy kín nắp hộp / khóa zip túi 45g sau mỗi lần dùng, bảo quản nơi khô ráo thoáng mát dưới 30°C',
            ],
          },
        ],
      },
      ja: {
        cardTitle: 'お召し上がり・活用法',
        pageTitle: '毎日の取り入れ方と保管ガイド — Donan',
        eyebrow: '05 · ご使用方法',
        lead: '毎日の飲料水、お茶、スープやお料理に手軽に加えるだけで、自然なミネラル習慣を無理なく継続いただけます。',
        sections: [
          {
            heading: '日常生活での3つの活用ステップ',
            body: '冷水にも温水にも溶けやすく、塩辛さを感じにくいまろやかな配合になっています。',
            bullets: [
              'マイボトルや1〜1.5Lのピッチャー水に少量を溶かし、日中・スポーツ時の水分補給に',
              '炊飯時のお水や味噌汁・スープに加えることで料理の旨味と栄養バランスを底上げ',
              '開封後は湿気を避けてしっかり密閉し、高温多湿を避けた冷暗所で保管してください',
            ],
          },
        ],
      },
    },
    {
      slug: 'specs-and-faq',
      imageKey: 'kirara_cream',
      kind: 'editorial',
      vi: {
        cardTitle: 'Thông số & FAQ',
        pageTitle: 'Thông số quy cách & Câu hỏi thường gặp — Donan',
        eyebrow: '06 · Thông số & Hỏi đáp',
        lead: 'Chi tiết đóng gói hộp 120g / gói 45g, nguồn gốc và giải đáp câu hỏi thường gặp về Cân bằng khoáng chất Donan.',
        sections: [],
        comparisonHeaders: ['Thông số', 'Chi tiết sản phẩm Donan'],
        comparisonRows: [
          { label: 'Quy cách đóng gói', primaryValue: 'Hộp tiêu chuẩn 120g · Tùy chọn gói chia nhỏ 45g' },
          { label: 'Nhóm sản phẩm', primaryValue: 'Khoáng chất tự nhiên tốt cho sức khỏe' },
          { label: 'Xuất xứ & tiêu chuẩn', primaryValue: 'Gensen Co., Ltd. · Nhập khẩu chính ngạch Nhật Bản' },
          { label: 'Đơn giá tham khảo', primaryValue: '1.390.000 VNĐ (Hộp 120g — sẵn 9 hộp tại Đà Nẵng)' },
        ],
        faqs: [
          {
            q: 'Nhà tôi đang dùng máy lọc nước RO có nên dùng thêm Donan không?',
            a: 'Rất nên dùng. Màng lọc RO loại bỏ gần như toàn bộ khoáng chất có lợi lẫn tạp chất, khiến nước bị "trơ" khoáng. Bổ sung Donan giúp tái tạo độ cân bằng vi khoáng tự nhiên, hỗ trợ hydrat hóa tốt hơn.',
          },
          {
            q: 'Hàng sẵn tại kho và thời gian đặt lô mới từ Nhật Bản mất bao lâu?',
            a: 'Harian hiện sẵn 9 hộp 120g tại kho Đà Nẵng có thể giao ngay trong 24–48 giờ. Với đơn số lượng lớn đặt lô mới từ Nhật Bản, thời gian nhập khẩu chính ngạch khoảng 10–14 ngày làm việc.',
          },
        ],
      },
      ja: {
        cardTitle: '仕様・FAQ',
        pageTitle: 'Donan ミネラルバランス 仕様とQ&A',
        eyebrow: '06 · 仕様・FAQ',
        lead: '内容量（120g/45g）、活用シーン、および在庫・お届けスケジュールのご案内。',
        sections: [],
        comparisonHeaders: ['項目', 'Donan 製品仕様'],
        comparisonRows: [
          { label: '内容量', primaryValue: '120g標準ボックス ／ 45gコンパクト小袋' },
          { label: 'カテゴリー', primaryValue: '健康サポート天然ミネラル' },
          { label: '製造・原産国', primaryValue: '日本（株式会社ゲンセン正規輸入品）' },
          { label: '標準参考価格', primaryValue: '1,390,000 VND（120g・ダナン在庫9点あり）' },
        ],
        faqs: [
          {
            q: '家庭でRO浄水器を使っていますが、Donanを併用するメリットはありますか？',
            a: 'はい、非常に相性が良いです。RO水は不純物と同時に天然ミネラルも取り除かれるため、Donanを加えることで水分吸収率とまろやかな飲み心地を高められます。',
          },
          {
            q: '現在の在庫状況と予約発注時の納期はどのくらいですか？',
            a: 'ダナン倉庫に9点在庫がございます（24〜48時間以内発送可）。まとまった数量での日本取り寄せの場合、通常10〜14営業日ほどでお届けいたします。',
          },
        ],
      },
    },
  ],

  'da-kirara': [
    makeInquiryTile('Đá Kirara', 'キララストーン (1kg)', 'bathroom'),
    makeOnlineShopTile('Đá Kirara', 'キララストーン (1kg)', '2.184.000 VNĐ', 'bathroom'),
    {
      slug: 'mineral-stone-mechanism',
      imageKey: 'bathroom',
      kind: 'editorial',
      vi: {
        cardTitle: 'Cơ chế thanh lọc & Ion âm',
        pageTitle: 'Đá khoáng tự nhiên Kirara 1kg — Thanh lọc nước & Điều hòa vi khí hậu',
        eyebrow: '03 · Cơ chế khoáng chất tự nhiên',
        lead: 'Túi 1kg đá khoáng thạch tự nhiên tuyển chọn từ Nhật Bản, giàu nguyên tố vi lượng giúp giải phóng ion âm ổn định, làm mềm cụm phân tử nước và khử mùi không gian kín.',
        sections: [
          {
            heading: 'Bền vững nhiều năm — Chỉ cần rửa sạch & phơi nắng tái tạo',
            body: 'Không giống lõi lọc than hoạt tính phải vứt bỏ sau vài tháng, đá khoáng Kirara giữ cấu trúc tinh thể ổn định qua nhiều năm sử dụng. Mỗi lần tiếp xúc với nước hoặc luồng khí lưu thông, bề mặt đá tiếp tục giải phóng ion có lợi một cách tự nhiên.',
            bullets: [
              'Làm mềm độ cứng thô của nước, giảm vị Clo nhẹ và giúp nước uống có hậu vị ngọt thanh',
              'Phát tán ion âm liên tục giúp không gian kín như tủ lạnh, phòng ngủ, tủ giày luôn thông thoáng',
              'An toàn tuyệt đối, không chứa chất tẩy rửa hay phụ gia nhân tạo',
            ],
          },
        ],
        metrics: [
          { value: '1 kg', label: 'Trọng lượng túi tiêu chuẩn đá khoáng tự nhiên Nhật Bản' },
          { value: 'Đa năng 4in1', label: 'Bình nước uống · Bồn tắm · Tủ lạnh · Phòng kín' },
          { value: '25 bộ', label: 'Sẵn kho Harian Đà Nẵng — giao nhanh 24–48 giờ' },
        ],
      },
      ja: {
        cardTitle: '浄水・マイナスイオン作用',
        pageTitle: 'キララストーン 1kg — 天然ミネラル溶出とマイナスイオン空間調整',
        eyebrow: '03 · 製品メカニズム',
        lead: '厳選された日本産天然鉱石1kgが水や空間に有益な微量ミネラルとマイナスイオンを安定供給し、まろやかな水質と澄んだ室内環境を整えます。',
        sections: [
          {
            heading: '使い捨て不要 — 水洗いと天日干しで長期間パワーを維持',
            body: '一般的な活性炭カートリッジとは異なり、鉱石そのものの物理・結晶構造が機能するため溶け崩れが少なく、月1回の水洗いと天日干しで何年も繰り返し活用できます。',
            bullets: [
              '水道水の角を取り、お茶やコーヒーが一段と美味しくなるまろやかな軟水化サポート',
              '冷蔵庫・シューズボックス・クローゼット・寝室のこもったニオイをマイナスイオンでリフレッシュ',
              '化学薬剤不使用で、飲料用途にも入浴用途にも安心の100%天然素材',
            ],
          },
        ],
        metrics: [
          { value: '1kg', label: 'たっぷり使える日本産天然鉱石標準パック' },
          { value: '4用途対応', label: '飲料水・温泉風入浴・冷蔵庫脱臭・室内空気ケア' },
          { value: '25個在庫', label: 'ダナン倉庫にて即納発送可能' },
        ],
      },
    },
    {
      slug: 'water-microclimate',
      imageKey: 'hero_living',
      kind: 'editorial',
      vi: {
        cardTitle: '4 Ứng dụng thực tế',
        pageTitle: '4 Cách ứng dụng Đá Kirara tối ưu nước uống, bồn tắm & khử mùi',
        eyebrow: '04 · Ứng dụng đa năng tại gia đình',
        lead: 'Một túi 1kg có thể chia thành nhiều phần nhỏ để phục vụ đồng thời cho phòng bếp, phòng tắm và phòng ngủ.',
        sections: [
          {
            heading: '1. Làm mềm nước uống, pha trà đạo & cà phê',
            body: 'Thả 100–200g đá đã rửa sạch và đun sôi sơ vào bình thủy tinh 1,5–2 Lít và ngâm qua đêm (6–8 giờ). Nước trở nên thanh nhẹ, êm dịu cổ họng và giữ trọn hương thơm nguyên bản của lá trà xanh hay cà phê rang mộc.',
          },
          {
            heading: '2. Ngâm bồn tắm khoáng nóng thư giãn (Onsen tại gia)',
            body: 'Cho khoảng 500g đá vào túi lưới thả vào bồn nước ấm 38–40°C trước khi tắm 15 phút giúp nước dịu êm với làn da nhạy cảm và hỗ trợ thư giãn cơ bắp sau giờ làm việc.',
          },
          {
            heading: '3 & 4. Khử mùi tủ lạnh, tủ giày, tủ quần áo & phòng ngủ',
            body: 'Đặt 150–250g đá khô trong chén sứ hoặc túi vải thoáng khí ở ngăn mát tủ lạnh, tủ giày hoặc đầu giường để hấp thụ mùi thức ăn ám lẫn và giữ luồng không khí dễ chịu.',
          },
        ],
      },
      ja: {
        cardTitle: '4つの実践活用シーン',
        pageTitle: '飲料水・入浴・冷蔵庫・空間消臭 — キララストーン4つの活用法',
        eyebrow: '04 · 活用シーン',
        lead: '1kgパックを小分けにして、キッチン・バスルーム・リビングの複数箇所で同時にご活用いただけます。',
        sections: [
          {
            heading: '1. 飲料水・日本茶・コーヒーのまろやか化',
            body: '煮沸洗浄した鉱石100〜200gを1.5〜2Lのガラスポットに入れて一晩（6〜8時間）置くだけで、口当たりの柔らかい美味しい水になり、茶葉や珈琲の風味を引き立てます。',
          },
          {
            heading: '2. ご自宅で楽しむミネラル温浴（おうち温泉）',
            body: 'ネットに入れた鉱石約500gを浴槽に沈めてお湯を張ることで、肌当たりがやわらかくなり、1日の疲れを癒すリラックスバスタイムを演出します。',
          },
          {
            heading: '3 & 4. 冷蔵庫・靴箱・クローゼットの自然脱臭',
            body: '通気性のある小袋や陶器皿に乾燥状態の鉱石を150〜250g入れて置くだけで、冷蔵庫内の食品移り臭や玄関の湿気臭を抑えます。',
          },
        ],
      },
    },
    {
      slug: 'maintenance-guide',
      imageKey: 'consulting',
      kind: 'editorial',
      vi: {
        cardTitle: 'Vệ sinh & Tái tạo đá',
        pageTitle: 'Hướng dẫn làm sạch ban đầu & Tái tạo năng lượng đá định kỳ',
        eyebrow: '05 · Hướng dẫn bảo dưỡng',
        lead: 'Quy trình bảo dưỡng hoàn toàn bằng nước sạch và ánh nắng tự nhiên, tuyệt đối không dùng xà phòng hay hóa chất tẩy rửa.',
        sections: [
          {
            heading: 'Chuẩn bị trước lần đầu sử dụng (cho bình nước uống)',
            body: 'Xả sạch bụi khoáng tự nhiên bám ngoài viên đá dưới vòi nước chảy, sau đó đun sôi trong nồi nước sạch khoảng 5–10 phút rồi để nguội tự nhiên trước khi cho vào bình thủy tinh ngâm nước uống.',
          },
          {
            heading: 'Vệ sinh & phơi nắng tái tạo mỗi tháng 1 lần',
            body: 'Với đá ngâm nước hoặc đặt tủ lạnh/bồn tắm: định kỳ 3–4 tuần lấy đá ra chà rửa nhẹ bằng nước sạch (không dùng nước rửa chén), sau đó phơi dưới ánh nắng nhẹ 2–3 giờ để tái tạo bề mặt khoáng chất thông thoáng.',
          },
        ],
      },
      ja: {
        cardTitle: 'お手入れ・再生方法',
        pageTitle: '初回洗浄と月1回の簡単天日干しメンテナンス',
        eyebrow: '05 · お手入れガイド',
        lead: '合成洗剤は一切不要。流水洗いと天日乾燥だけで長年にわたり清潔かつパワフルにご使用いただけます。',
        sections: [
          {
            heading: '初回使用前のお手入れ（飲料水用）',
            body: '表面の細かな鉱物粉を流水でしっかり洗い流した後、きれいな鍋で5〜10分ほど煮沸消毒し、冷ましてから飲料水ポットへ入れてください。',
          },
          {
            heading: '月1回の水洗いと天日干しリフレッシュ',
            body: '3〜4週間に一度、水洗い（食器用洗剤は使用厳禁）したうえで直射日光の下で2〜3時間しっかり乾かすことで、吸着機能がリセットされ衛生的にお使いいただけます。',
          },
        ],
      },
    },
    {
      slug: 'specs-and-faq',
      imageKey: 'bathroom',
      kind: 'editorial',
      vi: {
        cardTitle: 'Thông số & FAQ',
        pageTitle: 'Thông số sản phẩm & Câu hỏi thường gặp — Đá Kirara 1kg',
        eyebrow: '06 · Thông số & Hỏi đáp',
        lead: 'Quy cách đóng gói 1kg, tồn kho hiện tại và giải đáp những câu hỏi thường gặp về Đá khoáng Kirara.',
        sections: [],
        comparisonHeaders: ['Thông số', 'Chi tiết tiêu chuẩn Đá Kirara'],
        comparisonRows: [
          { label: 'Quy cách đóng gói', primaryValue: 'Túi tiêu chuẩn 1kg (có thể chia nhỏ theo từng mục đích sử dụng)' },
          { label: 'Tác động chính', primaryValue: 'Khoáng hóa nhẹ & làm mềm nước · Tạo ion âm · Hấp thụ mùi phòng kín' },
          { label: 'Tuổi thọ vật lý', primaryValue: 'Nhiều năm sử dụng liên tục (tái tạo định kỳ bằng nước sạch & phơi nắng)' },
          { label: 'Tồn kho tại Đà Nẵng', primaryValue: '25 bộ sẵn sàng giao nhanh trong 24–48 giờ toàn quốc' },
          { label: 'Xuất xứ & Đơn giá', primaryValue: 'Nhật Bản · 2.184.000 VNĐ' },
        ],
        faqs: [
          {
            q: 'Đá Kirara có bị mòn hay phải thay mới hàng tháng không?',
            a: 'Không. Đây là đá khoáng tự nhiên có độ cứng cao, chỉ cần vệ sinh định kỳ mỗi tháng bằng nước sạch và phơi nắng nhẹ để dùng ổn định suốt nhiều năm.',
          },
          {
            q: 'Tôi có thể dùng chung 1 túi 1kg cho cả bình nước và tủ lạnh cùng lúc không?',
            a: 'Hoàn toàn được — nhưng hãy chia hẳn thành 2 phần riêng biệt ngay từ đầu (ví dụ 200g dùng riêng cho bình nước uống và 200g dùng riêng đặt tủ lạnh hoặc tủ giày) để đảm bảo vệ sinh an toàn thực phẩm.',
          },
        ],
      },
      ja: {
        cardTitle: '仕様・FAQ',
        pageTitle: 'キララストーン 仕様詳細・よくあるご質問',
        eyebrow: '06 · 仕様・FAQ',
        lead: '容量1kg規格、使用方法、お手入れに関するQ&A。',
        sections: [],
        comparisonHeaders: ['項目', 'キララストーン 仕様'],
        comparisonRows: [
          { label: '内容量', primaryValue: '1kg標準パック（用途に合わせて小分け可能）' },
          { label: '主な作用', primaryValue: '飲料水の軟水化・ミネラル溶出・マイナスイオン発生・脱臭' },
          { label: '使用目安', primaryValue: '水洗いと天日干しメンテナンスで長期間繰り返し使用可能' },
          { label: '在庫数', primaryValue: '25個（ダナン倉庫より24〜48時間以内発送）' },
          { label: '原産国・価格', primaryValue: '日本 ／ 2,184,000 VND' },
        ],
        faqs: [
          {
            q: '毎月買い替える必要はありますか？',
            a: 'いいえ。硬度の高い天然鉱石のため溶け崩れにくく、月1回の水洗いと天日干しで何年も繰り返しお使いいただけます。',
          },
          {
            q: '1袋（1kg）を飲料水用と冷蔵庫脱臭用に同時に分けて使えますか？',
            a: 'はい、可能です。衛生管理のため、最初に「飲料水用（例：200g）」「入浴用」「脱臭用」と用途ごとに小分けして管理されることをおすすめします。',
          },
        ],
      },
    },
  ],
};

const SUBDETAIL_EN_FALLBACKS: Record<string, Record<string, ProductSubDetailLocale>> = {
  'kirara-cream': {
    'who-is-kirara': {
      cardTitle: 'What is Kirara?',
      pageTitle: 'What is Kirara? Japanese Natural Mineral Wall Material Philosophy',
      eyebrow: '03 · Product Overview',
      lead: 'KIRARA is a 2-in-1 natural cream interior wall material (primer & topcoat) developed from Yonaguni fossilized coral and Aichi Danto stone, turning enclosed rooms into crisp, forest-fresh air.',
      sections: [
        {
          heading: 'Synergy of Yonaguni Fossilized Coral & Aichi Danto Stone',
          body: 'Unlike synthetic vinyl wallpapers or plastic acrylic paints that seal walls airtight, Kirara cures into a microporous mineral matrix—free of crystalline silica and formulated strictly with Eco Binder and food-grade pigments.',
          bullets: [
            'Delivers ~2.5× the moisture absorption/release of traditional Shikkui lime plaster for 20+ years',
            '0% Crystalline Silica & 0% VOC — F☆☆☆☆ and MLIT Non-Combustible certified in Japan',
            'High-elasticity cream formula reduces hairline wall cracks over time',
            'Balanced 32-shade natural palette suitable for minimalist homes, schools, and clinics',
          ],
        },
      ],
      metrics: [
        { value: '~2.5×', label: 'Humidity regulation capacity vs. traditional Shikkui plaster' },
        { value: '10,000+', label: 'Homes, schools, and clinics installed across Japan' },
        { value: '32 shades', label: 'Food-grade natural mineral color palette' },
      ],
    },
    'easy-installation': {
      cardTitle: 'Easy Installation & Cost Efficiency',
      pageTitle: 'Easy Application & Long-Term Lifecycle Cost Efficiency',
      eyebrow: '04 · Application & Economics',
      lead: 'Supplied ready-mixed in 19L and 6L pails: open and apply directly by roller, spray gun, or trowel—even right over clean existing wallpaper using Clean Sealer.',
      sections: [
        {
          heading: 'Apply Directly Over Existing Vinyl Wallpaper',
          body: 'For renovation projects, Kirara eliminates dusty wall stripping and disposal waste. Simply clean the surface, prime with Clean Sealer, and roll or trowel Kirara smoothly.',
          bullets: [
            '19L pail coverage: ~35 m² (roller/sprayer, 2 coats) or ~25 m² (trowel, 1mm)',
            'Zero powder mixing dust; safe to apply inside occupied apartments and offices',
            'Seamless spot touch-up whenever minor scuffs occur',
            '20+ year functional lifespan outperforms replacing vinyl wallpaper every 5–7 years',
          ],
        },
      ],
      metrics: [
        { value: '35 m²', label: '19L pail coverage by roller / spray gun (2 coats)' },
        { value: '25 m²', label: '19L pail coverage by hand trowel' },
        { value: '> 20 yrs', label: 'Functional durability without periodic replacement' },
      ],
      comparisonHeaders: ['Comparison Factor', 'KIRARA Cream', 'Vinyl Wallpaper / Acrylic Paint'],
      comparisonRows: [
        { label: 'Preparation', primaryValue: 'Pre-mixed cream pail, ready out of the box', secondaryValue: 'Multi-step powder mixing or glue prep' },
        { label: 'Renovation', primaryValue: 'Coats over clean wallpaper with Clean Sealer', secondaryValue: 'Costly stripping & landfill waste' },
        { label: 'Spot Repair', primaryValue: 'Seamless local dab touch-up', secondaryValue: 'Requires replacing entire wall panel' },
        { label: '15-Year Cost', primaryValue: 'Single investment, zero replacement cycles', secondaryValue: 'Replaced 2–3 times due to peeling/yellowing' },
      ],
    },
    safety: {
      cardTitle: "Kirara's Safety",
      pageTitle: 'Uncompromising Safety — F☆☆☆☆ & MLIT Non-Combustible Certified',
      eyebrow: '05 · Health & Fire Safety Verification',
      lead: 'So gentle that applicators can touch it bare-handed without chemical respirators, and families can occupy rooms immediately after drying.',
      sections: [
        {
          heading: 'Zero Formaldehyde · Zero VOC · 0% Crystalline Silica',
          body: 'KIRARA holds Japan’s highest emission rating (F☆☆☆☆) and Ministry of Land, Infrastructure, Transport and Tourism (MLIT) Non-Combustible certification—preventing toxic smoke even under extreme heat.',
          bullets: [
            'Free of Formaldehyde, Toluene, Xylene, and synthetic fungicides',
            'MLIT Non-Combustible Material certification suitable for commercial buildings',
            'No toxic smoke or off-gassing',
            'Trusted in ~100 nurseries/schools and ~40 dental/pediatric clinics in Japan',
          ],
        },
      ],
      metrics: [
        { value: 'F☆☆☆☆', label: 'Highest JIS formaldehyde emission safety grade' },
        { value: '0%', label: 'Crystalline Silica & harmful VOC content' },
        { value: '140+', label: 'Schools, nurseries & clinics installed in Japan' },
      ],
    },
    'deodorizing-purification': {
      cardTitle: 'Deodorizing & Air Purification',
      pageTitle: 'Continuous Deodorization & Active Air Purification',
      eyebrow: '06 · Passive Air Filtration Technology',
      lead: 'Removes up to 98% of ammonia, cigarette smoke, food, and pet odors within 2 hours while generating ~300 negative ions/cc.',
      sections: [
        {
          heading: 'JIS-Verified Deodorizing, Antibacterial & Anti-Mold Performance',
          body: 'Rather than masking smells with fragrance, millions of microscopic coral pores trap and break down odor molecules continuously.',
          bullets: [
            '98% deodorization of ammonia (NH₃), H₂S, and smoke within 2 hours',
            'Antibacterial JIS Z 2801 & anti-mold JIS Z 2911A compliant',
            '~300 negative ions/cc (~10× typical air-conditioned office air)',
          ],
        },
      ],
      metrics: [
        { value: '98%', label: 'Verified odor reduction within 2 hours' },
        { value: '300 /cc', label: 'Negative-ion density across coated walls' },
        { value: 'JIS Z 2801', label: 'Antibacterial & JIS Z 2911A anti-mold compliance' },
      ],
    },
    'temperature-control': {
      cardTitle: 'Temperature Control Function',
      pageTitle: 'Thermal Comfort Regulation & Far-Infrared Radiation',
      eyebrow: '07 · Microclimate & Energy Efficiency',
      lead: 'Acts as a natural thermal buffer across walls—reducing harsh summer heat transfer and chilly winter surface radiation.',
      sections: [
        {
          heading: 'Gentle Far-Infrared Radiation & Even Room Temperature',
          body: 'Aichi Danto stone and porous fossilized coral slow rapid conductive heat loss, reducing ceiling-to-floor temperature stratification.',
          bullets: [
            'Reduces cold-feet/warm-head discomfort under continuous A/C or heating',
            'Helps lower monthly HVAC energy load',
            'Prevents cold wall condensation to the touch',
          ],
        },
      ],
      metrics: [
        { value: '6–14 μm', label: 'Bio-compatible far-infrared mineral band' },
        { value: 'Balanced', label: 'Minimizes floor-to-ceiling temperature spread' },
        { value: 'Efficient', label: 'Supports lower residential & office HVAC draw' },
      ],
    },
    'humidity-control': {
      cardTitle: 'Humidity Control Function',
      pageTitle: 'Passive Humidity Regulation — Preventing Damp Mold & Dry Air',
      eyebrow: '08 · Autonomous Humidity Buffering',
      lead: 'Absorbs excess moisture during humid monsoon seasons and gently releases stored moisture in dry air-conditioned rooms—maintaining 40%–60% RH.',
      sections: [
        {
          heading: '~2.5× Faster Moisture Buffering Than Traditional Lime Plaster',
          body: 'Operating purely through natural capillary breathing with zero electricity, Kirara protects respiratory comfort, wooden furniture, and electronics.',
          bullets: [
            'Prevents condensation and black mold along coastal or north-facing walls',
            'Zero electricity, zero noise, and zero water-tank maintenance',
            'Protects wardrobes, instruments, books, and interior woodwork',
          ],
        },
      ],
      metrics: [
        { value: '~2.5×', label: 'Moisture buffering vs. traditional Shikkui plaster' },
        { value: '40–60%', label: 'Optimal relative humidity zone for health' },
        { value: '0 W', label: '100% passive humidity regulation' },
      ],
    },
    'training-events': {
      cardTitle: 'Kirara Training & Events',
      pageTitle: 'Certified Wall Artist Training & Hands-On Workshops',
      eyebrow: '09 · Partner Certification & Workshops',
      lead: 'Hands-on training to become an officially certified Kirara Wall Artist—unlocking partner trade pricing and Japanese application standards.',
      sections: [
        {
          heading: 'Become a Certified Wall Artist Partner in Vietnam',
          body: 'Harian hosts practical workshops in Da Nang covering trowel textures, roller finishing, spray application, substrate priming, and project estimation.',
          bullets: [
            'Master 3 finishes: artistic trowel, fast roller, and pressure sprayer',
            'Substrate assessment & Clean Sealer priming across 32 shades',
            'Official certification and partner wholesale pricing access',
          ],
        },
      ],
      metrics: [
        { value: '1 Day', label: 'Intensive hands-on Wall Artist certification' },
        { value: '3 Methods', label: 'Trowel · Roller · Airless Spray' },
        { value: 'Partner', label: 'Dedicated wholesale pricing for graduates' },
      ],
    },
    specifications: {
      cardTitle: 'Kirara Specifications List',
      pageTitle: 'KIRARA Cream Technical Specifications & Coverage Data',
      eyebrow: '10 · Official Technical Data Sheet',
      lead: 'Complete breakdown of composition, coverage rates per tool, storage temperature, and Japanese safety approvals.',
      sections: [
        {
          heading: 'Storage & Pre-Application Care',
          body: 'Free of harsh synthetic preservatives, store indoors away from freezing or direct sunlight (4°C–40°C) and use ideally within 3 months of production.',
        },
      ],
      comparisonHeaders: ['Specification', 'KIRARA Cream Standard Data'],
      comparisonRows: [
        { label: 'Commercial Name', primaryValue: 'KIRARA — 2-in-1 Natural Mineral Cream Wall Finish' },
        { label: 'Manufacturer', primaryValue: 'Gensen Co., Ltd. (Japan) · Distributor: Harian Vietnam' },
        { label: 'Core Materials', primaryValue: 'Yonaguni fossilized coral, Aichi Danto stone, Eco Binder, food-grade pigments' },
        { label: 'Packaging', primaryValue: '19L Standard Pail & 6L Compact Pail' },
        { label: 'Coverage (19L)', primaryValue: '~25 m² (trowel 1mm) · ~35 m² (roller/sprayer 2 coats)' },
        { label: 'Drying Time', primaryValue: 'Touch dry 2–4h · Full cure ~24h (ambient dependent)' },
        { label: 'Storage', primaryValue: '4°C–40°C indoors; recommended within 3 months of manufacture' },
        { label: 'Certifications', primaryValue: 'F☆☆☆☆ (JIS), MLIT Non-Combustible Certified' },
        { label: 'Substrates', primaryValue: 'Gypsum board, plywood, vinyl wallpaper, mortar, concrete (use Clean Sealer)' },
        { label: 'Color Palette', primaryValue: '32 Natural Mineral Shades (#01 Coral White – #32 Custom)' },
      ],
    },
    faq: {
      cardTitle: 'Frequently Asked Questions',
      pageTitle: 'Frequently Asked Questions — KIRARA Cream (FAQ)',
      eyebrow: '11 · Technical FAQ',
      lead: 'Answers to common questions from homeowners, architects, and contractors regarding durability, DIY use, maintenance, and delivery.',
      sections: [],
      faqs: [
        { q: 'How long do Kirara’s deodorizing and humidity functions last?', a: 'Functionally semi-permanent (>20 years). Because natural porous coral and stone minerals perform the buffering rather than chemical additives, properties remain active for decades.' },
        { q: 'Can it be applied directly over existing vinyl wallpaper or as a DIY project?', a: 'Yes. On intact wallpaper or painted drywall, clean dust/grease, apply Clean Sealer primer, and roll or trowel Kirara Cream without tearing down old walls.' },
        { q: 'Is it safe for infants and pets during and right after application?', a: 'Yes. F☆☆☆☆ certified, zero crystalline silica, and food-grade pigments mean no harsh fumes or off-gassing.' },
        { q: 'How do I clean smudges or repair minor scratches?', a: 'Light smudges lift with a clean pencil eraser or damp wrung cloth. Scratches can be touched up seamlessly with a dab of matching Kirara Cream.' },
        { q: 'What is the lead time for custom shades in Vietnam?', a: '#01 Coral White and popular shades ship rapidly from stock; custom 32-shade orders are scheduled immediately upon order confirmation.' },
      ],
    },
    examples: {
      cardTitle: 'Examples of Kirara Work',
      pageTitle: 'Featured Case Studies & Kirara Installations',
      eyebrow: '12 · Project Portfolio',
      lead: 'Proven across 10,000+ homes, ~100 nurseries/schools, ~40 medical/dental clinics, and ~40 hospitality venues.',
      sections: [
        {
          heading: 'From Minimalist Coastal Villas to Medical & Educational Spaces',
          body: 'Soft matte mineral light diffusion and rapid odor control make Kirara ideal across both residential and public spaces.',
        },
      ],
      examples: [
        { title: 'Minimalist Coastal Villa Living & Bedrooms', location: 'Da Nang · Vietnam', area: '185 m² walls & ceilings', note: '#01 Coral White paired with #05 Silky Beige prevents coastal humidity dampness and clears new-wood odors.' },
        { title: 'Japanese-Standard Nurseries & Kindergartens', location: 'Tokyo & Aichi · Japan', area: '~100 schools', note: 'F☆☆☆☆ zero-emission walls protect classroom air quality and sensitive skin.' },
        { title: 'Dental & Pediatric Clinics', location: 'Osaka & Da Nang', area: '~40 clinics', note: 'Eliminates antiseptic clinic odors to create a calm waiting atmosphere.' },
        { title: 'Japanese Dining & Specialty Coffee Lounges', location: 'Aichi & Central Vietnam', area: '~40 F&B venues', note: 'Clears overnight cooking and smoke odors while showcasing warm #19 Cocoa & #12 Apricot tones.' },
      ],
    },
  },
  'kirara-liquid': {
    'overview-mineral-mist': {
      cardTitle: 'About Kirara Liquid',
      pageTitle: 'KIRARA LIQUID — 100% Natural Ionized Mineral Solution',
      eyebrow: '03 · Product Overview',
      lead: 'Clear, colorless aqueous mineral solution enriched with natural Ca²⁺ and Mg²⁺ ions—transforming interior surfaces and car cabins into active air-purifying zones.',
      sections: [
        {
          heading: 'Acute Oral Toxicity Tested — Safe Around Infants & Pets',
          body: 'Free of alcohol, synthetic surfactants, and artificial fragrance, Kirara Liquid leaves zero white residue or stains across fabrics, leather, and walls.',
          bullets: [
            '100% natural Ca²⁺ & Mg²⁺ mineral water without discoloration or stickiness',
            'Safe for nurseries, clinics, bedrooms, curtains, sofas, and vehicles',
            'Quick deployment with zero renovation downtime',
          ],
        },
      ],
      metrics: [
        { value: '100%', label: 'Natural Ca²⁺ & Mg²⁺ ion water (oral toxicity tested)' },
        { value: '6.27 μm', label: 'Far-infrared antioxidant microclimate wavelength' },
        { value: '3 Sizes', label: '500ML Spray · 700ML Bottle · 10L Commercial Tank' },
      ],
    },
    'tvoc-pm25-purification': {
      cardTitle: 'TVOC & PM2.5 Purification',
      pageTitle: 'Formaldehyde/TVOC Breakdown & PM2.5 Suppression',
      eyebrow: '04 · Air Purification Mechanism',
      lead: 'Breaks down harmful VOCs from new furniture adhesives while settling airborne PM2.5 dust and inhibiting E. coli and S. aureus.',
      sections: [
        {
          heading: 'Antioxidant Microclimate & Airborne Particulate Reduction',
          body: 'Mineral ion micro-layers neutralize static suspension of PM2.5 and allergens while suppressing microbial growth on textiles and walls.',
        },
      ],
      metrics: [
        { value: 'TVOC', label: 'Breaks down Formaldehyde & new-interior gases' },
        { value: 'PM2.5', label: 'Settles fine suspended airborne particulates' },
        { value: '6.27 μm', label: 'Far-infrared antioxidant comfort' },
      ],
    },
    'automotive-treatment': {
      cardTitle: 'Automotive Cabin Coating',
      pageTitle: 'Mineral Air Purification Coating for Car Interiors',
      eyebrow: '05 · Automotive Care Service',
      lead: 'Neutralizes new-car plastic odors, A/C mustiness, and smoke while radiating 6.27-micron far-infrared comfort to ease motion sickness.',
      sections: [
        {
          heading: 'Japanese-Standard Cabin Coating (From 1,100,000 VNĐ)',
          body: 'Precision micro-mist across headliners, leather/fabric seats, floor mats, and A/C vents—safe for vehicle electronics and family passengers.',
        },
      ],
      metrics: [
        { value: '1.1M VNĐ', label: 'Full cabin coating service starting price' },
        { value: '6.27 μm', label: 'Helps reduce fatigue & motion sickness' },
        { value: '45 min', label: 'Fast completion, ready to drive' },
      ],
    },
    'specs-and-faq': {
      cardTitle: 'Specs & FAQ',
      pageTitle: 'KIRARA LIQUID Specifications & Frequently Asked Questions',
      eyebrow: '06 · Specifications & FAQ',
      lead: 'Bottle and tank sizes, safety test profile, and practical usage FAQ.',
      sections: [],
      comparisonHeaders: ['Specification', 'KIRARA LIQUID Standard Details'],
      comparisonRows: [
        { label: 'Pack Sizes', primaryValue: '500ML Spray · 700ML Refill · 10L Commercial Tank' },
        { label: 'Active Formula', primaryValue: '100% natural Ca²⁺ & Mg²⁺ ionized mineral water' },
        { label: 'Safety Verification', primaryValue: 'Acute oral toxicity tested · Alcohol & fragrance free' },
        { label: 'Far-Infrared Band', primaryValue: '6.27 microns' },
      ],
      faqs: [
        { q: 'How long does one professional spray coating last?', a: 'On undisturbed walls, curtains, and headliners, mineral ions maintain active deodorizing protection for 6–12 months.' },
        { q: 'Can I spray directly on baby bedding or pet areas?', a: 'Yes. It is 100% natural mineral water tested for acute oral safety with no rinsing needed.' },
      ],
    },
  },
  'gko-tay-nam-moc': {
    'spore-mechanism': {
      cardTitle: 'Spore Eradication Mechanism',
      pageTitle: 'Japanese HMSS Mold Spore Eradication & Tobacco Tar Removal',
      eyebrow: '03 · HMSS Penetration Technology',
      lead: 'Recommended by Japan’s House Mold Security System (HMSS) to penetrate deep fungal spores and strip stubborn yellow tobacco tar stains.',
      sections: [
        {
          heading: 'Deep Root Treatment Without Abrasive Scrubbing',
          body: 'Penetrates grout, mortar, timber, and wallpaper to disable mold nuclei and eliminate nicotine yellowing with 99.9% sanitizing efficacy.',
        },
      ],
      metrics: [
        { value: 'HMSS', label: 'Recommended under Japan HMSS mold standard' },
        { value: '99.9%', label: 'E. coli & Staphylococcus aureus elimination' },
        { value: '112 Units', label: 'In stock in Da Nang (from 270,000 VNĐ)' },
      ],
    },
    'safety-food-grade': {
      cardTitle: 'Safety & Low Chlorine Odor',
      pageTitle: 'Food-Grade Auxiliary Blend — Minimized Harsh Odor',
      eyebrow: '04 · User Safety & Kirara Prep',
      lead: 'Food-grade additives reduce stinging chlorine fumes indoors while leaving an ideal clean substrate prior to Kirara Cream finishing.',
      sections: [
        {
          heading: 'Ideal Pre-Treatment Reset Before Kirara Cream',
          body: 'Resets damp, mold-affected masonry cleanly before priming with Clean Sealer and finishing with Kirara Cream.',
        },
      ],
    },
    'application-guide': {
      cardTitle: '3-Step Application Guide',
      pageTitle: 'How to Remove Mold & Tobacco Stains in 3 Simple Steps',
      eyebrow: '05 · Application Guide',
      lead: 'Apply evenly by spray or brush with no power tools or heavy scraping required.',
      sections: [
        { heading: 'Step 1 — Dust & Dry Surface Prep', body: 'Gently brush off loose dust so G.K.O contacts mold roots directly.' },
        { heading: 'Step 2 — Spray Evenly & Wait 15–30 Minutes', body: 'Coat affected zones plus 10–15cm border and let penetrate naturally.' },
        { heading: 'Step 3 — Rinse or Wipe Clean with Damp Cloth', body: 'Rinse wet areas with water or wipe interior walls cleanly and let dry.' },
      ],
    },
    'specs-and-faq': {
      cardTitle: 'Specs & FAQ',
      pageTitle: 'G.K.O Specifications & FAQ',
      eyebrow: '06 · Specifications & FAQ',
      lead: '200ML, 500ML, and 4L tank specs plus practical answers.',
      sections: [],
      comparisonHeaders: ['Item', 'G.K.O Specification'],
      comparisonRows: [
        { label: 'Sizes', primaryValue: '200ML (270,000 VNĐ) · 500ML · 4L Commercial Tank' },
        { label: 'Standard', primaryValue: 'Japan HMSS Recommended Protocol' },
        { label: 'Sanitizing', primaryValue: '99.9% E. coli & S. aureus reduction' },
      ],
      faqs: [
        { q: 'How much area does one 200ML bottle cover?', a: 'Approximately 4–6 m² of mold-affected wall, tile grout, or ceiling corners.' },
        { q: 'Does G.K.O remove aged yellow nicotine stains?', a: 'Yes, it effectively breaks down nicotine and tobacco tar staining prior to repainting.' },
      ],
    },
  },
  'can-bang-khoang-chat-donan': {
    'mineral-origin': {
      cardTitle: 'Natural Mineral Philosophy',
      pageTitle: '"Air × Water × Minerals × Food = Health" — Donan Trace Minerals',
      eyebrow: '03 · Gensen Wellness Philosophy',
      lead: 'Replenishes bioavailable trace minerals commonly removed by RO drinking water filtration and modern diets.',
      sections: [
        {
          heading: 'Why Re-Mineralize Purified RO Water?',
          body: 'RO membranes remove impurities along with beneficial Calcium, Magnesium, and trace elements. Donan restores natural electrolyte balance cleanly.',
        },
      ],
      metrics: [
        { value: '120g / 45g', label: 'Family Box 120g & Portable Travel Pack 45g' },
        { value: '100%', label: 'Japanese quality-verified natural trace minerals' },
        { value: 'RO-Ready', label: 'Ideal daily re-mineralization for RO filtered water' },
      ],
    },
    'quality-traceability': {
      cardTitle: 'Japanese Quality Control',
      pageTitle: 'Batch Traceability & Packaging (120g / 45g)',
      eyebrow: '04 · Quality & Provenance',
      lead: 'Imported directly from Japan with full lot-level quality verification and bilingual usage instructions.',
      sections: [
        {
          heading: 'Fresh Japanese Production Batches & Da Nang Stock',
          body: 'Available in 120g boxes from Da Nang warehouse stock alongside compact 45g travel packs for active lifestyles.',
        },
      ],
    },
    'usage-guide': {
      cardTitle: 'Daily Usage Guide',
      pageTitle: 'How to Incorporate Donan into Your Daily Hydration & Meals',
      eyebrow: '05 · Practical Usage',
      lead: 'Dissolves cleanly in cold or warm water, tea, coffee, soups, and rice cooking.',
      sections: [
        {
          heading: 'Three Simple Daily Ways',
          body: 'Mix a measured pinch into your 1–1.5L water pitcher, add lightly while cooking rice or broth, and keep the container sealed dry below 30°C.',
        },
      ],
    },
    'specs-and-faq': {
      cardTitle: 'Specs & FAQ',
      pageTitle: 'Donan Mineral Balance Specifications & FAQ',
      eyebrow: '06 · Specifications & FAQ',
      lead: 'Packaging options, stock status, and RO water pairing answers.',
      sections: [],
      comparisonHeaders: ['Item', 'Donan Product Details'],
      comparisonRows: [
        { label: 'Pack Sizes', primaryValue: '120g Standard Box · 45g Compact Travel Pack' },
        { label: 'Origin', primaryValue: 'Gensen Co., Ltd. · Made in Japan' },
        { label: 'Price', primaryValue: '1,390,000 VNĐ (9 boxes ready in Da Nang)' },
      ],
      faqs: [
        { q: 'Should I use Donan if my home uses an RO purifier?', a: 'Yes. RO systems strip natural minerals out; Donan restores balanced trace electrolytes and crisp taste.' },
      ],
    },
  },
  'da-kirara': {
    'mineral-stone-mechanism': {
      cardTitle: 'Purification & Negative Ions',
      pageTitle: 'Kirara Natural Mineral Stone 1kg — Water & Air Ionization',
      eyebrow: '03 · Natural Mineral Mechanism',
      lead: 'Selected Japanese mineral ore rich in trace elements that softens drinking water, emits steady negative ions, and refreshes enclosed air.',
      sections: [
        {
          heading: 'Reusable for Years — Simple Water Rinse & Sun Regeneration',
          body: 'Unlike disposable carbon cartridges, Kirara Stone maintains stable crystal performance for years with monthly clean-water rinsing and sunlight drying.',
        },
      ],
      metrics: [
        { value: '1 kg', label: 'Standard Japanese natural mineral stone pack' },
        { value: '4-in-1', label: 'Water pitcher · Mineral bath · Fridge · Room odor care' },
        { value: '25 Sets', label: 'Ready in Da Nang warehouse (24–48h dispatch)' },
      ],
    },
    'water-microclimate': {
      cardTitle: '4 Practical Uses',
      pageTitle: '4 Everyday Uses for Kirara Mineral Stone',
      eyebrow: '04 · Multi-Purpose Living',
      lead: 'Divide the 1kg pack across your kitchen pitcher, bath tub, refrigerator, and closets.',
      sections: [
        { heading: '1. Softening Drinking Water, Tea & Coffee', body: 'Steep 100–200g pre-boiled stone in 1.5–2L glass pitcher overnight for crisp, smooth water.' },
        { heading: '2. Soothing Home Mineral Bath (Onsen Style)', body: 'Place ~500g in a mesh pouch inside warm bath water 15 minutes before soaking.' },
        { heading: '3 & 4. Refrigerator, Shoe Cabinet & Bedroom Deodorizer', body: 'Keep 150–250g dry stone in a breathable dish or pouch to absorb stale odors.' },
      ],
    },
    'maintenance-guide': {
      cardTitle: 'Cleaning & Regeneration',
      pageTitle: 'Initial Preparation & Monthly Sun-Drying Care',
      eyebrow: '05 · Care Guide',
      lead: 'Zero detergents required—maintain solely with clean water and natural sunlight.',
      sections: [
        { heading: 'First-Time Prep (For Drinking Water)', body: 'Rinse thoroughly under running water, boil for 5–10 minutes in clean water, and cool before steeping.' },
        { heading: 'Monthly Rinse & Sun Refresh', body: 'Every 3–4 weeks rinse with plain water (never dish soap) and sun-dry for 2–3 hours.' },
      ],
    },
    'specs-and-faq': {
      cardTitle: 'Specs & FAQ',
      pageTitle: 'Kirara Mineral Stone 1kg Specifications & FAQ',
      eyebrow: '06 · Specifications & FAQ',
      lead: '1kg pack specs, Da Nang inventory, and multi-use hygiene tips.',
      sections: [],
      comparisonHeaders: ['Item', 'Kirara Stone Specification'],
      comparisonRows: [
        { label: 'Net Weight', primaryValue: '1kg Standard Pack (divisible by usage zone)' },
        { label: 'Effects', primaryValue: 'Water softening · Mild mineralization · Negative ions · Odor absorption' },
        { label: 'Stock & Price', primaryValue: '25 sets in Da Nang · 2,184,000 VNĐ' },
      ],
      faqs: [
        { q: 'Can one 1kg pack be split for both water and refrigerator odor control?', a: 'Yes—simply divide them permanently from day one (e.g., 200g dedicated to drinking water, separate stones for bath/fridge).' },
      ],
    },
  },
};

export function getResolvedSubDetails(
  product: ProductItem,
  onlyVisible = false
): ProductSubDetail[] {
  const baseList =
    product.subDetails !== undefined
      ? product.subDetails
      : PRODUCT_SUB_DETAILS[product.id] || [];

  const enDict = SUBDETAIL_EN_BY_SLUG(product.id);
  const hydrated = baseList.map((item) => ({
    ...item,
    en: item.en ?? enDict[item.slug],
  }));

  return onlyVisible ? hydrated.filter((item) => item.isVisible !== false) : hydrated;
}

function SUBDETAIL_EN_BY_SLUG(productId: string): Record<string, ProductSubDetailLocale> {
  return SUBDETAIL_EN_FALLBACKS[productId] || {};
}

export function createStarterSubDetails(
  productName: string,
  priceLabel: string,
  productNameEn?: string,
  productNameJa?: string
): ProductSubDetail[] {
  const enTitle = productNameEn || productName;
  const jaTitle = productNameJa || productName;
  return [
    makeInquiryTile(productName, jaTitle, 'consulting', enTitle),
    makeOnlineShopTile(productName, jaTitle, priceLabel, 'kirara_cream', enTitle),
    {
      slug: 'tong-quan-tinh-nang',
      imageKey: 'hero_living',
      kind: 'editorial',
      isVisible: true,
      vi: {
        cardTitle: 'Tổng quan & Tính năng',
        pageTitle: `Tổng quan & Tính năng nổi bật — ${productName}`,
        eyebrow: '03 · Giới thiệu sản phẩm',
        lead: `Tìm hiểu đặc điểm kỹ thuật, nguồn gốc và giá trị ứng dụng của ${productName} trong hệ sinh thái Harian Vietnam.`,
        sections: [
          {
            heading: 'Điểm nổi bật của giải pháp',
            body: 'Sản phẩm được kiểm soát chất lượng theo tiêu chuẩn Nhật Bản, phù hợp cho cả hộ gia đình và dự án thương mại.',
            bullets: [
              'An toàn cho sức khỏe và thân thiện với môi trường sống',
              'Hỗ trợ tư vấn kỹ thuật và bàn giao trực tiếp từ Harian Đà Nẵng',
            ],
          },
        ],
      },
      en: {
        cardTitle: 'Overview & Features',
        pageTitle: `Overview & Key Features — ${enTitle}`,
        eyebrow: '03 · Product Overview',
        lead: `Explore technical highlights, provenance, and practical applications of ${enTitle} from Harian Vietnam.`,
        sections: [
          {
            heading: 'Key Solution Highlights',
            body: 'Quality-verified to Japanese standards, tailored for residential living spaces and commercial developments.',
            bullets: [
              'Health-safe formulation and eco-friendly indoor performance',
              'Direct technical support and delivery from Harian Da Nang',
            ],
          },
        ],
      },
      ja: {
        cardTitle: '製品概要・特長',
        pageTitle: `${jaTitle} の概要と主な特長`,
        eyebrow: '03 · 製品紹介',
        lead: `${jaTitle}の技術特徴、日本基準の品質管理、導入メリットをご紹介します。`,
        sections: [
          {
            heading: '主な導入メリット',
            body: '住宅から商業施設・オフィスまで幅広い空間環境に適した高品質製品です。',
            bullets: [
              '高い安全性と環境配慮設計',
              'Harianダナンチームによる日本語・ベトナム語技術サポート対応',
            ],
          },
        ],
      },
    },
  ];
}

