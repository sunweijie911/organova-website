'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

const MILESTONES = [
  {
    year: '2009',
    text: 'Seminal stem cell organoid culture paper (Nature Medicine, 1,000+ citations)',
  },
  {
    year: '2014',
    text: 'GI organoid oncogenic transformation (Nature Medicine, 500+ citations)',
  },
  { year: '2016', text: 'ALI culture system methodology (Cell Reports)' },
  {
    year: '2018',
    text: 'Complete TME preservation landmark paper (Cell, 1,400+ citations)',
  },
  {
    year: '2019',
    text: '"Organoid 2.0" named in Nature Reviews Cancer (112+ citations)',
  },
  {
    year: '2022',
    text: 'OrgaNova TRiCBiO founded; ALI-PDO™ platform established',
  },
  {
    year: '2024',
    text: '1,500+ patient models validated; strategic partnership with Eli Lilly',
  },
  {
    year: '2025',
    text: 'US operations in Philadelphia; large-scale CRISPR screen paper (Nat Commun)',
  },
];

export default function AboutView() {
  const [storyExpanded, setStoryExpanded] = useState(false);
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const { data: team } = api.team.list.useQuery();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Why do so many promising cancer drugs fail?
          </h1>
          <p className={styles.heroSubtitle}>
            We started with a question that has defined our mission: to build a
            preclinical model that finally reflects human biology.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.story}>
            <div className={styles.storyBlock}>
              <h3 className={styles.storyHeading}>The Question</h3>
              <p>
                Why do 97% of oncology drugs fail in clinical trials? This
                question drove our founding—a frustration shared by scientists
                watching promising drugs fail in patients. The answer wasn't the
                drugs. It was the models.
              </p>
            </div>
            <div className={styles.storyBlock}>
              <h3 className={styles.storyHeading}>The Breakthrough</h3>
              <p>
                Grounded in landmark research, our team developed a method to
                preserve the entire tumor tissue architecture. The result is not
                a model of a tumor. It is a living fragment of the patient's
                tumor.
              </p>
            </div>
            <div className={styles.storyBlock}>
              <h3 className={styles.storyHeading}>The Platform</h3>
              <p>
                OrgaNova TRiCBiO was founded to translate this breakthrough into
                a scalable platform. Today, we have a biobank of 1,500+ models
                and have validated our clinical prediction accuracy at 84.43%.
              </p>
            </div>
            {storyExpanded && (
              <div className={styles.storyExpanded}>
                <p>
                  For decades, the preclinical stage of drug development has
                  relied on tools that were never designed to reflect human
                  biology. Standard 2D cell lines grow in plastic dishes,
                  stripped of the three-dimensional architecture and cellular
                  complexity of real tumors. Even first-generation
                  patient-derived organoids lose the stromal cells, immune
                  cells, and extracellular matrix that govern how a tumor
                  actually responds to treatment. The result is a systematic
                  illusion of efficacy.
                </p>
                <p>
                  Beginning with the landmark 2009 Nature Medicine paper and
                  culminating in the 2018 Cell paper that demonstrated
                  preservation of the complete tumor microenvironment in an
                  Air-Liquid Interface system, our founding scientific team
                  spent 15 years developing Organoid 2.0. The key insight:
                  instead of isolating and expanding tumor cells, preserve the
                  entire tissue architecture.
                </p>
                <p>
                  OrgaNova TRiCBiO was founded in 2022. In three years, we built
                  a biobank of over 1,500 models across 20+ cancer types,
                  validated our platform's clinical prediction accuracy at
                  84.43% across 152 patient cases, and established partnerships
                  with global pharmaceutical leaders including Eli Lilly and
                  Pharmaron.
                </p>
              </div>
            )}
            <button
              className={styles.storyToggle}
              onClick={() => setStoryExpanded((v) => !v)}
              type="button"
            >
              {storyExpanded ? '↑ Show less' : 'Read Our Full Story →'}
            </button>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Core Team</h2>
          {team && (
            <>
              {team.tricbio.length > 0 && (
                <div className={styles.teamGroup}>
                  <h3 className={styles.teamGroupLabel}>
                    TRiCBiO — Nanjing / Shanghai
                  </h3>
                  <div className={styles.teamGrid}>
                    {team.tricbio.map((m) => (
                      <button
                        className={styles.memberCard}
                        key={m.id}
                        onClick={() =>
                          setActiveMember(activeMember === m.id ? null : m.id)
                        }
                        type="button"
                      >
                        {m.photo ? (
                          // biome-ignore lint/performance/noImgElement: dynamic member photo
                          <img
                            alt={m.name}
                            className={styles.memberPhoto}
                            src={m.photo}
                          />
                        ) : (
                          <div className={styles.memberPhotoPlaceholder}>
                            {m.name[0]}
                          </div>
                        )}
                        <h4 className={styles.memberName}>{m.name}</h4>
                        <p className={styles.memberTitle}>{m.title}</p>
                        {m.shortBio && (
                          <p className={styles.memberShort}>{m.shortBio}</p>
                        )}
                        {activeMember === m.id && m.fullBio && (
                          <div
                            className="rich-text"
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted rich text from CMS
                            dangerouslySetInnerHTML={{ __html: m.fullBio }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {team.organova.length > 0 && (
                <div className={styles.teamGroup}>
                  <h3 className={styles.teamGroupLabel}>
                    OrgaNova — Philadelphia
                  </h3>
                  <div className={styles.teamGrid}>
                    {team.organova.map((m) => (
                      <button
                        className={styles.memberCard}
                        key={m.id}
                        onClick={() =>
                          setActiveMember(activeMember === m.id ? null : m.id)
                        }
                        type="button"
                      >
                        {m.photo ? (
                          // biome-ignore lint/performance/noImgElement: dynamic member photo
                          <img
                            alt={m.name}
                            className={styles.memberPhoto}
                            src={m.photo}
                          />
                        ) : (
                          <div className={styles.memberPhotoPlaceholder}>
                            {m.name[0]}
                          </div>
                        )}
                        <h4 className={styles.memberName}>{m.name}</h4>
                        <p className={styles.memberTitle}>{m.title}</p>
                        {m.shortBio && (
                          <p className={styles.memberShort}>{m.shortBio}</p>
                        )}
                        {activeMember === m.id && m.fullBio && (
                          <div
                            className="rich-text"
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted rich text from CMS
                            dangerouslySetInnerHTML={{ __html: m.fullBio }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Journey</h2>
          <div className={styles.timeline}>
            {MILESTONES.map((m) => (
              <div className={styles.milestone} key={m.year}>
                <span className={styles.milestoneYear}>{m.year}</span>
                <div className={styles.milestoneDot} />
                <p className={styles.milestoneText}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Join Us in Fixing Drug Discovery.</h2>
          <Link className={styles.ctaBtn} href="/contact">
            Partner With Us →
          </Link>
        </div>
      </section>
    </div>
  );
}
