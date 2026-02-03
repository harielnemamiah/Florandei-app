// db.js - Gerenciamento de Banco de Dados Local

// Configuração do localForage (IndexedDB)
const db = localforage.createInstance({
    name: 'florandei',
    storeName: 'registros'
});

const photosDB = localforage.createInstance({
    name: 'florandei',
    storeName: 'photos'
});

const settingsDB = localforage.createInstance({
    name: 'florandei',
    storeName: 'settings'
});

// Classe para gerenciar registros
class RegistrosDB {
    constructor() {
        this.db = db;
        this.photosDB = photosDB;
        this.settingsDB = settingsDB;
    }

    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Salvar registro
    async salvar(registro) {
        try {
            const id = registro.id || this.generateId();
            
            // Separar foto do registro
            const photo = registro.photo;
            delete registro.photo;
            
            // Salvar foto separadamente
            if (photo) {
                await this.photosDB.setItem(id, photo);
            }
            
            // Salvar registro
            const registroCompleto = {
                id,
                ...registro,
                hasPhoto: !!photo,
                updatedAt: new Date().toISOString()
            };
            
            await this.db.setItem(id, registroCompleto);
            return registroCompleto;
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
            throw error;
        }
    }

    // Buscar registro por ID
    async buscar(id) {
        try {
            const registro = await this.db.getItem(id);
            if (!registro) return null;
            
            // Carregar foto se existir
            if (registro.hasPhoto) {
                const photo = await this.photosDB.getItem(id);
                registro.photo = photo;
            }
            
            return registro;
        } catch (error) {
            console.error('Erro ao buscar registro:', error);
            throw error;
        }
    }

    // Listar todos os registros
    async listar() {
        try {
            const registros = [];
            await this.db.iterate((value, key) => {
                registros.push(value);
            });
            
            // Ordenar por data (mais recentes primeiro)
            registros.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            return registros;
        } catch (error) {
            console.error('Erro ao listar registros:', error);
            throw error;
        }
    }

    // Excluir registro
    async excluir(id) {
        try {
            await this.db.removeItem(id);
            await this.photosDB.removeItem(id);
            return true;
        } catch (error) {
            console.error('Erro ao excluir registro:', error);
            throw error;
        }
    }

    // Buscar registros com filtros
    async filtrar(filtros = {}) {
        try {
            let registros = await this.listar();
            
            // Filtrar por busca de texto
            if (filtros.search) {
                const searchLower = filtros.search.toLowerCase();
                registros = registros.filter(r => 
                    r.description.toLowerCase().includes(searchLower)
                );
            }
            
            // Filtrar por tag
            if (filtros.tag) {
                registros = registros.filter(r => 
                    r.tags && r.tags.includes(filtros.tag)
                );
            }
            
            // Ordenar
            if (filtros.sort === 'date-asc') {
                registros.reverse();
            }
            
            return registros;
        } catch (error) {
            console.error('Erro ao filtrar registros:', error);
            throw error;
        }
    }

    // Obter todas as tags únicas
    async getTags() {
        try {
            const registros = await this.listar();
            const tagsSet = new Set();
            
            registros.forEach(r => {
                if (r.tags) {
                    r.tags.forEach(tag => tagsSet.add(tag));
                }
            });
            
            return Array.from(tagsSet).sort();
        } catch (error) {
            console.error('Erro ao obter tags:', error);
            throw error;
        }
    }

    // Estatísticas
    async getEstatisticas() {
        try {
            const registros = await this.listar();
            const tags = await this.getTags();
            
            // Contar registros por tag
            const tagCounts = {};
            registros.forEach(r => {
                if (r.tags) {
                    r.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            });
            
            // Ordenar tags por frequência
            const topTags = Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            
            // Registros por mês
            const mesesCounts = {};
            registros.forEach(r => {
                const mes = new Date(r.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
                mesesCounts[mes] = (mesesCounts[mes] || 0) + 1;
            });
            
            return {
                total: registros.length,
                totalTags: tags.length,
                registrosComFoto: registros.filter(r => r.hasPhoto).length,
                topTags,
                mesesCounts,
                ultimoRegistro: registros[0]?.createdAt
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    // Exportar dados
    async exportar() {
        try {
            const registros = await this.listar();
            
            // Carregar fotos para todos os registros
            for (let registro of registros) {
                if (registro.hasPhoto) {
                    const photo = await this.photosDB.getItem(registro.id);
                    registro.photo = photo;
                }
            }
            
            return {
                version: '1.0',
                exportDate: new Date().toISOString(),
                registros
            };
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            throw error;
        }
    }

    // Importar dados
    async importar(dados) {
        try {
            if (!dados.registros || !Array.isArray(dados.registros)) {
                throw new Error('Formato de dados inválido');
            }
            
            let importados = 0;
            for (let registro of dados.registros) {
                await this.salvar(registro);
                importados++;
            }
            
            return importados;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            throw error;
        }
    }

    // Limpar todos os dados
    async limpar() {
        try {
            await this.db.clear();
            await this.photosDB.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            throw error;
        }
    }

    // Salvar configuração
    async saveSetting(key, value) {
        try {
            await this.settingsDB.setItem(key, value);
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
        }
    }

    // Buscar configuração
    async getSetting(key, defaultValue = null) {
        try {
            const value = await this.settingsDB.getItem(key);
            return value !== null ? value : defaultValue;
        } catch (error) {
            console.error('Erro ao buscar configuração:', error);
            return defaultValue;
        }
    }
}

// Instância global
const registrosDB = new RegistrosDB();
