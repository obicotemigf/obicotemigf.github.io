const elementosAno = document.querySelectorAll('.anoAtual');
  const anoAtual = new Date().getFullYear();
  elementosAno.forEach(elemento => {
    elemento.textContent = anoAtual;
  });