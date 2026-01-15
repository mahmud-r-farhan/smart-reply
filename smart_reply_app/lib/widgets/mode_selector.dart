import 'package:flutter/material.dart';
import '../utils/app_theme.dart';
import '../utils/constants.dart';

class ModeSelector extends StatelessWidget {
  final String currentMode;
  final Function(String) onModeChanged;

  const ModeSelector({
    super.key,
    required this.currentMode,
    required this.onModeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.backgroundLight.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderColor.withValues(alpha: 0.5)),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: [
          _buildModeTab(
            mode: AppMode.reply,
            label: 'SMS Reply',
            icon: Icons.message_rounded,
            isSelected: currentMode == AppMode.reply,
          ),
          const SizedBox(width: 8),
          _buildModeTab(
            mode: AppMode.enhance,
            label: 'Enhance',
            icon: Icons.edit_rounded,
            isSelected: currentMode == AppMode.enhance,
          ),
        ],
      ),
    );
  }

  Widget _buildModeTab({
    required String mode,
    required String label,
    required IconData icon,
    required bool isSelected,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: () => onModeChanged(mode),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
          decoration: BoxDecoration(
            gradient: isSelected ? AppTheme.primaryGradient : null,
            color: isSelected ? null : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isSelected ? AppTheme.softShadow : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? Colors.white : AppTheme.textMuted,
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                  fontSize: 14,
                  color: isSelected ? Colors.white : AppTheme.textMuted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
