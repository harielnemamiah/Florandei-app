// map.js - Gerenciamento do Mapa

class MapaFlorandei {
    constructor() {
        // Coordenadas de Cravinhos-SP
        this.cravinhos = {
            lat: -21.3367,
            lng: -47.7453,
            zoom: 14
        };
        
        this.map = null;
        this.markers = [];
        this.currentLocationMarker = null;
        this.tempMarker = null;
        this.userLocation = null;
        
        // Ícone customizado para marcadores
        this.markerIcon = L.divIcon({
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
        
        // Ícone para localização do usuário
        this.userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div style="width:16px;height:16px;background:#2196F3;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
        });
        
        // Ícone para marcador temporário
        this.tempIcon = L.divIcon({
            className: 'temp-marker',
            html: '<div style="width:32px;height:32px;background:#ff9800;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:16px">📍</span></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });
    }

    // Inicializar mapa
    async init() {
        try {
            // Criar mapa centrado em Cravinhos
            this.map = L.map('map', {
                zoomControl: true,
                attributionControl: false
            }).setView([this.cravinhos.lat, this.cravinhos.lng], this.cravinhos.zoom);

            // Adicionar camada de tiles (OpenStreetMap)
            // Para offline: tiles devem ser pré-baixados
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                minZoom: 12,
                bounds: [
                    [-21.40, -47.82],  // SW
                    [-21.27, -47.67]   // NE
                ]
            }).addTo(this.map);

            // Adicionar evento de clique no mapa
            this.map.on('click', (e) => {
                this.onMapClick(e);
            });

            // Tentar obter localização do usuário
            await this.getUserLocation();
            
            // Carregar marcadores existentes
            await this.loadMarkers();
            
            return true;
        } catch (error) {
            console.error('Erro ao inicializar mapa:', error);
            throw error;
        }
    }

    // Obter localização do usuário
    async getUserLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('Geolocalização não suportada');
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    
                    // Adicionar marcador de localização
                    this.updateUserLocationMarker();
                    
                    // Centralizar no usuário se estiver em Cravinhos
                    const distance = this.calculateDistance(
                        this.userLocation.lat,
                        this.userLocation.lng,
                        this.cravinhos.lat,
                        this.cravinhos.lng
                    );
                    
                    // Se estiver a menos de 10km do centro de Cravinhos
                    if (distance < 10) {
                        this.map.setView([this.userLocation.lat, this.userLocation.lng], 16);
                    }
                    
                    resolve(this.userLocation);
                },
                (error) => {
                    console.warn('Erro ao obter localização:', error);
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 30000
                }
            );
        });
    }

    // Atualizar marcador de localização do usuário
    updateUserLocationMarker() {
        if (!this.userLocation) return;
        
        if (this.currentLocationMarker) {
            this.map.removeLayer(this.currentLocationMarker);
        }
        
        this.currentLocationMarker = L.marker(
            [this.userLocation.lat, this.userLocation.lng],
            { icon: this.userIcon }
        ).addTo(this.map);
        
        // Adicionar círculo de precisão
        L.circle([this.userLocation.lat, this.userLocation.lng], {
            radius: this.userLocation.accuracy,
            color: '#2196F3',
            fillColor: '#2196F3',
            fillOpacity: 0.1,
            weight: 1
        }).addTo(this.map);
    }

    // Centralizar na localização do usuário
    centerOnUser() {
        if (this.userLocation) {
            this.map.setView([this.userLocation.lat, this.userLocation.lng], 17, {
                animate: true
            });
        } else {
            this.getUserLocation();
        }
    }

    // Evento de clique no mapa
    onMapClick(e) {
        // Disparar evento customizado
        const event = new CustomEvent('mapClicked', {
            detail: {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            }
        });
        document.dispatchEvent(event);
    }

    // Adicionar marcador temporário (editável)
    addTempMarker(lat, lng) {
        // Remover marcador temporário anterior
        if (this.tempMarker) {
            this.map.removeLayer(this.tempMarker);
        }
        
        // Adicionar novo marcador temporário (arrastável)
        this.tempMarker = L.marker([lat, lng], {
            icon: this.tempIcon,
            draggable: true
        }).addTo(this.map);
        
        // Evento de arrastar
        this.tempMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            const event = new CustomEvent('markerMoved', {
                detail: {
                    lat: pos.lat,
                    lng: pos.lng
                }
            });
            document.dispatchEvent(event);
        });
        
        return this.tempMarker;
    }

    // Remover marcador temporário
    removeTempMarker() {
        if (this.tempMarker) {
            this.map.removeLayer(this.tempMarker);
            this.tempMarker = null;
        }
    }

    // Carregar marcadores dos registros
    async loadMarkers() {
        try {
            // Limpar marcadores existentes
            this.clearMarkers();
            
            // Buscar registros
            const registros = await registrosDB.listar();
            
            // Adicionar marcador para cada registro
            registros.forEach(registro => {
                this.addMarker(registro);
            });
        } catch (error) {
            console.error('Erro ao carregar marcadores:', error);
        }
    }

    // Adicionar marcador de registro
    addMarker(registro) {
        const marker = L.marker([registro.latitude, registro.longitude], {
            icon: this.markerIcon
        }).addTo(this.map);
        
        // Criar popup
        const popupContent = this.createPopupContent(registro);
        marker.bindPopup(popupContent);
        
        // Evento de clique no marcador
        marker.on('click', () => {
            const event = new CustomEvent('markerClicked', {
                detail: { id: registro.id }
            });
            document.dispatchEvent(event);
        });
        
        this.markers.push({ id: registro.id, marker });
    }

    // Criar conteúdo do popup
    createPopupContent(registro) {
        const tags = registro.tags ? registro.tags.slice(0, 3).join(', ') : '';
        const date = new Date(registro.createdAt).toLocaleDateString('pt-BR');
        
        return `
            <div style="min-width:200px">
                <strong style="color:#2d5016">${registro.description.substring(0, 50)}${registro.description.length > 50 ? '...' : ''}</strong><br>
                ${tags ? `<small>🏷️ ${tags}</small><br>` : ''}
                <small>📅 ${date}</small>
            </div>
        `;
    }

    // Limpar todos os marcadores
    clearMarkers() {
        this.markers.forEach(({ marker }) => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }

    // Remover marcador específico
    removeMarker(id) {
        const index = this.markers.findIndex(m => m.id === id);
        if (index !== -1) {
            this.map.removeLayer(this.markers[index].marker);
            this.markers.splice(index, 1);
        }
    }

    // Centralizar em marcador
    centerOnMarker(id) {
        const markerData = this.markers.find(m => m.id === id);
        if (markerData) {
            const pos = markerData.marker.getLatLng();
            this.map.setView(pos, 18, { animate: true });
            markerData.marker.openPopup();
        }
    }

    // Calcular distância entre dois pontos (fórmula de Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Formatar coordenadas para exibição
    formatCoords(lat, lng) {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

// Instância global
const mapa = new MapaFlorandei();
