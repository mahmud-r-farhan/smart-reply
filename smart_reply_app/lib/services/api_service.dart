import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class ApiService {
  final http.Client _client;
  
  ApiService({http.Client? client}) : _client = client ?? http.Client();
  
  /// Generate smart reply suggestions based on received message
  Future<List<String>> suggestReply({
    required String message,
    required String format,
  }) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.suggestReply}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'message': message,
          'format': format,
        }),
      ).timeout(const Duration(seconds: 30));
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final suggestions = data['suggestions'] as List<dynamic>?;
        return suggestions?.map((s) => s.toString()).toList() ?? [];
      } else {
        throw ApiException('Server error: ${response.statusCode}');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}');
    }
  }
  
  /// Enhance/improve user's own text
  Future<List<String>> enhanceText({
    required String text,
    required String format,
  }) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.enhanceText}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'text': text,
          'format': format,
        }),
      ).timeout(const Duration(seconds: 30));
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final enhancements = data['enhancements'] as List<dynamic>?;
        return enhancements?.map((s) => s.toString()).toList() ?? [];
      } else {
        throw ApiException('Server error: ${response.statusCode}');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}');
    }
  }
  
  void dispose() {
    _client.close();
  }
}

class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  
  @override
  String toString() => message;
}
