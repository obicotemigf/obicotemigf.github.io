const CURRENT_YEAR = new Date().getFullYear();
const PROGRAMMING_LABEL = 'Modalidade Programação: ';
const PHASE_LABELS = ['Prova da Fase 1', 'Prova da Fase 2', 'Prova da Fase 3'];
const OBI_API_URL = 'https://felipevandevelde.github.io/api_obi/request.json';

function preencherAnoAtual() {
  const elementosAno = document.querySelectorAll('.anoAtual');

  elementosAno.forEach((elemento) => {
    elemento.textContent = CURRENT_YEAR;
  });
}

async function verificarLogoOBI() {
  try {
    const response = await fetch(`./sources/logo-obi${CURRENT_YEAR}.svg`, {
      method: 'HEAD',
      cache: 'no-store',
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

function preencherLogoOBI() {
  const elemento = document.getElementById('obi_logo');
  elemento.src = `./sources/logo-obi${CURRENT_YEAR}.svg`;
}

function exibirLogoOBI() {
  const elemento = document.getElementById('obi_link');
  elemento.style = "obi_link";
}

function formatarDatas(calendar, fase) {
  const datas = calendar[fase];

  if (!datas || datas.length === 0) {
    return 'Não divulgada';
  }

  return datas.join(', ');
}

async function carregarDados() {
  try {
    const response = await fetch(OBI_API_URL, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.ano !== CURRENT_YEAR) {
      return;
    }

    const eventosProgramacao = (data.eventos || []).filter((evento) =>
      evento.descricao && evento.descricao.includes(PROGRAMMING_LABEL),
    );

    const calendar = {
      'Prova da Fase 1': [],
      'Prova da Fase 2': [],
      'Prova da Fase 3': [],
    };

    eventosProgramacao.forEach((evento) => {
      const descricaoLimpa = evento.descricao
        .replace(PROGRAMMING_LABEL, '')
        .trim();

      if (Object.prototype.hasOwnProperty.call(calendar, descricaoLimpa)) {
        calendar[descricaoLimpa].push(`${evento.dia}/${evento.mes}`);
      }
    });

    PHASE_LABELS.forEach((fase) => {
      const elementoFase = document.getElementById(fase);

      if (!elementoFase) {
        return;
      }

      elementoFase.textContent = formatarDatas(calendar, fase);
    });
  } catch (error) {
    console.error('Erro ao buscar dados da OBI:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  preencherAnoAtual();
  carregarDados();

  const logoExiste = await verificarLogoOBI();
  console.log(logoExiste);

  if (logoExiste) {
    exibirLogoOBI()
    preencherLogoOBI();
  }
});