// ui.js - Gerenciamento da Interface

class UIFlorandei {
    constructor() {
        this.currentRegistro = null;
        this.tempLocation = null;
        this.selectedTags = new Set();
        this.photoData = null;
        
        // Tags sugeridas
        this.suggestedTags = [
            'Árvore Frutífera',
            'Nativa',
            'Exótica',
            'Medicinal',
            'Ornamental',
            'Floração',
            'Frutificação'
        ];
    }

    // Inicializar UI
    init() {
        this.setupEventListeners();
        this.updateFilterTagsDropdown();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botão de adicionar (FAB)
        document.getElementById('fab-add').addEventListener('click', () => {
            this.openAddModal();
        });

        // Botão de localização
        document.getElementById('btn-location').addEventListener('click', () => {
            mapa.centerOnUser();
        });

        // Botões do header
        document.getElementById('btn-list').addEventListener('click', () => {
            this.openListModal();
        });

        document.getElementById('btn-stats').addEventListener('click', () => {
            this.openStatsModal();
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            this.exportData();
        });

        // Modal de registro
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        document.getElementById('btn-cancel').addEventListener('click', () => {
            this.closeModal(document.getElementById('modal-registro'));
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            this.saveRegistro();
        });

        // Upload de foto
        document.getElementById('input-photo').addEventListener('change', (e) => {
            this.handlePhotoUpload(e);
        });

        // Tags
        document.querySelectorAll('.tag-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                this.toggleTag(e.target.dataset.tag);
            });
        });

        document.getElementById('btn-add-tag').addEventListener('click', () => {
            this.addCustomTag();
        });

        document.getElementById('input-custom-tag').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCustomTag();
            }
        });

        // Modal de visualização
        document.getElementById('btn-delete').addEventListener('click', () => {
            this.deleteRegistro();
        });

        document.getElementById('btn-edit').addEventListener('click', () => {
            this.editRegistro();
        });

        // Filtros da lista
        document.getElementById('filter-search').addEventListener('input', () => {
            this.filterList();
        });

        document.getElementById('filter-tag').addEventListener('change', () => {
            this.filterList();
        });

        document.getElementById('filter-sort').addEventListener('change', () => {
            this.filterList();
        });

        // Eventos do mapa
        document.addEventListener('mapClicked', (e) => {
            if (document.getElementById('modal-registro').classList.contains('active')) {
                this.handleMapClick(e.detail);
            }
        });

        document.addEventListener('markerMoved', (e) => {
            this.handleMarkerMoved(e.detail);
        });

        document.addEventListener('markerClicked', (e) => {
            this.viewRegistro(e.detail.id);
        });

        // Fechar modal ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    // Abrir modal de adicionar
    openAddModal() {
        this.currentRegistro = null;
        this.resetForm();
        
        document.getElementById('modal-title').textContent = 'Novo Registro';
        document.getElementById('input-date').value = new Date().toLocaleString('pt-BR');
        
        // Usar localização atual se disponível
        if (mapa.userLocation) {
            this.tempLocation = {
                lat: mapa.userLocation.lat,
                lng: mapa.userLocation.lng
            };
            this.updateLocationPreview();
            mapa.addTempMarker(this.tempLocation.lat, this.tempLocation.lng);
        } else {
            document.getElementById('location-coords').textContent = 'Clique no mapa para definir a localização';
        }
        
        this.showModal('modal-registro');
        this.showMessage('Clique no mapa ou arraste o marcador para ajustar a posição', 'info');
    }

    // Lidar com clique no mapa
    handleMapClick(location) {
        this.tempLocation = location;
        this.updateLocationPreview();
        mapa.addTempMarker(location.lat, location.lng);
    }

    // Lidar com movimentação do marcador
    handleMarkerMoved(location) {
        this.tempLocation = location;
        this.updateLocationPreview();
    }

    // Atualizar preview de localização
    updateLocationPreview() {
        if (!this.tempLocation) return;
        
        const coords = mapa.formatCoords(this.tempLocation.lat, this.tempLocation.lng);
        document.getElementById('location-coords').textContent = coords;
        
        if (mapa.userLocation) {
            const accuracy = `±${Math.round(mapa.userLocation.accuracy)}m de precisão`;
            document.getElementById('location-accuracy').textContent = accuracy;
        }
    }

    // Upload de foto
    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.photoData = event.target.result;
            
            // Mostrar preview
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = `<img src="${this.photoData}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }

    // Toggle tag
    toggleTag(tag) {
        if (this.selectedTags.has(tag)) {
            this.selectedTags.delete(tag);
        } else {
            this.selectedTags.add(tag);
        }
        this.updateSelectedTags();
        this.updateTagChips();
    }

    // Adicionar tag customizada
    addCustomTag() {
        const input = document.getElementById('input-custom-tag');
        const tag = input.value.trim();
        
        if (tag && !this.selectedTags.has(tag)) {
            this.selectedTags.add(tag);
            this.updateSelectedTags();
            input.value = '';
        }
    }

    // Atualizar visualização de tags selecionadas
    updateSelectedTags() {
        const container = document.getElementById('selected-tags');
        container.innerHTML = '';
        
        this.selectedTags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'selected-tag';
            tagEl.innerHTML = `
                ${tag}
                <button onclick="ui.removeTag('${tag}')">&times;</button>
            `;
            container.appendChild(tagEl);
        });
    }

    // Atualizar aparência dos chips de tags
    updateTagChips() {
        document.querySelectorAll('.tag-chip').forEach(chip => {
            const tag = chip.dataset.tag;
            if (this.selectedTags.has(tag)) {
                chip.classList.add('selected');
            } else {
                chip.classList.remove('selected');
            }
        });
    }

    // Remover tag
    removeTag(tag) {
        this.selectedTags.delete(tag);
        this.updateSelectedTags();
        this.updateTagChips();
    }

    // Salvar registro
    async saveRegistro() {
        try {
            // Validar dados
            if (!this.tempLocation) {
                this.showMessage('Selecione uma localização no mapa', 'error');
                return;
            }

            const description = document.getElementById('input-description').value.trim();
            if (!description) {
                this.showMessage('Adicione uma descrição', 'error');
                return;
            }

            // Criar registro
            const registro = {
                latitude: this.tempLocation.lat,
                longitude: this.tempLocation.lng,
                description,
                tags: Array.from(this.selectedTags),
                photo: this.photoData,
                createdAt: new Date().toISOString()
            };

            // Se estiver editando
            if (this.currentRegistro) {
                registro.id = this.currentRegistro.id;
                registro.createdAt = this.currentRegistro.createdAt;
            }

            // Salvar no banco
            await registrosDB.salvar(registro);

            // Atualizar mapa
            await mapa.loadMarkers();

            // Fechar modal
            this.closeModal(document.getElementById('modal-registro'));
            
            this.showMessage('Registro salvo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            this.showMessage('Erro ao salvar registro', 'error');
        }
    }

    // Visualizar registro
    async viewRegistro(id) {
        try {
            const registro = await registrosDB.buscar(id);
            if (!registro) return;

            this.currentRegistro = registro;

            // Preencher modal
            if (registro.photo) {
                document.getElementById('view-photo').innerHTML = `<img src="${registro.photo}" alt="Foto">`;
            } else {
                document.getElementById('view-photo').innerHTML = '<p style="color:#999">Sem foto</p>';
            }

            document.getElementById('view-description').textContent = registro.description;
            
            // Tags
            const tagsContainer = document.getElementById('view-tags');
            tagsContainer.innerHTML = '';
            if (registro.tags && registro.tags.length > 0) {
                registro.tags.forEach(tag => {
                    const tagEl = document.createElement('div');
                    tagEl.className = 'view-tag';
                    tagEl.textContent = tag;
                    tagsContainer.appendChild(tagEl);
                });
            } else {
                tagsContainer.innerHTML = '<p style="color:#999">Sem tags</p>';
            }

            const coords = mapa.formatCoords(registro.latitude, registro.longitude);
            document.getElementById('view-coords').textContent = coords;

            const date = new Date(registro.createdAt).toLocaleString('pt-BR');
            document.getElementById('view-date').textContent = date;

            this.showModal('modal-view');
        } catch (error) {
            console.error('Erro ao visualizar:', error);
        }
    }

    // Editar registro
    editRegistro() {
        this.closeModal(document.getElementById('modal-view'));
        
        // Preencher formulário
        document.getElementById('modal-title').textContent = 'Editar Registro';
        document.getElementById('input-description').value = this.currentRegistro.description;
        document.getElementById('input-date').value = new Date(this.currentRegistro.createdAt).toLocaleString('pt-BR');
        
        // Tags
        this.selectedTags = new Set(this.currentRegistro.tags || []);
        this.updateSelectedTags();
        this.updateTagChips();
        
        // Foto
        if (this.currentRegistro.photo) {
            this.photoData = this.currentRegistro.photo;
            document.getElementById('photo-preview').innerHTML = `<img src="${this.photoData}" alt="Preview">`;
        }
        
        // Localização
        this.tempLocation = {
            lat: this.currentRegistro.latitude,
            lng: this.currentRegistro.longitude
        };
        this.updateLocationPreview();
        mapa.addTempMarker(this.tempLocation.lat, this.tempLocation.lng);
        mapa.centerOnMarker(this.currentRegistro.id);
        
        this.showModal('modal-registro');
    }

    // Excluir registro
    async deleteRegistro() {
        if (!confirm('Tem certeza que deseja excluir este registro?')) return;

        try {
            await registrosDB.excluir(this.currentRegistro.id);
            await mapa.loadMarkers();
            
            this.closeModal(document.getElementById('modal-view'));
            this.showMessage('Registro excluído', 'success');
        } catch (error) {
            console.error('Erro ao excluir:', error);
            this.showMessage('Erro ao excluir registro', 'error');
        }
    }

    // Abrir modal de lista
    async openListModal() {
        await this.updateFilterTagsDropdown();
        await this.filterList();
        this.showModal('modal-list');
    }

    // Filtrar lista
    async filterList() {
        try {
            const search = document.getElementById('filter-search').value;
            const tag = document.getElementById('filter-tag').value;
            const sort = document.getElementById('filter-sort').value;

            const registros = await registrosDB.filtrar({ search, tag, sort });

            const container = document.getElementById('list-container');
            container.innerHTML = '';

            if (registros.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Nenhum registro encontrado</p>';
                return;
            }

            registros.forEach(registro => {
                const item = this.createListItem(registro);
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Erro ao filtrar lista:', error);
        }
    }

    // Criar item da lista
    createListItem(registro) {
        const div = document.createElement('div');
        div.className = 'list-item';
        
        const photoSrc = registro.hasPhoto ? '(Com foto)' : '(Sem foto)';
        const description = registro.description.substring(0, 80);
        const date = new Date(registro.createdAt).toLocaleDateString('pt-BR');
        const coords = mapa.formatCoords(registro.latitude, registro.longitude);
        
        let tagsHTML = '';
        if (registro.tags && registro.tags.length > 0) {
            tagsHTML = '<div class="list-item-tags">';
            registro.tags.slice(0, 3).forEach(tag => {
                tagsHTML += `<span class="list-item-tag">${tag}</span>`;
            });
            tagsHTML += '</div>';
        }
        
        div.innerHTML = `
            <div class="list-item-photo" style="${registro.hasPhoto ? 'background-image:url(' + photoSrc + ')' : ''}">
                ${!registro.hasPhoto ? '📷' : ''}
            </div>
            <div class="list-item-info">
                <h3>${description}</h3>
                <p>📍 ${coords}</p>
                <p>📅 ${date}</p>
                ${tagsHTML}
            </div>
        `;
        
        div.addEventListener('click', () => {
            this.closeModal(document.getElementById('modal-list'));
            this.viewRegistro(registro.id);
        });
        
        return div;
    }

    // Atualizar dropdown de tags
    async updateFilterTagsDropdown() {
        const select = document.getElementById('filter-tag');
        const tags = await registrosDB.getTags();
        
        select.innerHTML = '<option value="">Todas as tags</option>';
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            select.appendChild(option);
        });
    }

    // Abrir modal de estatísticas
    async openStatsModal() {
        try {
            const stats = await registrosDB.getEstatisticas();
            const container = document.getElementById('stats-container');
            
            container.innerHTML = `
                <div class="stat-card">
                    <h3>📊 Total de Registros</h3>
                    <div class="stat-value">${stats.total}</div>
                </div>
                
                <div class="stat-card">
                    <h3>🏷️ Tags Únicas</h3>
                    <div class="stat-value">${stats.totalTags}</div>
                </div>
                
                <div class="stat-card">
                    <h3>📷 Registros com Foto</h3>
                    <div class="stat-value">${stats.registrosComFoto}</div>
                </div>
                
                ${stats.topTags.length > 0 ? `
                    <div class="stat-card">
                        <h3>🔝 Tags Mais Usadas</h3>
                        <div class="stat-list">
                            ${stats.topTags.map(([tag, count]) => `
                                <div class="stat-list-item">
                                    <span>${tag}</span>
                                    <span><strong>${count}</strong></span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${stats.ultimoRegistro ? `
                    <div class="stat-card">
                        <h3>🕒 Último Registro</h3>
                        <p>${new Date(stats.ultimoRegistro).toLocaleString('pt-BR')}</p>
                    </div>
                ` : ''}
            `;
            
            this.showModal('modal-stats');
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    // Exportar dados
    async exportData() {
        try {
            const data = await registrosDB.exportar();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `florandei-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.showMessage('Dados exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar:', error);
            this.showMessage('Erro ao exportar dados', 'error');
        }
    }

    // Resetar formulário
    resetForm() {
        document.getElementById('input-description').value = '';
        document.getElementById('input-photo').value = '';
        document.getElementById('photo-preview').innerHTML = '';
        document.getElementById('input-custom-tag').value = '';
        this.selectedTags.clear();
        this.updateSelectedTags();
        this.updateTagChips();
        this.photoData = null;
        this.tempLocation = null;
        mapa.removeTempMarker();
    }

    // Mostrar modal
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    // Fechar modal
    closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        modal.classList.remove('active');
        
        if (modal.id === 'modal-registro') {
            this.resetForm();
        }
    }

    // Mostrar mensagem
    showMessage(text, type = 'info') {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text;
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 3000);
    }
}

// Instância global
const ui = new UIFlorandei();
