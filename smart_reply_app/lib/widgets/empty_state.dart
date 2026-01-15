import 'package:flutter/material.dart';
import '../utils/app_theme.dart';

class EmptyState extends StatelessWidget {
  final bool loading;
  final List<String> results;
  final String input;

  const EmptyState({
    super.key,
    required this.loading,
    required this.results,
    required this.input,
  });

  @override
  Widget build(BuildContext context) {
    if (loading || results.isNotEmpty || input.isNotEmpty) {
      return const SizedBox.shrink();
    }

    return Center(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  Icons.edit_rounded,
                  size: 40,
                  color: AppTheme.primaryBlue,
                ),
              ),
              const SizedBox(height: 24),
              // Title
              Text(
                'Enter text to get started',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      letterSpacing: -0.5,
                    ),
              ),
              const SizedBox(height: 10),
              // Description
              Text(
                'Our AI analyzes context, tone, and intent to craft responses, enhancements, or translations that sound natural and effective.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppTheme.textMuted,
                      height: 1.5,
                    ),
              ),
              const SizedBox(height: 32),


            ],
          ),
        ),
      ),
    );
  }


}