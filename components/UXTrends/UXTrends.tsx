/* eslint-disable */
"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import s from "./ParallaxSlider.module.css"
import { FiCheckCircle, FiSmile, FiUser, FiLayout, FiDatabase, FiCpu, FiEye, FiLayers } from "react-icons/fi"

/* ─────────────────────────────────────────────── */
/*  Slide content definitions                      */
/* ─────────────────────────────────────────────── */

const slides = [
    {
        id: "intro",
        tag: "UX/UI Trends 2026",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div className={s.cardTag}>UX/UI Trends →</div>
                <h3 className={s.cardTitle} style={{ fontSize: 32 }}>
                    Escalamos tu negocio con diseño de <span className={s.cardTitleAccent}>2026.</span>
                </h3>
                <p className={s.cardSubtitle} style={{ marginTop: 16 }}>
                    No solo diseñamos, resolvemos. Convertimos píxeles en arquitectura de negocio.
                </p>
            </>
        ),
    },
    {
        id: "genui",
        tag: "UI Generativa",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div>
                    <h3 className={s.cardTitle}>Hacemos interfaces <span className={s.cardTitleAccent}>(GenUI)</span></h3>
                    <p className={s.cardSubtitle}>Creamos experiencias que se adaptan en tiempo real:</p>
                    <ul className={s.cardList}>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Entendemos el comportamiento</li>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Respondemos al contexto</li>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Personalizamos cada flujo</li>
                    </ul>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
                    <span className={s.cardPill}><span className={s.cardPillDot} /> Sin pantallas fijas</span>
                    <span className={s.cardPill}><span className={s.cardPillDot} /> Solo interfaces vivas</span>
                </div>
            </>
        ),
    },
    {
        id: "porqueimporta",
        tag: "¿Por qué importa?",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div>
                    <h3 className={s.cardTitle}>Resolvemos <span className={s.cardTitleAccent}>fricciones.</span></h3>
                    <div className={s.cardCheckbox}>
                        <p className={s.cardCheckboxTitle}>Nuestro enfoque garantiza:</p>
                        <ul className={s.cardList}>
                            <li className={s.cardListItem}><FiCheckCircle className={s.cardListIcon} size={16} /> Menos pasos al éxito</li>
                            <li className={s.cardListItem}><FiCheckCircle className={s.cardListIcon} size={16} /> Decisiones más rápidas</li>
                            <li className={s.cardListItem}><FiCheckCircle className={s.cardListIcon} size={16} /> Lealtad de usuario pura</li>
                        </ul>
                    </div>
                </div>
                <div className={s.cardFooter}>
                    <p className={s.cardFooterText}>
                        Pasamos de lo visual a lo <span className={s.cardFooterAccent}>estratégico.</span>
                    </p>
                </div>
            </>
        ),
    },
    {
        id: "agentready",
        tag: "Agent-Ready Web",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div>
                    <h3 className={s.cardTitle}>Construimos para el <span className={s.cardTitleAccent}>futuro.</span></h3>
                    <p className={s.cardSubtitle}>Preparamos tu web para humanos y agentes de IA.</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Optimizamos la estructura para que:</p>
                    <ul className={s.cardList}>
                        <li className={s.cardListItem}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,229,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FiEye size={14} className={s.cardListIcon} /></div>
                            Cualquier bot entienda tu valor
                        </li>
                        <li className={s.cardListItem}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,229,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FiLayers size={14} className={s.cardListIcon} /></div>
                            La información fluya sin trabas
                        </li>
                        <li className={s.cardListItem}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,229,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FiCpu size={14} className={s.cardListIcon} /></div>
                            La IA ejecute por ti
                        </li>
                    </ul>
                </div>
                <div className={s.cardFooter}>
                    <p className={s.cardFooterText}>
                        Hacemos tecnología <span className={s.cardFooterAccent}>interoperable.</span>
                    </p>
                </div>
            </>
        ),
    },
    {
        id: "quecambia",
        tag: "¿Qué cambia?",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div>
                    <h3 className={s.cardTitle}>¿Qué cambia en <span className={s.cardTitleAccent}>UX/UI?</span></h3>
                    <ul className={s.cardList} style={{ gap: 14 }}>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Estructuras semánticas más limpias</li>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Menos ruido visual</li>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Datos mejor organizados</li>
                    </ul>
                </div>
                <div className={s.cardFooter}>
                    <p className={s.cardFooterText}>
                        Diseñar bien ya no es solo experiencia. <span className={s.cardFooterAccent}>Es interoperabilidad.</span>
                    </p>
                </div>
            </>
        ),
    },
    {
        id: "humancore",
        tag: "Human-Core",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div style={{ textAlign: "center" }}>
                    <h3 className={s.cardTitle}>Inyectamos <span className={s.cardTitleAccent}>humanidad</span></h3>
                    <p className={s.cardSubtitle}>Eliminamos la frialdad corporativa.</p>
                    <div className={s.cardHighlight}>DISEÑO CON ALMA</div>
                    <ul className={s.cardList} style={{ alignItems: "center" }}>
                        <li className={s.cardListItem}><FiCheckCircle className={s.cardListIcon} size={16} /> Conexión emocional</li>
                        <li className={s.cardListItem}><FiCheckCircle className={s.cardListIcon} size={16} /> Micro-interacciones vivas</li>
                        <li className={s.cardListItem}><FiCheckCircle className={s.cardListIcon} size={16} /> Experiencias orgánicas</li>
                    </ul>
                </div>
                <div className={s.cardFooter} style={{ textAlign: "center" }}>
                    <p className={s.cardFooterText}>Creamos <span className={s.cardFooterAccent}>cercanía</span> en cada clic.</p>
                </div>
            </>
        ),
    },
    {
        id: "sistemas",
        tag: "Sistemas",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div>
                    <h3 className={s.cardTitle}>UX orientado a <span className={s.cardTitleAccent}>sistemas</span></h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                        <span className={s.cardPill}><span className={s.cardPillDot} /> Pantallas aisladas → Ecosistemas</span>
                    </div>
                    <p className={s.cardSubtitle}>El diseño ya no piensa solo en páginas, sino en:</p>
                    <ul className={s.cardList}>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Flujos</li>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Eventos</li>
                        <li className={s.cardListItem}><span className={s.cardListDot} /> Conexiones entre servicios</li>
                    </ul>
                </div>
                <div className={s.cardFooter}>
                    <p className={s.cardFooterText}>UX/UI se vuelve parte de la <span className={s.cardFooterAccent}>arquitectura.</span></p>
                </div>
            </>
        ),
    },
    {
        id: "equipo",
        tag: "Tu equipo hoy",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <h3 className={s.cardTitle} style={{ fontSize: 24 }}>Qué debería hacer tu equipo <span className={s.cardTitleAccent}>hoy</span></h3>
                    <div className={s.cardTag}>SI DISEÑAS PARA 2026</div>
                </div>
                <div className={s.cardGrid}>
                    <div className={s.cardGridItem}>
                        <span className={s.cardGridNum}>01.</span>
                        <FiSmile size={24} className={s.cardGridIcon} />
                        <p className={s.cardGridText}>Piensa en comportamiento, no solo layout</p>
                    </div>
                    <div className={s.cardGridItem}>
                        <span className={s.cardGridNum}>02.</span>
                        <FiUser size={24} className={s.cardGridIcon} />
                        <p className={s.cardGridText}>Diseña para humanos y sistemas</p>
                    </div>
                    <div className={s.cardGridItem}>
                        <span className={s.cardGridNum}>03.</span>
                        <FiLayout size={24} className={s.cardGridIcon} />
                        <p className={s.cardGridText}>Prioriza claridad sobre exceso visual</p>
                    </div>
                    <div className={s.cardGridItem}>
                        <span className={s.cardGridNum}>04.</span>
                        <FiDatabase size={24} className={s.cardGridIcon} />
                        <p className={s.cardGridText}>Valida UX con datos, no suposiciones</p>
                    </div>
                </div>
            </>
        ),
    },
    {
        id: "outro",
        tag: "Conclusión",
        render: () => (
            <>
                <div className={s.cardGlow} />
                <div>
                    <p className={s.cardSubtitle}>No seguimos tendencias, las creamos.</p>
                    <h3 className={s.cardTitle} style={{ fontSize: 30 }}>
                        <span className={s.cardTitleAccent} style={{ display: "block", marginBottom: 4 }}>Resolvemos</span>
                        tus desafíos técnicos con ingeniería de élite<span className={s.cardTitleAccent}>.</span>
                    </h3>
                </div>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>¿Empezamos?</span>
                    <Link href="/cotizar" className={s.ctaButton}>
                        Inicia tu diagnóstico gratuito →
                    </Link>
                </div>
            </>
        ),
    },
]

/* ─────────────────────────────────────────────── */
/*  3D Parallax Slider Component                   */
/* ─────────────────────────────────────────────── */

export function UXTrends() {
    const [current, setCurrent] = useState(0)
    const total = slides.length
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Auto-advance every 5s
    const startAutoPlay = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total)
        }, 5000)
    }, [total])

    useEffect(() => {
        startAutoPlay()
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [startAutoPlay])

    const go = useCallback((dir: number) => {
        setCurrent((prev) => (prev + dir + total) % total)
        startAutoPlay()
    }, [total, startAutoPlay])

    const goTo = useCallback((idx: number) => {
        setCurrent(idx)
        startAutoPlay()
    }, [startAutoPlay])

    const getSlideClass = (index: number) => {
        if (index === current) return s.slideCurrent
        if (index === (current + 1) % total) return s.slideNext
        if (index === (current - 1 + total) % total) return s.slidePrevious
        return s.slideHidden
    }

    return (
        <section style={{ padding: "100px 0", position: "relative", overflow: "hidden" }}>
            {/* Background */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0, 102, 255, 0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

            {/* Header */}
            <div className="container" style={{ position: "relative", zIndex: 1, marginBottom: 48 }}>
                <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
                    <span style={{
                        padding: "6px 14px", borderRadius: 100,
                        background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.25)",
                        fontSize: 13, fontWeight: 600, color: "#00E5FF",
                        display: "inline-block", marginBottom: 16,
                    }}>
                        Diseño que convierte en 2026
                    </span>
                    <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
                        Reglas de diseño <span style={{ color: "#00E5FF" }}>web y mobile</span>
                    </h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 16 }}>
                        El UX/UI dejó de ser decoración. Es arquitectura de negocio, y estas son las reglas que separan lo amateur de lo profesional.
                    </p>
                </div>
            </div>

            {/* Slider */}
            <div className={s.slider}>
                <button className={s.sliderBtn} onClick={() => go(-1)} aria-label="Previous">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>

                <div className={s.slidesWrapper}>
                    {slides.map((slide, i) => (
                        <div key={slide.id} className={`${s.slide} ${getSlideClass(i)}`}>
                            <div className={s.slideInner}>
                                <div className={s.card}>
                                    {slide.render()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className={s.sliderBtn} onClick={() => go(1)} aria-label="Next">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* Pagination */}
            <div className={s.pagination}>
                {slides.map((slide, i) => (
                    <button
                        key={slide.id}
                        className={`${s.paginationDot} ${i === current ? s.paginationDotActive : ""}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
