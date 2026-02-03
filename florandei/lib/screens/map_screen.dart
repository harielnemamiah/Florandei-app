import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';
import '../models/plant_record.dart';
import '../services/database_service.dart';
import '../services/location_service.dart';
import 'add_record_screen.dart';
import 'record_detail_screen.dart';
import 'records_list_screen.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  List<PlantRecord> _records = [];
  Position? _currentPosition;
  bool _isLoading = true;
  LatLng? _tempMarker;

  // Coordenadas de Cravinhos-SP
  static const LatLng _cravinhosCenter = LatLng(-21.3397, -47.7333);

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    
    // Carregar registros do banco
    final records = await DatabaseService.instance.getAllRecords();
    
    // Tentar obter localização atual
    final position = await LocationService.getCurrentLocation();
    
    setState(() {
      _records = records;
      _currentPosition = position;
      _isLoading = false;
    });
  }

  void _onMapTap(TapPosition tapPosition, LatLng point) {
    setState(() {
      _tempMarker = point;
    });

    // Navegar para tela de adicionar registro
    _navigateToAddRecord(point);
  }

  Future<void> _navigateToAddRecord(LatLng point) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AddRecordScreen(
          initialLocation: point,
          currentPosition: _currentPosition,
        ),
      ),
    );

    if (result == true) {
      _loadData();
      setState(() => _tempMarker = null);
    } else {
      setState(() => _tempMarker = null);
    }
  }

  void _centerOnCurrentLocation() async {
    if (_currentPosition != null) {
      _mapController.move(
        LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
        16,
      );
    } else {
      final position = await LocationService.getCurrentLocation();
      if (position != null) {
        setState(() => _currentPosition = position);
        _mapController.move(
          LatLng(position.latitude, position.longitude),
          16,
        );
      }
    }
  }

  void _showRecordDetail(PlantRecord record) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RecordDetailScreen(record: record),
      ),
    ).then((_) => _loadData());
  }

  void _showRecordsList() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RecordsListScreen(),
      ),
    ).then((_) => _loadData());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Florandei'),
        backgroundColor: Colors.green[700],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.list),
            onPressed: _showRecordsList,
            tooltip: 'Ver lista de registros',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: _cravinhosCenter,
                initialZoom: 14.0,
                minZoom: 12.0,
                maxZoom: 18.0,
                onTap: _onMapTap,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'assets/map_tiles/{z}/{x}/{y}.png',
                  fallbackUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.florandei.app',
                ),
                // Marcadores de registros salvos
                MarkerLayer(
                  markers: _records.map((record) {
                    return Marker(
                      point: LatLng(record.latitude, record.longitude),
                      width: 40,
                      height: 40,
                      child: GestureDetector(
                        onTap: () => _showRecordDetail(record),
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.green,
                          size: 40,
                        ),
                      ),
                    );
                  }).toList(),
                ),
                // Marcador temporário
                if (_tempMarker != null)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: _tempMarker!,
                        width: 40,
                        height: 40,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.orange,
                          size: 40,
                        ),
                      ),
                    ],
                  ),
                // Marcador de posição atual
                if (_currentPosition != null)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: LatLng(
                          _currentPosition!.latitude,
                          _currentPosition!.longitude,
                        ),
                        width: 20,
                        height: 20,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.blue.withOpacity(0.7),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 3),
                          ),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
      floatingActionButton: SpeedDial(
        icon: Icons.add,
        activeIcon: Icons.close,
        backgroundColor: Colors.green[700],
        foregroundColor: Colors.white,
        children: [
          SpeedDialChild(
            child: const Icon(Icons.my_location),
            label: 'Registrar aqui',
            onTap: () async {
              final position = await LocationService.getCurrentLocation();
              if (position != null) {
                _navigateToAddRecord(
                  LatLng(position.latitude, position.longitude),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Não foi possível obter localização'),
                  ),
                );
              }
            },
          ),
          SpeedDialChild(
            child: const Icon(Icons.gps_fixed),
            label: 'Centralizar no GPS',
            onTap: _centerOnCurrentLocation,
          ),
        ],
      ),
    );
  }
}
