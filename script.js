// ========================
// MEUS DADOS (localStorage)
// ========================

function salvarMeusDados() {
  const dados = {
    nome: document.getElementById("meuNome").value.trim(),
    whatsapp: document.getElementById("meuWhatsapp").value.trim(),
    email: document.getElementById("meuEmail").value.trim(),
    site: document.getElementById("meuSite").value.trim(),
  };
  localStorage.setItem("victory_meus_dados", JSON.stringify(dados));
  const msg = document.getElementById("dadosSalvosMsg");
  msg.textContent = "Dados salvos!";
  msg.classList.add("show");
  setTimeout(() => msg.classList.remove("show"), 2500);
}

function carregarMeusDados() {
  const raw = localStorage.getItem("victory_meus_dados");
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    if (d.nome) document.getElementById("meuNome").value = d.nome;
    if (d.whatsapp) document.getElementById("meuWhatsapp").value = d.whatsapp;
    if (d.email) document.getElementById("meuEmail").value = d.email;
    if (d.site) document.getElementById("meuSite").value = d.site;
  } catch (e) {}
}

function getMeusDados() {
  return {
    nome: document.getElementById("meuNome").value.trim() || "victory_dev",
    whatsapp: document.getElementById("meuWhatsapp").value.trim() || "",
    email: document.getElementById("meuEmail").value.trim() || "",
    site:
      document.getElementById("meuSite").value.trim() ||
      "victory-dev.vercel.app",
  };
}

const LABELS_PROJETO = {
  350: "Landing Page simples",
  650: "Site institucional (até 5 páginas)",
  1100: "Site institucional (até 10 páginas)",
  1400: "E-commerce básico",
  2500: "E-commerce completo",
  900: "Sistema web / painel admin",
  2000: "App web completo",
};

const PRAZO_LABELS = {
  1: "Entrega normal: 15 a 30 dias úteis",
  1.3: "Entrega urgente: 7 a 14 dias úteis",
  1.6: "Entrega super urgente: até 7 dias úteis",
};

function formatBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcular() {
  const projetoEl = document.getElementById("tipoProjeto");
  const prazoEl = document.getElementById("prazo");
  const descEl = document.getElementById("desconto");

  const baseVal = parseFloat(projetoEl.value) || 0;
  const prazoMult = parseFloat(prazoEl.value) || 1;
  const descPct = Math.min(Math.max(parseFloat(descEl.value) || 0, 0), 50);

  const checkboxes = document.querySelectorAll(
    '.check-item input[type="checkbox"]:checked',
  );
  let extrasVal = 0;
  checkboxes.forEach((cb) => (extrasVal += parseFloat(cb.value)));

  const subtotal = (baseVal + extrasVal) * prazoMult;
  const desconto = subtotal * (descPct / 100);
  const total = subtotal - desconto;
  const urgenciaAdd = (baseVal + extrasVal) * (prazoMult - 1);

  // Linha base
  const rowBase = document.getElementById("rowBase");
  const valBase = document.getElementById("valBase");
  if (baseVal > 0) {
    rowBase.style.display = "flex";
    valBase.textContent = formatBRL(baseVal);
  } else {
    rowBase.style.display = "none";
  }

  // Extras
  const listaExtras = document.getElementById("listaExtras");
  listaExtras.innerHTML = "";
  checkboxes.forEach((cb) => {
    const row = document.createElement("div");
    row.className = "resumo-row";
    row.innerHTML = `<span>${cb.closest("label").textContent.trim()}</span><span>${formatBRL(parseFloat(cb.value))}</span>`;
    listaExtras.appendChild(row);
  });

  // Urgência
  const rowUrgencia = document.getElementById("rowUrgencia");
  const valUrgencia = document.getElementById("valUrgencia");
  if (prazoMult > 1 && baseVal + extrasVal > 0) {
    rowUrgencia.style.display = "flex";
    valUrgencia.textContent = "+" + formatBRL(urgenciaAdd);
  } else {
    rowUrgencia.style.display = "none";
  }

  // Desconto
  const rowDesconto = document.getElementById("rowDesconto");
  const valDesconto = document.getElementById("valDesconto");
  const labelDesconto = document.getElementById("labelDesconto");
  if (descPct > 0 && total > 0) {
    rowDesconto.style.display = "flex";
    labelDesconto.textContent = `Desconto (${descPct}%)`;
    valDesconto.textContent = "-" + formatBRL(desconto);
  } else {
    rowDesconto.style.display = "none";
  }

  // Total
  document.getElementById("totalFinal").textContent = formatBRL(total);

  // Parcelamento
  const parcEl = document.getElementById("parcelamento");
  const parcNum = document.getElementById("parcelas");
  const parcVal = document.getElementById("valParcela");
  if (total >= 300) {
    parcEl.style.display = "block";
    const numParcelas = total >= 1500 ? 6 : total >= 800 ? 3 : 2;
    parcNum.textContent = numParcelas + "x";
    parcVal.textContent = formatBRL(total / numParcelas);
  } else {
    parcEl.style.display = "none";
  }

  // Prazo
  const prazoBox = document.getElementById("prazoBox");
  const prazoLabel = document.getElementById("prazoLabel");
  prazoBox.style.display = "block";
  prazoLabel.textContent = PRAZO_LABELS[prazoEl.value] || "";
}

function resetar() {
  document.getElementById("nomeCliente").value = "";
  document.getElementById("tipoNegocio").value = "";
  document.getElementById("tipoProjeto").value = "0";
  document.getElementById("prazo").value = "1";
  document.getElementById("desconto").value = "0";
  document.getElementById("obs").value = "";
  document
    .querySelectorAll('.check-item input[type="checkbox"]')
    .forEach((cb) => (cb.checked = false));
  calcular();
  showToast("Formulário limpo!");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

function gerarPDF() {
  const nome =
    document.getElementById("nomeCliente").value.trim() ||
    "Cliente não informado";
  const negocio =
    document.getElementById("tipoNegocio").value || "Não informado";
  const projetoEl = document.getElementById("tipoProjeto");
  const prazoEl = document.getElementById("prazo");
  const descEl = document.getElementById("desconto");
  const obs = document.getElementById("obs").value.trim();

  const baseVal = parseFloat(projetoEl.value) || 0;
  const prazoMult = parseFloat(prazoEl.value) || 1;
  const descPct = Math.min(Math.max(parseFloat(descEl.value) || 0, 0), 50);
  const labelProj = LABELS_PROJETO[projetoEl.value] || "Não selecionado";

  if (baseVal === 0) {
    showToast("Selecione o tipo de projeto primeiro.");
    return;
  }

  const checkboxes = document.querySelectorAll(
    '.check-item input[type="checkbox"]:checked',
  );
  let extrasVal = 0;
  let extrasHTML = "";
  checkboxes.forEach((cb) => {
    const v = parseFloat(cb.value);
    extrasVal += v;
    extrasHTML += `<tr><td>${cb.closest("label").textContent.trim()}</td><td style="text-align:right">${formatBRL(v)}</td></tr>`;
  });

  const subtotal = (baseVal + extrasVal) * prazoMult;
  const desconto = subtotal * (descPct / 100);
  const total = subtotal - desconto;
  const urgAdd = (baseVal + extrasVal) * (prazoMult - 1);
  const numParcelas = total >= 1500 ? 6 : total >= 800 ? 3 : 2;
  const hoje = new Date().toLocaleDateString("pt-BR");
  const validade = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("pt-BR");

  const eu = getMeusDados();
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8"/>
    <title>Orçamento - ${nome}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; color: #111; background: #fff; padding: 40px; font-size: 14px; }
      .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; border-bottom: 3px solid #052288; padding-bottom: 16px; }
      .brand { font-size: 24px; font-weight: 900; color: #052288; letter-spacing: -1px; }
      .brand span { color: #0453cc; }
      .meta { text-align: right; font-size: 12px; color: #555; line-height: 1.6; }
      h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #0453cc; margin: 24px 0 10px; }
      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; margin-bottom: 8px; }
      .info-item label { font-size: 11px; color: #888; display: block; }
      .info-item span { font-size: 14px; color: #111; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th { background: #052288; color: #fff; padding: 8px 12px; text-align: left; font-size: 12px; }
      th:last-child { text-align: right; }
      td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
      td:last-child { text-align: right; }
      .tr-urgencia td { color: #d97706; }
      .tr-desconto td { color: #16a34a; }
      .tr-total td { font-weight: 700; font-size: 16px; border-top: 2px solid #052288; border-bottom: none; color: #052288; }
      .parcelamento { text-align: right; font-size: 12px; color: #888; margin-top: 6px; }
      .obs-box { background: #f5f6f8; border-left: 4px solid #0453cc; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #444; margin-top: 8px; }
      .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 11px; color: #aaa; display: flex; justify-content: space-between; }
      .validade { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 8px 14px; font-size: 12px; color: #92400e; margin-top: 16px; display: inline-block; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand">${eu.nome}</div>
        <div style="font-size:12px; color:#888; margin-top:4px">${eu.site}</div>
        ${eu.whatsapp ? `<div style="font-size:12px; color:#888;">${eu.whatsapp}</div>` : ""}
        ${eu.email ? `<div style="font-size:12px; color:#888;">${eu.email}</div>` : ""}
      </div>
      <div class="meta">
        <div><strong>Orçamento #${String(Date.now()).slice(-5)}</strong></div>
        <div>Data: ${hoje}</div>
        <div>Válido até: ${validade}</div>
      </div>
    </div>

    <h2>Dados do cliente</h2>
    <div class="info-grid">
      <div class="info-item"><label>Nome / Empresa</label><span>${nome}</span></div>
      <div class="info-item"><label>Tipo de negócio</label><span>${negocio}</span></div>
    </div>

    <h2>Detalhamento do projeto</h2>
    <table>
      <thead><tr><th>Item</th><th>Valor</th></tr></thead>
      <tbody>
        <tr><td>${labelProj}</td><td>${formatBRL(baseVal)}</td></tr>
        ${extrasHTML}
        ${prazoMult > 1 ? `<tr class="tr-urgencia"><td>Adicional de urgência (${PRAZO_LABELS[prazoEl.value]})</td><td>+${formatBRL(urgAdd)}</td></tr>` : ""}
        ${descPct > 0 ? `<tr class="tr-desconto"><td>Desconto (${descPct}%)</td><td>-${formatBRL(desconto)}</td></tr>` : ""}
        <tr class="tr-total"><td>Total</td><td>${formatBRL(total)}</td></tr>
      </tbody>
    </table>
    ${total >= 300 ? `<div class="parcelamento">ou em até ${numParcelas}x de ${formatBRL(total / numParcelas)}</div>` : ""}

    ${obs ? `<h2>Observações</h2><div class="obs-box">${obs}</div>` : ""}

    <div class="validade">⏳ Este orçamento é válido até ${validade}</div>

    <div class="footer">
      <span>${eu.nome} &mdash; Desenvolvimento Web &amp; Automações</span>
      <span>Documento gerado automaticamente</span>
    </div>

    <script>window.onload = () => { window.print(); }<\/script>
  </body>
  </html>`;

  const win = window.open("", "_blank");
  if (!win) {
    showToast("Permita popups para gerar o PDF.");
    return;
  }
  win.document.write(htmlContent);
  win.document.close();
  showToast("PDF gerado com sucesso!");
}

// ========================
// WHATSAPP
// ========================

function enviarWhatsApp() {
  const nome = document.getElementById("nomeCliente").value.trim() || "cliente";
  const projetoEl = document.getElementById("tipoProjeto");
  const prazoEl = document.getElementById("prazo");
  const descEl = document.getElementById("desconto");
  const eu = getMeusDados();

  const baseVal = parseFloat(projetoEl.value) || 0;
  if (baseVal === 0) {
    showToast("Selecione o tipo de projeto primeiro.");
    return;
  }

  const prazoMult = parseFloat(prazoEl.value) || 1;
  const descPct = Math.min(Math.max(parseFloat(descEl.value) || 0, 0), 50);
  const labelProj = LABELS_PROJETO[projetoEl.value] || "";

  const checkboxes = document.querySelectorAll(
    '.check-item input[type="checkbox"]:checked',
  );
  let extrasVal = 0;
  let extrasTexto = "";
  checkboxes.forEach((cb) => {
    extrasVal += parseFloat(cb.value);
    extrasTexto += `\n  • ${cb.closest("label").textContent.trim()}: ${formatBRL(parseFloat(cb.value))}`;
  });

  const subtotal = (baseVal + extrasVal) * prazoMult;
  const desconto = subtotal * (descPct / 100);
  const total = subtotal - desconto;
  const numParcelas = total >= 1500 ? 6 : total >= 800 ? 3 : 2;
  const validade = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("pt-BR");

  const msg = `Olá, ${nome}! 👋

Segue o orçamento do seu projeto:

📋 *${labelProj}*${extrasTexto ? `\nExtras:${extrasTexto}` : ""}
${descPct > 0 ? `\n🎁 Desconto de ${descPct}%` : ""}
${prazoMult > 1 ? `\n⚡ Prazo: ${PRAZO_LABELS[prazoEl.value]}` : ""}

💰 *Total: ${formatBRL(total)}*
${total >= 300 ? `(ou ${numParcelas}x de ${formatBRL(total / numParcelas)})` : ""}

📅 Proposta válida até ${validade}

Qualquer dúvida, estou à disposição! 🚀
— ${eu.nome}`;

  const numero = eu.whatsapp.replace(/\D/g, "");
  const url = `https://wa.me/5581991482982?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
}

// ========================
// HISTÓRICO (localStorage)
// ========================

function getHistorico() {
  try {
    return JSON.parse(localStorage.getItem("victory_historico") || "[]");
  } catch (e) {
    return [];
  }
}

function salvarNoHistorico() {
  const nome = document.getElementById("nomeCliente").value.trim();
  const negocio = document.getElementById("tipoNegocio").value;
  const projetoEl = document.getElementById("tipoProjeto");
  const prazoEl = document.getElementById("prazo");
  const descEl = document.getElementById("desconto");
  const obs = document.getElementById("obs").value.trim();

  const baseVal = parseFloat(projetoEl.value) || 0;
  if (baseVal === 0 || !nome) {
    showToast("Preencha o cliente e o tipo de projeto antes de salvar.");
    return;
  }

  const prazoMult = parseFloat(prazoEl.value) || 1;
  const descPct = Math.min(Math.max(parseFloat(descEl.value) || 0, 0), 50);

  const checkboxes = document.querySelectorAll(
    '.check-item input[type="checkbox"]:checked',
  );
  let extrasVal = 0;
  const extrasSelecionados = [];
  checkboxes.forEach((cb) => {
    extrasVal += parseFloat(cb.value);
    extrasSelecionados.push({
      label: cb.closest("label").textContent.trim(),
      valor: parseFloat(cb.value),
    });
  });

  const subtotal = (baseVal + extrasVal) * prazoMult;
  const desconto = subtotal * (descPct / 100);
  const total = subtotal - desconto;

  const registro = {
    id: Date.now(),
    data: new Date().toLocaleDateString("pt-BR"),
    nome,
    negocio,
    projeto: projetoEl.value,
    labelProj: LABELS_PROJETO[projetoEl.value] || "",
    prazo: prazoEl.value,
    descPct,
    extras: extrasSelecionados,
    total,
    obs,
  };

  const hist = getHistorico();
  hist.unshift(registro);
  if (hist.length > 30) hist.pop();
  localStorage.setItem("victory_historico", JSON.stringify(hist));

  renderHistorico();
  showToast("Salvo no histórico!");
}

function renderHistorico() {
  const hist = getHistorico();
  const section = document.getElementById("historicoSection");
  const lista = document.getElementById("historicoLista");

  if (hist.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  lista.innerHTML = "";

  hist.forEach((r) => {
    const card = document.createElement("div");
    card.className = "hist-card";
    card.innerHTML = `
      <div class="hist-card-nome">${r.nome}</div>
      <div class="hist-card-proj">${r.labelProj}${r.negocio ? " · " + r.negocio : ""}</div>
      <div class="hist-card-total">${formatBRL(r.total)}</div>
      <div class="hist-card-data">Salvo em ${r.data}</div>
      <div class="hist-card-actions">
        <button class="hist-btn carregar" onclick="carregarOrcamento(${r.id})">Carregar</button>
        <button class="hist-btn excluir" onclick="excluirOrcamento(${r.id})">Excluir</button>
      </div>`;
    lista.appendChild(card);
  });
}

function carregarOrcamento(id) {
  const r = getHistorico().find((x) => x.id === id);
  if (!r) return;

  document.getElementById("nomeCliente").value = r.nome;
  document.getElementById("tipoNegocio").value = r.negocio;
  document.getElementById("tipoProjeto").value = r.projeto;
  document.getElementById("prazo").value = r.prazo;
  document.getElementById("desconto").value = r.descPct;
  document.getElementById("obs").value = r.obs || "";

  document
    .querySelectorAll('.check-item input[type="checkbox"]')
    .forEach((cb) => {
      const label = cb.closest("label").textContent.trim();
      cb.checked = r.extras.some((e) => e.label === label);
    });

  calcular();
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Orçamento carregado!");
}

function excluirOrcamento(id) {
  const hist = getHistorico().filter((x) => x.id !== id);
  localStorage.setItem("victory_historico", JSON.stringify(hist));
  renderHistorico();
  showToast("Removido do histórico.");
}

function limparHistorico() {
  if (!confirm("Tem certeza que quer apagar todo o histórico?")) return;
  localStorage.removeItem("victory_historico");
  renderHistorico();
  showToast("Histórico apagado.");
}

// Inicializa
carregarMeusDados();
calcular();
renderHistorico();
