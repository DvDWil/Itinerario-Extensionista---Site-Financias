document.addEventListener('DOMContentLoaded', () => {
    // Função de trocar de calculadora 
    window.switchCalc = function(id) {
        document.querySelectorAll('.calc-tab').forEach((t, i) => {
            const ids = ['reserva', 'juros', 'milhao'];
            t.classList.toggle('active', ids[i] === id);
        });
        document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('calc-' + id).classList.add('active');
    };

    // Função de formatar moeda
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // 2. CALCULADORA: RESERVA DE EMERGÊNCIA
    window.calcReserva = function() {
        const modelo = document.getElementById('res-modelo').value;
        const custoFixo = Number(document.getElementById('res-custo').value);
        const poupancaMensal = Number(document.getElementById('res-poupanca').value);

        if (!custoFixo || custoFixo <= 0) {
            alert('Por favor, insira valores reais para custo fixo.');
            return;
        }

        if (!poupancaMensal || poupancaMensal <= 0) {
            alert('Por favor, insira valores reais para poupança mensal.');
            return;
        }

        let mesesCobertura = 6;
        if (modelo === 'servidor') mesesCobertura = 3;
        if (modelo === 'autonomo') mesesCobertura = 12;

        const metaReserva = custoFixo * mesesCobertura;
        let tempoTexto = "0 meses";

        if (poupancaMensal > 0) {
            const mesesParaAlcancar = Math.ceil(metaReserva / poupancaMensal);
            const anos = Math.floor(mesesParaAlcancar / 12);
            const meses = mesesParaAlcancar % 12;

            tempoTexto = (anos > 0 ? anos + " ano(s) " : "") + (meses > 0 ? meses + " mês(es)" : "");
            if (tempoTexto === "") tempoTexto = "0 meses";

        } else {
            tempoTexto = "Defina um aporte";
        }

        document.getElementById('res-meta').innerText = formatarMoeda(metaReserva);
        document.getElementById('res-tempo').innerText = tempoTexto;
        document.getElementById('res-meses').innerText = `${mesesCobertura} meses`;

        document.getElementById('res-result').style.display = 'block';
    }

    // 3. CALCULADORA: JUROS COMPOSTOS
    window.calcJuros = function() {
        const inicial = Number(document.getElementById('jc-inicial').value);
        const mensal = Number(document.getElementById('jc-mensal').value);
        const taxaAnual = Number(document.getElementById('jc-taxa').value) / 100;
        const anos = Number(document.getElementById('jc-anos').value);

        if (!taxaAnual || taxaAnual <= 0 || !anos || anos <= 0) {
            alert("Por favor, preencha a taxa anual e o período em anos.");
            return;
        }

        const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1;
        const totalMeses = anos * 12;

        let montanteFinal = inicial * Math.pow(1 + taxaMensal, totalMeses);

        for (let m = 1; m <= totalMeses; m++) {
            montanteFinal += mensal * Math.pow(1 + taxaMensal, totalMeses - m);
        }

        const totalInvestido = inicial + (mensal * totalMeses);
        const jurosGanhos = Math.max(0, montanteFinal - totalInvestido);

        document.getElementById('jc-total').innerText = formatarMoeda(montanteFinal);
        document.getElementById('jc-investido').innerText = formatarMoeda(totalInvestido);
        document.getElementById('jc-juros').innerText = formatarMoeda(jurosGanhos);

        document.getElementById('jc-result').style.display = 'block';

    };

    // 4. CALCULADORA PRIMEIRO MILHÃO
    window.calcMilhao = function() {
        const aporte = Number(document.getElementById('pm-aporte').value);
        const taxaAnual = Number(document.getElementById('pm-taxa').value);
        const meta = 1000000;

        if (!aporte || aporte <= 0 || !taxaAnual || taxaAnual <= 0) {
            alert("Por favor, preencha o aporte mensal e a taxa anual.");
            return;
        }

        const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1;
        
        if (aporte * 12 < 1000 && taxaAnual < 2) {
            alert("Com esse valor de aporte a meta levará séculos. Tente um valor maior.");
            return;
        }

        let saldo = 0;
        let meses = 0;

        while (saldo < meta && meses < 1000){
                saldo += aporte;
                saldo += saldo * taxaMensal;
                meses++;
        }

        const anosTotal = (meses / 12).toFixed(1);
        const totalAportado = aporte * meses;
        const jurosGanhos = meta - totalAportado;

        document.getElementById('pm-anos').innerText = `${anosTotal} anos`;
        document.getElementById('pm-total').innerText = formatarMoeda(totalAportado);
        document.getElementById('pm-juros').innerText = formatarMoeda(jurosGanhos);

        document.getElementById('pm-result').style.display = 'block';
    };

    // Efeito de Fade on Scroll
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { 
            if (e.isIntersecting) e.target.classList.add('visible'); 
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

});
