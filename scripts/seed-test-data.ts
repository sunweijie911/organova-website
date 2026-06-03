import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/server/db/schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('错误: 缺少 DATABASE_URL 环境变量');
  process.exit(1);
}

// 与 src/server/db/index.ts 保持一致的 SSL 行为：
// 非生产环境（本地 Postgres 默认不开 SSL）关闭 SSL，生产环境（RDS 强制 SSL）不强制校验 CA
const ssl =
  process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false;
const conn = postgres(databaseUrl, { ssl });
const db = drizzle(conn, { schema });

async function seed() {
  console.log('🌱 开始导入初始数据...\n');

  // ──────────────────────────────────────────
  // 1. 出版物
  // ──────────────────────────────────────────
  console.log('📚 导入出版物...');
  await db.delete(schema.publications);
  await db.insert(schema.publications).values([
    {
      year: 2025,
      journal: 'Nature Communications',
      title:
        'Large-scale CRISPR screening in primary human 3D gastric organoids enables comprehensive dissection of gene-drug interactions',
      authors: 'Lo, Y.H., ..., Kuo, C.J.',
      citationCount: '—',
      doi: null,
      sortOrder: 0,
      isVisible: true,
    },
    {
      year: 2024,
      journal: 'Nature Reviews Cancer',
      title: 'Organoid 2.0 technology application review',
      authors: '(Review)',
      citationCount: '—',
      doi: null,
      sortOrder: 1,
      isVisible: true,
    },
    {
      year: 2019,
      journal: 'Nature Reviews Cancer',
      title: 'Organoid 2.0 technology named and characterized',
      authors: '(Review)',
      citationCount: '112+',
      doi: null,
      sortOrder: 2,
      isVisible: true,
    },
    {
      year: 2018,
      journal: 'Cell',
      title: 'Organoid Modeling of the Tumor Immune Microenvironment',
      authors: 'Neal, J.T., Li, X., ..., Kuo, C.J.',
      citationCount: '1,400+',
      doi: null,
      sortOrder: 3,
      isVisible: true,
    },
    {
      year: 2016,
      journal: 'Cell Reports',
      title:
        'Air-Liquid Interface culture system for 3D organoid culture of diverse primary gastrointestinal tissues',
      authors: 'Li, X., Ootani, A., Kuo, C.',
      citationCount: '—',
      doi: null,
      sortOrder: 4,
      isVisible: true,
    },
    {
      year: 2014,
      journal: 'Nature Medicine',
      title:
        'Oncogenic transformation of diverse gastrointestinal tissues in primary organoid culture',
      authors: 'Li, X., Nadauld, L., ..., Kuo, C.J.',
      citationCount: '500+',
      doi: null,
      sortOrder: 5,
      isVisible: true,
    },
    {
      year: 2009,
      journal: 'Nature Medicine',
      title:
        'Sustained in vitro intestinal epithelial culture within a Wnt-dependent stem cell niche',
      authors: 'Ootani, A., ..., Kuo, C.J.',
      citationCount: '1,000+',
      doi: null,
      sortOrder: 6,
      isVisible: true,
    },
  ]);
  console.log('  ✓ 7 篇');

  // ──────────────────────────────────────────
  // 2. 资源下载（固定3条）
  // ──────────────────────────────────────────
  console.log('📁 导入资源下载...');
  await db.delete(schema.resources);
  await db.insert(schema.resources).values([
    {
      name: 'Platform Overview',
      description: 'ALI-PDO™ 技术与能力一页纸摘要',
      ctaLabel: 'Download PDF →',
      ctaType: 'contact',
      fileUrl: null,
      externalUrl: null,
      isVisible: true,
      sortOrder: 1,
    },
    {
      name: 'Biobank Catalog',
      description: '按癌种的完整模型列表，含特征数据',
      ctaLabel: 'Request Access →',
      ctaType: 'contact',
      fileUrl: null,
      externalUrl: null,
      isVisible: true,
      sortOrder: 2,
    },
    {
      name: 'Sample Case Study',
      description: '从样本收到到最终报告的详细研究示例',
      ctaLabel: 'Download PDF →',
      ctaType: 'contact',
      fileUrl: null,
      externalUrl: null,
      isVisible: true,
      sortOrder: 3,
    },
  ]);
  console.log('  ✓ 3 条');

  // ──────────────────────────────────────────
  // 2b. News
  // ──────────────────────────────────────────
  console.log('📰 导入 News...');
  await db.delete(schema.news);
  await db.insert(schema.news).values([
    {
      title: 'OrgaNova TRiCBiO Establishes US Headquarters in Philadelphia',
      publishedAt: new Date('2025-03-15'),
      location: 'PHILADELPHIA, Penn.',
      isPublished: true,
      coverImage: null,
      content: `<p>OrgaNova TRiCBiO has officially established its United States headquarters in Philadelphia, Pennsylvania, marking a major milestone in the company's expansion into the global pharmaceutical market.</p>
<p>The Philadelphia office will serve as the primary hub for business development, client relations, and scientific collaboration with North American pharmaceutical and biotech partners. This strategic location places OrgaNova TRiCBiO at the heart of one of the world's most active life sciences ecosystems.</p>
<p>"Philadelphia gives us direct access to the world's most active pharmaceutical development community," said Jun Li, MD, PhD, Co-Founder and CEO of OrgaNova. "We are here to solve the hardest problems in oncology drug development, and we are here to stay."</p>
<p>The US operations will complement OrgaNova's R&D and production center in Nanjing, China, which houses the company's core scientific team and biobank of over 1,500 patient-derived organoid models.</p>`,
    },
    {
      title:
        'OrgaNova TRiCBiO Publishes Landmark CRISPR Screening Study in Nature Communications',
      publishedAt: new Date('2025-01-20'),
      location: 'NANJING, China',
      isPublished: true,
      coverImage: null,
      content: `<p>OrgaNova TRiCBiO announced the publication of a landmark study in <em>Nature Communications</em> demonstrating large-scale CRISPR screening in primary human 3D gastric organoids, enabling comprehensive dissection of gene-drug interactions.</p>
<p>The study, led by Dr. Y.H. Lo and colleagues in collaboration with Prof. Calvin Kuo's laboratory at Stanford University, establishes a new paradigm for functional genomics in clinically relevant organoid systems. The work demonstrates that genome-scale CRISPR screens can be performed directly in primary human 3D organoids—the same models used for clinical prediction—providing target validation data with unprecedented biological relevance.</p>
<p>"This work represents the convergence of our two core capabilities: organoid biology and functional genomics," said Wei He, PhD, Co-Founder and CSO. "It opens a new chapter in how the industry will approach target discovery and drug-gene interaction studies."</p>
<p>The publication is freely available in <em>Nature Communications</em>.</p>`,
    },
    {
      title: 'OrgaNova TRiCBiO Announces Strategic Partnership with Eli Lilly',
      publishedAt: new Date('2024-09-10'),
      location: 'PHILADELPHIA, Penn.',
      isPublished: true,
      coverImage: null,
      content: `<p>OrgaNova TRiCBiO announced a strategic partnership with Eli Lilly and Company, one of the world's leading pharmaceutical companies, to apply the ALI-PDO&#8482; Organoid 2.0 platform to support Lilly's oncology drug development pipeline.</p>
<p>Under the agreement, OrgaNova TRiCBiO will leverage its biobank of over 1,500 patient-derived organoid models and its proprietary ALI-PDO&#8482; technology to provide clinically predictive preclinical data supporting multiple oncology programs at Lilly.</p>
<p>"This partnership with Eli Lilly validates what we have believed from the beginning: that the industry needs a fundamentally better preclinical model," said Mohan Thiruvazhi, PhD, VP of Business Development. "We are proud to be partnering with one of the world's most innovative pharmaceutical companies."</p>
<p>Financial terms of the partnership were not disclosed.</p>`,
    },
    {
      title:
        'OrgaNova TRiCBiO Validates 1,500+ Patient-Derived Organoid Models Across 20+ Cancer Types',
      publishedAt: new Date('2024-04-22'),
      location: 'NANJING, China',
      isPublished: true,
      coverImage: null,
      content: `<p>OrgaNova TRiCBiO today announced that its biobank has surpassed 1,500 deeply characterized patient-derived organoid (PDO) models, covering more than 20 solid tumor types across its US and China biobanks.</p>
<p>The milestone represents a critical mass of biological material enabling statistically robust drug screening, biomarker discovery, and co-clinical study design at scale. All models are available in both PDO 1.0 and Organoid 2.0 (ALI-PDO&#8482;) formats, with full genomic (WES) and transcriptomic (RNA-seq) characterization linked to de-identified patient clinical data.</p>
<p>"1,500 models is not just a number—it's the foundation for a new kind of drug development," said Xingnan Li, PhD, Co-Founder and Chief Scientific Architect. "We now have the breadth and depth to support any oncology program, in any indication, with statistically meaningful data."</p>
<p>The biobank includes models from the US facility in Philadelphia (676+ FFPE blocks, 35 normal tissue types) and the China facility in Nanjing (400+ HCC, 300+ CRC, 200+ RCC, 150+ PDAC, 150+ Breast, 120+ Sarcoma, 100+ NSCLC, 80+ GBM, and more).</p>`,
    },
    {
      title:
        'OrgaNova TRiCBiO Founded to Commercialize Organoid 2.0 Technology Platform',
      publishedAt: new Date('2022-06-01'),
      location: 'NANJING, China',
      isPublished: true,
      coverImage: null,
      content: `<p>OrgaNova TRiCBiO was officially founded to translate decades of landmark organoid biology research into a scalable, commercially available preclinical platform for the global pharmaceutical industry.</p>
<p>The company's founding is grounded in a series of landmark publications beginning with the 2009 <em>Nature Medicine</em> paper on stem cell organoid culture, the 2018 <em>Cell</em> paper demonstrating complete tumor microenvironment preservation (1,400+ citations), and the naming of "Organoid 2.0" in <em>Nature Reviews Cancer</em> in 2019.</p>
<p>"We spent 15 years building the science. We founded OrgaNova to put it to work," said Xingnan Li, PhD, the inventor of the ALI-PDO&#8482; technology and Co-Founder. "The 97% failure rate in oncology drug development is not inevitable. It is a consequence of inadequate models. We are changing that."</p>
<p>The company is headquartered in Nanjing, China, with R&D operations and a growing international presence.</p>`,
    },
  ]);
  console.log('  ✓ 5 条新闻');

  // ──────────────────────────────────────────
  // 3. FAQ 分类 + 条目
  // ──────────────────────────────────────────
  console.log('❓ 导入 FAQ...');
  await db.delete(schema.faqItems);
  await db.delete(schema.faqCategories);

  const cats = await db
    .insert(schema.faqCategories)
    .values([
      { name: 'About Our Technology', sortOrder: 0, isVisible: true },
      { name: 'About Our Services', sortOrder: 1, isVisible: true },
      { name: 'About Our Biobank', sortOrder: 2, isVisible: true },
      { name: 'About Partnerships', sortOrder: 3, isVisible: true },
      { name: 'About Quality & Compliance', sortOrder: 4, isVisible: true },
    ])
    .returning({ id: schema.faqCategories.id });

  const [c1, c2, c3, c4, c5] = cats.map((c) => c.id) as [
    number,
    number,
    number,
    number,
    number,
  ];

  await db.insert(schema.faqItems).values([
    // Technology
    {
      categoryId: c1,
      sortOrder: 0,
      isVisible: true,
      question:
        'What is the difference between Organoid 1.0 and Organoid 2.0 (ALI-PDO™)?',
      answer:
        '<p>The primary difference is the preservation of the native Tumor Microenvironment (TME). Organoid 1.0 models are typically just tumor cells grown in an artificial matrix (like Matrigel), stripped of the immune and stromal cells. Our Organoid 2.0 (ALI-PDO™) platform uses a proprietary Air-Liquid Interface (ALI) culture system that co-cultures the tumor cells with their native stromal and immune cells, creating a more biologically complete and clinically predictive model.</p>',
    },
    {
      categoryId: c1,
      sortOrder: 1,
      isVisible: true,
      question: 'What is the clinical prediction accuracy of your models?',
      answer:
        '<p>Our models have demonstrated an average <strong>84.43% accuracy</strong> in predicting patient clinical outcomes across 152 patient cases in 5 solid tumor types. In our liver cancer co-clinical study, we achieved 78.95% clinical correlation across 21 patients and 7 drugs. This compares to approximately 10–30% for conventional cell-line models and 40–60% for first-generation PDO models.</p>',
    },
    {
      categoryId: c1,
      sortOrder: 2,
      isVisible: true,
      question: 'How do you maintain the immune cells in your ALI-PDO™ models?',
      answer:
        '<p>The Air-Liquid Interface (ALI) method is key. Culturing tissue on a permeable membrane with media below and air above mimics the natural environment of epithelial tissues. Combined with our proprietary serum-free media formulation, this allows long-term survival and function of endogenous immune cells—including T-cells (CD3+, CD4+, CD8+), macrophages (TAMs), and NK cells—for <strong>more than 4 weeks</strong> without artificial stimulation.</p>',
    },
    {
      categoryId: c1,
      sortOrder: 3,
      isVisible: true,
      question: 'What drug modalities does your platform support?',
      answer:
        '<p>Our platform is modality-agnostic. We support: <strong>small molecules, biologics/antibodies, ADCs, ICB, bi-specific antibodies, cell and gene therapies</strong> (CAR-T, CAR-NK), and <strong>nucleic acid therapeutics</strong>. Each modality requires specific assay design, and we work with you to optimize the study for your drug class.</p>',
    },
    {
      categoryId: c1,
      sortOrder: 4,
      isVisible: true,
      question: 'What types of functional genomics screens do you offer?',
      answer:
        '<p>We offer <strong>CRISPR-based screens</strong> (KO, CRISPRi, CRISPRa) and <strong>shRNA-based knockdown screens</strong>—from custom focused libraries targeting specific pathways to unbiased genome-scale screens. This is grounded in landmark work: Lo, Y.H., et al., <em>Nature Communications</em>, 2025.</p>',
    },
    // Services
    {
      categoryId: c2,
      sortOrder: 0,
      isVisible: true,
      question: 'What is your typical project turnaround time?',
      answer:
        '<p>Standard drug screening studies: <strong>2–3 weeks</strong> from sample receipt to final report. Feasibility studies: as little as 4 weeks from project initiation. Custom projects vary by scope and are discussed during project design.</p>',
    },
    {
      categoryId: c2,
      sortOrder: 1,
      isVisible: true,
      question: 'What kind of data is included in a final report?',
      answer:
        '<p>A standard report includes dose-response curves, IC50 values, raw viability data, H&E/IHC quality control images, and a comprehensive summary. I-O studies include T-cell activation (FACS), cytokine profiling (ELISA), and tumor killing quantification. All reports include detailed methodology and QC metrics.</p>',
    },
    {
      categoryId: c2,
      sortOrder: 2,
      isVisible: true,
      question: 'Can you work with my own patient samples?',
      answer:
        '<p>Yes. We accept fresh tumor tissue, core needle biopsies, and surgical resection specimens. We can also help design sample collection protocols that meet our quality requirements. Please contact us to discuss sample logistics.</p>',
    },
    {
      categoryId: c2,
      sortOrder: 3,
      isVisible: true,
      question: 'What is the minimum sample size required for a study?',
      answer:
        '<p>For studies using our existing biobank models, no additional sample is required. For custom patient sample studies, we typically require a minimum of <strong>50–100mg of fresh tumor tissue</strong> per model.</p>',
    },
    // Biobank
    {
      categoryId: c3,
      sortOrder: 0,
      isVisible: true,
      question: 'How many models do you have in your biobank?',
      answer:
        '<p>Over <strong>1,500 patient-derived organoid models</strong> across 20+ solid tumor types. US Biobank (Philadelphia): 676+ FFPE blocks, 35 normal tissue types. China Biobank (Nanjing): 400+ HCC, 300+ CRC, 200+ RCC, 150+ PDAC, 150+ Breast, 120+ Sarcoma, 100+ NSCLC, 80+ GBM, and more.</p>',
    },
    {
      categoryId: c3,
      sortOrder: 1,
      isVisible: true,
      question: 'How are your models characterized?',
      answer:
        '<p>Every model is deeply characterized with histopathology review (H&E), whole-exome sequencing (WES), and RNA-sequencing for gene expression profiling. This multi-omic data is linked to de-identified patient clinical history including tumor stage, prior treatment, and clinical outcomes where available.</p>',
    },
    {
      categoryId: c3,
      sortOrder: 2,
      isVisible: true,
      question: 'Can I access your biobank for my own research?',
      answer:
        '<p>Yes. We offer biobank access through fee-for-service and strategic partnership programs. Contact us or submit a Request a Quote form to discuss your requirements.</p>',
    },
    // Partnerships
    {
      categoryId: c4,
      sortOrder: 0,
      isVisible: true,
      question: 'What are your partnership models?',
      answer:
        '<p><strong>(1) Feasibility Studies</strong> — rapid proof-of-concept for early-stage validation. <strong>(2) Fee-for-Service</strong> — custom drug screening or I-O evaluation with full data reporting. <strong>(3) Strategic Alliances</strong> — long-term collaboration with dedicated models, co-publication rights, priority biobank access. <strong>(4) Co-Development Programs</strong> — co-design research, co-own data, co-publish findings.</p>',
    },
    {
      categoryId: c4,
      sortOrder: 1,
      isVisible: true,
      question: 'Do you work with academic institutions?',
      answer:
        '<p>Yes. We collaborate with academic medical centers and research institutions on funded research and investigator-initiated studies, often with co-publication agreements and biobank access for academic research. Contact us to discuss opportunities.</p>',
    },
    {
      categoryId: c4,
      sortOrder: 2,
      isVisible: true,
      question: 'What is the typical timeline from inquiry to project start?',
      answer:
        '<p>For feasibility studies and standard fee-for-service projects: typically <strong>2–4 weeks</strong> from initial inquiry to project start, following a scoping call and proposal review.</p>',
    },
    // Quality & Compliance
    {
      categoryId: c5,
      sortOrder: 0,
      isVisible: true,
      question: 'Are your studies GLP-compliant?',
      answer:
        '<p>Our platform is designed for discovery and translational research phases—not formal GLP compliance. Studies are conducted under rigorous internal quality standards (SOPs, documented protocols, reproducibility controls) to generate high-quality data supporting IND strategy. For formal GLP studies, we recommend partnering with a dedicated CRO.</p>',
    },
    {
      categoryId: c5,
      sortOrder: 1,
      isVisible: true,
      question: 'How do you ensure reproducibility?',
      answer:
        '<p>Reproducibility is built into every step: (1) standardized model establishment/QC (H&E, IHC, qPCR); (2) defined passage number limits; (3) blinded data analysis; (4) statistical significance thresholds; (5) internal positive/negative controls in every assay.</p>',
    },
    {
      categoryId: c5,
      sortOrder: 2,
      isVisible: true,
      question: 'How do you handle patient data privacy?',
      answer:
        '<p>All patient data is fully de-identified per applicable regulations (HIPAA in the US, GDPR-equivalent in China). We do not share identifiable patient information. All sample collection is conducted under IRB-approved protocols with informed consent.</p>',
    },
  ]);
  console.log('  ✓ 5 分类，17 条 Q&A');

  // ──────────────────────────────────────────
  // 4. 团队成员
  // ──────────────────────────────────────────
  console.log('👥 导入团队成员...');
  await db.delete(schema.teamMembers);
  await db.insert(schema.teamMembers).values([
    {
      group: 'tricbio',
      sortOrder: 0,
      isVisible: true,
      name: 'Wei He, PhD',
      title: 'Co-Founder & CSO',
      shortBio: 'Former Novartis Researcher',
      fullBio: null,
      photo: null,
    },
    {
      group: 'tricbio',
      sortOrder: 1,
      isVisible: true,
      name: 'Xingnan Li, PhD',
      title: 'Co-Founder & Chief Scientific Architect',
      shortBio:
        'Stanford; Organoid 2.0 inventor; 15 years of organoid research',
      fullBio: null,
      photo: null,
    },
    {
      group: 'tricbio',
      sortOrder: 2,
      isVisible: true,
      name: 'Han Yin, PhD',
      title: 'Co-Founder',
      shortBio: 'Former Novartis; contributed to 6 approved drugs',
      fullBio: null,
      photo: null,
    },
    {
      group: 'tricbio',
      sortOrder: 3,
      isVisible: true,
      name: 'Xiaojun Xu, PhD',
      title: 'Co-Founder & Head of AI/ML',
      shortBio: 'Former Pfizer; AI-driven drug discovery',
      fullBio: null,
      photo: null,
    },
    {
      group: 'organova',
      sortOrder: 0,
      isVisible: true,
      name: 'Jun Li, MD, PhD',
      title: 'Co-Founder & CEO',
      shortBio: 'Orthopedic regeneration; 60+ publications; NIH/FDA experience',
      fullBio: null,
      photo: null,
    },
    {
      group: 'organova',
      sortOrder: 1,
      isVisible: true,
      name: 'Lele Song, PhD',
      title: 'Co-Founder & Head of R&D',
      shortBio: 'iPSC & PDO expert; CRISPR applications',
      fullBio: null,
      photo: null,
    },
    {
      group: 'organova',
      sortOrder: 2,
      isVisible: true,
      name: 'Mike Duffy, PhD',
      title: 'VP of Product Engineering',
      shortBio: 'Product development and scale-up',
      fullBio: null,
      photo: null,
    },
    {
      group: 'organova',
      sortOrder: 3,
      isVisible: true,
      name: 'Mohan Thiruvazhi, PhD',
      title: 'VP of Business Development',
      shortBio:
        '25 years BD experience; former North America Director, Pharmaffiliates',
      fullBio: null,
      photo: null,
    },
  ]);
  console.log('  ✓ 8 人（4 TRiCBiO + 4 OrgaNova）');

  // ──────────────────────────────────────────
  // 5. 癌种库
  // ──────────────────────────────────────────
  console.log('🔬 导入癌种库...');
  await db.delete(schema.cancerTypes);
  await db.insert(schema.cancerTypes).values([
    {
      name: 'Liver Cancer (HCC / ICC)',
      slug: 'liver-cancer',
      modelCount: '400+ (China)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 0,
      isPublished: true,
      subpageTitle: 'Liver Cancer: HCC & ICC Models',
      modelCountDetail:
        '400+ patient-derived models (China Biobank), including Matched Normal Pairs. NGS-characterized with complete clinical annotation.',
      validationMethods: 'H&E, IHC, NGS',
      validatedApplications:
        '<ul><li>Drug sensitivity testing</li><li>Co-clinical patient response prediction (78.95% clinical correlation)</li><li>TME-preserved PDO 2.0 models for immunotherapy evaluation</li></ul>',
      clinicalCorrelation:
        '78.95% clinical correlation across 21 patients and 7 drugs',
      cta1Label: 'Read the Co-clinical Case Study',
      cta1Url: '/case-studies/liver-cancer-drug-response',
      cta2Label: 'Request Liver Cancer Models',
      cta2Url: '/request-quote',
    },
    {
      name: 'Colorectal Cancer (CRC)',
      slug: 'colorectal-cancer',
      modelCount: '300+ (China)\n190 (US)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 1,
      isPublished: true,
      subpageTitle: 'Colorectal Cancer (CRC) Models',
      modelCountDetail:
        '300+ models in China Biobank, 190 in US Biobank. Full WES and RNA-seq characterization.',
      validationMethods: 'H&E, IHC, WES, RNA-seq',
      validatedApplications:
        '<ul><li>Drug efficacy screening</li><li>Biomarker discovery and patient stratification</li><li>CRISPR-based target discovery</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request CRC Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Kidney Cancer (ccRCC)',
      slug: 'kidney-cancer',
      modelCount: '200+ (China)\n193 (US)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 2,
      isPublished: true,
      subpageTitle: 'Kidney Cancer (ccRCC) Models',
      modelCountDetail:
        '200+ models in China Biobank, 193 in US Biobank. TIL retention demonstrated >4 weeks.',
      validationMethods: 'H&E, IHC, FACS, NGS',
      validatedApplications:
        '<ul><li>ICB efficacy evaluation with native TIL retention</li><li>T-cell activation quantification (CD8+, NK)</li><li>Drug sensitivity screening</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'View I-O Case Study',
      cta1Url: '/case-studies/immunotherapy-efficacy-evaluation',
      cta2Label: 'Request ccRCC Models',
      cta2Url: '/request-quote',
    },
    {
      name: 'Breast Cancer',
      slug: 'breast-cancer',
      modelCount: '150+ (China)\n174 (US)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 3,
      isPublished: true,
      subpageTitle: 'Breast Cancer Models',
      modelCountDetail:
        '150+ models in China Biobank, 174 in US Biobank. Multiple subtypes: ER+, HER2+, TNBC.',
      validationMethods: 'H&E, IHC (ER, PR, HER2), WES',
      validatedApplications:
        '<ul><li>Subtype-specific drug efficacy</li><li>ADC evaluation</li><li>Biomarker discovery</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request Breast Cancer Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Pancreatic Cancer (PDAC)',
      slug: 'pancreatic-cancer',
      modelCount: '150+ (China)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 4,
      isPublished: true,
      subpageTitle: 'Pancreatic Cancer (PDAC) Models',
      modelCountDetail:
        '150+ PDAC models in China Biobank. High-fidelity models reflecting the dense desmoplastic stroma of PDAC.',
      validationMethods: 'H&E, Masson Trichrome, IHC, WES',
      validatedApplications:
        '<ul><li>Drug efficacy with stromal context</li><li>Stroma-targeting therapy evaluation</li><li>Combination drug studies</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request PDAC Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Sarcoma (GIST / OS)',
      slug: 'sarcoma',
      modelCount: '120+ (China)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 5,
      isPublished: true,
      subpageTitle: 'Sarcoma: GIST & Osteosarcoma Models',
      modelCountDetail:
        '120+ sarcoma models. First validated PDO models for GIST and Osteosarcoma.',
      validationMethods: 'IHC (Vimentin, Ki67, SOX9, TP53), NGS',
      validatedApplications:
        '<ul><li>Mutation-specific drug testing (KIT/PDGFRA)</li><li>Rare tumor modeling for precision oncology</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Read the Rare Tumor Case Study',
      cta1Url: '/case-studies/rare-tumor-modeling',
      cta2Label: 'Request Sarcoma Models',
      cta2Url: '/request-quote',
    },
    {
      name: 'Lung Cancer (NSCLC)',
      slug: 'lung-cancer-nsclc',
      modelCount: '100+ (China)\n11 (US)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 6,
      isPublished: true,
      subpageTitle: 'Lung Cancer (NSCLC) Models',
      modelCountDetail:
        '100+ NSCLC models in China Biobank, 11 in US Biobank. Multiple driver mutation subtypes: EGFR, KRAS, ALK, ROS1.',
      validationMethods: 'H&E, IHC, NGS',
      validatedApplications:
        '<ul><li>Targeted therapy efficacy by mutation subtype</li><li>Resistance mechanism studies</li><li>Immunotherapy evaluation</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'View I-O Efficacy Case Study',
      cta1Url: '/case-studies/immunotherapy-efficacy-evaluation',
      cta2Label: 'Request NSCLC Models',
      cta2Url: '/request-quote',
    },
    {
      name: 'Glioblastoma (GBM)',
      slug: 'glioblastoma-gbm',
      modelCount: '80+ (China)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 7,
      isPublished: true,
      subpageTitle: 'Glioblastoma (GBM) Models',
      modelCountDetail:
        '80+ GBM models preserving intact immune, vascular, and hypoxic TME. Validated for >4-week stability.',
      validationMethods: 'H&E, IF (Nestin, Olig2, S100B), FACS',
      validatedApplications:
        '<ul><li>TME-targeted drug evaluation</li><li>HIF-2α pathway targeting</li><li>Tumor killing assay by FACS</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Read the GBM Case Study',
      cta1Url: '/case-studies/gbm-tme-drug-evaluation',
      cta2Label: 'Request GBM Models',
      cta2Url: '/request-quote',
    },
    {
      name: 'Endometrial Cancer',
      slug: 'endometrial-cancer',
      modelCount: '93 (US)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 8,
      isPublished: true,
      subpageTitle: 'Endometrial Cancer Models',
      modelCountDetail:
        '93 models in US Biobank. Subtypes: MSI-H, POLE-mutant, copy-number-high.',
      validationMethods: 'H&E, IHC, MSI testing, WES',
      validatedApplications:
        '<ul><li>Immunotherapy response by molecular subtype</li><li>Drug efficacy screening</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request Endometrial Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Ovarian Cancer',
      slug: 'ovarian-cancer',
      modelCount: '10 (US)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 9,
      isPublished: true,
      subpageTitle: 'Ovarian Cancer Models',
      modelCountDetail:
        '10 ovarian cancer models in US Biobank. Focus on high-grade serous ovarian carcinoma (HGSOC).',
      validationMethods: 'H&E, IHC (PAX8, WT1), WES',
      validatedApplications:
        '<ul><li>PARP inhibitor and platinum sensitivity</li><li>Combination therapy studies</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request Ovarian Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Gastric Cancer (GC)',
      slug: 'gastric-cancer',
      modelCount: 'Available',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 10,
      isPublished: true,
      subpageTitle: 'Gastric Cancer Models',
      modelCountDetail:
        'Co-clinical study demonstrated 66.79% drug response prediction accuracy across 7 patients and 5 drugs.',
      validationMethods: 'H&E, IHC, NGS',
      validatedApplications:
        '<ul><li>Co-clinical prospective drug response prediction</li><li>Standard-of-care chemotherapy evaluation</li></ul>',
      clinicalCorrelation:
        '66.79% accuracy across 7 patients and 5 drugs (prospective co-clinical)',
      cta1Label: 'Read the Gastric Cancer Case Study',
      cta1Url: '/case-studies/gastric-cancer-co-clinical',
      cta2Label: 'Request Gastric Models',
      cta2Url: '/request-quote',
    },
    {
      name: 'Biliary Tract Cancer',
      slug: 'biliary-tract-cancer',
      modelCount: 'Available',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 11,
      isPublished: true,
      subpageTitle: 'Biliary Tract Cancer Models',
      modelCountDetail:
        'Models available for intrahepatic cholangiocarcinoma (ICC) and gallbladder cancer.',
      validationMethods: 'H&E, IHC, WES',
      validatedApplications:
        '<ul><li>Drug efficacy screening</li><li>Targeted therapy evaluation (FGFR, IDH1)</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request Biliary Tract Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Head & Neck Cancer',
      slug: 'head-neck-cancer',
      modelCount: 'Available',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 12,
      isPublished: true,
      subpageTitle: 'Head & Neck Cancer Models',
      modelCountDetail:
        'HNSCC models available. HPV-positive and HPV-negative subtypes represented.',
      validationMethods: 'H&E, IHC, HPV testing',
      validatedApplications:
        '<ul><li>HPV-stratified drug sensitivity</li><li>Immunotherapy evaluation</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request H&N Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Prostate Cancer',
      slug: 'prostate-cancer',
      modelCount: 'Available',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 13,
      isPublished: true,
      subpageTitle: 'Prostate Cancer Models',
      modelCountDetail:
        'Prostate cancer PDO models available including castration-resistant (CRPC) subtypes.',
      validationMethods: 'H&E, IHC (PSA, AR), WES',
      validatedApplications:
        '<ul><li>Androgen receptor pathway studies</li><li>PARP inhibitor sensitivity (HRR-deficient tumors)</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request Prostate Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Lymphoma',
      slug: 'lymphoma',
      modelCount: '4 (US)',
      formats: 'PDO 1.0',
      sortOrder: 14,
      isPublished: true,
      subpageTitle: 'Lymphoma Models',
      modelCountDetail: '4 lymphoma models in US Biobank (PDO 1.0 format).',
      validationMethods: 'H&E, IHC, flow cytometry',
      validatedApplications: '<ul><li>Drug sensitivity screening</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request Lymphoma Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
    {
      name: 'Normal Tissue (35 types)',
      slug: 'normal-tissue',
      modelCount: '676 FFPE blocks (US)',
      formats: 'FFPE & Fresh Frozen',
      sortOrder: 15,
      isPublished: true,
      subpageTitle: 'Normal Tissue Organoid Models',
      modelCountDetail:
        '676+ FFPE blocks across 35 normal tissue types in US Biobank. Validated for lung, kidney, liver, intestine, and more.',
      validationMethods: 'mIF, qPCR, functional assays',
      validatedApplications:
        '<ul><li>Pulmonary toxicity screening</li><li>Nephrotoxicity assessment</li><li>Hepatotoxicity evaluation</li><li>GI toxicity studies</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Read the Safety Case Study',
      cta1Url: '/case-studies/normal-tissue-safety',
      cta2Label: 'Request Normal Tissue Models',
      cta2Url: '/request-quote',
    },
    {
      name: 'Matched Normal Pairs',
      slug: 'matched-normal-pairs',
      modelCount: '6 types (China)',
      formats: 'PDO 1.0 & 2.0',
      sortOrder: 16,
      isPublished: true,
      subpageTitle: 'Matched Normal-Tumor Pairs',
      modelCountDetail:
        '6 matched normal-tumor pair types in China Biobank. Enables direct comparison of drug effects on tumor vs. normal tissue from the same patient.',
      validationMethods: 'H&E, IHC, WES (somatic variant calling)',
      validatedApplications:
        '<ul><li>Therapeutic index / selectivity studies</li><li>On-target / off-tumor toxicity assessment</li></ul>',
      clinicalCorrelation: null,
      cta1Label: 'Request Matched Pairs',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
    },
  ]);
  console.log('  ✓ 17 个癌种');

  // ──────────────────────────────────────────
  // 6. 案例研究
  // ──────────────────────────────────────────
  console.log('📋 导入案例研究...');
  await db.delete(schema.caseStudies);
  await db.insert(schema.caseStudies).values([
    {
      slug: 'liver-cancer-drug-response',
      title: 'Patient-Specific Drug Response Prediction in Liver Cancer',
      summary:
        '21 patients, 7 drugs tested. Our models achieved 78.95% clinical correlation—predicting which patients responded and which did not.',
      cancerTypeTags: ['HCC/ICC'],
      applicationTags: ['Drug Efficacy'],
      challenge:
        '<p>A clinical partner needed to validate whether organoid-based drug sensitivity testing could accurately predict patient outcomes in hepatocellular carcinoma (HCC) and intrahepatic cholangiocarcinoma (ICC)—two of the most challenging and heterogeneous liver cancers.</p>',
      approach:
        '<p>We established PDO models from 21 patients with HCC or ICC. Each model was tested against 7 drugs, including chemotherapy agents and ICB combinations. Drug sensitivity results were then compared against actual patient clinical outcomes in a blinded retrospective analysis.</p>',
      results:
        '<p>Overall clinical correlation: <strong>78.95%</strong>. Sensitivity: 80%, Specificity: 77.78%. The models accurately predicted both responders and non-responders across all drug classes tested.</p>',
      implication:
        '<p>This study validates the use of our ALI-PDO platform as a co-clinical tool for personalized oncology, enabling patient stratification before treatment initiation.</p>',
      metaModel: 'HCC/ICC PDO',
      metaDrugClasses: 'Chemotherapy, ICB combinations',
      metaReadout: 'Drug sensitivity, clinical correlation',
      metaValidation: 'Clinical follow-up (blinded retrospective)',
      cta1Label: 'Request Liver Cancer Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
      sortOrder: 0,
      isPublished: true,
    },
    {
      slug: 'gastric-cancer-co-clinical',
      title: 'Co-Clinical Drug Response Study in Gastric Cancer',
      summary:
        '7 patients, 5 drugs tested. Organoid models predicted clinical response with 66.79% accuracy in a prospective co-clinical design.',
      cancerTypeTags: ['Gastric'],
      applicationTags: ['Drug Efficacy'],
      challenge:
        '<p>Gastric cancer is highly heterogeneous, and predicting which patients will respond to specific chemotherapy regimens remains a major unmet clinical need.</p>',
      approach:
        '<p>PDO models were established from 7 gastric cancer patients and tested against 5 standard-of-care drugs in a prospective co-clinical design, where sensitivity results were generated <em>before</em> treatment decisions were finalized.</p>',
      results:
        '<p>Clinical prediction accuracy: <strong>66.79%</strong>. The prospective design validated that organoid-based testing can provide actionable information before clinical treatment begins.</p>',
      implication:
        '<p>Demonstrates the feasibility of using PDO testing as a real-time clinical decision support tool in gastric cancer management.</p>',
      metaModel: 'Gastric Cancer PDO',
      metaDrugClasses: 'Standard-of-care chemotherapy',
      metaReadout: 'Drug sensitivity, prospective clinical correlation',
      metaValidation: 'Prospective co-clinical comparison',
      cta1Label: 'Request Gastric Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
      sortOrder: 1,
      isPublished: true,
    },
    {
      slug: 'gbm-tme-drug-evaluation',
      title: 'TME-Targeted Drug Evaluation in Glioblastoma',
      summary:
        'Our Organoid 2.0 preserved intact immune, vascular, and hypoxic components of GBM for >4 weeks, enabling TME-directed drug testing impossible in standard models.',
      cancerTypeTags: ['GBM'],
      applicationTags: ['Immunotherapy'],
      challenge:
        '<p>Glioblastoma (GBM) is one of the most treatment-resistant cancers, partly due to its complex TME including hypoxic regions, vascular components, and immune infiltrates. Standard organoid models lose these components within days.</p>',
      approach:
        '<p>GBM PDO 2.0 models were established using our ALI culture system. TME preservation was validated by H&E and IF staining (Nestin, Olig2, S100B). Drug efficacy against the HIF-2alpha pathway was evaluated using a tumor killing assay by FACS.</p>',
      results:
        '<p>Intact immune, vascular, and hypoxic TME components preserved for <strong>&gt;4 weeks</strong>. HIF-2alpha pathway inhibition demonstrated measurable tumor killing quantified by FACS.</p>',
      implication:
        '<p>Enables preclinical testing of TME-targeted therapies in GBM—a capability not available in any conventional model system.</p>',
      metaModel: 'GBM PDO 2.0',
      metaDrugClasses: 'HIF-2alpha pathway inhibitor',
      metaReadout: 'Tumor killing assay by FACS',
      metaValidation: 'H&E, IF (Nestin, Olig2, S100B)',
      cta1Label: 'Request GBM Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
      sortOrder: 2,
      isPublished: true,
    },
    {
      slug: 'immunotherapy-efficacy-evaluation',
      title: 'Comprehensive Immunotherapy Efficacy Evaluation',
      summary:
        'TIL retention >4 weeks. Demonstrated ICB-induced tumor killing and bi-specific antibody efficacy with full immune profiling by FACS, qPCR, and ELISA.',
      cancerTypeTags: ['RCC', 'NSCLC'],
      applicationTags: ['Immunotherapy'],
      challenge:
        '<p>Evaluating immunotherapy efficacy requires a model that retains functional immune cells over the duration of a study. Standard models lose immune cells within days, making it impossible to assess T-cell exhaustion, cytokine dynamics, or long-term immune response.</p>',
      approach:
        '<p><strong>Part I — ICB Evaluation:</strong> ccRCC and NSCLC PDO models were established with IL-2 supplementation. T-cell retention was monitored over 28 days. ICB treatment was applied and anti-tumor immune response was quantified.</p><p><strong>Part II — Bi-specific Antibody:</strong> The same platform was applied to evaluate a BsAb targeting both tumor and immune cells.</p>',
      results:
        '<p><strong>Part I:</strong> TIL retention &gt;4 weeks. ICB-induced measurable CD8+ T and NK cell activation with tumor killing quantified by FACS.</p><p><strong>Part II:</strong> BsAb-induced CD8+ T and NK cell activation with tumor killing quantification by flow cytometry, qPCR, and ELISA.</p>',
      implication:
        '<p>Provides a comprehensive, multi-readout platform for evaluating checkpoint inhibitors and next-generation immunotherapies including bi-specific antibodies and cell therapies.</p>',
      metaModel: 'ccRCC/NSCLC PDO 2.0',
      metaDrugClasses: 'ICB, Bi-specific Antibody',
      metaReadout: 'T-cell activation, tumor killing, cytokine profiling',
      metaValidation: 'FACS, qPCR, ELISA, IF',
      cta1Label: 'Discuss Your I-O Program',
      cta1Url: '/contact',
      cta2Label: null,
      cta2Url: null,
      sortOrder: 3,
      isPublished: true,
    },
    {
      slug: 'rare-tumor-modeling',
      title: 'Rare Tumor Modeling: GIST and Osteosarcoma',
      summary:
        'Established the first validated PDO models for GIST and osteosarcoma, enabling mutation-specific drug testing in rare mesenchymal tumors.',
      cancerTypeTags: ['GIST', 'Rare Tumors'],
      applicationTags: ['Drug Efficacy', 'Special Models'],
      challenge:
        '<p>Rare mesenchymal tumors like GIST and osteosarcoma have extremely limited preclinical model options. Patients are often excluded from drug development programs due to lack of representative models.</p>',
      approach:
        '<p>PDO models were established from GIST and osteosarcoma patient tissue. Models were validated by IHC and NGS to confirm preservation of key tumor markers (Vimentin, Ki67, SOX9, TP53 for osteosarcoma). Multiple morphological subtypes were captured.</p>',
      results:
        '<p>Successfully established the first validated PDO models for both GIST and osteosarcoma. Mutation-specific drug testing demonstrated differential response based on KIT/PDGFRA mutation status in GIST.</p>',
      implication:
        '<p>Expands the reach of precision oncology to rare tumor types, enabling biomarker-driven stratification and drug testing in underserved patient populations.</p>',
      metaModel: 'GIST / Osteosarcoma PDO',
      metaDrugClasses: 'Targeted therapy (KIT/PDGFRA inhibitors)',
      metaReadout: 'Drug sensitivity, mutation-response correlation',
      metaValidation: 'IHC (Vimentin, Ki67, SOX9, TP53), NGS',
      cta1Label: 'Request Rare Tumor Models',
      cta1Url: '/request-quote',
      cta2Label: null,
      cta2Url: null,
      sortOrder: 4,
      isPublished: true,
    },
    {
      slug: 'normal-tissue-safety',
      title: 'Normal Tissue Organoid Models for Safety Assessment',
      summary:
        'Lung and kidney organoid models validated for pulmonary and nephrotoxicity screening, providing human-relevant safety data beyond animal models.',
      cancerTypeTags: ['Non-Oncology'],
      applicationTags: ['Safety & Toxicity'],
      challenge:
        '<p>Animal models poorly predict human organ toxicity, leading to late-stage clinical failures. Human-relevant safety models are urgently needed for earlier identification of organ toxicity risks.</p>',
      approach:
        '<p>Normal lung and kidney organoid models were established from healthy human tissue. Lung: validated with CC10, KRT5, DAPI (maturation: 21-28 days). Kidney: validated with Nephrin, LTL, DAPI (maturation: 28-35 days). Both validated by mIF, qPCR, and functional assays.</p>',
      results:
        '<p>Both models maintained &gt;30-day stability. Demonstrated dose-dependent toxicity responses to known nephrotoxins and pulmonary toxicants, with good concordance with known human clinical toxicity profiles.</p>',
      implication:
        '<p>Provides a human-relevant, organ-specific safety screening platform to identify organ toxicity risks earlier in development, before animal studies or clinical trials.</p>',
      metaModel: 'Normal Lung / Kidney Organoid',
      metaDrugClasses: 'Multiple (safety assessment)',
      metaReadout: 'Cell viability, functional markers, cytokine release',
      metaValidation: 'mIF, qPCR, functional assays',
      cta1Label: 'Discuss Your Safety Program',
      cta1Url: '/contact',
      cta2Label: null,
      cta2Url: null,
      sortOrder: 5,
      isPublished: true,
    },
    {
      slug: 'disease-modeling-ibd-metabolic',
      title: 'Disease Modeling for Drug Discovery: IBD and Metabolic Disease',
      summary:
        'Established IBD and adipose tissue organoid models for anti-inflammatory compound screening and metabolic disease research.',
      cancerTypeTags: ['Non-Oncology'],
      applicationTags: ['Disease Modeling'],
      challenge:
        '<p>Inflammatory bowel disease (IBD) and metabolic diseases lack physiologically relevant human models for drug screening, limiting the translation of preclinical findings.</p>',
      approach:
        '<p><strong>IBD:</strong> Intestinal organoid models were established and challenged with pro-inflammatory cytokines (TNFalpha, IL-1beta, IL-6). Barrier integrity was assessed by TEER measurement and ZO-1 staining.</p><p><strong>Metabolic:</strong> Adipose tissue organoids were differentiated into brown adipose tissue (BAT) over 14-21 days.</p>',
      results:
        '<p><strong>IBD:</strong> Anti-inflammatory compounds demonstrated dose-dependent restoration of barrier integrity (TEER) and goblet cell function.</p><p><strong>Metabolic:</strong> BAT organoids demonstrated functional thermogenic capacity, enabling screening of compounds targeting metabolic disease.</p>',
      implication:
        '<p>Demonstrates the versatility of our platform beyond oncology, opening new opportunities in inflammatory and metabolic disease drug discovery.</p>',
      metaModel: 'Intestinal / Adipose Tissue Organoid',
      metaDrugClasses: 'Anti-inflammatory compounds, metabolic modulators',
      metaReadout: 'TEER, ZO-1, cytokine profiling',
      metaValidation: 'Alcian blue staining, mIF, qPCR',
      cta1Label: 'Discuss Non-Oncology Programs',
      cta1Url: '/contact',
      cta2Label: null,
      cta2Url: null,
      sortOrder: 6,
      isPublished: true,
    },
  ]);
  console.log('  ✓ 7 篇案例研究');

  console.log('\n✅ 所有初始数据导入完成！');
  console.log('\n导入汇总:');
  console.log('  出版物:   7 篇');
  console.log('  资源下载: 3 条（CTA 均指向 /contact，PDF 待后台上传）');
  console.log('  News:     5 条（全部已上线）');
  console.log('  FAQ:      5 分类，18 条 Q&A');
  console.log('  团队成员: 8 人（4 TRiCBiO + 4 OrgaNova）');
  console.log('  癌种库:   17 个（全部已上线）');
  console.log('  案例研究: 7 篇（全部已上线）');
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ 导入失败:', e);
    process.exit(1);
  });
