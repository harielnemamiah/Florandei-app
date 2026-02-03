# Florandei 🌿

App mobile para registro e mapeamento de flora em Cravinhos-SP.

## Funcionalidades

- 📍 Mapeamento com GPS em tempo real
- 📷 Captura de fotos (câmera ou galeria)
- 🗺️ Mapas offline de Cravinhos-SP
- 🏷️ Sistema de tags (pré-definidas + personalizadas)
- 📊 Estatísticas e filtros
- 💾 Armazenamento local (SQLite)
- 🔒 100% privado (dados no dispositivo)

## Requisitos

- Flutter 3.0 ou superior
- Android Studio (para compilação Android)
- Dispositivo Android 5.0+ (API 21+)

## Opção 1: Compilar Online (RECOMENDADO - MAIS FÁCIL)

### Usando Codemagic (Grátis, sem instalar nada)

1. **Criar conta**: https://codemagic.io/signup
2. **Upload do código**:
   - Faça upload dos arquivos deste projeto para GitHub
   - Ou faça zip e envie direto
3. **Configurar build**:
   - Platform: Android
   - Build type: Release
   - Branch: main
4. **Iniciar build**: Clique em "Start new build"
5. **Aguardar**: ~10-15 minutos
6. **Baixar APK**: Link aparecerá quando terminar

### Usando GitHub Actions (Automático)

1. Faça upload do código para GitHub
2. Vá em: Settings → Secrets → New repository secret
3. Adicione: `FLUTTER_BUILD = true`
4. Commit qualquer mudança
5. APK será gerado automaticamente em Actions

## Opção 2: Compilar Localmente (Mais Controle)

### Windows

```bash
# 1. Instalar Flutter
# Baixe: https://docs.flutter.dev/get-started/install/windows
# Extraia em C:\src\flutter
# Adicione ao PATH: C:\src\flutter\bin

# 2. Instalar Android Studio
# Baixe: https://developer.android.com/studio
# Instale Android SDK (API 34)

# 3. Aceitar licenças
flutter doctor --android-licenses

# 4. Compilar
cd florandei
flutter pub get
flutter build apk --release

# APK em: build/app/outputs/flutter-apk/app-release.apk
```

### Linux

```bash
# 1. Instalar Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter
export PATH="$PATH:~/flutter/bin"
echo 'export PATH="$PATH:~/flutter/bin"' >> ~/.bashrc

# 2. Instalar dependências
sudo apt-get update
sudo apt-get install clang cmake ninja-build pkg-config libgtk-3-dev

# 3. Instalar Android Studio
# Baixe: https://developer.android.com/studio
sudo snap install android-studio --classic

# 4. Aceitar licenças
flutter doctor --android-licenses

# 5. Compilar
cd florandei
flutter pub get
flutter build apk --release
```

### Mac

```bash
# 1. Instalar Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter
export PATH="$PATH:~/flutter/bin"
echo 'export PATH="$PATH:~/flutter/bin"' >> ~/.zshrc

# 2. Instalar Xcode Command Line Tools
xcode-select --install

# 3. Instalar Android Studio
# Baixe: https://developer.android.com/studio

# 4. Aceitar licenças
flutter doctor --android-licenses

# 5. Compilar
cd florandei
flutter pub get
flutter build apk --release
```

## Instalar APK no Celular

### Via Cabo USB

```bash
# Ativar "Depuração USB" no celular:
# Configurações → Sobre → Tocar 7x em "Número da versão"
# Configurações → Opções de desenvolvedor → Depuração USB

# Conectar cabo e executar:
adb install build/app/outputs/flutter-apk/app-release.apk
```

### Via Transferência Direta

1. Copie o arquivo `app-release.apk` para o celular
2. Abra o arquivo no celular
3. Permita "Instalar apps desconhecidos" quando solicitado
4. Toque em "Instalar"
5. Pronto!

## Mapas Offline (Opcional)

O app funciona online por padrão. Para usar 100% offline:

1. **Baixar Mobile Atlas Creator**: https://mobac.sourceforge.io/
2. **Configurar**:
   - Source: OpenStreetMap
   - Zoom levels: 12-18
   - Área: Cravinhos-SP (Lat: -21.3397, Long: -47.7333)
   - Format: PNG
3. **Exportar** para: `florandei/assets/map_tiles/`
4. **Recompilar** o app

**Tamanho esperado**: ~100-200 MB de tiles

## Como Usar o App

### Primeiro Uso

1. Abra o app "Florandei"
2. Conceda as permissões:
   - ✅ Localização (GPS)
   - ✅ Câmera
   - ✅ Armazenamento
3. Aguarde o mapa carregar

### Registrar uma Planta

**Método 1 - Clique no Mapa:**
1. Toque em qualquer local do mapa
2. Marcador laranja aparece
3. Arraste para ajustar posição
4. Preencha formulário:
   - Tire foto ou escolha da galeria
   - Escreva descrição/identificação
   - Selecione tags
5. Toque em "Salvar Registro"

**Método 2 - GPS Atual:**
1. Toque no botão "+" (canto inferior direito)
2. Selecione "Registrar aqui"
3. App captura sua localização GPS
4. Preencha formulário
5. Salvar

### Visualizar Registros

**No Mapa:**
- Marcadores verdes = registros salvos
- Toque em qualquer marcador
- Visualize foto, descrição, tags, coordenadas

**Em Lista:**
1. Toque no ícone 📋 no topo
2. Veja todos os registros
3. Use filtros de tags
4. Veja estatísticas

### Filtrar por Tags

1. Vá para tela de lista
2. Toque nos chips de tags
3. Veja apenas registros com aquela tag

### Excluir Registro

1. Abra o registro (toque no marcador ou lista)
2. Toque no ícone 🗑️ (lixeira) no topo
3. Confirme exclusão

## Tags Pré-definidas

- Árvore Frutífera
- Nativa
- Exótica
- Medicinal
- Ornamental
- Palmeira
- Arbusto
- Herbácea
- Trepadeira
- Suculenta
- Flores
- Madeira de Lei

**Você pode criar tags personalizadas!**

## Estrutura do Código

```
florandei/
├── lib/
│   ├── main.dart                      # Entry point
│   ├── models/
│   │   └── plant_record.dart          # Modelo de dados
│   ├── services/
│   │   ├── database_service.dart      # SQLite
│   │   ├── location_service.dart      # GPS
│   │   └── image_service.dart         # Câmera
│   └── screens/
│       ├── map_screen.dart            # Mapa principal
│       ├── add_record_screen.dart     # Adicionar
│       ├── record_detail_screen.dart  # Detalhes
│       └── records_list_screen.dart   # Lista/Filtros
├── android/                           # Config Android
├── assets/
│   └── map_tiles/                     # Mapas offline
└── pubspec.yaml                       # Dependências
```

## Banco de Dados

- **Tipo**: SQLite
- **Localização**: `/data/data/com.florandei.app/databases/florandei.db`
- **Imagens**: `/Android/data/com.florandei.app/files/images/`

**Schema:**
```sql
CREATE TABLE plant_records (
  id TEXT PRIMARY KEY,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  imagePath TEXT,
  description TEXT NOT NULL,
  tags TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
```

## Backup Manual

### Android com Debug USB

```bash
# Backup do banco de dados
adb pull /data/data/com.florandei.app/databases/florandei.db ./backup/

# Backup das imagens
adb pull /sdcard/Android/data/com.florandei.app/files/images ./backup/images/
```

### Restaurar Backup

```bash
adb push ./backup/florandei.db /data/data/com.florandei.app/databases/
adb push ./backup/images/* /sdcard/Android/data/com.florandei.app/files/images/
```

## Resolução de Problemas

### App não instala

**Erro: "App não instalado"**
- Solução: Vá em Configurações → Segurança → Permitir fontes desconhecidas

**Erro: "Versão incompatível"**
- Solução: Seu Android precisa ser 5.0+ (API 21+)

### GPS não funciona

1. Verificar se GPS está ativado (Configurações → Localização)
2. Verificar permissões (Configurações → Apps → Florandei → Permissões)
3. Testar ao ar livre (sinal GPS melhor)
4. Aguardar ~30 segundos para primeira captura

### Mapa não carrega

**Tela branca:**
- Verifique conexão com internet (se não tem tiles offline)
- Reinicie o app

**Tiles faltando:**
- Internet pode estar lenta
- Considere adicionar tiles offline

### Câmera não abre

1. Verificar permissão de câmera
2. Fechar outros apps que usam câmera
3. Use "Galeria" como alternativa

### App fecha sozinho (crash)

1. Reinstale o app
2. Limpe cache: Configurações → Apps → Florandei → Limpar cache
3. Verifique espaço disponível (precisa ~500 MB livres)

### Fotos ocupando muito espaço

As fotos são automaticamente comprimidas para ~500 KB cada. Se quiser reduzir mais:
1. Use apps externos para comprimir antes de adicionar
2. Ou edite `lib/services/image_service.dart` e mude `quality: 85` para `quality: 60`

## Performance

**Registros suportados**: Até 10.000+ sem problemas  
**Tamanho médio por registro**: ~500 KB (foto) + ~1 KB (dados)  
**Consumo de bateria**: Baixo (GPS só quando necessário)  
**Uso de memória**: ~150-250 MB RAM

## Tecnologias

- **Flutter 3.x** - Framework cross-platform
- **Dart 3.x** - Linguagem de programação
- **flutter_map 6.1** - Renderização de mapas
- **geolocator 11.0** - Acesso ao GPS
- **sqflite 2.3** - Banco de dados SQLite
- **image_picker 1.0** - Acesso à câmera/galeria
- **image 4.1** - Compressão de imagens

## Roadmap Futuro

Funcionalidades planejadas:
- [ ] Exportar para KML/GeoJSON
- [ ] Sincronização Google Drive
- [ ] Modo noturno
- [ ] Busca por texto
- [ ] Comparação de registros
- [ ] Gráficos de distribuição

## Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas!

## Licença

Uso pessoal livre. Sem garantias.

---

**Desenvolvido para catalogação de flora em Cravinhos-SP** 🌳🚶‍♂️

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026
