import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';

class ChatProvider extends ChangeNotifier {
  final ApiService _apiService;
  
  // State
  String _input = '';
  List<String> _results = [];
  bool _loading = false;
  String _style = ResponseStyle.professional;
  String _mode = AppMode.reply;
  String? _error;
  
  ChatProvider({ApiService? apiService}) 
      : _apiService = apiService ?? ApiService();
  
  // Getters
  String get input => _input;
  List<String> get results => _results;
  bool get loading => _loading;
  String get style => _style;
  String get mode => _mode;
  String? get error => _error;
  
  // Setters
  void setInput(String value) {
    _input = value;
    notifyListeners();
  }
  
  void setStyle(String value) {
    _style = value;
    notifyListeners();
  }
  
  void setMode(String value) {
    _mode = value;
    _results = [];
    _error = null;
    notifyListeners();
  }
  
  void clear() {
    _input = '';
    _results = [];
    _error = null;
    notifyListeners();
  }
  
  /// Generate results based on current mode
  Future<void> getResults() async {
    if (_input.trim().isEmpty) return;
    
    _loading = true;
    _results = [];
    _error = null;
    notifyListeners();
    
    try {
      if (_mode == AppMode.reply) {
        _results = await _apiService.suggestReply(
          message: _input,
          format: _style,
        );
      } else if (_mode == AppMode.enhance) {
        _results = await _apiService.enhanceText(
          text: _input,
          format: _style,
        );
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
  
  /// Regenerate results with same settings
  Future<void> regenerate() async {
    await getResults();
  }
  
  @override
  void dispose() {
    _apiService.dispose();
    super.dispose();
  }
}
