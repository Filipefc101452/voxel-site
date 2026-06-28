# 📚 Guia de Customização - Voxel System

## 🎯 Alterações Rápidas

### 1️⃣ Trocar o Nome da Empresa

**Arquivo:** `index.html`

```html
<!-- Navbar -->
<div class="navbar-brand">
    <h1><i class="fas fa-cube"></i> SEU_NOME_AQUI</h1>
</div>

<!-- Footer -->
<div class="footer-section">
    <h3>SEU_NOME_AQUI</h3>
    <p>Sua descrição aqui</p>
</div>
```

**Arquivo:** `config.json`
```json
{
  "project": {
    "name": "SEU_NOME_AQUI"
  }
}
```

---

### 2️⃣ Alterar Email e Telefone

**Arquivo:** `index.html` (Seção Contato)

```html
<div class="info-item">
    <i class="fas fa-phone"></i>
    <div>
        <h3>Telefone</h3>
        <p>+55 (XX) XXXXX-XXXX</p>
    </div>
</div>
```

**Arquivo:** `config.json`
```json
{
  "contact": {
    "email": "seu_email@empresa.com",
    "phone": "+55 (XX) XXXXX-XXXX"
  }
}
```

---

### 3️⃣ Mudar as Cores da Marca

**Arquivo:** `styles.css` (Linhas 1-9)

```css
:root {
    --primary-color: #NOVA_COR1;      /* Cor principal */
    --secondary-color: #NOVA_COR2;    /* Cor secundária */
    --dark-color: #NOVA_COR3;         /* Cor escura */
    --light-color: #NOVA_COR4;        /* Cor clara */
    --text-color: #NOVA_COR5;         /* Cor do texto */
}
```

**Gerador de cores:** [Coolors.co](https://coolors.co)

---

### 4️⃣ Editar Serviços

**Arquivo:** `index.html` (Seção Services)

```html
<div class="service-card">
    <i class="fas fa-NOVO_ICONE"></i>
    <h3>Novo Serviço</h3>
    <p>Descrição do novo serviço...</p>
</div>
```

**Ícones disponíveis:** [Font Awesome](https://fontawesome.com/icons)

---

### 5️⃣ Atualizar Portfólio

**Arquivo:** `index.html` (Seção Portfolio)

```html
<div class="portfolio-item">
    <div class="portfolio-image">
        <i class="fas fa-NOVO_ICONE"></i>
    </div>
    <h3>Nome do Projeto</h3>
    <p>Descrição do projeto</p>
</div>
```

---

### 6️⃣ Mudar Textos da Hero Section

**Arquivo:** `index.html` (Seção Hero)

```html
<h2>Seu Novo Título Principal</h2>
<p>Sua nova descrição...</p>
```

---

### 7️⃣ Atualizar Tecnologias

**Arquivo:** `index.html` (Seção Tech Stack)

```html
<div class="tech-item">
    <i class="fab fa-NOVO_LOGO"></i>
    <p>Nome da Tecnologia</p>
</div>
```

---

### 8️⃣ Editar Redes Sociais

**Arquivo:** `index.html` (Footer)

```html
<div class="social-links">
    <a href="https://facebook.com/seu_perfil"><i class="fab fa-facebook"></i></a>
    <a href="https://twitter.com/seu_perfil"><i class="fab fa-twitter"></i></a>
    <a href="https://linkedin.com/seu_perfil"><i class="fab fa-linkedin"></i></a>
    <a href="https://instagram.com/seu_perfil"><i class="fab fa-instagram"></i></a>
</div>
```

**Arquivo:** `config.json`
```json
{
  "social": {
    "facebook": "https://facebook.com/seu_usuario",
    "twitter": "https://twitter.com/seu_usuario",
    "linkedin": "https://linkedin.com/company/seu_empresa",
    "instagram": "https://instagram.com/seu_usuario"
  }
}
```

---

## 🔧 Modificações Avançadas

### Adicionar Nova Seção

1. **HTML** - Adicione após uma seção existente:
```html
<section id="secao-nova" class="secao-nova">
    <div class="container">
        <h2>Título da Seção</h2>
        <!-- Conteúdo -->
    </div>
</section>
```

2. **CSS** - Adicione estilos em `styles.css`:
```css
.secao-nova {
    padding: 100px 0;
    background-color: var(--light-color);
}
```

3. **Navbar** - Adicione link em `index.html`:
```html
<li><a href="#secao-nova" class="nav-link">Nova Seção</a></li>
```

---

### Integrar Formulário com Backend

**Opção 1: Formspree (Recomendado)**

1. Visite [Formspree.io](https://formspree.io)
2. Criar novo form
3. Mude o form action em `index.html`:

```html
<form action="https://formspree.io/f/SEU_ID" method="POST" id="contactForm">
    <!-- campos do formulário -->
</form>
```

**Opção 2: EmailJS (Client-side)**

1. Cadastre em [EmailJS.com](https://www.emailjs.com)
2. Adicione script no `index.html` antes de `</body>`:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
<script>
emailjs.init("SEU_PUBLIC_KEY");
</script>
```

---

### Adicionar Google Analytics

**Arquivo:** `index.html` (após `<head>`)

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXX');
</script>
```

---

## 🎨 Referência de Classes CSS

### Componentes
- `.navbar` - Navegação
- `.hero` - Seção principal
- `.service-card` - Card de serviço
- `.portfolio-item` - Item do portfólio
- `.btn` - Botão
- `.container` - Container responsivo

### Estados
- `.active` - Elemento ativo
- `.show` - Elemento visível
- `:hover` - Hover state

---

## 📱 Dicas de Responsividade

**Breakpoints Principais:**
- Desktop: 1200px+
- Tablet: 768px - 1200px
- Mobile: < 768px

**Para testar:** Abra DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)

---

## 🐛 Troubleshooting

### Menu não fecha no mobile
```javascript
// Adicione em script.js se necessário
navMenu.classList.remove('active');
```

### Cores não mudam
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Verifique se as variáveis CSS estão corretas

### Animações lentas
- Reduza o `transition` em `styles.css`
- Desabilite animações em mobile se necessário

---

## 📚 Recursos Úteis

- **Ícones:** [Font Awesome](https://fontawesome.com)
- **Cores:** [Coolors.co](https://coolors.co)
- **Fontes:** [Google Fonts](https://fonts.google.com)
- **Gradientes:** [Gradient Generator](https://cssgradient.io)
- **Animações:** [Animate.css](https://animate.style)

---

## ✅ Checklist de Lançamento

- [ ] Trocar nome da empresa
- [ ] Atualizar cores da marca
- [ ] Editar email/telefone
- [ ] Adicionar informações reais
- [ ] Atualizar portfólio
- [ ] Conectar formulário a backend
- [ ] Adicionar Google Analytics
- [ ] Testar responsividade
- [ ] Testar em múltiplos navegadores
- [ ] Deploy em hosting

---

**Última atualização:** 2024