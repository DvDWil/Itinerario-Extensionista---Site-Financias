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
    window.fmt = function(n) {
        return 'R$ ' + n.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    };

    // Efeito de Fade on Scroll
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { 
            if (e.isIntersecting) e.target.classList.add('visible'); 
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

});