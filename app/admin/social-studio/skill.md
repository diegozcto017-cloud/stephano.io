# Social Studio — Skill Reference

## How Image Generation Works

### In the Browser (Social Studio UI)
1. Go to `/admin/social-studio`
2. Tab **Ideas** → generate ideas or pick a template
3. Click any idea → Tab **Crear** appears with slides
4. Click **"Generar X imágenes con IA"** → Gemini Flash generates each slide
5. Tab **Preview** → Phone mockup, download each slide, copy caption

### From Terminal (nano-banana CLI)
```bash
# Single image
bun run ~/tools/nano-banana-2/src/cli.ts "prompt" -s 1K -a 1:1

# Batch carousel (use generate-visuals.py)
python app/admin/social-studio/generate-visuals.py --topic "Tu negocio necesita web" --slides 5

# From existing content JSON
python app/admin/social-studio/generate-visuals.py --json content.json

# 9:16 Reel cover
bun run ~/tools/nano-banana-2/src/cli.ts "Reel cover for stephano.io, dark luxury tech" -a 9:16 -s 1K
```

## Content Strategy: 70-20-10 Rule

### 70% Proven ideas
- Browse competitor/niche leader accounts
- Find videos with **10K+ likes AND 5x views vs follower count**
- Recreate topic with your own hook and execution
- Categories: web design, digital transformation, business automation, Costa Rica entrepreneurship

### 20% Repeat winners
- Check past content with best engagement
- Change the hook (first 3 seconds/words)
- Change the format (carousel → reel, or reel → carousel)

### 10% Experimental
- New angles on stephano.io services
- Test new formats, new target verticals

## 3-Pillar Framework

| Pillar | % | Description | Example |
|--------|---|-------------|---------|
| Educativo | 40% | Teach something useful | "5 razones por las que tu negocio necesita web en 2026" |
| Entretenido | 30% | Fun, relatable, comparisons | "WhatsApp vs sistema de agendas (before/after)" |
| Emocional | 30% | Connection, aspiration | "El día que un restaurante triplicó sus reservas" |

## Monthly Workflow

```
Semana 1-4 (repetir):
- Lunes    → 10 ideas (70-20-10 breakdown)
- Martes   → 10 scripts (hook + slides + caption + hashtags)
- Miércoles → Generar/grabar TODO (imágenes con IA + video si aplica)
- Jueves   → Editar y programar
- Viernes  → Publicar + engagement (responder comentarios, DMs)
- Sáb-Dom  → Analizar métricas, ajustar estrategia
```

## Hashtag Strategy (Instagram Organic)

Mix sizes for maximum reach:
- **5 broad** (1M+ posts): #negocios #emprendimiento #tecnologia #costarica #paginaweb
- **5 medium** (100K-500K): #desarrolloweb #tiendaonline #marketingdigital #negocioscr #softwareempresarial
- **5 niche** (10K-50K): #stephanoio #websitecr #transformaciondigital #solucionesdigitales #agenciacr
- **5 location**: #costarica #sanjose #tico #centroamerica #negociosdedicos

## Output Directory
Generated images → `public/social-assets/{carousel-title}/slide-01.jpeg`
Access in browser → `/social-assets/{carousel-title}/slide-01.jpeg`
