# Portfólio WEB DECALQ (novo)

Projeto **independente** do portfólio atual. Mesma stack (Next.js 16 App Router, React 19, TypeScript, Framer Motion, Lenis, exportação estática), interface criada do zero. O projeto original (`Downloads/portfolio-completo/portfolio`) não foi alterado.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm run build   # gera out/
```

## Configuração central

| O quê | Onde |
|---|---|
| WhatsApp (país+DDD+número, só dígitos), e-mail, URL do site | variáveis `NEXT_PUBLIC_*` (ver `.env.example`) lidas em `src/config/site.ts` |
| Mensagens do WhatsApp | `src/config/site.ts` (`mensagens`) |
| Projetos e cases | `src/data/projects.ts` |
| Serviços, processo | `src/data/services.ts` |
| Tecnologias | `src/data/technologies.ts` |
| Textos de essência/sobre/equipe | `src/data/content.ts` |
| Tokens visuais | `src/styles/tokens.css` |

**WhatsApp:** sem `NEXT_PUBLIC_WHATSAPP` nenhum botão aponta para `wa.me`; os CTAs levam a `/contato/`, que mostra o aviso de "não configurado". Defina o número no ambiente do build (Vercel: Settings → Environment Variables) e faça novo deploy.

**Prospecção:** `https://SEU-DOMINIO/?origem=whatsapp` troca o rótulo para "Continuar nossa conversa no WhatsApp" e a mensagem inicial. A origem fica guardada na aba (`sessionStorage`) e sobrevive à navegação interna. `NEXT_PUBLIC_WHATSAPP_PROSPECCAO` opcionalmente define outro número para esse caso. O clique só abre a conversa: o site não sabe se a mensagem foi enviada nem identifica o chat de origem.

## Movimento: uma fonte só

`src/lib/movimento.ts` resolve o modo em vigor e publica em `<html data-motion="completo|calmo">`, escrito **antes da primeira pintura** pelo script em `layout.tsx`.

- Padrão: respeita `prefers-reduced-motion` do sistema.
- O visitante pode decidir o contrário pelo interruptor (`MotionToggle`), no rodapé e no pé da faixa. A escolha vence a preferência do sistema e fica em `localStorage` (`decalq:movimento`).
- **Todo** o CSS de animação condiciona a `html[data-motion="completo"]` — não existe mais nenhuma `@media (prefers-reduced-motion)` nos estilos. Todo componente pergunta por `useReducedMotion()`, que lê o mesmo estado.

Isso é deliberado: antes, a mesma decisão morava em `@media` espalhadas por vários arquivos CSS, e uma regra duplicada em `pages.css` sobrescreveu `home.css` por ordem de import, deixando um botão de pausa sobre uma faixa que nunca se movia.

**Ao depurar "a animação não roda":** verifique `document.documentElement.dataset.motion` e conte quadros com `requestAnimationFrame`. Zero quadros por segundo com `visibilityState: "visible"` significa que a janela do navegador está oculta ou minimizada — o compositor não tica e qualquer animação congela. É o ambiente, não o código.

## Comportamentos

- **Intro:** só o decalqzinho (`Intro.tsx`). Toca ao abrir, recarregar, voltar de outra página (link ou histórico) e ao restaurar do bfcache; nunca por sessão/visita. "Pular intro", Esc/clique/rolagem, versão calma com `prefers-reduced-motion` e liberação por temporizador (script inline em `layout.tsx`) se algo falhar. Âncoras dentro da home não reiniciam.
- **Logo:** `BrandSymbol` compartilhado entre intro e cabeçalho; pisca um olho no hover (mouse), foco por teclado e clique. O desenho não recebe gradiente novo nem efeito: a luz fica no ambiente.
- **Faixa horizontal:** `HorizontalGallery.tsx`, distância medida no conteúdo; carrossel com botões no toque/tablet/movimento reduzido.
- **Ticker** (`Ticker.tsx`): duas linhas, 52s e 74s, sentidos opostos. Movimento automático e contínuo, independente de scroll ou hover. Quem liga é `data-run` no elemento (estado React), não uma regra `@media`: uma cópia de `.ticker-toggle` em `pages.css` já sobrescreveu o `display:none` de `home.css` por ordem de import e deixou um botão de pausa sobre uma faixa parada. Não há pausa por hover, porque a faixa ocupa a largura toda e qualquer ponteiro de passagem a congelaria. O loop usa duas cópias idênticas e `translateX(-50%)`, então o reinício cai sobre o estado inicial (sem salto ou vão). Com `prefers-reduced-motion` ela não parte sozinha e o botão convida: "Ativar movimento"; ao ativar, roda 1,9× mais devagar (`data-calm`).
- **Transições de rota:** `app/template.tsx` (entrada) + `lib/transicao.ts` (saída). A entrada é animação CSS (`.route`), não `style` inline, para não sobrar `transform` residual criando bloco de contenção para `position: fixed`. A saída tem piso de 150ms, senão a rota nova monta antes de o fade aparecer.
- **Âncoras da mesma página:** índice no topo de `/servicos`. Com Lenis a rolagem é suave e compensa `--header-h`; com movimento reduzido o salto é direto, compensado por `scroll-padding-top`.
- **CTA final:** `CursorCta.tsx`, seguidor só com mouse fino e sem movimento reduzido; senão, botão estático único.
- **Métricas:** `/metricas/` (fora do sitemap e do robots). Coleta via `@vercel/analytics` (só no deploy da Vercel, com Web Analytics ativado). O painel mostra estado "aguardando dados" até `carregarMetricas()` (`src/lib/metricas.ts`) ser ligada a uma fonte de leitura. Nada é inventado.
- **Visualizador:** `/projetos/<slug>/visitar/` abre sites publicados que permitem iframe, com barra de retorno.

## Publicação

Projeto Vercel **separado** do atual: importe esta pasta (preset Next.js, build `npm run build`), defina as variáveis do `.env.example` e faça o deploy.
