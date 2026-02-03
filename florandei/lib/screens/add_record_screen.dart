import 'dart:io';
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:uuid/uuid.dart';
import 'package:flutter_map/flutter_map.dart';
import '../models/plant_record.dart';
import '../services/database_service.dart';
import '../services/image_service.dart';

class AddRecordScreen extends StatefulWidget {
  final LatLng initialLocation;
  final Position? currentPosition;

  const AddRecordScreen({
    super.key,
    required this.initialLocation,
    this.currentPosition,
  });

  @override
  State<AddRecordScreen> createState() => _AddRecordScreenState();
}

class _AddRecordScreenState extends State<AddRecordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  final _customTagController = TextEditingController();
  final MapController _mapController = MapController();
  
  String? _imagePath;
  late LatLng _selectedLocation;
  final List<String> _selectedTags = [];
  bool _isSaving = false;

  // Tags pré-definidas
  static const List<String> _predefinedTags = [
    'Árvore Frutífera',
    'Nativa',
    'Exótica',
    'Medicinal',
    'Ornamental',
    'Palmeira',
    'Arbusto',
    'Herbácea',
    'Trepadeira',
    'Suculenta',
    'Flores',
    'Madeira de Lei',
  ];

  @override
  void initState() {
    super.initState();
    _selectedLocation = widget.initialLocation;
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _customTagController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    String? path;
    if (source == ImageSource.camera) {
      path = await ImageService.pickImageFromCamera();
    } else {
      path = await ImageService.pickImageFromGallery();
    }

    if (path != null) {
      setState(() => _imagePath = path);
    }
  }

  void _showImageSourceDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Selecionar imagem'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Câmera'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Galeria'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _toggleTag(String tag) {
    setState(() {
      if (_selectedTags.contains(tag)) {
        _selectedTags.remove(tag);
      } else {
        _selectedTags.add(tag);
      }
    });
  }

  void _addCustomTag() {
    final tag = _customTagController.text.trim();
    if (tag.isNotEmpty && !_selectedTags.contains(tag)) {
      setState(() {
        _selectedTags.add(tag);
        _customTagController.clear();
      });
    }
  }

  void _onMapTap(TapPosition tapPosition, LatLng point) {
    setState(() {
      _selectedLocation = point;
    });
  }

  Future<void> _saveRecord() async {
    if (!_formKey.currentState!.validate()) return;
    if (_imagePath == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, adicione uma imagem')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      final record = PlantRecord(
        id: const Uuid().v4(),
        latitude: _selectedLocation.latitude,
        longitude: _selectedLocation.longitude,
        imagePath: _imagePath,
        description: _descriptionController.text.trim(),
        tags: _selectedTags,
        createdAt: DateTime.now(),
      );

      await DatabaseService.instance.insertRecord(record);

      if (mounted) {
        Navigator.pop(context, true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registro salvo com sucesso!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao salvar: $e')),
        );
      }
    } finally {
      setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Novo Registro'),
        backgroundColor: Colors.green[700],
        foregroundColor: Colors.white,
      ),
      body: _isSaving
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Mapa para ajustar localização
                    Card(
                      elevation: 4,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(12),
                            child: Text(
                              'Ajuste a localização (arraste o marcador)',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                          ),
                          SizedBox(
                            height: 250,
                            child: FlutterMap(
                              mapController: _mapController,
                              options: MapOptions(
                                initialCenter: _selectedLocation,
                                initialZoom: 17.0,
                                onTap: _onMapTap,
                              ),
                              children: [
                                TileLayer(
                                  urlTemplate: 'assets/map_tiles/{z}/{x}/{y}.png',
                                  fallbackUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                                ),
                                MarkerLayer(
                                  markers: [
                                    Marker(
                                      point: _selectedLocation,
                                      width: 40,
                                      height: 40,
                                      child: const Icon(
                                        Icons.location_on,
                                        color: Colors.red,
                                        size: 40,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8),
                            child: Text(
                              'Lat: ${_selectedLocation.latitude.toStringAsFixed(6)}, '
                              'Long: ${_selectedLocation.longitude.toStringAsFixed(6)}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Imagem
                    Card(
                      elevation: 4,
                      child: Column(
                        children: [
                          if (_imagePath != null)
                            Stack(
                              children: [
                                Image.file(
                                  File(_imagePath!),
                                  height: 200,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                ),
                                Positioned(
                                  top: 8,
                                  right: 8,
                                  child: IconButton(
                                    icon: const Icon(Icons.close),
                                    color: Colors.white,
                                    style: IconButton.styleFrom(
                                      backgroundColor: Colors.black54,
                                    ),
                                    onPressed: () {
                                      setState(() => _imagePath = null);
                                    },
                                  ),
                                ),
                              ],
                            )
                          else
                            InkWell(
                              onTap: _showImageSourceDialog,
                              child: Container(
                                height: 150,
                                decoration: BoxDecoration(
                                  color: Colors.grey[200],
                                  border: Border.all(color: Colors.grey),
                                ),
                                child: const Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.add_a_photo, size: 48),
                                      SizedBox(height: 8),
                                      Text('Adicionar foto'),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          if (_imagePath != null)
                            TextButton.icon(
                              icon: const Icon(Icons.edit),
                              label: const Text('Alterar foto'),
                              onPressed: _showImageSourceDialog,
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Descrição
                    TextFormField(
                      controller: _descriptionController,
                      decoration: const InputDecoration(
                        labelText: 'Descrição / Identificação',
                        border: OutlineInputBorder(),
                        hintText: 'Nome científico, características, observações...',
                      ),
                      maxLines: 4,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Por favor, adicione uma descrição';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Tags
                    Text(
                      'Tags',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _predefinedTags.map((tag) {
                        final isSelected = _selectedTags.contains(tag);
                        return FilterChip(
                          label: Text(tag),
                          selected: isSelected,
                          onSelected: (_) => _toggleTag(tag),
                          selectedColor: Colors.green[200],
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _customTagController,
                            decoration: const InputDecoration(
                              labelText: 'Tag personalizada',
                              border: OutlineInputBorder(),
                              hintText: 'Digite e pressione +',
                            ),
                            onSubmitted: (_) => _addCustomTag(),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          icon: const Icon(Icons.add_circle),
                          color: Colors.green[700],
                          onPressed: _addCustomTag,
                        ),
                      ],
                    ),
                    if (_selectedTags.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: _selectedTags.map((tag) {
                          return Chip(
                            label: Text(tag),
                            backgroundColor: Colors.green[100],
                            deleteIcon: const Icon(Icons.close, size: 18),
                            onDeleted: () => _toggleTag(tag),
                          );
                        }).toList(),
                      ),
                    ],
                    const SizedBox(height: 24),

                    // Botão salvar
                    ElevatedButton(
                      onPressed: _saveRecord,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green[700],
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text(
                        'Salvar Registro',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

// Import necessário para ImageSource
import 'package:image_picker/image_picker.dart';
