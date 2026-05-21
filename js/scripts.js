// ============================================================
//  FinançasClaras — scripts.js
//  Calculadoras (index) + Sistema de Comentários (níveis 1-4)
// ============================================================

// ─────────────────────────────────────────
//  SUPABASE CONFIG
// ─────────────────────────────────────────
const SUPABASE_URL = 'https://kemobknewgdorescxoli.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Wsxt5RCCOcoXirdrEgPBbw_t6xBS3xQ';

// ─────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR');
}

function avatarLetra(nome) {
    return nome[0].toUpperCase();
}

// Detecta em qual página estamos pelo ARTIGO_ID declarado inline nos HTMLs.
// Os HTMLs continuam declarando:  const ARTIGO_ID = 'nivel1';  (por exemplo)
// Este script lê essa variável global quando presente.

// ─────────────────────────────────────────
//  RENDERIZAÇÃO DE COMENTÁRIOS
// ─────────────────────────────────────────
function renderizarComentarios(dados) {
    const lista = document.getElementById('lista-comentarios');
    if (!lista) return;

    // Separa raízes e respostas
    const raizes = dados.filter(c => !c.resposta_de);
    const respostasPor = {};
    dados.filter(c => c.resposta_de).forEach(c => {
        if (!respostasPor[c.resposta_de]) respostasPor[c.resposta_de] = [];
        respostasPor[c.resposta_de].push(c);
    });

    if (!raizes.length) {
        lista.innerHTML = '<p style="color:rgba(255,255,255,.3);font-size:.9rem;">Nenhum comentário ainda. Seja o primeiro!</p>';
        return;
    }

    lista.innerHTML = raizes.map(c => {
        const respostas = (respostasPor[c.id] || []);
        const respostasHTML = respostas.map(r => `
            <div style="
                margin-top:.75rem;
                margin-left:2.5rem;
                padding:.85rem 1rem;
                background:rgba(255,255,255,0.04);
                border-radius:8px;
                border-left:2px solid var(--esmeralda);
            ">
                <div class="d-flex align-items-center gap-2 mb-1">
                    <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:.7rem;flex-shrink:0;">
                        ${avatarLetra(r.nome)}
                    </div>
                    <div>
                        <span style="color:#fff;font-weight:600;font-size:.85rem;">${r.nome}</span>
                        <span style="color:rgba(255,255,255,0.35);font-size:.75rem;margin-left:.5rem;">${formatarData(r.criado_em)}</span>
                    </div>
                </div>
                <div style="color:rgba(255,255,255,0.8);font-size:.88rem;padding-left:2.1rem;">${r.mensagem}</div>
            </div>
        `).join('');

        return `
        <div class="comment-card" style="background:var(--grafite-mid);padding:1rem;border-radius:8px;margin-bottom:1rem;border:1px solid rgba(255,255,255,0.05);">
            <div class="d-flex align-items-center gap-2 mb-2">
                <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--esmeralda),var(--esmeralda-deeper));display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:.8rem;flex-shrink:0;">
                    ${avatarLetra(c.nome)}
                </div>
                <div>
                    <div style="color:#fff;font-weight:600;font-size:.9rem;">${c.nome}</div>
                    <div style="color:rgba(255,255,255,0.4);font-size:.75rem;">${formatarData(c.criado_em)}</div>
                </div>
            </div>
            <div style="color:rgba(255,255,255,0.85);font-size:.9rem;margin-bottom:.75rem;">${c.mensagem}</div>

            ${respostasHTML}

            <!-- Botão Responder -->
            <button
                onclick="toggleResposta(${c.id})"
                style="
                    background:none;border:none;cursor:pointer;
                    color:var(--esmeralda-light);font-size:.8rem;
                    display:flex;align-items:center;gap:.3rem;
                    margin-top:.6rem;padding:0;opacity:.8;
                "
                onmouseover="this.style.opacity=1"
                onmouseout="this.style.opacity=.8"
            >
                <i class="bi bi-reply"></i> Responder
            </button>

            <!-- Formulário de resposta (oculto por padrão) -->
            <div id="form-resposta-${c.id}" style="display:none;margin-top:.75rem;">
                <input
                    id="resp-nome-${c.id}" type="text" placeholder="Seu nome"
                    style="width:100%;padding:.55rem .9rem;border-radius:7px;border:1px solid rgba(255,255,255,.1);background:var(--grafite);color:#fff;margin-bottom:.5rem;outline:none;font-size:.88rem;"
                />
                <textarea
                    id="resp-texto-${c.id}" rows="2" placeholder="Escreva sua resposta..."
                    style="width:100%;padding:.55rem .9rem;border-radius:7px;border:1px solid rgba(255,255,255,.1);background:var(--grafite);color:#fff;margin-bottom:.5rem;resize:vertical;outline:none;font-size:.88rem;"
                ></textarea>
                <div style="display:flex;align-items:center;gap:.75rem;">
                    <button
                        class="btn-comment"
                        style="padding:.45rem 1.1rem;font-size:.85rem;"
                        onclick="enviarResposta(${c.id})"
                    >Enviar resposta <i class="bi bi-send ms-1"></i></button>
                    <button
                        onclick="toggleResposta(${c.id})"
                        style="background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;font-size:.8rem;"
                    >Cancelar</button>
                    <span id="resp-status-${c.id}" style="font-size:.8rem;color:var(--esmeralda-light);"></span>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ─────────────────────────────────────────
//  TOGGLE FORMULÁRIO DE RESPOSTA
// ─────────────────────────────────────────
window.toggleResposta = function(id) {
    const form = document.getElementById(`form-resposta-${id}`);
    if (!form) return;
    const aberto = form.style.display !== 'none';
    form.style.display = aberto ? 'none' : 'block';
    if (!aberto) document.getElementById(`resp-nome-${id}`)?.focus();
};

// ─────────────────────────────────────────
//  CARREGAR COMENTÁRIOS
// ─────────────────────────────────────────
async function carregarComentarios() {
    const lista = document.getElementById('lista-comentarios');
    if (!lista) return;

    const artigoId = typeof ARTIGO_ID !== 'undefined' ? ARTIGO_ID : 'geral';
    lista.innerHTML = '<p style="color:rgba(255,255,255,.3);font-size:.9rem;">Carregando comentários...</p>';

    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/comentarios?artigo=eq.${artigoId}&order=criado_em.asc`,
            { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        const dados = await res.json();
        renderizarComentarios(dados);
    } catch (e) {
        lista.innerHTML = '<p style="color:#EF4444;font-size:.9rem;">Erro ao carregar comentários.</p>';
    }
}

// ─────────────────────────────────────────
//  ENVIAR COMENTÁRIO RAIZ
// ─────────────────────────────────────────
window.enviarComentario = async function() {
    const nome    = document.getElementById('cmt-nome')?.value.trim();
    const mensagem = document.getElementById('cmt-texto')?.value.trim();
    const status  = document.getElementById('cmt-status');
    const artigoId = typeof ARTIGO_ID !== 'undefined' ? ARTIGO_ID : 'geral';

    if (!nome || !mensagem) {
        status.style.color = '#EF4444';
        status.textContent = 'Preencha tudo!';
        return;
    }
    status.style.color = 'var(--esmeralda-light)';
    status.textContent = 'Enviando...';

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/comentarios`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ nome, mensagem, artigo: artigoId })
        });
        if (res.ok) {
            status.textContent = 'Publicado!';
            document.getElementById('cmt-nome').value  = '';
            document.getElementById('cmt-texto').value = '';
            setTimeout(() => status.textContent = '', 3000);
            carregarComentarios();
        } else {
            status.style.color = '#EF4444';
            status.textContent = 'Erro ao enviar :(';
        }
    } catch (e) {
        status.style.color = '#EF4444';
        status.textContent = 'Erro de conexão :(';
    }
};

// ─────────────────────────────────────────
//  ENVIAR RESPOSTA
// ─────────────────────────────────────────
window.enviarResposta = async function(comentarioPaiId) {
    const nome     = document.getElementById(`resp-nome-${comentarioPaiId}`)?.value.trim();
    const mensagem = document.getElementById(`resp-texto-${comentarioPaiId}`)?.value.trim();
    const status   = document.getElementById(`resp-status-${comentarioPaiId}`);
    const artigoId = typeof ARTIGO_ID !== 'undefined' ? ARTIGO_ID : 'geral';

    if (!nome || !mensagem) {
        status.style.color = '#EF4444';
        status.textContent = 'Preencha tudo!';
        return;
    }
    status.style.color = 'var(--esmeralda-light)';
    status.textContent = 'Enviando...';

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/comentarios`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ nome, mensagem, artigo: artigoId, resposta_de: comentarioPaiId })
        });
        if (res.ok) {
            status.textContent = 'Resposta enviada!';
            setTimeout(() => {
                document.getElementById(`form-resposta-${comentarioPaiId}`).style.display = 'none';
                status.textContent = '';
            }, 1500);
            carregarComentarios();
        } else {
            status.style.color = '#EF4444';
            status.textContent = 'Erro ao enviar :(';
        }
    } catch (e) {
        status.style.color = '#EF4444';
        status.textContent = 'Erro de conexão :(';
    }
};

// ─────────────────────────────────────────
//  INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Carrega comentários se a página tiver a seção
    if (document.getElementById('lista-comentarios')) {
        carregarComentarios();
    }

    // ── CALCULADORAS (index.html) ──────────────

    // Troca de aba
    window.switchCalc = function(id) {
        document.querySelectorAll('.calc-tab').forEach((t, i) => {
            const ids = ['reserva', 'juros', 'milhao'];
            t.classList.toggle('active', ids[i] === id);
        });
        document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('calc-' + id)?.classList.add('active');
    };

    // Calculadora: Reserva de Emergência
    window.calcReserva = function() {
        const modelo        = document.getElementById('res-modelo')?.value;
        const custoFixo     = Number(document.getElementById('res-custo')?.value);
        const poupancaMensal = Number(document.getElementById('res-poupanca')?.value);

        if (!custoFixo || custoFixo <= 0) { alert('Por favor, insira valores reais para custo fixo.'); return; }
        if (!poupancaMensal || poupancaMensal <= 0) { alert('Por favor, insira valores reais para poupança mensal.'); return; }

        let mesesCobertura = 6;
        if (modelo === 'servidor') mesesCobertura = 3;
        if (modelo === 'autonomo') mesesCobertura = 12;

        const metaReserva = custoFixo * mesesCobertura;
        const mesesParaAlcancar = Math.ceil(metaReserva / poupancaMensal);
        const anos  = Math.floor(mesesParaAlcancar / 12);
        const meses = mesesParaAlcancar % 12;
        let tempoTexto = (anos > 0 ? anos + ' ano(s) ' : '') + (meses > 0 ? meses + ' mês(es)' : '');
        if (!tempoTexto) tempoTexto = '0 meses';

        document.getElementById('res-meta').innerText   = formatarMoeda(metaReserva);
        document.getElementById('res-tempo').innerText  = tempoTexto;
        document.getElementById('res-meses').innerText  = `${mesesCobertura} meses`;
        document.getElementById('res-result').style.display = 'block';
    };

    // Calculadora: Juros Compostos
    window.calcJuros = function() {
        const inicial   = Number(document.getElementById('jc-inicial')?.value);
        const mensal    = Number(document.getElementById('jc-mensal')?.value);
        const taxaAnual = Number(document.getElementById('jc-taxa')?.value) / 100;
        const anos      = Number(document.getElementById('jc-anos')?.value);

        if (!taxaAnual || taxaAnual <= 0 || !anos || anos <= 0) {
            alert('Por favor, preencha a taxa anual e o período em anos.'); return;
        }

        const taxaMensal  = Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1;
        const totalMeses  = anos * 12;
        let montanteFinal = inicial * Math.pow(1 + taxaMensal, totalMeses);
        for (let m = 1; m <= totalMeses; m++) {
            montanteFinal += mensal * Math.pow(1 + taxaMensal, totalMeses - m);
        }
        const totalInvestido = inicial + mensal * totalMeses;
        const jurosGanhos    = Math.max(0, montanteFinal - totalInvestido);

        document.getElementById('jc-total').innerText     = formatarMoeda(montanteFinal);
        document.getElementById('jc-investido').innerText = formatarMoeda(totalInvestido);
        document.getElementById('jc-juros').innerText     = formatarMoeda(jurosGanhos);
        document.getElementById('jc-result').style.display = 'block';
    };

    // Calculadora: Primeiro Milhão
    window.calcMilhao = function() {
        const aporte   = Number(document.getElementById('pm-aporte')?.value);
        const taxaAnual = Number(document.getElementById('pm-taxa')?.value);
        const meta     = 1_000_000;

        if (!aporte || aporte <= 0 || !taxaAnual || taxaAnual <= 0) {
            alert('Por favor, preencha o aporte mensal e a taxa anual.'); return;
        }
        if (aporte * 12 < 1000 && taxaAnual < 2) {
            alert('Com esse valor de aporte a meta levará séculos. Tente um valor maior.'); return;
        }

        const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1;
        let saldo = 0, meses = 0;
        while (saldo < meta && meses < 1000) { saldo += aporte; saldo += saldo * taxaMensal; meses++; }

        const anosTotal    = (meses / 12).toFixed(1);
        const totalAportado = aporte * meses;
        const jurosGanhos  = meta - totalAportado;

        document.getElementById('pm-anos').innerText  = `${anosTotal} anos`;
        document.getElementById('pm-total').innerText = formatarMoeda(totalAportado);
        document.getElementById('pm-juros').innerText = formatarMoeda(jurosGanhos);
        document.getElementById('pm-result').style.display = 'block';
    };

    // Efeito Fade on Scroll
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

});