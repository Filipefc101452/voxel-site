const demoCredentials = {
    username: 'voxel',
    password: '101452'
};

const avatarColors = ['6366f1', 'ec4899', '10b981', 'f59e0b', '14b8a6', '8b5cf6', 'ef4444', 'f97316'];

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getAvatarUrl(name) {
    const color = getAvatarColor(name || 'Usuário');
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&rounded=true`;
}

const dbState = {
    user: {
        name: 'Administrador Voxel',
        role: 'Administrador'
    },
    projects: [
        {
            name: 'Portal Interno',
            client: 'Cliente A',
            status: 'Em Progresso',
            progress: 65,
            start: '2024-04-10',
            end: '2024-09-12',
            description: 'Sistema para comunicação interna e automação de processos.'
        },
        {
            name: 'E-commerce B2B',
            client: 'Empresa Beta',
            status: 'Planejamento',
            progress: 20,
            start: '2024-06-12',
            end: '2024-12-20',
            description: 'Loja virtual com gestão de catálogo e pagamentos integrados.'
        },
        {
            name: 'App Mobile',
            client: 'Startup C',
            status: 'Concluído',
            progress: 100,
            start: '2023-11-05',
            end: '2024-03-30',
            description: 'Aplicativo multiplataforma para agendamento de serviços.'
        }
    ],
    users: [
        {
            name: 'Mariana Silva',
            email: 'mariana@voxel.com',
            role: 'Gestora',
            department: 'Gestão',
            avatar: getAvatarUrl('Mariana Silva')
        },
        {
            name: 'Lucas Andrade',
            email: 'lucas@voxel.com',
            role: 'Desenvolvedor',
            department: 'Desenvolvimento',
            avatar: getAvatarUrl('Lucas Andrade')
        },
        {
            name: 'Amanda Costa',
            email: 'amanda@voxel.com',
            role: 'Designer',
            department: 'Design',
            avatar: getAvatarUrl('Amanda Costa')
        }
    ],
    tasks: [
        {
            title: 'Revisar escopo do portal',
            project: 'Portal Interno',
            description: 'Verificar requisitos e priorizar fases iniciais.',
            priority: 'Alta',
            responsible: 'Mariana Silva',
            status: 'Planejamento'
        },
        {
            title: 'Implementar checkout',
            project: 'E-commerce B2B',
            description: 'Conectar gateway de pagamento e testes de transação.',
            priority: 'Média',
            responsible: 'Lucas Andrade',
            status: 'Em Progresso'
        },
        {
            title: 'Ajustar interface móvel',
            project: 'App Mobile',
            description: 'Aprimorar fluxo de navegação e acessibilidade.',
            priority: 'Baixa',
            responsible: 'Amanda Costa',
            status: 'Concluído'
        }
    ],
    logs: [
        {
            date: '2026-06-27 09:12',
            user: 'Admin',
            action: 'Login',
            status: 'success',
            details: 'Acesso ao dashboard realizado com sucesso.'
        },
        {
            date: '2026-06-26 17:45',
            user: 'Lucas Andrade',
            action: 'Atualizou projeto',
            status: 'success',
            details: 'Status do projeto E-commerce B2B alterado para Em Progresso.'
        },
        {
            date: '2026-06-25 14:30',
            user: 'Mariana Silva',
            action: 'Criou usuário',
            status: 'success',
            details: 'Novo usuário cadastrado para equipe de marketing.'
        }
    ]
};

let activityChart = null;
let currentEditingUserIndex = null;
let currentModalAvatarDataUrl = null;

function triggerAvatarUpload() {
    const fileInput = document.getElementById('avatarInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleAvatarInputChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        currentModalAvatarDataUrl = reader.result;
        updateUsuarioAvatarPreview(currentModalAvatarDataUrl);
    };
    reader.readAsDataURL(file);
}

function resetUsuarioAvatar() {
    currentModalAvatarDataUrl = null;
    const modal = document.getElementById('usuarioModal');
    const nameInput = modal.querySelector('input[name="name"]');
    const name = nameInput ? nameInput.value.trim() : 'Usuário';
    updateUsuarioAvatarPreview(getAvatarUrl(name || 'Usuário'));
    const fileInput = document.getElementById('avatarInput');
    if (fileInput) {
        fileInput.value = '';
    }
}

function updateUsuarioAvatarPreview(src) {
    const preview = document.getElementById('usuarioAvatarPreview');
    if (preview) {
        preview.src = src;
    }
}

function getSavedDbState() {
    const saved = localStorage.getItem('voxelDashboardState');
    if (!saved) {
        return null;
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.warn('Falha ao carregar estado salvo do dashboard:', error);
        return null;
    }
}

function saveDbState() {
    localStorage.setItem('voxelDashboardState', JSON.stringify(dbState));
}

function isAuthenticated() {
    return localStorage.getItem('voxelLoggedIn') === 'true' || localStorage.getItem('voxelRemember') === 'true';
}

function initDashboard() {
    const savedState = getSavedDbState();
    if (savedState) {
        if (savedState.user) dbState.user = savedState.user;
        if (Array.isArray(savedState.projects)) dbState.projects = savedState.projects;
        if (Array.isArray(savedState.users)) dbState.users = savedState.users;
        if (Array.isArray(savedState.tasks)) dbState.tasks = savedState.tasks;
        if (Array.isArray(savedState.logs)) dbState.logs = savedState.logs;
    }

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const userSearchInput = document.getElementById('userSearch');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', renderUsers);
    }

    renderUserProfile();
    renderAllDashboard();
    setupSidebarClose();

    if (isAuthenticated()) {
        showDashboard();
    } else {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginModal').classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const remember = document.getElementById('remember').checked;

    if (username === demoCredentials.username && password === demoCredentials.password) {
        localStorage.setItem('voxelLoggedIn', 'true');
        if (remember) {
            localStorage.setItem('voxelRemember', 'true');
        }
        showNotification('Login realizado com sucesso!', 'success');
        showDashboard();
    } else {
        showNotification('Credenciais inválidas. Tente novamente.', 'error');
    }
}

function showDashboard() {
    localStorage.setItem('voxelLoggedIn', 'true');
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('dashboard').classList.remove('hidden');
    renderAllDashboard();
}

function logout() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('loginModal').classList.add('active');
    localStorage.removeItem('voxelRemember');
    localStorage.removeItem('voxelLoggedIn');
}

function setupSidebarClose() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-sidebar');
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function loadPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const target = document.getElementById(`page-${pageId}`);
    if (target) {
        target.classList.add('active');
    }
    if (pageId === 'overview') {
        updateOverview();
    }
}

function renderAllDashboard() {
    updateOverview();
    renderRecentProjects();
    renderProjectsTable();
    renderUsers();
    renderTasks();
    renderLogs();
    populateTaskOptions();
    renderActivityChart();
}

function renderUserProfile() {
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = dbState.user.name;
    }
}

function updateOverview() {
    const totalProjects = dbState.projects.length;
    const totalUsers = dbState.users.length;
    const totalTasks = dbState.tasks.filter(task => task.status !== 'Concluído').length;
    const completedPercent = Math.round((dbState.tasks.filter(task => task.status === 'Concluído').length / Math.max(dbState.tasks.length, 1)) * 100);
    const statusEmProgresso = dbState.projects.filter(project => project.status === 'Em Progresso').length;
    const statusConcluido = dbState.projects.filter(project => project.status === 'Concluído').length;
    const statusPlanejamento = dbState.projects.filter(project => project.status === 'Planejamento').length;
    const statusAtrasado = dbState.projects.filter(project => project.status === 'Atrasado').length;

    document.getElementById('totalProjetos').textContent = totalProjects;
    document.getElementById('totalUsuarios').textContent = totalUsers;
    document.getElementById('totalTarefas').textContent = totalTasks;
    document.getElementById('percentualConcluido').textContent = `${completedPercent}%`;
    document.getElementById('statusEmProgresso').textContent = statusEmProgresso;
    document.getElementById('statusConcluido').textContent = statusConcluido;
    document.getElementById('statusPlanejamento').textContent = statusPlanejamento;
    document.getElementById('statusAtrasado').textContent = statusAtrasado;

    renderActivityChart();
}

function getProjectStatusClass(status) {
    switch (status) {
        case 'Consultado':
        case 'Concluído':
            return 'completed';
        case 'Em Progresso':
            return 'in-progress';
        case 'Atrasado':
            return 'delayed';
        default:
            return 'pending';
    }
}

function renderRecentProjects() {
    const recentContainer = document.getElementById('recentProjects');
    recentContainer.innerHTML = '';
    dbState.projects.slice(0, 3).forEach(project => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.innerHTML = `
            <div class="recent-info">
                <h4>${project.name}</h4>
                <p>${project.client} · ${project.description}</p>
            </div>
            <span class="recent-status">${project.status}</span>
        `;
        recentContainer.appendChild(item);
    });
}

function renderProjectsTable() {
    const projetosTable = document.getElementById('projetosTable');
    projetosTable.innerHTML = '';
    dbState.projects.forEach((project, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.name}</td>
            <td>${project.client}</td>
            <td><span class="status-badge ${getProjectStatusClass(project.status)}">${project.status}</span></td>
            <td>${project.progress}%</td>
            <td>${project.start}</td>
            <td>${project.end}</td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="editarProjeto(${index})">Editar</button>
                <button class="btn btn-secondary btn-small" onclick="removerProjeto(${index})">Remover</button>
            </td>
        `;
        projetosTable.appendChild(tr);
    });
}

function renderUsers() {
    const usuariosContainer = document.getElementById('usuariosContainer');
    const userCount = document.getElementById('userCount');
    const searchValue = (document.getElementById('userSearch')?.value || '').toLowerCase().trim();

    const filteredUsers = dbState.users.filter(user => {
        const text = `${user.name} ${user.email} ${user.role} ${user.department}`.toLowerCase();
        return text.includes(searchValue);
    });

    if (userCount) {
        userCount.textContent = `${filteredUsers.length} usuário${filteredUsers.length !== 1 ? 's' : ''}`;
    }

    usuariosContainer.innerHTML = '';
    if (filteredUsers.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'user-empty';
        emptyState.innerHTML = '<p>Nenhum usuário encontrado. Tente outra busca.</p>';
        usuariosContainer.appendChild(emptyState);
        return;
    }

    dbState.users.forEach((user, index) => {
        const text = `${user.name} ${user.email} ${user.role} ${user.department}`.toLowerCase();
        if (!text.includes(searchValue)) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-card-top">
                <img class="user-avatar" src="${user.avatar}" alt="${user.name}">
                <div class="user-card-info">
                    <h4>${user.name}</h4>
                    <span class="user-role-badge">${user.role}</span>
                </div>
            </div>
            <div class="user-card-details">
                <p>${user.department}</p>
                <p>${user.email}</p>
            </div>
            <div class="user-card-actions">
                <button class="btn btn-secondary btn-small" onclick="abrirModalUsuario(${index})">Editar</button>
                <button class="btn btn-danger btn-small" onclick="removerUsuario(${index})">Excluir</button>
            </div>
        `;
        usuariosContainer.appendChild(card);
    });
}

function removerUsuario(index) {
    const user = dbState.users[index];
    if (!user) return;
    if (!confirm(`Deseja excluir o usuário ${user.name}?`)) {
        return;
    }

    dbState.users.splice(index, 1);
    saveDbState();
    renderAllDashboard();
    showNotification('Usuário excluído com sucesso.', 'success');
}

function renderTasks() {
    const planejar = document.getElementById('tarefasPlanejamento');
    const progresso = document.getElementById('tarefasEmProgresso');
    const concluido = document.getElementById('tarefasConcluido');
    planejar.innerHTML = '';
    progresso.innerHTML = '';
    concluido.innerHTML = '';

    dbState.tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.project} · ${task.priority}</p>
            <p>${task.responsible}</p>
        `;

        if (task.status === 'Planejamento') {
            planejar.appendChild(item);
        } else if (task.status === 'Em Progresso') {
            progresso.appendChild(item);
        } else {
            concluido.appendChild(item);
        }
    });
}

function renderLogs() {
    const logsTable = document.getElementById('logsTable');
    logsTable.innerHTML = '';
    dbState.logs.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.date}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td><span class="log-status ${log.status === 'success' ? 'success' : 'error'}"></span>${log.status}</td>
            <td>${log.details}</td>
        `;
        logsTable.appendChild(tr);
    });
}

function renderActivityChart() {
    const chartCanvas = document.getElementById('activityChart');
    if (!chartCanvas) {
        return;
    }

    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const data = [12, 18, 14, 22, 24, 20];

    if (activityChart) {
        activityChart.data.datasets[0].data = data;
        activityChart.update();
        return;
    }

    if (window.Chart) {
        activityChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Tarefas concluídas',
                        data,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        tension: 0.35,
                        fill: true,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6b7280' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(229, 231, 235, 0.8)' },
                        ticks: { color: '#6b7280' }
                    }
                }
            }
        });
    }
}

function populateTaskOptions() {
    const projectSelect = document.querySelector('#tarefaModal select:nth-of-type(1)');
    const userSelect = document.querySelector('#tarefaModal select:nth-of-type(2)');
    if (!projectSelect || !userSelect) {
        return;
    }

    projectSelect.innerHTML = '<option>Selecione um projeto</option>';
    dbState.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });

    userSelect.innerHTML = '<option>Selecione um usuário</option>';
    dbState.users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.name;
        userSelect.appendChild(option);
    });
}

function abrirModalProjeto() {
    document.getElementById('projetoModal').classList.add('active');
}

function abrirModalUsuario(index = null) {
    const modal = document.getElementById('usuarioModal');
    const modalTitle = modal.querySelector('#usuarioModalTitle');
    const submitButton = modal.querySelector('#usuarioSubmitButton');
    const nameInput = modal.querySelector('input[name="name"]');
    const emailInput = modal.querySelector('input[name="email"]');
    const roleInput = modal.querySelector('input[name="role"]');
    const departmentSelect = modal.querySelector('select[name="department"]');

    if (index !== null && index !== undefined) {
        currentEditingUserIndex = index;
        const user = dbState.users[index];
        nameInput.value = user.name;
        emailInput.value = user.email;
        roleInput.value = user.role;
        departmentSelect.value = user.department;
        currentModalAvatarDataUrl = user.avatar || null;
        updateUsuarioAvatarPreview(user.avatar || getAvatarUrl(user.name));
        modalTitle.textContent = 'Editar Usuário';
        submitButton.textContent = 'Salvar Alterações';
    } else {
        currentEditingUserIndex = null;
        currentModalAvatarDataUrl = null;
        modalTitle.textContent = 'Novo Usuário';
        submitButton.textContent = 'Criar Usuário';
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (roleInput) roleInput.value = '';
        if (departmentSelect) departmentSelect.selectedIndex = 0;
        updateUsuarioAvatarPreview(getAvatarUrl('Usuário'));
        const fileInput = document.getElementById('avatarInput');
        if (fileInput) fileInput.value = '';
    }

    if (nameInput) {
        nameInput.oninput = () => {
            if (!currentModalAvatarDataUrl) {
                updateUsuarioAvatarPreview(getAvatarUrl(nameInput.value.trim() || 'Usuário'));
            }
        };
    }

    modal.classList.add('active');
}

function abrirModalTarefa() {
    document.getElementById('tarefaModal').classList.add('active');
}

function fecharModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function salvarProjeto(event) {
    event.preventDefault();
    const modal = document.getElementById('projetoModal');
    const inputs = modal.querySelectorAll('input, textarea, select');
    const [nameInput, clientInput, statusSelect, startInput, endInput, descriptionInput] = inputs;

    const project = {
        name: nameInput.value.trim(),
        client: clientInput.value.trim(),
        status: statusSelect.value,
        progress: statusSelect.value === 'Concluído' ? 100 : statusSelect.value === 'Em Progresso' ? 45 : 15,
        start: startInput.value,
        end: endInput.value,
        description: descriptionInput.value.trim() || 'Projeto cadastrado no dashboard.'
    };

    dbState.projects.push(project);
    saveDbState();
    renderAllDashboard();
    fecharModal('projetoModal');
    showNotification('Projeto criado com sucesso!', 'success');
}

function salvarUsuario(event) {
    event.preventDefault();
    const modal = document.getElementById('usuarioModal');
    const nameInput = modal.querySelector('input[name="name"]');
    const emailInput = modal.querySelector('input[name="email"]');
    const roleInput = modal.querySelector('input[name="role"]');
    const departmentSelect = modal.querySelector('select[name="department"]');

    const nome = nameInput.value.trim();
    const user = {
        name: nome,
        email: emailInput.value.trim(),
        role: roleInput.value.trim(),
        department: departmentSelect.value,
        avatar: currentModalAvatarDataUrl || getAvatarUrl(nome || 'Usuário')
    };

    if (currentEditingUserIndex !== null && currentEditingUserIndex !== undefined) {
        dbState.users[currentEditingUserIndex] = user;
        showNotification('Usuário atualizado com sucesso!', 'success');
    } else {
        dbState.users.push(user);
        showNotification('Usuário criado com sucesso!', 'success');
    }

    currentEditingUserIndex = null;
    saveDbState();
    renderAllDashboard();
    fecharModal('usuarioModal');
}

function salvarTarefa(event) {
    event.preventDefault();
    const modal = document.getElementById('tarefaModal');
    const inputs = modal.querySelectorAll('input, textarea, select');
    const [titleInput, projectSelect, descriptionInput, prioritySelect, userSelect] = inputs;

    const task = {
        title: titleInput.value.trim(),
        project: projectSelect.value,
        description: descriptionInput.value.trim(),
        priority: prioritySelect.value,
        responsible: userSelect.value,
        status: 'Planejamento'
    };

    dbState.tasks.push(task);
    saveDbState();
    renderAllDashboard();
    fecharModal('tarefaModal');
    showNotification('Tarefa criada com sucesso!', 'success');
}

function editarProjeto(index) {
    const project = dbState.projects[index];
    if (!project) return;

    abrirModalProjeto();
    const modal = document.getElementById('projetoModal');
    const inputs = modal.querySelectorAll('input, textarea, select');
    const [nameInput, clientInput, statusSelect, startInput, endInput, descriptionInput] = inputs;

    nameInput.value = project.name;
    clientInput.value = project.client;
    statusSelect.value = project.status;
    startInput.value = project.start;
    endInput.value = project.end;
    descriptionInput.value = project.description;

    modal.querySelector('.modal-form').onsubmit = function(e) {
        e.preventDefault();
        project.name = nameInput.value.trim();
        project.client = clientInput.value.trim();
        project.status = statusSelect.value;
        project.progress = statusSelect.value === 'Concluído' ? 100 : statusSelect.value === 'Em Progresso' ? 45 : 15;
        project.start = startInput.value;
        project.end = endInput.value;
        project.description = descriptionInput.value.trim();

        saveDbState();
        renderAllDashboard();
        fecharModal('projetoModal');
        showNotification('Projeto atualizado com sucesso!', 'success');
        modal.querySelector('.modal-form').onsubmit = salvarProjeto;
    };
}

function removerProjeto(index) {
    dbState.projects.splice(index, 1);
    saveDbState();
    renderAllDashboard();
    showNotification('Projeto removido com sucesso.', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 14px 18px;
        border-radius: 10px;
        color: white;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#374151'};
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    document.body.appendChild(notification);
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 2600);
}

window.addEventListener('DOMContentLoaded', initDashboard);
