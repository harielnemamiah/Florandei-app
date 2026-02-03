# Ícone do App Florandei

## Ícone Atual

O app usa o ícone padrão do Flutter. Para personalizar:

## Como Criar Ícone Personalizado

### Opção 1: Usar Ferramenta Online

1. **Acesse**: https://icon.kitchen/
2. **Conceito**: Pegadas caminhando pela flora
   - Sugestões de design:
     - Pegadas verdes sobre fundo de folhas
     - Silhueta de pessoa andando + árvores
     - Trilha com plantas ao redor
3. **Gerar ícone** para Android
4. **Baixar** todos os tamanhos (mipmap)

### Opção 2: Design Manual

#### Especificações Técnicas

**Tamanhos necessários** (Android):
```
mipmap-mdpi/    ic_launcher.png (48x48)
mipmap-hdpi/    ic_launcher.png (72x72)
mipmap-xhdpi/   ic_launcher.png (96x96)
mipmap-xxhdpi/  ic_launcher.png (144x144)
mipmap-xxxhdpi/ ic_launcher.png (192x192)
```

**Design Guidelines**:
- Tamanho base: 1024x1024 px
- Formato: PNG com transparência
- Cores sugeridas: Verde (#4CAF50), Terra (#8B4513)
- Estilo: Minimalista, reconhecível em tamanhos pequenos

#### Elementos Sugeridos

**Conceito "Pegadas na Flora"**:
- 2-3 pegadas humanas (estilizadas)
- Folhas/plantas ao redor
- Cor verde predominante
- Fundo transparente ou gradiente sutil

**Ferramentas para criar**:
- Figma (online, grátis): https://figma.com
- Canva (online, grátis): https://canva.com
- GIMP (desktop, grátis): https://gimp.org

### Instalar Ícone no Projeto

#### Método Automático (Recomendado)

1. **Instalar ferramenta**:
```bash
flutter pub add flutter_launcher_icons
```

2. **Criar** `flutter_launcher_icons.yaml`:
```yaml
flutter_launcher_icons:
  android: true
  ios: false
  image_path: "assets/icons/ic_launcher.png"
  adaptive_icon_background: "#4CAF50"
  adaptive_icon_foreground: "assets/icons/ic_launcher_foreground.png"
```

3. **Executar**:
```bash
flutter pub run flutter_launcher_icons
```

#### Método Manual

1. **Copiar imagens** para:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png
├── mipmap-hdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
```

2. **Recompilar** app:
```bash
flutter build apk --release
```

## Ícone Adaptativo (Android 8+)

Para suportar "Adaptive Icons" (ícone que muda forma):

1. Criar dois arquivos:
   - `ic_launcher_background.png` (fundo)
   - `ic_launcher_foreground.png` (frente)

2. Colocar em:
```
android/app/src/main/res/
├── mipmap-mdpi/
├── mipmap-hdpi/
└── ...
```

## Exemplo de Paleta de Cores

```
Verde Primário: #4CAF50
Verde Escuro:   #2E7D32
Terra:          #8B4513
Marrom Claro:   #D7CCC8
Branco:         #FFFFFF
```

## Mockup de Conceitos

### Conceito 1: Pegadas Minimalistas
```
┌─────────────────┐
│                 │
│    👣  🌿       │
│  👣             │
│       🌱  🍃    │
│                 │
└─────────────────┘
```

### Conceito 2: Pessoa + Natureza
```
┌─────────────────┐
│                 │
│   🚶  🌳        │
│     🌿🌱        │
│                 │
│                 │
└─────────────────┘
```

### Conceito 3: Trilha Circular
```
┌─────────────────┐
│                 │
│    ╱─🌿─╲       │
│   👣   🌱      │
│    ╲─🍃─╱       │
│                 │
└─────────────────┘
```

## Ferramentas IA para Gerar Ícone

Se quiser usar IA:

1. **Prompt sugerido**:
```
"Create a minimalist app icon for a plant mapping app called Florandei.
Include footsteps walking through flora, green leaves, and plants.
Style: flat design, modern, recognizable at small sizes.
Colors: green (#4CAF50) and earth tones. 1024x1024 px."
```

2. **Ferramentas**:
   - DALL-E: https://openai.com/dall-e-2
   - Midjourney: https://midjourney.com
   - Stable Diffusion: https://stablediffusionweb.com

## Checklist de Ícone

- [ ] Design criado (1024x1024)
- [ ] Todos os tamanhos gerados
- [ ] Testado em fundo claro e escuro
- [ ] Reconhecível em 48x48
- [ ] Cores contrastam bem
- [ ] Instalado no projeto
- [ ] App recompilado
- [ ] Testado no celular

## Ícone Atual (Temporário)

O app atualmente usa o ícone padrão do Flutter (azul). Substitua assim que possível!

---

**Dica**: Um bom ícone faz TODA diferença na percepção do app. Vale o investimento de tempo!
