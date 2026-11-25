# SiteDotIncBr — Fábrica de Sites Cinematográficos com IA

Manual padrão operacional para criar, validar e publicar **sites interativos de alto impacto visual** para qualquer nicho (clínicas de pilates, estética, cafeterias, restaurantes, barbearias, arquitetura, comércios locais, etc.) usando as **5 Skills Globais** instaladas no Antigravity.

---

## 1. As 5 Skills Globais da Fábrica

Localizadas em `C:\Users\ELITEBOOK\.gemini\config\skills\` (funcionam em **qualquer projeto** aberto no Antigravity):

| Ordem | Skill | Função |
| :---: | :--- | :--- |
| **1** | `cine-site-briefing` | Cria direção de arte, paleta, par de fontes, roteiro de 4 atos e prompts de imagem/vídeo (`BRIEFING.md`). |
| **2** | `cine-media-pipeline` | Gera cenas cinematográficas (Modo Instantâneo) **ou** fatia um `.mp4` em frames `.webp` Desktop/Mobile (`extract-frames.ps1`). |
| **3** | `cine-site-builder` | Gera o site estático zero-build (`index.html`, `styles.css`, `app.js`) com `<canvas>` + GSAP ScrollTrigger + Lenis + conversão local. |
| **4** | `cine-site-qa` | Sobe servidor local e audita automaticamente Desktop (`1440px`), Mobile (`390px`), contraste, animações e erros de console. |
| **5** | `cine-site-deploy` | Publica gratuitamente no GitHub Pages (`dotincbr.com.br/demos/<slug>/` ou repositório isolado via `gh`). |

---

## 2. Prompt Mestre (Copiar & Colar para Qualquer Nicho)

Sempre que quiser gerar um site novo, copie o modelo abaixo, preencha os colchetes e envie para o agente:

```markdown
Quero criar um novo site cinematográfico usando a cadeia completa das skills
(`cine-site-briefing` → `cine-media-pipeline` → `cine-site-builder` → `cine-site-qa`).

### Dados do Cliente
- **Nome da marca:** [Ex: Café Origem / Studio Aura Pilates / Barbearia Navalha]
- **Nicho:** [Ex: Cafeteria artesanal / Clínica de Pilates / Clínica de Estética / Hamburgueria]
- **Pasta da demo:** `demos/[slug-do-cliente]` (ex: `demos/cafe-origem`)
- **Cidade / Bairro:** [Ex: Jardins, São Paulo/SP]
- **WhatsApp:** [Ex: 5511999990000]
- **Objetivo principal:** [Ex: Agendar aula experimental / Pedir no WhatsApp / Solicitar orçamento / Reservar mesa]
- **Diferenciais / Serviços:** [Ex: Torra própria, croissants artesanais, espaço pet friendly]

### Direção Visual (Livre — personalize como quiser)
- **Estilo estético:** [Ex: Luxo orgânico claro / Dark luxury / Editorial quente / Streetwear alto contraste / Futurista minimalista]
- **Paleta de cores:** [Deixe "Sugerir ideal para o nicho" OU informe hexadecimais exatos: Fundo `#...`, Texto `#...`, Destaque `#...`]
- **Tipografia:** [Ex: Serifa editorial + Sans limpa / Display bold caixa alta + Sans geométrica / Sugerir ideal]
- **Estilo de animação:** [Ex: Apple Scroll-Scrubbing 4 atos + Lenis + Glassmorphism / Parallax profundo + revelação editorial / Troca de cor por ato + texto cinético gigante]
- **Mídia inicial:** [Modo Instantâneo (cenas geradas por IA) OU tenho vídeo `.mp4` em `<caminho>`]

Ao finalizar, rode a auditoria visual (`cine-site-qa`) em Desktop e Mobile e me avise quando estiver pronto para publicar no GitHub Pages.
```

---

## 3. Catálogo de Estilos, Paletas e Animações (Misture Livremente)

Use esta tabela para variar completamente o visual de um cliente para outro sem repetir fórmula:

### Estilos & Paletas
| Estilo | Sensação | Paleta Base Sugerida | Fontes Sugeridas | Ideal para |
| :--- | :--- | :--- | :--- | :--- |
| **Luxo Orgânico** | Leveza, luz natural, boutique | Linho `#F6F3EE` + Verde-carvão `#1C2620` + Dourado `#C9A97E` | `Instrument Serif` + `Plus Jakarta Sans` | Pilates, fisioterapia, spas, clínicas integrativas, hotéis |
| **Editorial Quente** | Sensorial, artesanal, apetitoso | Creme `#F3ECE1` + Espresso `#241711` + Caramelo `#8C4A27` | `Playfair Display` + `DM Sans` | Cafeterias, padarias, confeitarias, sorveterias |
| **Dark Luxury** | Poder, sofisticação, alto valor | Grafite `#0E0F11` + Off-white `#F5F2EB` + Ouro `#C89B54` | `Syne` ou `Cormorant Garamond` + `Inter` | Barbearias premium, arquitetura, advocacia, estética avançada, B2B |
| **Appetite Fire** | Energia, fome imediata, contraste | Carvão `#12100E` + Creme `#FAF6F0` + Brasa `#E25822` | `Fraunces` + `Plus Jakarta Sans` | Hamburguerias, pizzarias, churrascarias, restaurantes |
| **Champagne Clean** | Suavidade, confiança, pele/beleza | Pérola `#FAF7F4` + Cacau `#221D1A` + Rose/Nude `#9E7B64` | `Cormorant Garamond` + `Manrope` | Estética, harmonização, odontologia, dermatologia |
| **Streetwear / Bold** | Jovem, disruptivo, alta energia | Preto `#0A0A0A` + Neon Lima `#C8FF00` ou Laranja `#FF5500` | `Anton` ou `Syne` + `Space Grotesk` | Moda, academias, crossfit, marcas autorais, eventos |

### Estilos de Animação que Você Pode Pedir
1. **Apple Scroll-Scrubbing (Padrão da Fábrica):** `<canvas>` travado (`sticky`) que avança frames `.webp` ou transiciona 3–4 cenas com Ken Burns suave sincronizado à rolagem + régua lateral `01–04`.
2. **Texto Cinético & Camadas:** Títulos gigantes que deslizam horizontalmente (marquee ou parallax reverso) atrás ou sobre o elemento visual.
3. **Troca de Tema no Scroll:** A cor de fundo da página inteira muda suavemente conforme o usuário passa pelos atos (ótimo para moda, sorveterias e produtos com sabores/cores).
4. **Cards Glassmorphic Flutuantes:** Badges e métricas com vidro fosco (`backdrop-filter: blur`) que entram em cascata sobre o visual cinematográfico.
5. **Bento Grid Interativo:** Grade modular estilo Apple abaixo da dobra com microinterações no hover, números animados e abas interativas.

---

## 4. Como Turbinar um Demo com Vídeo Real ou Vídeo de IA (`.mp4` → `.webp`)

Todo site gerado pela fábrica já nasce pronto para rodar nos **dois modos** sem alterar código — basta trocar o `assets/media-manifest.json`.

### Passo 1 — Instalar o FFmpeg (uma única vez no Windows)
```powershell
winget install Gyan.FFmpeg
```
*(Feche e reabra o terminal após instalar.)*

### Passo 2 — Gerar ou gravar o vídeo (5 a 8 segundos)
- **Com IA:** Gere 1 ou 2 imagens-chave e anime em **Kling AI**, **Google Veo**, **Runway** ou **Luma** pedindo movimento contínuo e lento (*slow smooth dolly out, continuous camera glide, no jump cuts*).
- **Com celular:** Grave um clipe real de 5–8s em 4K 60fps andando devagar pelo espaço/produto do cliente.

### Passo 3 — Extrair os frames otimizados automaticamente
```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.gemini\config\skills\cine-media-pipeline\scripts\extract-frames.ps1" `
  -InputVideo "C:\caminho\do\video.mp4" `
  -OutputDir ".\demos\pilates-lumina\assets"
```
O script gera automaticamente:
- `assets/frames/desktop/frame_0001.webp`... (1280px, 20fps)
- `assets/frames/mobile/frame_0001.webp`... (640px, 16fps)
- `assets/poster.webp`
- `assets/media-manifest.json` atualizado para `"mode": "frames"`.

---

## 5. Como Testar Localmente e Publicar no GitHub Pages

### Testar no seu computador
```powershell
python -m http.server 8765 --directory ".\demos\pilates-lumina"
```
Abra `http://localhost:8765/` no navegador (ou teste pelo celular na mesma rede).

### Publicar grátis em `dotincbr.com.br/demos/<slug>/` (Modo Subpasta)
```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.gemini\config\skills\cine-site-deploy\scripts\deploy-gh-pages.ps1" `
  -Mode Subfolder `
  -RepoDir "." `
  -Slug "pilates-lumina"
```
Em ~1 minuto, a prévia fica online com HTTPS em:
`https://dotincbr.com.br/demos/<slug>/`

### Publicar em repositório isolado para o cliente (Modo Standalone — requer `gh`)
Instale uma vez com `winget install GitHub.cli` e autentique com `gh auth login`, depois rode:
```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.gemini\config\skills\cine-site-deploy\scripts\deploy-gh-pages.ps1" `
  -Mode Standalone `
  -SiteDir ".\demos\pilates-lumina" `
  -RepoName "demo-pilates-lumina"
```

---

## 6. Diretrizes Obrigatórias de Qualidade (Checklist)

Antes de enviar qualquer link para um cliente, confirme:
- [ ] **Zero texto dentro das imagens/vídeos gerados por IA** (todo texto deve ser HTML real para nitidez e SEO).
- [ ] **Contraste garantido** sobre fotos/vídeos com gradiente direcional (`.cinema-scrim`).
- [ ] **Mobile impecável (`390px`)**: sem barra de rolagem horizontal, altura de scroll confortável (`260vh`–`280vh`) e botões clicáveis com o polegar.
- [ ] **Acessibilidade (`prefers-reduced-motion`)**: todos os atos continuam acessíveis sem travar a rolagem.
- [ ] **Conversão direta**: botão de WhatsApp com mensagem pré-preenchida contextualizada para o cliente.
- [ ] **Zero erros no console** e nenhuma imagem/fonte retornando `404`.

---

## 7. Roteiro Rápido de Venda (WhatsApp / Direct)

1. Escolha um negócio local com bom Instagram e site fraco (ou só Linktree).
2. Gere uma demo personalizada em `demos/<nome-do-cliente>/` e publique em `https://dotincbr.com.br/demos/<nome-do-cliente>/`.
3. Grave um vídeo de 15–20 segundos rolando o site no celular e envie junto com a mensagem:
   > *"Olá [Nome], tudo bem? Acompanhei o trabalho da [Empresa] e montei uma prévia interativa de como ficaria um site cinematográfico para transformar quem chega do Instagram e Google em agendamentos no WhatsApp. Posso te mandar o link para você testar aí no seu celular?"*

---

## Demos Atuais neste Repositório
- **Lumina Pilates** (`demos/pilates-lumina/`) — Estúdio boutique de Pilates & Reabilitação (`https://dotincbr.com.br/demos/pilates-lumina/`).
